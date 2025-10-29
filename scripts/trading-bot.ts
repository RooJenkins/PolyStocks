import cron from 'node-cron';
import { runTradingCycle } from '../lib/trading-engine';

console.log('🤖 PolyStocks AI Trading Bot Started');
console.log('📅 Running every 30 minutes (cost-optimized)');
console.log('⏰ Started at:', new Date().toLocaleString());
console.log('💰 Estimated cost: $4-5/month');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Run immediately on startup
console.log('🚀 Running initial trading cycle...\n');
runTradingCycle().catch(console.error);

// Then run every 30 minutes (48 cycles per day)
// This reduces API costs by 90% while maintaining active trading
cron.schedule('*/30 * * * *', async () => {
  console.log(`\n\n⏰ Scheduled run at ${new Date().toLocaleString()}`);
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
