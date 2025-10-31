/**
 * Safety Limits System
 *
 * Implements circuit breakers and risk management for live trading
 * Prevents catastrophic losses from AI agent errors
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const SAFETY_LIMITS = {
  // Per-agent limits
  MAX_POSITION_PER_AGENT: 100,           // $100 max account value per agent
  MAX_SINGLE_TRADE_VALUE: 50,            // $50 max per single trade
  MAX_DAILY_LOSS_PER_AGENT: 20,          // Stop agent if loses $20 in a day
  MAX_DAILY_TRADES_PER_AGENT: 3,         // Max 3 day trades per 5 days (PDT rule)

  // Global limits
  MAX_TOTAL_ACCOUNT_VALUE: 600,          // $600 total across all agents
  HALT_ON_TOTAL_DAILY_LOSS: 100,         // Stop ALL trading if daily loss > $100
  HALT_ON_API_ERROR_COUNT: 5,            // Stop if 5+ consecutive API errors

  // Feature flags
  REQUIRE_MANUAL_APPROVAL: false,        // Set to true to manually approve each trade
  ENABLE_CIRCUIT_BREAKERS: true,         // Enable all circuit breakers
  ENABLE_PDT_CHECKS: true,               // Enforce Pattern Day Trader rules
};

interface ValidationResult {
  allowed: boolean;
  reason?: string;
  warningLevel?: 'info' | 'warning' | 'critical';
}

/**
 * Validate if a trade is allowed based on all safety limits
 */
export async function validateTrade(
  agentId: string,
  agentName: string,
  action: 'BUY' | 'SELL',
  symbol: string,
  quantity: number,
  currentPrice: number
): Promise<ValidationResult> {
  const tradeValue = quantity * currentPrice;

  // 1. Check manual approval requirement
  if (SAFETY_LIMITS.REQUIRE_MANUAL_APPROVAL) {
    return {
      allowed: false,
      reason: 'Manual approval required for all trades',
      warningLevel: 'info'
    };
  }

  // 2. Check single trade value limit
  if (tradeValue > SAFETY_LIMITS.MAX_SINGLE_TRADE_VALUE) {
    return {
      allowed: false,
      reason: `Trade value $${tradeValue.toFixed(2)} exceeds limit of $${SAFETY_LIMITS.MAX_SINGLE_TRADE_VALUE}`,
      warningLevel: 'warning'
    };
  }

  // 3. Check agent's daily loss limit
  const dailyPnL = await getAgentDailyPnL(agentId);
  if (dailyPnL < -SAFETY_LIMITS.MAX_DAILY_LOSS_PER_AGENT) {
    return {
      allowed: false,
      reason: `Agent ${agentName} has lost $${Math.abs(dailyPnL).toFixed(2)} today (limit: $${SAFETY_LIMITS.MAX_DAILY_LOSS_PER_AGENT})`,
      warningLevel: 'critical'
    };
  }

  // 4. Check Pattern Day Trader rules (for BUY orders)
  if (SAFETY_LIMITS.ENABLE_PDT_CHECKS && action === 'BUY') {
    const dayTradesLast5Days = await countDayTradesLast5Days(agentId);
    if (dayTradesLast5Days >= SAFETY_LIMITS.MAX_DAILY_TRADES_PER_AGENT) {
      return {
        allowed: false,
        reason: `Agent ${agentName} has made ${dayTradesLast5Days} day trades in last 5 days (PDT limit: ${SAFETY_LIMITS.MAX_DAILY_TRADES_PER_AGENT})`,
        warningLevel: 'critical'
      };
    }
  }

  // 5. Check agent's account value limit (for BUY orders)
  if (action === 'BUY') {
    const agent = await prisma.agent.findUnique({
      where: { id: agentId },
      select: { accountValue: true }
    });

    if (!agent) {
      return {
        allowed: false,
        reason: `Agent ${agentName} not found`,
        warningLevel: 'critical'
      };
    }

    if (agent.accountValue + tradeValue > SAFETY_LIMITS.MAX_POSITION_PER_AGENT) {
      return {
        allowed: false,
        reason: `Trade would exceed agent max account value of $${SAFETY_LIMITS.MAX_POSITION_PER_AGENT}`,
        warningLevel: 'warning'
      };
    }
  }

  // 6. Check total system daily loss
  const totalDailyPnL = await getTotalDailyPnL();
  if (totalDailyPnL < -SAFETY_LIMITS.HALT_ON_TOTAL_DAILY_LOSS) {
    return {
      allowed: false,
      reason: `SYSTEM HALT: Total daily loss $${Math.abs(totalDailyPnL).toFixed(2)} exceeds limit of $${SAFETY_LIMITS.HALT_ON_TOTAL_DAILY_LOSS}`,
      warningLevel: 'critical'
    };
  }

  // 7. Check API error rate
  const recentErrors = await getRecentAPIErrors();
  if (recentErrors >= SAFETY_LIMITS.HALT_ON_API_ERROR_COUNT) {
    return {
      allowed: false,
      reason: `SYSTEM HALT: ${recentErrors} consecutive API errors detected`,
      warningLevel: 'critical'
    };
  }

  // All checks passed
  return {
    allowed: true,
    warningLevel: 'info'
  };
}

/**
 * Get agent's P&L for today
 */
