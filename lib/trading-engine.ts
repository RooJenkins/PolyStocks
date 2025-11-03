import { prisma } from './prisma';
import { fetchStockPrices, fetchStockQuote, fetchStockNews } from './stock-api';
import { getAIDecision } from './ai-models';
import type { Stock} from '@/types';
import {
  isMarketOpen,
  getMarketStatus,
} from './realistic-execution';
import { getBroker, getBrokerDisplayName, type BrokerType } from './brokers';
import { validateTrade, validateExitParameters, logSafetyViolation } from './safety-limits';
import { checkAndExecuteExits } from './exit-manager';

// Wrapper functions that route to correct broker based on agent's broker configuration
async function executeBuyTrade(agentId: string, agentName: string, symbol: string, quantity: number, marketPrice: number) {
  // Get agent's broker configuration
  const agent = await prisma.agent.findUnique({
    where: { id: agentId },
    select: { broker: true }
  });

  const brokerType = (agent?.broker || 'simulation') as BrokerType;
  const brokerDisplayName = getBrokerDisplayName(brokerType);
  console.log(`  📍 Broker: ${brokerDisplayName}`);

  // Check safety limits first
  const validation = await validateTrade(agentId, agentName, 'BUY', symbol, quantity, marketPrice);
  if (!validation.allowed) {
    await logSafetyViolation(agentId, agentName, validation.reason!, validation.warningLevel!);
    return {
      success: false,
      error: validation.reason,
      executedPrice: 0,
      executedQuantity: 0,
      commission: 0,
      slippage: 0,
      executionTime: 0
    };
  }

  // Route to appropriate broker
  const broker = getBroker(brokerType, agentName);
  console.log(`  🔌 Using ${broker.name} for trade execution`);
  return await broker.executeBuy(symbol, quantity, agentId);
}

async function executeSellTrade(agentId: string, agentName: string, symbol: string, quantity: number, marketPrice: number) {
  // Get agent's broker configuration
  const agent = await prisma.agent.findUnique({
    where: { id: agentId },
    select: { broker: true }
  });

  const brokerType = (agent?.broker || 'simulation') as BrokerType;
  const brokerDisplayName = getBrokerDisplayName(brokerType);
  console.log(`  📍 Broker: ${brokerDisplayName}`);

  // Check safety limits first
  const validation = await validateTrade(agentId, agentName, 'SELL', symbol, quantity, marketPrice);
  if (!validation.allowed) {
    await logSafetyViolation(agentId, agentName, validation.reason!, validation.warningLevel!);
    return {
      success: false,
      error: validation.reason,
      executedPrice: 0,
      executedQuantity: 0,
      commission: 0,
      slippage: 0,
      executionTime: 0
    };
  }

  // Route to appropriate broker
  const broker = getBroker(brokerType, agentName);
  console.log(`  🔌 Using ${broker.name} for trade execution`);
  return await broker.executeSell(symbol, quantity, agentId);
}

// Helper: Calculate market trend from stocks
function calculateMarketTrend(stocks: Stock[]): { daily: number; weekly: number } {
  // Filter out stocks with invalid changePercent values
  const validStocks = stocks.filter(s => typeof s.changePercent === 'number' && !isNaN(s.changePercent));

  if (validStocks.length === 0) {
    return { daily: 0, weekly: 0 }; // Return 0 instead of NaN when no valid data
  }

  const dailyAvg = validStocks.reduce((sum, s) => sum + s.changePercent, 0) / validStocks.length;
  // Weekly trend will be calculated from performance data if available
  return { daily: dailyAvg, weekly: 0 };
}

