import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get('timeframe') || 'all';

    let startDate: Date | undefined;
    const now = new Date();

    switch (timeframe) {
      case '24h':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'all':
      default:
        startDate = undefined;
    }

    const where = startDate ? { timestamp: { gte: startDate } } : {};

    const performancePoints = await prisma.performancePoint.findMany({
      where,
      orderBy: { timestamp: 'asc' },
    });

    // Group by timestamp and format for chart
    const groupedData = new Map<string, any>();

    for (const point of performancePoints) {
      const timestamp = point.timestamp.toISOString();

      if (!groupedData.has(timestamp)) {
        groupedData.set(timestamp, { timestamp });
      }

      const entry = groupedData.get(timestamp);
      entry[point.agentId] = point.accountValue;
    }

    const chartData = Array.from(groupedData.values());

    return NextResponse.json(chartData);
  } catch (error: any) {
    console.error('Error fetching performance data:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch performance data' },
      { status: 500 }
    );
  }
}
