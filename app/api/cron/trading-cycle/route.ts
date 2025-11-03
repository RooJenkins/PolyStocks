import { NextRequest, NextResponse } from 'next/server';
import { runTradingCycle } from '@/lib/trading-engine';

/**
 * POST /api/cron/trading-cycle
 * Vercel Cron Job endpoint to run the AI trading cycle
 * Runs every 5 minutes during market hours
 */
export async function POST(request: NextRequest) {
  // Verify the request is from Vercel Cron
  const authHeader = request.headers.get('authorization');

  if (process.env.NODE_ENV === 'production') {
    // In production, verify it's coming from Vercel Cron
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
  }

  console.log('🚀 [Cron] Trading cycle triggered by Vercel Cron');

  try {
    await runTradingCycle();

    return NextResponse.json({
      success: true,
      message: 'Trading cycle completed successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('❌ [Cron] Trading cycle failed:', error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Trading cycle failed',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/cron/trading-cycle
 * Test endpoint to check if cron is configured
 */
export async function GET() {
  return NextResponse.json({
    message: 'Trading cycle cron endpoint is active',
    schedule: 'Every 5 minutes during market hours (9:30 AM - 4:00 PM ET)',
    nextRun: 'Managed by Vercel Cron'
  });
}
