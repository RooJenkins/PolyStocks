import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const AGENTS = [
  { name: 'GPT-5', model: 'gpt-5', color: '#10b981', broker: 'simulation', isLive: false },
  { name: 'Claude Sonnet 4.5', model: 'claude-sonnet-4-20250514', color: '#3b82f6', broker: 'simulation', isLive: false },
  { name: 'Gemini Flash', model: 'gemini-2.0-flash-exp', color: '#f59e0b', broker: 'simulation', isLive: false },
  { name: 'DeepSeek', model: 'deepseek-chat', color: '#8b5cf6', broker: 'simulation', isLive: false },
  { name: 'Qwen', model: 'qwen-max', color: '#ec4899', broker: 'simulation', isLive: false },
  { name: 'Grok', model: 'grok-2-1212', color: '#ef4444', broker: 'simulation', isLive: false },
  { name: 'Kimi K2', model: 'moonshot-v1-128k', color: '#14b8a6', broker: 'simulation', isLive: false },
];

async function seedAgents() {
  try {
    console.log('🌱 Seeding AI trading agents...\n');

    for (const agentData of AGENTS) {
      // Check if agent already exists
      const existing = await prisma.agent.findFirst({
        where: { model: agentData.model },
      });

      let agent;
      if (existing) {
        // Update existing agent
        agent = await prisma.agent.update({
          where: { id: existing.id },
          data: {
            accountValue: 10000,
            cashBalance: 10000,
            startingValue: 10000,
            lastSyncAt: new Date(),
          },
        });
        console.log(`🔄 ${agent.name} (${agent.model}) - Reset to $${agent.accountValue.toLocaleString()}`);
      } else {
        // Create new agent
        agent = await prisma.agent.create({
          data: {
            name: agentData.name,
            model: agentData.model,
            color: agentData.color,
            broker: agentData.broker,
            isLive: agentData.isLive,
            accountValue: 10000,
            cashBalance: 10000,
            startingValue: 10000,
            lastSyncAt: new Date(),
          },
        });
        console.log(`✅ ${agent.name} (${agent.model}) - Created with $${agent.accountValue.toLocaleString()}`);
      }
    }

    console.log('\n📊 All agents seeded successfully!');
    console.log(`\n💰 Total portfolio value: $${(AGENTS.length * 10000).toLocaleString()}`);

  } catch (error) {
    console.error('❌ Error seeding agents:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedAgents();