// Helper: Enrich stocks with historical data
async function enrichStocksWithTrends(stocks: Stock[]): Promise<Stock[]> {
  // Get stock price history from the last 30 days
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const stockPrices = await prisma.stockPrice.findMany({
    where: {
      timestamp: {
        gte: thirtyDaysAgo,
      },
    },
    orderBy: { timestamp: 'asc' },
  });

  return stocks.map(stock => {
    const historicalPrices = stockPrices
      .filter(sp => sp.symbol === stock.symbol)
      .map(sp => sp.price);

    if (historicalPrices.length === 0) {
      return stock;
    }

    // Calculate 7-day trend
    const sevenDayPrices = stockPrices
      .filter(sp => sp.symbol === stock.symbol && sp.timestamp >= sevenDaysAgo)
      .map(sp => sp.price);

    const weekTrend = sevenDayPrices.length >= 2
      ? ((stock.price - sevenDayPrices[0]) / sevenDayPrices[0]) * 100
      : undefined;

    // Calculate moving averages
    const ma7 = sevenDayPrices.length > 0
      ? sevenDayPrices.reduce((a, b) => a + b, 0) / sevenDayPrices.length
      : undefined;

    const ma30 = historicalPrices.length > 0
      ? historicalPrices.reduce((a, b) => a + b, 0) / historicalPrices.length
      : undefined;

    return {
      ...stock,
      weekTrend,
      ma7,
      ma30,
    };
  });
}

// Helper: Fetch news for stocks with significant moves
async function fetchNewsForBigMovers(stocks: Stock[]): Promise<Array<{ symbol: string; headline: string; sentiment: 'positive' | 'negative' | 'neutral' }>> {
  // Filter stocks with >3% absolute change
  const bigMovers = stocks.filter(s => Math.abs(s.changePercent) > 3);

  if (bigMovers.length === 0) {
    return [];
  }

  console.log(`📰 Fetching news for ${bigMovers.length} stocks with >3% moves...`);

  const news: Array<{ symbol: string; headline: string; sentiment: 'positive' | 'negative' | 'neutral' }> = [];

  try {
    const newsData = await fetchStockNews(bigMovers.map(s => s.symbol));

    // Take top 3 most recent news items
    const topNews = newsData.slice(0, 3);

    for (const item of topNews) {
      // Simple sentiment analysis based on keywords
      const headline = (item.headline || item.title || '').toLowerCase();
      let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';

      const positiveWords = ['up', 'surge', 'gain', 'beat', 'record', 'high', 'profit', 'growth', 'success'];
      const negativeWords = ['down', 'fall', 'drop', 'miss', 'loss', 'low', 'decline', 'concern', 'warning'];

      if (positiveWords.some(word => headline.includes(word))) {
        sentiment = 'positive';
      } else if (negativeWords.some(word => headline.includes(word))) {
        sentiment = 'negative';
      }

      news.push({
        symbol: (item.tickers && item.tickers[0]) || bigMovers[0].symbol,
        headline: (item.headline || item.title || 'No headline').slice(0, 100), // Truncate to 100 chars
        sentiment,
      });
    }

    console.log(`✓ Found ${news.length} relevant news items\n`);
  } catch (error) {
    console.log('⚠️  No news API available, continuing without news\n');
  }

  return news;
}

// Helper: Calculate agent performance stats
async function calculateAgentStats(agentId: string) {
  const trades = await prisma.trade.findMany({
    where: { agentId },
    orderBy: { timestamp: 'desc' },
    take: 100, // Last 100 trades
  });

  if (trades.length === 0) {
    return {
      winRate: 0,
      totalTrades: 0,
      avgWin: 0,
      avgLoss: 0,
      bestTrade: 0,
      worstTrade: 0,
    };
  }

  const profitableTrades = trades.filter(t => (t.realizedPnL || 0) > 0);
  const losingTrades = trades.filter(t => (t.realizedPnL || 0) < 0);

  const wins = profitableTrades.map(t => t.realizedPnL || 0);
  const losses = losingTrades.map(t => t.realizedPnL || 0);

  return {
    winRate: trades.length > 0 ? (profitableTrades.length / trades.length) * 100 : 0,
    totalTrades: trades.length,
    avgWin: wins.length > 0 ? wins.reduce((a, b) => a + b, 0) / wins.length : 0,
    avgLoss: losses.length > 0 ? losses.reduce((a, b) => a + b, 0) / losses.length : 0,
    bestTrade: wins.length > 0 ? Math.max(...wins) : 0,
    worstTrade: losses.length > 0 ? Math.min(...losses) : 0,
  };
}

