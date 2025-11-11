import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function removeDuplicates() {
  try {
    console.log('🗑️  Removing duplicate agents...\n');

    // Delete GPT-4o Mini (duplicate of GPT-5)
    const gpt4oMini = await prisma.agent.findFirst({
      where: { model: 'gpt-4o-mini' },
    });

    if (gpt4oMini) {
      await prisma.agent.delete({
        where: { id: gpt4oMini.id },
      });
      console.log(`✅ Deleted duplicate: GPT-4o Mini (${gpt4oMini.id})`);
    }

    // Delete Claude Haiku (duplicate of Claude Sonnet 4.5)
    const claudeHaiku = await prisma.agent.findFirst({
      where: { model: 'claude-3-5-haiku-20241022' },
    });

    if (claudeHaiku) {
      await prisma.agent.delete({
        where: { id: claudeHaiku.id },
      });
      console.log(`✅ Deleted duplicate: Claude Haiku (${claudeHaiku.id})`);
    }

    console.log('\n✨ Duplicates removed successfully!');

  } catch (error) {
    console.error('❌ Error removing duplicates:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

removeDuplicates();
