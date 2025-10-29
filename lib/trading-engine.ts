import { prisma } from './prisma';
import { fetchStockPrices, fetchStockQuote } from './stock-api';
import { getAIDecision } from './ai-models';
import type { Stock } from '@/types';

export async function runTradingCycle() {
  console.log('\n🔄 ===== STARTING TRADING CYCLE =====');
  console.log(`📅 ${new Date().toLocaleString()}\n`);

  try {
    // 1. Fetch current stock prices
    console.log('📊 Fetching stock prices...');
    const stocks = await fetchStockPrices();
    console.log(`✓ Fetched ${stocks.length} stock prices\n`);

    // 2. Get all agents
    const agents = await prisma.agent.findMany({
      include: {
        positions: true,
      },
    });

    console.log(`🤖 Processing ${agents.length} AI agents\n`);

    // 3. Process each agent
    for (const agent of agents) {
      await processAgentTrading(agent, stocks);
    }

    // 4. Update all performance metrics
    await updatePerformanceMetrics();

    console.log('\n✅ ===== TRADING CYCLE COMPLETE =====\n');
  } catch (error: any) {
    console.error('\n❌ ===== ERROR IN TRADING CYCLE =====');
    console.error(error);
    console.error('======================================\n');
  }
}

async function processAgentTrading(agent: any, stocks: Stock[]) {
  console.log(`\n━━━ ${agent.name} (${agent.model}) ━━━`);

  try {
    // Update current prices for all positions
    for (const position of agent.positions) {
      const currentStock = stocks.find((s) => s.symbol === position.symbol);
      if (currentStock) {
        position.currentPrice = currentStock.price;
        position.unrealizedPnL =
          (currentStock.price - position.entryPrice) * position.quantity;
        position.unrealizedPnLPercent =
          ((currentStock.price - position.entryPrice) / position.entryPrice) * 100;

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
    };

    // Get AI decision
    const decision = await getAIDecision(agent.id, agent.name, marketContext);

    console.log(`  🎯 Decision: ${decision.action}`);
    console.log(`  💭 Reasoning: ${decision.reasoning}`);
    console.log(`  📊 Confidence: ${(decision.confidence * 100).toFixed(1)}%`);

    // Execute trade based on decision
    if (decision.action === 'BUY') {
      await executeBuy(agent, decision, stocks);
    } else if (decision.action === 'SELL') {
      await executeSell(agent, decision, stocks);
    }

    // Log the decision
    await prisma.decision.create({
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
  } catch (error: any) {
    console.error(`  ❌ Error processing ${agent.name}:`, error.message);
  }
}

async function executeBuy(agent: any, decision: any, stocks: Stock[]) {
  if (!decision.symbol || !decision.quantity) {
    console.log('  ⚠️  Invalid BUY decision (missing symbol or quantity)');
    return;
  }

  const stock = stocks.find((s) => s.symbol === decision.symbol);
  if (!stock) {
    console.log(`  ❌ Stock ${decision.symbol} not found`);
    return;
  }

  const totalCost = stock.price * decision.quantity;

  // Check if agent has enough cash
  if (totalCost > agent.cashBalance) {
    console.log(
      `  ❌ Insufficient funds: Need $${totalCost.toFixed(2)}, have $${agent.cashBalance.toFixed(2)}`
    );
    return;
  }

  // Check if agent already has this position
  const existingPosition = agent.positions.find((p: any) => p.symbol === stock.symbol);
  if (existingPosition) {
    // Update existing position (average down/up)
    const newQuantity = existingPosition.quantity + decision.quantity;
    const newEntryPrice =
      (existingPosition.entryPrice * existingPosition.quantity +
        stock.price * decision.quantity) /
      newQuantity;

    await prisma.position.update({
      where: { id: existingPosition.id },
      data: {
        quantity: newQuantity,
        entryPrice: newEntryPrice,
        currentPrice: stock.price,
        unrealizedPnL: 0,
        unrealizedPnLPercent: 0,
      },
    });

    console.log(
      `  ✅ Added to position: ${decision.quantity} shares of ${stock.symbol} @ $${stock.price.toFixed(2)}`
    );
  } else {
    // Create new position
    await prisma.position.create({
      data: {
        agentId: agent.id,
        symbol: stock.symbol,
        name: stock.name,
        quantity: decision.quantity,
        entryPrice: stock.price,
        currentPrice: stock.price,
        unrealizedPnL: 0,
        unrealizedPnLPercent: 0,
      },
    });

    console.log(
      `  ✅ Bought ${decision.quantity} shares of ${stock.symbol} @ $${stock.price.toFixed(2)}`
    );
  }

  // Create trade record
  await prisma.trade.create({
    data: {
      agentId: agent.id,
      symbol: stock.symbol,
      name: stock.name,
      action: 'BUY',
      quantity: decision.quantity,
      price: stock.price,
      total: totalCost,
      reasoning: decision.reasoning,
      confidence: decision.confidence,
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

  const saleProceeds = stock.price * position.quantity;
  const realizedPnL = (stock.price - position.entryPrice) * position.quantity;
  const realizedPnLPercent = ((stock.price - position.entryPrice) / position.entryPrice) * 100;

  // Create trade record
  await prisma.trade.create({
    data: {
      agentId: agent.id,
      symbol: stock.symbol,
      name: stock.name,
      action: 'SELL',
      quantity: position.quantity,
      price: stock.price,
      total: saleProceeds,
      realizedPnL,
      reasoning: decision.reasoning,
      confidence: decision.confidence,
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
    `  ✅ Sold ${position.quantity} shares of ${stock.symbol} @ $${stock.price.toFixed(2)}`
  );
  console.log(
    `  📊 Realized P&L: ${realizedPnL >= 0 ? '+' : ''}$${realizedPnL.toFixed(2)} (${realizedPnLPercent >= 0 ? '+' : ''}${realizedPnLPercent.toFixed(2)}%)`
  );
  console.log(`  💵 Cash after sale: $${(agent.cashBalance + saleProceeds).toFixed(2)}`);
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
