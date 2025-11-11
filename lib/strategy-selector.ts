/**
 * Smart Strategy Selection Based on Market Conditions
 *
 * Analyzes market regime and recommends optimal trading strategy
 * Rather than forcing each AI into a fixed strategy, we select the
 * BEST strategy for current market conditions and apply to all AIs.
 */

import type { MarketContext } from './market-context';

export type MarketRegime =
  | 'strong_uptrend'      // Trending up with momentum
  | 'weak_uptrend'        // Grinding higher slowly
  | 'range_bound'         // Sideways choppy market
  | 'weak_downtrend'      // Slow decline
  | 'strong_downtrend'    // Bear market crash
  | 'high_volatility'     // VIX spike, panic
  | 'low_volatility';     // Calm, boring market

export type OptimalStrategy =
  | 'momentum_breakout'
  | 'trend_following'
  | 'mean_reversion'
  | 'volatility_arbitrage'
  | 'defensive_cash';

export interface StrategyRecommendation {
  regime: MarketRegime;
  primaryStrategy: OptimalStrategy;
  secondaryStrategy?: OptimalStrategy;
  reasoning: string;
  confidence: number;
  riskLevel: 'low' | 'medium' | 'high';
}

/**
 * Detect current market regime
 */
export function detectMarketRegime(marketContext: MarketContext): MarketRegime {
  const { spyTrend, vix, sectorRotation } = marketContext;

  // Strong uptrend: Price > MAs, low VIX, sectors leading
  if (
    spyTrend.regime === 'bullish' &&
    spyTrend.weekChange > 2 &&
    vix.level < 15
  ) {
    return 'strong_uptrend';
  }

  // Weak uptrend: Grinding higher but choppy
  if (
    spyTrend.regime === 'bullish' &&
    spyTrend.weekChange > 0 &&
    spyTrend.weekChange < 2
  ) {
    return 'weak_uptrend';
  }

  // High volatility: VIX spike
  if (vix.level > 20) {
    return 'high_volatility';
  }

  // Low volatility: Boring market
  if (vix.level < 12) {
    return 'low_volatility';
  }

  // Range bound: Neutral regime, low vol
  if (
    spyTrend.regime === 'neutral' &&
    Math.abs(spyTrend.weekChange) < 1
  ) {
    return 'range_bound';
  }

  // Downtrends
  if (spyTrend.regime === 'bearish') {
    return spyTrend.weekChange < -3 ? 'strong_downtrend' : 'weak_downtrend';
  }

  return 'range_bound'; // Default
}

/**
 * Select optimal strategy based on market regime
 */
export function selectOptimalStrategy(
  regime: MarketRegime,
  marketContext: MarketContext
): StrategyRecommendation {

  switch (regime) {
    case 'strong_uptrend':
      return {
        regime,
        primaryStrategy: 'momentum_breakout',
        secondaryStrategy: 'trend_following',
        reasoning: `Strong uptrend (SPY +${marketContext.spyTrend.weekChange.toFixed(1)}% this week, VIX ${marketContext.vix.level}). Momentum and trend-following strategies perform best. Buy breakouts with strong volume.`,
        confidence: 85,
        riskLevel: 'medium',
      };

    case 'weak_uptrend':
      return {
        regime,
        primaryStrategy: 'trend_following',
        reasoning: `Weak uptrend with SPY +${marketContext.spyTrend.weekChange.toFixed(1)}%. Market grinding higher but choppy. Trend-following with wider stops works best. Avoid aggressive breakout chasing.`,
        confidence: 70,
        riskLevel: 'medium',
      };

    case 'range_bound':
      return {
        regime,
        primaryStrategy: 'mean_reversion',
        reasoning: `Range-bound market (SPY ${marketContext.spyTrend.weekChange.toFixed(1)}% weekly, VIX ${marketContext.vix.level}). Mean reversion performs best. Buy oversold dips, sell overbought rallies. Avoid breakout trades.`,
        confidence: 75,
        riskLevel: 'low',
      };

    case 'high_volatility':
      return {
        regime,
        primaryStrategy: 'volatility_arbitrage',
        secondaryStrategy: 'mean_reversion',
        reasoning: `High volatility regime (VIX ${marketContext.vix.level}). Volatility arbitrage works best - buy panic selloffs in quality names, sell quick bounces. Mean reversion on 1-2 day timeframe.`,
        confidence: 80,
        riskLevel: 'high',
      };

    case 'low_volatility':
      return {
        regime,
        primaryStrategy: 'mean_reversion',
        reasoning: `Low volatility (VIX ${marketContext.vix.level}). Calm, boring market. Mean reversion on small moves. Avoid overtrading. Consider larger positions due to low risk.`,
        confidence: 70,
        riskLevel: 'low',
      };

    case 'weak_downtrend':
    case 'strong_downtrend':
      return {
        regime,
        primaryStrategy: 'defensive_cash',
        secondaryStrategy: 'volatility_arbitrage',
        reasoning: `Bearish market (SPY ${marketContext.spyTrend.weekChange.toFixed(1)}%, VIX ${marketContext.vix.level}). DEFENSIVE MODE - preserve capital. Only trade volatility spikes or stay in cash. Avoid longs.`,
        confidence: 90,
        riskLevel: 'high',
      };

    default:
      return {
        regime,
        primaryStrategy: 'mean_reversion',
        reasoning: 'Unclear market regime. Using conservative mean reversion approach.',
        confidence: 50,
        riskLevel: 'medium',
      };
  }
}

