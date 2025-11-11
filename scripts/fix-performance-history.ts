import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixPerformanceHistory() {
  try {
    console.log('🧹 Cleaning up incorrect performance data points...\n');

    const claude = await prisma.agent.findFirst({
      where: { model: 'claude-sonnet-4-20250514' },
    });

    if (!claude) {
      console.log('❌ Claude not found');
      return;
    }

    console.log(`📊 Claude Sonnet 4.5 (${claude.id})`);
    console.log(`   Current Account Value: $${claude.accountValue.toFixed(2)}`);

    // Get all performance points
    const performancePoints = await prisma.performancePoint.findMany({
      where: { agentId: claude.id },
      orderBy: { timestamp: 'desc' },
    });

    console.log(`\n📈 Performance Points (${performancePoints.length} total):\n`);

    let deletedCount = 0;

    for (const point of performancePoints) {
      const isInvalid = point.accountValue > 11000 && point.accountValue < 12000;

      console.log(`${isInvalid ? '❌' : '✓'} ${point.timestamp.toISOString().slice(0, 19).replace('T', ' ')} - $${point.accountValue.toFixed(2)}`);

      // Delete performance points in the $11,000-$12,000 range (the fake spike)
      if (isInvalid) {
        await prisma.performancePoint.delete({
          where: { id: point.id },
        });
        deletedCount++;
      }
    }

    console.log(`\n✨ Deleted ${deletedCount} incorrect performance points`);

    // Verify remaining points
    const remainingPoints = await prisma.performancePoint.findMany({
      where: { agentId: claude.id },
      orderBy: { timestamp: 'desc' },
    });

    console.log(`\n✅ Remaining performance points: ${remainingPoints.length}`);

    if (remainingPoints.length > 0) {
      console.log('\nRecent valid points:');
      remainingPoints.slice(0, 5).forEach(point => {
        console.log(`   ${point.timestamp.toISOString().slice(0, 19).replace('T', ' ')} - $${point.accountValue.toFixed(2)}`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

fixPerformanceHistory();
