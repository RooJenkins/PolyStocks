import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const agentId = searchParams.get('agentId');

    const where = agentId ? { agentId } : {};

    const positions = await prisma.position.findMany({
      where,
      orderBy: { openedAt: 'desc' },
      include: {
        agent: {
          select: {
            name: true,
            color: true,
          },
        },
      },
    });

    return NextResponse.json(positions);
  } catch (error: any) {
    console.error('Error fetching positions:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch positions' },
      { status: 500 }
    );
  }
}
