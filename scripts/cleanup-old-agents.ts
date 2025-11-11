import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanupOldAgents() {
  try {
    console.log('🧹 Cleaning up old agent versions...\n');

    // Delete old Qwen (qwen-2.5-72b) - keep qwen-max
    const oldQwen = await prisma.agent.findFirst({
      where: { model: 'qwen-2.5-72b' },
    });

    if (oldQwen) {
      await prisma.agent.delete({
        where: { id: oldQwen.id },
      });
      console.log(`✅ Deleted old Qwen: qwen-2.5-72b (${oldQwen.id})`);
    }

    // Delete old Grok (grok-beta) - keep grok-2-1212
    const oldGrok = await prisma.agent.findFirst({
      where: { model: 'grok-beta' },
    });

    if (oldGrok) {
      await prisma.agent.delete({
        where: { id: oldGrok.id },
      });
      console.log(`✅ Deleted old Grok: grok-beta (${oldGrok.id})`);
    }

    console.log('\n✨ Cleanup complete!');
    console.log('\n📊 Verifying final agent list...\n');

    // Show final list
    const finalAgents = await prisma.agent.findMany({
      where: {
        NOT: { model: 'equal-weighted-index' }, // Exclude benchmark
      },
      select: {
        name: true,
        model: true,
        color: true,
      },
      orderBy: { name: 'asc' },
    });

    finalAgents.forEach((agent, idx) => {
      console.log(`${idx + 1}. ${agent.name} (${agent.model}) - ${agent.color}`);
    });

    console.log(`\n✅ Total AI agents: ${finalAgents.length}`);

  } catch (error) {
    console.error('❌ Error cleaning up agents:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupOldAgents();
