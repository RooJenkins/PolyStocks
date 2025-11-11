import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyAllAgents() {
  try {
    console.log('🔍 Verifying ALL agents for cash balance issues...\n');

    const agents = await prisma.agent.findMany({
      where: {
        NOT: { model: 'equal-weighted-index' },
      },
      orderBy: { name: 'asc' },
    });

    for (const agent of agents) {
      // Get positions
      const positions = await prisma.position.findMany({
        where: { agentId: agent.id },
      });

      const positionValue = positions.reduce((sum, pos) =>
        sum + (pos.quantity * pos.currentPrice), 0
      );

      const positionCost = positions.reduce((sum, pos) =>
        sum + (pos.quantity * pos.entryPrice), 0
      );

      const expectedCash = agent.startingValue - positionCost;
      const cashDifference = agent.cashBalance - expectedCash;

      const status = Math.abs(cashDifference) < 1 ? '✅' : '❌';

      console.log(`${status} ${agent.name}`);
      console.log(`   Account Value: $${agent.accountValue.toFixed(2)}`);
      console.log(`   Cash Balance: $${agent.cashBalance.toFixed(2)}`);
      console.log(`   Expected Cash: $${expectedCash.toFixed(2)}`);
      console.log(`   Cash Difference: $${cashDifference.toFixed(2)}`);
      console.log(`   Position Value: $${positionValue.toFixed(2)}`);
      console.log(`   Position Cost: $${positionCost.toFixed(2)}`);
      console.log(`   Positions: ${positions.length}`);
      console.log('');
    }

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

verifyAllAgents();
