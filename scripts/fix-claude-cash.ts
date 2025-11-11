import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixClaudeCash() {
  try {
    console.log('🔧 Fixing Claude Sonnet 4.5 cash balance...\n');

    const claude = await prisma.agent.findFirst({
      where: { model: 'claude-sonnet-4-20250514' },
    });

    if (!claude) {
      console.log('❌ Claude not found');
      return;
    }

    // Get positions to calculate correct cash
    const positions = await prisma.position.findMany({
      where: { agentId: claude.id },
    });

    const positionCost = positions.reduce((sum, pos) =>
      sum + (pos.quantity * pos.entryPrice), 0
    );

    const positionValue = positions.reduce((sum, pos) =>
      sum + (pos.quantity * pos.currentPrice), 0
    );

    const correctCash = claude.startingValue - positionCost;
    const correctAccountValue = correctCash + positionValue;

    console.log('📊 Before Fix:');
    console.log(`   Cash Balance: $${claude.cashBalance.toFixed(2)}`);
    console.log(`   Account Value: $${claude.accountValue.toFixed(2)}`);
    console.log(`   P&L: +$${(claude.accountValue - claude.startingValue).toFixed(2)} (+${((claude.accountValue - claude.startingValue) / claude.startingValue * 100).toFixed(2)}%)`);

    console.log('\n🔧 Calculating Correct Values:');
    console.log(`   Starting Value: $${claude.startingValue.toFixed(2)}`);
    console.log(`   Position Cost: -$${positionCost.toFixed(2)}`);
    console.log(`   = Correct Cash: $${correctCash.toFixed(2)}`);
    console.log(`   Position Value: +$${positionValue.toFixed(2)}`);
    console.log(`   = Correct Account Value: $${correctAccountValue.toFixed(2)}`);

    // Update agent
    await prisma.agent.update({
      where: { id: claude.id },
      data: {
        cashBalance: correctCash,
        accountValue: correctAccountValue,
      },
    });

    console.log('\n✅ After Fix:');
    console.log(`   Cash Balance: $${correctCash.toFixed(2)}`);
    console.log(`   Account Value: $${correctAccountValue.toFixed(2)}`);
    console.log(`   Real P&L: +$${(correctAccountValue - claude.startingValue).toFixed(2)} (+${((correctAccountValue - claude.startingValue) / claude.startingValue * 100).toFixed(2)}%)`);

    console.log('\n✨ Cash balance fixed!');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

fixClaudeCash();