export async function runTradingCycle() {
  console.log('\n🔄 ===== STARTING TRADING CYCLE =====');
  console.log(`📅 ${new Date().toLocaleString()}\n`);

  try {
    // 1. Fetch current stock prices
    console.log('📊 Fetching stock prices...');
    let stocks = await fetchStockPrices();
    console.log(`✓ Fetched ${stocks.length} stock prices\n`);

    // 2. Enrich stocks with historical trends and technical indicators
    console.log('📈 Calculating price trends and technical indicators...');
    stocks = await enrichStocksWithTrends(stocks);
    console.log(`✓ Added 7-day trends and moving averages\n`);

    // 3. Check positions for automatic exits (Alpha Arena Phase 1)
    await checkAndExecuteExits(stocks);

    // 4. Calculate market trend
    const marketTrend = calculateMarketTrend(stocks);
    console.log(`📊 Market trend: ${marketTrend.daily >= 0 ? '+' : ''}${marketTrend.daily.toFixed(2)}% today\n`);

    // 5. Fetch news for big movers (>3% change)
    const news = await fetchNewsForBigMovers(stocks);

    // 6. Get all agents
    const agents = await prisma.agent.findMany({
      include: {
        positions: true,
      },
    });

    console.log(`🤖 Processing ${agents.length} AI agents\n`);

    // 7. Process each agent
    for (const agent of agents) {
      await processAgentTrading(agent, stocks, marketTrend, news);
    }

    // 8. Update all performance metrics
    await updatePerformanceMetrics();

    console.log('\n✅ ===== TRADING CYCLE COMPLETE =====\n');
  } catch (error: any) {
    console.error('\n❌ ===== ERROR IN TRADING CYCLE =====');
    console.error(error);
    console.error('======================================\n');
  }
}

async function processAgentTrading(
  agent: any,
  stocks: Stock[],
  marketTrend: { daily: number; weekly: number },
  news: Array<{ symbol: string; headline: string; sentiment: 'positive' | 'negative' | 'neutral' }>
) {
  console.log(`\n━━━ ${agent.name} (${agent.model}) ━━━`);

  try {
    // Get agent's performance stats
    const agentStats = await calculateAgentStats(agent.id);
    // Update current prices for all positions
    for (const position of agent.positions) {
      const currentStock = stocks.find((s) => s.symbol === position.symbol);
      if (currentStock) {
        position.currentPrice = currentStock.price;

        // Calculate P&L - inverse for SHORT positions
        if (position.side === 'SHORT') {
          position.unrealizedPnL =
            (position.entryPrice - currentStock.price) * position.quantity;
          position.unrealizedPnLPercent =
            ((position.entryPrice - currentStock.price) / position.entryPrice) * 100;
        } else {
          position.unrealizedPnL =
            (currentStock.price - position.entryPrice) * position.quantity;
          position.unrealizedPnLPercent =
            ((currentStock.price - position.entryPrice) / position.entryPrice) * 100;
        }

        await prisma.position.update({
          where: { id: position.id },
          data: {
            currentPrice: currentStock.price,
            unrealizedPnL: position.unrealizedPnL,
            unrealizedPnLPercent: position.unrealizedPnLPercent,
          },
        });
      }
    }

    // Calculate total portfolio value
    let portfolioValue = agent.cashBalance;
    for (const position of agent.positions) {
      portfolioValue += position.currentPrice * position.quantity;
    }

    // Update agent's account value
    await prisma.agent.update({
      where: { id: agent.id },
      data: { accountValue: portfolioValue },
    });

    console.log(`  💰 Account Value: $${portfolioValue.toFixed(2)}`);
    console.log(`  💵 Cash: $${agent.cashBalance.toFixed(2)}`);
    console.log(`  📈 Positions: ${agent.positions.length}`);

    if (agent.positions.length > 0) {
      console.log('  Current holdings:');
      agent.positions.forEach((p: any) => {
        console.log(
          `    • ${p.quantity} ${p.symbol} @ $${p.entryPrice.toFixed(2)} → $${p.currentPrice.toFixed(2)} (${p.unrealizedPnL >= 0 ? '+' : ''}$${p.unrealizedPnL.toFixed(2)})`
        );
      });
    }

    // Prepare market context for AI
    const marketContext = {
      stocks,
      cashBalance: agent.cashBalance,
      accountValue: portfolioValue,
      positions: agent.positions.map((p: any) => ({
        symbol: p.symbol,
        name: p.name,
        quantity: p.quantity,
        entryPrice: p.entryPrice,
        currentPrice: p.currentPrice,
        unrealizedPnL: p.unrealizedPnL,
        unrealizedPnLPercent: p.unrealizedPnLPercent,
      })),
      marketTrend,
      agentStats,
      news: news.length > 0 ? news : undefined,
    };

    // Get AI decision
    const decision = await getAIDecision(agent.id, agent.name, marketContext);

    console.log(`  🎯 Decision: ${decision.action}`);
    console.log(`  💭 Reasoning: ${decision.reasoning}`);
    console.log(`  📊 Confidence: ${(decision.confidence * 100).toFixed(1)}%`);
    if (decision.targetPrice) {
      console.log(`  🎯 Target Price: $${decision.targetPrice.toFixed(2)}`);
    }
    if (decision.stopLoss) {
      console.log(`  🛡️  Stop Loss: $${decision.stopLoss.toFixed(2)}`);
    }

    // Execute trade based on decision
    if (decision.action === 'BUY') {
      await executeBuy(agent, decision, stocks);
    } else if (decision.action === 'SELL') {
      await executeSell(agent, decision, stocks);
    } else if (decision.action === 'SELL_SHORT') {
      await executeShort(agent, decision, stocks);
    } else if (decision.action === 'BUY_TO_COVER') {
      await executeCover(agent, decision, stocks);
    }

    // Log the decision (Alpha Arena: store invalidationCondition)
    const decisionRecord = await prisma.decision.create({
      data: {
        agentId: agent.id,
        action: decision.action,
        symbol: decision.symbol,
        quantity: decision.quantity,
        confidence: decision.confidence,
        reasoning: decision.reasoning,
        riskAssessment: decision.riskAssessment || 'N/A',
        targetPrice: decision.targetPrice,
        stopLoss: decision.stopLoss,
        invalidationCondition: decision.invalidationCondition,
        portfolioValue,
        cashBalance: agent.cashBalance,
        marketDataSnapshot: JSON.stringify(
          stocks.map((s) => ({
            symbol: s.symbol,
            price: s.price,
            change: s.changePercent,
          }))
        ),
      },
    });

    // Store decision ID for linking trades back to decisions
    (decision as any).decisionId = decisionRecord.id;
  } catch (error: any) {
    console.error(`  ❌ Error processing ${agent.name}:`, error.message);
  }
}

