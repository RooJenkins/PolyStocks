import cron from 'node-cron';
import { runTradingCycle } from '../lib/trading-engine';

console.log('🤖 PolyStocks AI Trading Bot Started');
console.log('📅 Running every 3 minutes');
console.log('⏰ Started at:', new Date().toLocaleString());
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Run immediately on startup
console.log('🚀 Running initial trading cycle...\n');
runTradingCycle().catch(console.error);

// Then run every 3 minutes
cron.schedule('*/3 * * * *', async () => {
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