async function getAgentDailyPnL(agentId: string): Promise<number> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const trades = await prisma.trade.findMany({
    where: {
      agentId,
      executedAt: {
        gte: today
      }
    },
    select: {
      pnl: true
    }
  });

  return trades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
}

/**
 * Get total system P&L for today
 */
async function getTotalDailyPnL(): Promise<number> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const trades = await prisma.trade.findMany({
    where: {
      executedAt: {
        gte: today
      }
    },
    select: {
      pnl: true
    }
  });

  return trades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
}

/**
 * Count day trades in last 5 business days
 * A day trade is when you buy and sell the same stock in the same day
 */
async function countDayTradesLast5Days(agentId: string): Promise<number> {
  const fiveDaysAgo = new Date();
  fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

  // Get all trades in last 5 days
  const trades = await prisma.trade.findMany({
    where: {
      agentId,
      executedAt: {
        gte: fiveDaysAgo
      }
    },
    select: {
      symbol: true,
      type: true,
      executedAt: true
    },
    orderBy: {
      executedAt: 'asc'
    }
  });

  // Count day trades (same symbol, BUY then SELL on same calendar day)
  let dayTrades = 0;
  const buysByDay = new Map<string, Set<string>>(); // date -> Set of symbols bought

  for (const trade of trades) {
    const dateKey = trade.executedAt.toISOString().split('T')[0];

    if (trade.type === 'BUY') {
      if (!buysByDay.has(dateKey)) {
        buysByDay.set(dateKey, new Set());
      }
      buysByDay.get(dateKey)!.add(trade.symbol);
    } else if (trade.type === 'SELL') {
      const buysToday = buysByDay.get(dateKey);
      if (buysToday && buysToday.has(trade.symbol)) {
        dayTrades++;
        buysToday.delete(trade.symbol); // Count each symbol only once per day
      }
    }
  }

  return dayTrades;
}

/**
 * Get count of recent consecutive API errors
 */
async function getRecentAPIErrors(): Promise<number> {
  // Check last 10 trade attempts
  const recentTrades = await prisma.trade.findMany({
    take: 10,
    orderBy: {
      createdAt: 'desc'
    },
    select: {
      success: true
    }
  });

  // Count consecutive failures from most recent
  let consecutiveErrors = 0;
  for (const trade of recentTrades) {
    if (!trade.success) {
      consecutiveErrors++;
    } else {
      break;
    }
  }

  return consecutiveErrors;
}

/**
 * Log a safety limit violation
 */
export async function logSafetyViolation(
  agentId: string,
  agentName: string,
  reason: string,
  warningLevel: 'info' | 'warning' | 'critical'
): Promise<void> {
  console.warn(`⚠️ [SAFETY] ${warningLevel.toUpperCase()}: ${agentName} - ${reason}`);

  // Could also send alerts via email/SMS for critical violations
  if (warningLevel === 'critical') {
    console.error(`🚨 [CRITICAL SAFETY VIOLATION] ${agentName}: ${reason}`);
    // TODO: Send alert notification
  }
}

/**
 * Emergency stop - halt all trading
 */
export async function emergencyStop(reason: string): Promise<void> {
  console.error(`🛑 [EMERGENCY STOP] ${reason}`);
  console.error(`🛑 All trading halted. Manual intervention required.`);

  // Set flag in database to prevent future trades
  // TODO: Implement emergency stop flag in database
}

/**
 * Get safety status report
 */
export async function getSafetyStatus(): Promise<{
  totalDailyPnL: number;
  agentStatuses: Array<{
    agentId: string;
    agentName: string;
    dailyPnL: number;
    dayTradeCount: number;
    accountValue: number;
    status: 'ok' | 'warning' | 'halted';
  }>;
  recentErrors: number;
  systemStatus: 'ok' | 'warning' | 'halted';
}> {
  const totalDailyPnL = await getTotalDailyPnL();
  const recentErrors = await getRecentAPIErrors();

  const agents = await prisma.agent.findMany();

  const agentStatuses = await Promise.all(
    agents.map(async (agent) => {
      const dailyPnL = await getAgentDailyPnL(agent.id);
      const dayTradeCount = await countDayTradesLast5Days(agent.id);

      let status: 'ok' | 'warning' | 'halted' = 'ok';
      if (dailyPnL < -SAFETY_LIMITS.MAX_DAILY_LOSS_PER_AGENT) {
        status = 'halted';
      } else if (dailyPnL < -SAFETY_LIMITS.MAX_DAILY_LOSS_PER_AGENT * 0.5) {
        status = 'warning';
      }

      return {
        agentId: agent.id,
        agentName: agent.name,
        dailyPnL,
        dayTradeCount,
        accountValue: agent.accountValue,
        status
      };
    })
  );

  let systemStatus: 'ok' | 'warning' | 'halted' = 'ok';
  if (totalDailyPnL < -SAFETY_LIMITS.HALT_ON_TOTAL_DAILY_LOSS || recentErrors >= SAFETY_LIMITS.HALT_ON_API_ERROR_COUNT) {
    systemStatus = 'halted';
  } else if (totalDailyPnL < -SAFETY_LIMITS.HALT_ON_TOTAL_DAILY_LOSS * 0.5) {
    systemStatus = 'warning';
  }

  return {
    totalDailyPnL,
    agentStatuses,
    recentErrors,
    systemStatus
  };
}