async function executeBuy(agent: any, decision: any, stocks: Stock[]) {
  if (!decision.symbol) {
    console.log('  ⚠️  Invalid BUY decision (missing symbol)');
    return;
  }

  const stock = stocks.find((s) => s.symbol === decision.symbol);
  if (!stock) {
    console.log(`  ❌ Stock ${decision.symbol} not found`);
    return;
  }

  // ALPHA ARENA PHASE 2: Conviction-Based Position Sizing
  // Use confidence score to determine position size as percentage of cash
  let positionSizePercent = 0;
  const confidence = decision.confidence || 0.5;

  if (confidence >= 0.9) {
    positionSizePercent = 0.25; // 25% for very high confidence
  } else if (confidence >= 0.8) {
    positionSizePercent = 0.20; // 20% for high confidence
  } else if (confidence >= 0.7) {
    positionSizePercent = 0.15; // 15% for medium confidence
  } else {
    console.log(`  ⚠️  Confidence too low (${(confidence * 100).toFixed(0)}% < 70%) - rejecting trade`);
    return;
  }

  const maxInvestment = agent.cashBalance * positionSizePercent;
  const quantity = Math.floor(maxInvestment / stock.price);

  if (quantity === 0) {
    console.log(`  ⚠️  Position size too small for ${positionSizePercent * 100}% allocation`);
    return;
  }

  const estimatedCost = stock.price * quantity;
  console.log(
    `  💰 Position sizing: ${(confidence * 100).toFixed(0)}% confidence → ${(positionSizePercent * 100).toFixed(0)}% of cash ($${maxInvestment.toFixed(0)})`
  );

  // ALPHA ARENA PHASE 6: Validate exit parameters
  const exitValidation = validateExitParameters(
    'BUY',
    stock.price,
    decision.targetPrice,
    decision.stopLoss,
    decision.confidence
  );

  if (!exitValidation.allowed) {
    console.log(`  ❌ Exit parameter validation failed: ${exitValidation.reason}`);
    await logSafetyViolation(agent.id, agent.name, exitValidation.reason!, exitValidation.warningLevel!);
    return;
  }

  // Check if agent has enough cash (with buffer for slippage)
  if (estimatedCost * 1.01 > agent.cashBalance) {
    console.log(
      `  ❌ Insufficient funds: Need ~$${estimatedCost.toFixed(2)}, have $${agent.cashBalance.toFixed(2)}`
    );
    return;
  }

  // Execute with realistic constraints (bid-ask spread, market hours, delays, partial fills)
  // Uses Alpaca API if TRADING_MODE is "paper" or "live", otherwise simulates
  const execution = await executeBuyTrade(agent.id, agent.name, stock.symbol, quantity, stock.price);

  if (!execution.success) {
    console.log(`  ❌ Execution failed: ${execution.error}`);
    return;
  }

  const totalCost = execution.executedPrice! * execution.executedQuantity! + execution.commission!;

  // Check actual cost after execution
  if (totalCost > agent.cashBalance) {
    console.log(
      `  ❌ Insufficient funds after execution: Need $${totalCost.toFixed(2)}, have $${agent.cashBalance.toFixed(2)}`
    );
    return;
  }

  // Check if agent already has this position
  const existingPosition = agent.positions.find((p: any) => p.symbol === stock.symbol);
  if (existingPosition) {
    // Update existing position (average down/up)
    const newQuantity = existingPosition.quantity + execution.executedQuantity!;
    const newEntryPrice =
      (existingPosition.entryPrice * existingPosition.quantity +
        execution.executedPrice! * execution.executedQuantity!) /
      newQuantity;

    await prisma.position.update({
      where: { id: existingPosition.id },
      data: {
        quantity: newQuantity,
        entryPrice: newEntryPrice,
        currentPrice: execution.executedPrice!,
        unrealizedPnL: 0,
        unrealizedPnLPercent: 0,
      },
    });

    console.log(
      `  ✅ Added to position: ${execution.executedQuantity!} shares of ${stock.symbol} @ $${execution.executedPrice!.toFixed(2)}`
    );
  } else {
    // Create new position (Alpha Arena: store exit parameters and decision link)
    await prisma.position.create({
      data: {
        agentId: agent.id,
        symbol: stock.symbol,
        name: stock.name,
        side: 'LONG',
        quantity: execution.executedQuantity!,
        entryPrice: execution.executedPrice!,
        currentPrice: execution.executedPrice!,
        unrealizedPnL: 0,
        unrealizedPnLPercent: 0,
        // targetPrice, stopLoss, invalidationCondition, entryDecisionId removed - not in production schema
      },
    });

    console.log(
      `  ✅ Bought ${execution.executedQuantity!} shares of ${stock.symbol} @ $${execution.executedPrice!.toFixed(2)}`
    );
  }

  // Show execution details
  if (execution.slippage! > 0.01) {
    console.log(`  📊 Slippage: $${execution.slippage!.toFixed(2)}`);
  }
  if (execution.executedQuantity! < decision.quantity) {
    console.log(`  ⚠️  Partial fill: ${execution.executedQuantity!}/${decision.quantity} shares`);
  }
  if (execution.executionTime > 200) {
    console.log(`  ⏱️  Execution time: ${execution.executionTime.toFixed(0)}ms`);
  }

  // Create trade record (Alpha Arena: link to decision)
  await prisma.trade.create({
    data: {
      agentId: agent.id,
      symbol: stock.symbol,
      name: stock.name,
      action: 'BUY',
      quantity: execution.executedQuantity!,
      price: execution.executedPrice!,
      total: totalCost,
      reasoning: decision.reasoning,
      confidence: decision.confidence,
      // decisionId removed - not in production schema
    },
  });

  // Update agent's cash balance
  await prisma.agent.update({
    where: { id: agent.id },
    data: {
      cashBalance: agent.cashBalance - totalCost,
    },
  });

  console.log(`  💵 Remaining cash: $${(agent.cashBalance - totalCost).toFixed(2)}`);
}

