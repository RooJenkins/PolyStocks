import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const agentId = searchParams.get('agentId');
    const limit = parseInt(searchParams.get('limit') || '50');

    const where = agentId ? { agentId } : {};

    const trades = await prisma.trade.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      take: limit,
      include: {
        agent: {
          select: {
            name: true,
            color: true,
          },
        },
      },
    });

    return NextResponse.json(trades);
  } catch (error: any) {
    console.error('Error fetching trades:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch trades' },
      { status: 500 }
    );
  }
}
