/**
 * Test script for market-adaptive strategy selector
 * Shows what strategy would be recommended for current market conditions
 */

import { getOptimalTradingStrategy, getStrategyInstructions } from '../lib/strategy-selector';
import { getMarketContext } from '../lib/market-context';
import { fetchStockPrices } from '../lib/stock-api';
import { prisma } from '../lib/prisma';

async function testStrategySelector() {
  try {
    console.log('🧪 Testing Market-Adaptive Strategy Selector\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // 1. Fetch stock prices
    console.log('📊 Fetching current stock prices...');
    const stocks = await fetchStockPrices();
    console.log(`✓ Fetched ${stocks.length} stocks\n`);

    // 2. Get SPY historical prices for moving averages
    const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    const spyHistoricalPrices = await prisma.stockPrice.findMany({
      where: { symbol: 'SPY', timestamp: { gte: ninetyDaysAgo } },
      orderBy: { timestamp: 'asc' },
      select: { price: true }
    });

    // 3. Get market context
    console.log('🌍 Analyzing market context...');
    const marketContext = await getMarketContext(stocks, spyHistoricalPrices.map(p => p.price));
    console.log('✓ Market context generated\n');

    // 4. Detect optimal strategy
    console.log('🎯 Detecting optimal trading strategy...\n');
    const optimalStrategy = await getOptimalTradingStrategy(marketContext);

    // 5. Get strategy instructions
    const instructions = getStrategyInstructions(optimalStrategy);

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 STRATEGY RECOMMENDATION');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log(`Market Regime: ${optimalStrategy.regime.toUpperCase().replace(/_/g, ' ')}`);
    console.log(`Primary Strategy: ${optimalStrategy.primaryStrategy.toUpperCase().replace(/_/g, ' ')}`);
    if (optimalStrategy.secondaryStrategy) {
      console.log(`Secondary Strategy: ${optimalStrategy.secondaryStrategy.toUpperCase().replace(/_/g, ' ')}`);
    }
    console.log(`Confidence: ${optimalStrategy.confidence}%`);
    console.log(`Risk Level: ${optimalStrategy.riskLevel.toUpperCase()}`);
    console.log(`\nReasoning:\n${optimalStrategy.reasoning}`);

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📖 STRATEGY INSTRUCTIONS (sent to AI agents)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log(instructions);

    console.log('\n✅ Strategy selector test complete!\n');

  } catch (error) {
    console.error('❌ Error testing strategy selector:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testStrategySelector();