async function executeSell(agent: any, decision: any, stocks: Stock[]) {
  if (!decision.symbol) {
    console.log('  ⚠️  Invalid SELL decision (missing symbol)');
    return;
  }

  const stock = stocks.find((s) => s.symbol === decision.symbol);
  if (!stock) {
    console.log(`  ❌ Stock ${decision.symbol} not found`);
    return;
  }

  // Find position
  const position = agent.positions.find((p: any) => p.symbol === decision.symbol);
  if (!position) {
    console.log(`  ❌ No position found for ${decision.symbol}`);
    return;
  }

  // Execute with realistic constraints (bid-ask spread, market hours, delays, partial fills)
  // Uses Alpaca API if TRADING_MODE is "paper" or "live", otherwise simulates
  const execution = await executeSellTrade(agent.id, agent.name, stock.symbol, position.quantity, stock.price);

  if (!execution.success) {
    console.log(`  ❌ Execution failed: ${execution.error}`);
    return;
  }

  const saleProceeds = execution.executedPrice! * execution.executedQuantity! - execution.commission!;
  const realizedPnL = (execution.executedPrice! - position.entryPrice) * execution.executedQuantity! - execution.commission!;
  const realizedPnLPercent = ((execution.executedPrice! - position.entryPrice) / position.entryPrice) * 100;

  // Create trade record (Alpha Arena: link to decision and mark as manual exit)
  await prisma.trade.create({
    data: {
      agentId: agent.id,
      symbol: stock.symbol,
      name: stock.name,
      action: 'SELL',
      quantity: execution.executedQuantity!,
      price: execution.executedPrice!,
      total: saleProceeds,
      realizedPnL,
      reasoning: decision.reasoning,
      confidence: decision.confidence,
      // decisionId, exitReason removed - not in production schema
    },
  });

  // Delete position
  await prisma.position.delete({
    where: { id: position.id },
  });

  // Update agent's cash balance
  await prisma.agent.update({
    where: { id: agent.id },
    data: {
      cashBalance: agent.cashBalance + saleProceeds,
    },
  });

  console.log(
    `  ✅ Sold ${execution.executedQuantity!} shares of ${stock.symbol} @ $${execution.executedPrice!.toFixed(2)}`
  );
  console.log(
    `  📊 Realized P&L: ${realizedPnL >= 0 ? '+' : ''}$${realizedPnL.toFixed(2)} (${realizedPnLPercent >= 0 ? '+' : ''}${realizedPnLPercent.toFixed(2)}%)`
  );

  // Show execution details
  if (execution.slippage! > 0.01) {
    console.log(`  📊 Slippage: -$${execution.slippage!.toFixed(2)}`);
  }
  if (execution.executedQuantity! < position.quantity) {
    console.log(`  ⚠️  Partial fill: ${execution.executedQuantity!}/${position.quantity} shares`);
  }
  if (execution.executionTime > 200) {
    console.log(`  ⏱️  Execution time: ${execution.executionTime.toFixed(0)}ms`);
  }

  console.log(`  💵 Cash after sale: $${(agent.cashBalance + saleProceeds).toFixed(2)}`);
}

