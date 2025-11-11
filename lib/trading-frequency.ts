/**
 * Trading Frequency Optimization
 *
 * Strategy-specific guidance on trading frequency to maximize returns
 * while avoiding overtrading penalties.
 */

import type { TradingStrategy } from './ai-strategy-selection';

export interface FrequencyGuidance {
  minDaysBetweenTrades: number;
  idealFrequency: string;
  reasoning: string;
  encouragement: string;
  expectedTradesPerYear: string;
  riskOfOvertrading: 'low' | 'medium' | 'high';
}

/**
 * Strategy-specific trading frequency recommendations
 * Based on academic research and optimal holding periods
 */
export const FREQUENCY_GUIDANCE: Record<TradingStrategy, FrequencyGuidance> = {
  volatility_arbitrage: {
    minDaysBetweenTrades: 0,
    idealFrequency: 'Daily opportunities',
    reasoning: 'VIX spikes last 1-2 days. Missing a spike means missing the entire opportunity. Fast execution is critical.',
    encouragement: 'Trade aggressively when VIX > 20. These opportunities are rare but profitable.',
    expectedTradesPerYear: '100-150 trades',
    riskOfOvertrading: 'low', // Strategy demands fast action
  },

  momentum_breakout: {
    minDaysBetweenTrades: 1,
    idealFrequency: 'Every 2 days',
    reasoning: 'Momentum moves develop over 1-3 days. Need to catch breakouts early but avoid chasing every minor move.',
    encouragement: 'Wait for clear breakouts with volume confirmation. Don\'t chase without setup.',
    expectedTradesPerYear: '80-120 trades',
    riskOfOvertrading: 'medium', // Balance speed vs patience
  },

  mean_reversion: {
    minDaysBetweenTrades: 2,
    idealFrequency: 'Every 3 days',
    reasoning: 'Oversold bounces take 3-7 days to develop. Trading too frequently leads to whipsaw losses in noise.',
    encouragement: 'Be patient. Let bounces develop. Quality over quantity.',
    expectedTradesPerYear: '40-60 trades',
    riskOfOvertrading: 'high', // Most vulnerable to overtrading
  },

  trend_following: {
    minDaysBetweenTrades: 5,
    idealFrequency: 'Weekly check-ins',
    reasoning: 'Trends take weeks to develop. Daily trading causes premature exits. Weekly check-ins are sufficient.',
    encouragement: 'Let trends run. Only trade on trend changes or weekly rebalancing. Patience wins.',
    expectedTradesPerYear: '15-25 trades',
    riskOfOvertrading: 'high', // Strategy demands patience
  },

  defensive_cash: {
    minDaysBetweenTrades: 7,
    idealFrequency: 'Weekly monitoring',
    reasoning: 'Sitting on sidelines during bear markets. Only act on regime changes or extreme volatility spikes.',
    encouragement: 'Preserve capital. Only trade if VIX spikes above 25 or regime dramatically changes.',
    expectedTradesPerYear: '5-10 trades',
    riskOfOvertrading: 'low', // Already conservative
  },
};

/**
 * Calculate days since last trade for an agent
 */
export function calculateDaysSinceLastTrade(lastTradeTimestamp: Date | null): number {
  if (!lastTradeTimestamp) {
    return 999; // No previous trades
  }

  const now = new Date();
  const diffMs = now.getTime() - lastTradeTimestamp.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  return diffDays;
}

/**
 * Generate trading frequency guidance for AI prompt
 * CASH-AWARE: Encourages deployment when cash is high, discourages churning when invested
 */
