import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Simple auth check - require a secret key
    if (body.secret !== 'polystocks-reset-2024') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('🔄 Resetting production database...');

    // 1. Delete all positions
    const deletedPositions = await prisma.position.deleteMany({});
    console.log(`✅ Deleted ${deletedPositions.count} positions`);

    // 2. Delete all trades
    const deletedTrades = await prisma.trade.deleteMany({});
    console.log(`✅ Deleted ${deletedTrades.count} trades`);

    // 3. Delete all decisions
    const deletedDecisions = await prisma.decision.deleteMany({});
    console.log(`✅ Deleted ${deletedDecisions.count} decisions`);

    // 4. Delete all performance points
    const deletedPerformance = await prisma.performancePoint.deleteMany({});
    console.log(`✅ Deleted ${deletedPerformance.count} performance points`);

    // 5. Delete all stock prices
    const deletedStockPrices = await prisma.stockPrice.deleteMany({});
    console.log(`✅ Deleted ${deletedStockPrices.count} stock prices`);

    // 6. Reset all agents to $10,000 each
    const agents = await prisma.agent.findMany();
    console.log(`💰 Resetting ${agents.length} agents to $10,000 each`);

    for (const agent of agents) {
      await prisma.agent.update({
        where: { id: agent.id },
        data: {
          cashBalance: 10000,
          accountValue: 10000
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Production database reset complete',
      deleted: {
        positions: deletedPositions.count,
        trades: deletedTrades.count,
        decisions: deletedDecisions.count,
        performance: deletedPerformance.count,
        stockPrices: deletedStockPrices.count
      },
      agents: agents.length,
      totalCapital: agents.length * 10000
    });
  } catch (error: any) {
    console.error('❌ Error resetting:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
