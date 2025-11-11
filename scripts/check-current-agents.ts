import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkAgents() {
  try {
    console.log('📊 Current agents in database:\n');

    const agents = await prisma.agent.findMany({
      select: {
        id: true,
        name: true,
        model: true,
        color: true,
        accountValue: true,
        cashBalance: true,
      },
    });

    if (agents.length === 0) {
      console.log('No agents found in database.');
    } else {
      agents.forEach((agent, idx) => {
        console.log(`${idx + 1}. ${agent.name}`);
        console.log(`   Model: ${agent.model}`);
        console.log(`   ID: ${agent.id}`);
        console.log(`   Color: ${agent.color}`);
        console.log(`   Account Value: $${agent.accountValue.toLocaleString()}`);
        console.log(`   Cash Balance: $${agent.cashBalance.toLocaleString()}`);
        console.log('');
      });
    }

    console.log(`Total agents: ${agents.length}`);

  } catch (error) {
    console.error('❌ Error checking agents:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

checkAgents();
