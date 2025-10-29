import cron from 'node-cron';
import { runTradingCycle } from '../lib/trading-engine';
import { isMarketOpen, getMarketStatus, formatDuration } from '../lib/realistic-execution';

console.log('🤖 PolyStocks AI Trading Bot Started');
console.log('📅 Running every 30 minutes during market hours (9:30am-4pm ET)');
console.log('⏰ Started at:', new Date().toLocaleString());
console.log('💰 Estimated cost: $4-5/month');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Check market status on startup
const marketStatus = getMarketStatus();
console.log(`📊 Market Status: ${marketStatus.isOpen ? '✅ OPEN' : '🔴 CLOSED'}`);
if (!marketStatus.isOpen) {
  console.log(`⏰ Next market open: ${marketStatus.nextOpen.toLocaleString()}`);
  console.log(`⏳ Time until open: ${formatDuration(marketStatus.timeUntilOpen)}\n`);
}

// Run immediately on startup (only if market is open)
if (marketStatus.isOpen) {
  console.log('🚀 Market is open - Running initial trading cycle...\n');
  runTradingCycle().catch(console.error);
} else {
  console.log('⏸️  Market is closed - Waiting for next market open...\n');
}

// Then run every 30 minutes (only during market hours)
// This reduces API costs by 90% while maintaining active trading
cron.schedule('*/30 * * * *', async () => {
  const now = new Date();
  console.log(`\n\n⏰ Scheduled run at ${now.toLocaleString()}`);

  // Check if market is open
  if (!isMarketOpen(now)) {
    const status = getMarketStatus();
    console.log('🔴 Market is CLOSED - Skipping trading cycle');
    console.log(`⏰ Next market open: ${status.nextOpen.toLocaleString()}`);
    console.log(`⏳ Time until open: ${formatDuration(status.timeUntilOpen)}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    return;
  }

  console.log('✅ Market is OPEN - Running trading cycle');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  try {
    await runTradingCycle();
  } catch (error) {
    console.error('❌ Error in scheduled trading:', error);
  }
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n🛑 Shutting down PolyStocks Trading Bot...');
  console.log('👋 Goodbye!');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n\n🛑 Shutting down PolyStocks Trading Bot...');
  console.log('👋 Goodbye!');
  process.exit(0);
});

// Keep process alive
console.log('✅ Trading bot is running. Press Ctrl+C to stop.\n');
