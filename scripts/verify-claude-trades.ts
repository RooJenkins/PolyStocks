import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyClaudeTrades() {
  try {
    console.log('🔍 Verifying Claude Sonnet 4.5 trades...\n');

    // Get Claude agent
    const claude = await prisma.agent.findFirst({
      where: { model: 'claude-sonnet-4-20250514' },
    });

    if (!claude) {
      console.log('❌ Claude Sonnet 4.5 not found');
      return;
    }

    console.log('📊 Agent Info:');
    console.log(`   Name: ${claude.name}`);
    console.log(`   Account Value: $${claude.accountValue.toLocaleString()}`);
    console.log(`   Cash Balance: $${claude.cashBalance.toLocaleString()}`);
    console.log(`   Starting Value: $${claude.startingValue.toLocaleString()}`);
    console.log(`   P&L: $${(claude.accountValue - claude.startingValue).toFixed(2)} (${((claude.accountValue - claude.startingValue) / claude.startingValue * 100).toFixed(2)}%)`);

    // Get all trades
    const trades = await prisma.trade.findMany({
      where: { agentId: claude.id },
      orderBy: { timestamp: 'desc' },
      take: 20,
    });

    console.log(`\n📈 Recent Trades (${trades.length} total):\n`);

    let totalRealizedPnL = 0;
    trades.forEach((trade, idx) => {
      const pnl = trade.realizedPnL || 0;
      totalRealizedPnL += pnl;

      console.log(`${idx + 1}. ${trade.timestamp.toISOString().slice(0, 16).replace('T', ' ')}`);
      console.log(`   ${trade.action} ${trade.quantity} ${trade.symbol} @ $${trade.price.toFixed(2)}`);
      console.log(`   Total: $${trade.total.toFixed(2)}`);
      if (trade.realizedPnL !== null) {
        console.log(`   Realized P&L: $${pnl.toFixed(2)}`);
      }
      console.log(`   Reasoning: ${trade.reasoning.slice(0, 100)}...`);
      console.log('');
    });

    console.log(`💰 Total Realized P&L from trades: $${totalRealizedPnL.toFixed(2)}`);

    // Get current positions
    const positions = await prisma.position.findMany({
      where: { agentId: claude.id },
    });

    console.log(`\n📦 Current Positions (${positions.length}):\n`);

    let totalUnrealizedPnL = 0;
    positions.forEach((pos, idx) => {
      totalUnrealizedPnL += pos.unrealizedPnL;

      console.log(`${idx + 1}. ${pos.symbol} (${pos.side})`);
      console.log(`   Quantity: ${pos.quantity}`);
      console.log(`   Entry: $${pos.entryPrice.toFixed(2)} | Current: $${pos.currentPrice.toFixed(2)}`);
      console.log(`   Unrealized P&L: $${pos.unrealizedPnL.toFixed(2)} (${pos.unrealizedPnLPercent.toFixed(2)}%)`);
      console.log('');
    });

    console.log(`💰 Total Unrealized P&L: $${totalUnrealizedPnL.toFixed(2)}`);

    // Calculate expected account value
    const expectedAccountValue = claude.cashBalance + positions.reduce((sum, pos) => {
      return sum + (pos.quantity * pos.currentPrice);
    }, 0);

    console.log(`\n🧮 Verification:`);
    console.log(`   Cash Balance: $${claude.cashBalance.toFixed(2)}`);
    console.log(`   + Position Values: $${positions.reduce((sum, pos) => sum + (pos.quantity * pos.currentPrice), 0).toFixed(2)}`);
    console.log(`   = Expected Account Value: $${expectedAccountValue.toFixed(2)}`);
    console.log(`   Actual Account Value: $${claude.accountValue.toFixed(2)}`);
    console.log(`   Difference: $${(claude.accountValue - expectedAccountValue).toFixed(2)}`);

    const isCorrect = Math.abs(claude.accountValue - expectedAccountValue) < 1;
    console.log(`\n${isCorrect ? '✅' : '❌'} Account value is ${isCorrect ? 'CORRECT' : 'INCORRECT'}`);

  } catch (error) {
    console.error('❌ Error verifying trades:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

verifyClaudeTrades();