export function generateFrequencyGuidance(
  strategy: TradingStrategy,
  daysSinceLastTrade: number,
  cashPercentage: number // 0-100, percentage of account value in cash
): string {
  const guidance = FREQUENCY_GUIDANCE[strategy];

  const canTrade = daysSinceLastTrade >= guidance.minDaysBetweenTrades;
  const recommendation = canTrade
    ? '✅ You CAN trade today if opportunity is strong'
    : '⚠️ Consider HOLD unless opportunity is EXCEPTIONAL';

  const urgency = daysSinceLastTrade === 0
    ? '(You traded yesterday - be extra careful about overtrading)'
    : daysSinceLastTrade >= guidance.minDaysBetweenTrades * 2
    ? '(It\'s been a while - you have flexibility to act)'
    : '';

  // CASH-AWARE GUIDANCE: Adjust messaging based on capital deployment
  let capitalDeploymentGuidance = '';

  if (cashPercentage >= 70) {
    // High cash - encourage deployment
    capitalDeploymentGuidance = `
🚀 CAPITAL DEPLOYMENT PRIORITY:
You have ${cashPercentage.toFixed(0)}% cash sitting idle! This is costing you opportunity.
→ Be AGGRESSIVE about deploying capital on strong setups
→ Missing opportunities hurts more than occasional overtrading
→ Your goal: Get invested in quality positions
→ Don't let cash drag down your returns!`;
  } else if (cashPercentage >= 50) {
    // Moderate cash - balanced approach
    capitalDeploymentGuidance = `
💰 BALANCED CAPITAL DEPLOYMENT:
You have ${cashPercentage.toFixed(0)}% cash available.
→ Look for good opportunities to deploy more capital
→ Balance quality vs. getting invested
→ Don't force trades, but don't be overly conservative either`;
  } else if (cashPercentage >= 30) {
    // Reasonable deployment - normal frequency guidance
    capitalDeploymentGuidance = `
✓ GOOD CAPITAL DEPLOYMENT:
You have ${cashPercentage.toFixed(0)}% cash - well deployed!
→ Focus on quality setups and respect your strategy frequency
→ No rush to deploy remaining cash`;
  } else {
    // Fully invested - strict anti-churning
    capitalDeploymentGuidance = `
⚠️ AVOID CHURNING (You're ${(100 - cashPercentage).toFixed(0)}% invested):
You're nearly fully invested with only ${cashPercentage.toFixed(0)}% cash.
→ RESPECT YOUR FREQUENCY LIMITS STRICTLY
→ Don't churn positions just to "do something"
→ Only trade on clear strategy signals or when taking profits
→ Unnecessary churning creates spread costs and whipsaw losses
→ Let your positions work for you!`;
  }

  return `
═══════════════════════════════════════════════════════════
TRADING FREQUENCY GUIDANCE
═══════════════════════════════════════════════════════════

Your Strategy: ${strategy.toUpperCase().replace(/_/g, ' ')}
Ideal Frequency: ${guidance.idealFrequency}
Expected Trades/Year: ${guidance.expectedTradesPerYear}

WHY THIS FREQUENCY:
${guidance.reasoning}

YOUR SITUATION:
• Days since last trade: ${daysSinceLastTrade === 999 ? 'First trade' : `${daysSinceLastTrade} days`}
• Minimum recommended: ${guidance.minDaysBetweenTrades} days
• Cash available: ${cashPercentage.toFixed(1)}%
• Recommendation: ${recommendation} ${urgency}

GUIDANCE:
${guidance.encouragement}
${capitalDeploymentGuidance}

REMEMBER:
• HIGH CASH (>50%): Be aggressive, deploy capital on strong setups
• WELL INVESTED (<30% cash): Respect frequency limits, avoid churning
• Quality setups > Quantity of trades

Risk of Overtrading: ${guidance.riskOfOvertrading.toUpperCase()}
${guidance.riskOfOvertrading === 'high' ? '⚠️ Your strategy is especially vulnerable to overtrading - be disciplined!' : ''}
═══════════════════════════════════════════════════════════
`;
}

/**
 * Check if trading frequency is concerning (for logging/alerts)
 */
export function assessTradingFrequency(
  strategy: TradingStrategy,
  tradesThisWeek: number,
  tradesThisMonth: number
): {
  status: 'healthy' | 'borderline' | 'overtrading';
  message: string;
} {
  const guidance = FREQUENCY_GUIDANCE[strategy];

  // Calculate expected trades per week/month
  const expectedPerYear = parseInt(guidance.expectedTradesPerYear.split('-')[1] || '100');
  const expectedPerWeek = expectedPerYear / 52;
  const expectedPerMonth = expectedPerYear / 12;

  // Check weekly frequency
  if (tradesThisWeek > expectedPerWeek * 1.5) {
    return {
      status: 'overtrading',
      message: `⚠️ OVERTRADING ALERT: ${tradesThisWeek} trades this week (expected ~${expectedPerWeek.toFixed(1)}). Your ${strategy} strategy risks whipsaw losses from excessive trading.`,
    };
  }

  if (tradesThisWeek > expectedPerWeek * 1.2) {
    return {
      status: 'borderline',
      message: `⚠️ Trading frequently: ${tradesThisWeek} trades this week (expected ~${expectedPerWeek.toFixed(1)}). Monitor for overtrading.`,
    };
  }

  return {
    status: 'healthy',
    message: `✓ Healthy frequency: ${tradesThisWeek} trades this week (expected ~${expectedPerWeek.toFixed(1)}).`,
  };
}

/**
 * Calculate spread cost for a trade
 * Based on typical bid-ask spreads for liquid stocks
 */
export function calculateSpreadCost(price: number, quantity: number): number {
  // Typical spread: 2 basis points (0.02%) for liquid stocks
  const SPREAD_BPS = 2;

  // Half spread paid on entry
  const spreadPerShare = price * (SPREAD_BPS / 10000);
  const totalSpreadCost = spreadPerShare * quantity;

  return totalSpreadCost;
}

/**
 * Estimate annual trading costs based on frequency
 */
export function estimateAnnualCosts(
  strategy: TradingStrategy,
  avgTradeSize: number
): {
  expectedTrades: string;
  spreadCostPerTrade: number;
  annualSpreadCost: string;
  percentDrag: string;
} {
  const guidance = FREQUENCY_GUIDANCE[strategy];
  const expectedTrades = parseInt(guidance.expectedTradesPerYear.split('-')[1] || '100');

  // Assume $1000 average trade size if not provided
  const tradeSize = avgTradeSize || 1000;

  // Round trip cost (entry + exit)
  const spreadCostPerTrade = calculateSpreadCost(tradeSize / 100, 100) * 2; // Assume $10/share stocks
  const annualSpreadCost = spreadCostPerTrade * expectedTrades;
  const percentDrag = (annualSpreadCost / 10000) * 100; // Assume $10k portfolio

  return {
    expectedTrades: guidance.expectedTradesPerYear,
    spreadCostPerTrade,
    annualSpreadCost: `$${annualSpreadCost.toFixed(0)}`,
    percentDrag: `${percentDrag.toFixed(2)}%`,
  };
}