/**
 * Get strategy instructions for AI prompt
 */
export function getStrategyInstructions(
  recommendation: StrategyRecommendation
): string {
  const strategyGuides: Record<OptimalStrategy, string> = {
    momentum_breakout: `
MOMENTUM BREAKOUT STRATEGY (Active Now)
═══════════════════════════════════════
Entry Signals:
  ✓ Price breaks above MA7 with 2x avg volume
  ✓ RSI > 60 (momentum building, not overbought)
  ✓ Daily gain > 3% with strong sector support
  ✓ Stock making new 20-day highs

Exit Signals:
  ✗ Price closes below MA7 (momentum broken)
  ✗ Volume dries up (< 0.5x avg)
  ✗ RSI > 75 (overbought, take profits)
  ✗ Quick 5-7% profit target hit

Holding Period: 1-3 days (quick flips)
Risk: Aggressive (tight stops)`,

    trend_following: `
TREND FOLLOWING STRATEGY (Active Now)
═══════════════════════════════════════
Entry Signals:
  ✓ Price > MA7 > MA30 > MA90 (aligned uptrend)
  ✓ Making higher highs and higher lows
  ✓ Relative strength > +3% vs SPY
  ✓ Leading sector with momentum

Exit Signals:
  ✗ Price closes below MA30 (trend break)
  ✗ Relative strength turns negative
  ✗ Market regime shifts bearish
  ✗ 10-15% profit target or trailing stop hit

Holding Period: 1-4 weeks (ride the trend)
Risk: Moderate (wider stops)`,

    mean_reversion: `
MEAN REVERSION STRATEGY (Active Now)
═══════════════════════════════════════
Entry Signals:
  ✓ RSI < 30 (oversold on quality stock)
  ✓ Price touches lower Bollinger band
  ✓ Down > 5% in week without negative news
  ✓ Strong fundamentals intact

Exit Signals:
  ✗ RSI normalizes to 50-60
  ✗ Price reaches middle Bollinger band
  ✗ 3-5% profit target achieved
  ✗ Position held > 7 days without recovery

Holding Period: 3-7 days (wait for bounce)
Risk: Moderate (buy dips)`,

    volatility_arbitrage: `
VOLATILITY ARBITRAGE STRATEGY (Active Now)
═══════════════════════════════════════
Entry Signals:
  ✓ VIX spike > 20 (fear elevated)
  ✓ Stock down > 4% on broad market selloff
  ✓ Quality name with no stock-specific issues
  ✓ RSI < 35 (oversold in panic)

Exit Signals:
  ✗ VIX normalizes < 18
  ✗ Quick 3-5% bounce captured
  ✗ Next trading day (quick flip)
  ✗ Volatility remains elevated > 2 days (thesis failed)

Holding Period: 1-2 days (capture volatility)
Risk: Aggressive (fast moves)`,

    defensive_cash: `
DEFENSIVE MODE (Active Now)
═══════════════════════════════════════
⚠️  BEARISH MARKET - CAPITAL PRESERVATION ⚠️

Actions:
  ✓ HOLD CASH (primary strategy)
  ✓ Close any losing positions
  ✓ Tighten stops on winning positions
  ✓ Only trade extreme volatility spikes (VIX > 25)

DO NOT:
  ✗ Open new long positions (bear market)
  ✗ Buy dips (falling knives)
  ✗ Chase momentum (fades quickly)

Holding Period: Sit on sidelines
Risk: Low (protect capital)`,
  };

  return `
═══════════════════════════════════════════════════════════
MARKET REGIME: ${recommendation.regime.toUpperCase().replace(/_/g, ' ')}
═══════════════════════════════════════════════════════════

${recommendation.reasoning}

Confidence: ${recommendation.confidence}%
Risk Level: ${recommendation.riskLevel.toUpperCase()}

${strategyGuides[recommendation.primaryStrategy]}

${recommendation.secondaryStrategy ? `
SECONDARY STRATEGY: ${recommendation.secondaryStrategy.replace(/_/g, ' ').toUpperCase()}
(Use if primary strategy has no clear opportunities)
` : ''}

═══════════════════════════════════════════════════════════
`;
}

/**
 * Main function: Get optimal strategy for current market
 */
export async function getOptimalTradingStrategy(
  marketContext: MarketContext
): Promise<StrategyRecommendation> {
  // 1. Detect market regime
  const regime = detectMarketRegime(marketContext);

  // 2. Select optimal strategy
  const recommendation = selectOptimalStrategy(regime, marketContext);

  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('📊 MARKET REGIME DETECTION');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`  Regime: ${regime.toUpperCase().replace(/_/g, ' ')}`);
  console.log(`  Optimal Strategy: ${recommendation.primaryStrategy.toUpperCase().replace(/_/g, ' ')}`);
  console.log(`  Confidence: ${recommendation.confidence}%`);
  console.log(`  Risk Level: ${recommendation.riskLevel.toUpperCase()}`);
  console.log('');
  console.log(`  Reasoning:`);
  console.log(`  ${recommendation.reasoning}`);
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');

  return recommendation;
}