async function executeShort(agent: any, decision: any, stocks: Stock[]) {
  if (!decision.symbol || !decision.quantity) {
    console.log('  ⚠️  Invalid SELL_SHORT decision (missing symbol or quantity)');
    return;
  }

  const stock = stocks.find((s) => s.symbol === decision.symbol);
  if (!stock) {
    console.log(`  ❌ Stock ${decision.symbol} not found`);
    return;
  }

  // ALPHA ARENA PHASE 6: Validate exit parameters for SHORT
  const exitValidation = validateExitParameters(
    'SELL_SHORT',
    stock.price,
    decision.targetPrice,
    decision.stopLoss,
    decision.confidence
  );

  if (!exitValidation.allowed) {
    console.log(`  ❌ Exit parameter validation failed: ${exitValidation.reason}`);
    await logSafetyViolation(agent.id, agent.name, exitValidation.reason!, exitValidation.warningLevel!);
    return;
  }

  const totalValue = stock.price * decision.quantity;

  // Check if agent has enough cash (need collateral)
  if (totalValue > agent.cashBalance) {
    console.log(
      `  ❌ Insufficient funds for short: Need $${totalValue.toFixed(2)}, have $${agent.cashBalance.toFixed(2)}`
    );
    return;
  }

  // Check if agent already has a short position in this stock
  const existingPosition = agent.positions.find(
    (p: any) => p.symbol === stock.symbol && p.side === 'SHORT'
  );
  if (existingPosition) {
    console.log(`  ⚠️  Already have a short position in ${stock.symbol}`);
    return;
  }

  // Create new short position
  await prisma.position.create({
    data: {
      agentId: agent.id,
      symbol: stock.symbol,
      name: stock.name,
      side: 'SHORT',
      quantity: decision.quantity,
      entryPrice: stock.price,
      currentPrice: stock.price,
      unrealizedPnL: 0,
      unrealizedPnLPercent: 0,
      // targetPrice, stopLoss, invalidationCondition, entryDecisionId removed - not in production schema
    },
  });

  console.log(
    `  ✅ Shorted ${decision.quantity} shares of ${stock.symbol} @ $${stock.price.toFixed(2)}`
  );

  // Create trade record (Alpha Arena: link to decision)
  await prisma.trade.create({
    data: {
      agentId: agent.id,
      symbol: stock.symbol,
      name: stock.name,
      action: 'SELL_SHORT',
      quantity: decision.quantity,
      price: stock.price,
      total: totalValue,
      reasoning: decision.reasoning,
      confidence: decision.confidence,
      // decisionId removed - not in production schema
    },
  });

  // Receive cash from short sale
  await prisma.agent.update({
    where: { id: agent.id },
    data: {
      cashBalance: agent.cashBalance + totalValue,
    },
  });

  console.log(`  💵 Cash after short: $${(agent.cashBalance + totalValue).toFixed(2)}`);
}

async function executeCover(agent: any, decision: any, stocks: Stock[]) {
  if (!decision.symbol) {
    console.log('  ⚠️  Invalid BUY_TO_COVER decision (missing symbol)');
    return;
  }

  const stock = stocks.find((s) => s.symbol === decision.symbol);
  if (!stock) {
    console.log(`  ❌ Stock ${decision.symbol} not found`);
    return;
  }

  // Find short position
  const position = agent.positions.find(
    (p: any) => p.symbol === decision.symbol && p.side === 'SHORT'
  );
  if (!position) {
    console.log(`  ❌ No short position found for ${decision.symbol}`);
    return;
  }

  const coverCost = stock.price * position.quantity;
  const realizedPnL = (position.entryPrice - stock.price) * position.quantity;
  const realizedPnLPercent = ((position.entryPrice - stock.price) / position.entryPrice) * 100;

  // Check if agent has enough cash to cover
  if (coverCost > agent.cashBalance) {
    console.log(
      `  ❌ Insufficient funds to cover: Need $${coverCost.toFixed(2)}, have $${agent.cashBalance.toFixed(2)}`
    );
    return;
  }

  // Create trade record (Alpha Arena: link to decision and mark as manual exit)
  await prisma.trade.create({
    data: {
      agentId: agent.id,
      symbol: stock.symbol,
      name: stock.name,
      action: 'BUY_TO_COVER',
      quantity: position.quantity,
      price: stock.price,
      total: coverCost,
      realizedPnL,
      reasoning: decision.reasoning,
      confidence: decision.confidence,
      // decisionId, exitReason removed - not in production schema
    },
  });

  // Delete position
  await prisma.position.delete({
    where: { id: position.id },
  });

  // Update agent's cash balance
  await prisma.agent.update({
    where: { id: agent.id },
    data: {
      cashBalance: agent.cashBalance - coverCost,
    },
  });

  console.log(
    `  ✅ Covered ${position.quantity} shares of ${stock.symbol} @ $${stock.price.toFixed(2)}`
  );
  console.log(
    `  📊 Realized P&L: ${realizedPnL >= 0 ? '+' : ''}$${realizedPnL.toFixed(2)} (${realizedPnLPercent >= 0 ? '+' : ''}${realizedPnLPercent.toFixed(2)}%)`
  );
  console.log(`  💵 Cash after cover: $${(agent.cashBalance - coverCost).toFixed(2)}`);
}

async function updatePerformanceMetrics() {
  console.log('\n📈 Updating performance metrics...');

  const agents = await prisma.agent.findMany();

  for (const agent of agents) {
    await prisma.performancePoint.create({
      data: {
        agentId: agent.id,
        accountValue: agent.accountValue,
      },
    });
  }

  console.log('✓ Performance metrics updated');
}

// Allow running from command line
if (require.main === module) {
  runTradingCycle()
    .then(() => {
      console.log('✅ Done! Exiting...');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Fatal error:', error);
      process.exit(1);
    });
}
