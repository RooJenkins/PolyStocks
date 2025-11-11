/**
 * AI-Driven Strategy Selection
 *
 * Each AI independently analyzes market conditions and chooses their own trading strategy.
 * This tests AI intelligence at strategy selection and creates natural portfolio diversification.
 */

import type { MarketIntelligence } from './market-intelligence';
import type { MarketContext } from './market-context';

export type TradingStrategy =
  | 'momentum_breakout'
  | 'mean_reversion'
  | 'trend_following'
  | 'volatility_arbitrage'
  | 'defensive_cash';

export interface StrategyChoice {
  chosenStrategy: TradingStrategy;
  reasoning: string;
  confidence: number; // 0-1
  alternativeStrategy?: TradingStrategy;
  keyFactors: string[]; // What influenced the decision
}

/**
 * Generate strategy selection prompt for AI
 */
export function generateStrategySelectionPrompt(
  marketIntelligence: MarketIntelligence,
  marketContext: MarketContext
): string {
  return `You are an expert trader analyzing current market conditions to select the optimal trading strategy for the next trading session.

${marketIntelligence.last48Hours.summary}

${marketIntelligence.last30Days.summary}

${marketIntelligence.last90Days.summary}

CURRENT MARKET STATE:
══════════════════════════════════════
• SPY Trend: ${marketContext.spyTrend.regime.toUpperCase()}
• SPY vs MA7: ${((marketContext.spyTrend.price - marketContext.spyTrend.ma7) / marketContext.spyTrend.ma7 * 100).toFixed(2)}%
• SPY vs MA30: ${((marketContext.spyTrend.price - marketContext.spyTrend.ma30) / marketContext.spyTrend.ma30 * 100).toFixed(2)}%
• VIX: ${marketContext.vix.level.toFixed(1)} (${marketContext.vix.interpretation})
• VIX Signal: ${marketContext.vix.signal.toUpperCase()}
• Leading Sector: ${marketContext.sectorRotation.leadingSector.toUpperCase()}
• Lagging Sector: ${marketContext.sectorRotation.laggingSector.toUpperCase()}

TIMEFRAME ANALYSIS:
══════════════════════════════════════
48-Hour: ${marketIntelligence.overallAssessment.shortTermOutlook}
30-Day: ${marketIntelligence.overallAssessment.mediumTermOutlook}
90-Day: ${marketIntelligence.overallAssessment.longTermOutlook}

KEY RISKS:
${marketIntelligence.overallAssessment.keyRisks.map(r => `• ${r}`).join('\n')}

KEY OPPORTUNITIES:
${marketIntelligence.overallAssessment.keyOpportunities.map(o => `• ${o}`).join('\n')}

AVAILABLE TRADING STRATEGIES:
══════════════════════════════════════

1. MOMENTUM BREAKOUT
   Best For: Strong uptrends, high volume, breakouts above resistance
   Entry Signals:
     • Price breaks above MA7 with 2x average volume
     • RSI > 60 (momentum building, not overbought)
     • Daily gain > 3% with strong sector support
     • Stock making new 20-day highs
   Exit Signals:
     • Price closes below MA7 (momentum broken)
     • Volume dries up (< 0.5x avg)
     • RSI > 75 (overbought, take profits)
     • Quick 5-7% profit target hit
   Holding Period: 1-3 days (quick flips)
   Risk Level: AGGRESSIVE
   Works Best When: Strong bull market, accelerating momentum, high confidence

2. MEAN REVERSION
   Best For: Range-bound markets, oversold bounces, low volatility
   Entry Signals:
     • RSI < 30 (oversold on quality stock)
     • Price touches lower Bollinger band
     • Down > 5% in week without negative news
     • Strong fundamentals intact
   Exit Signals:
     • RSI normalizes to 50-60
     • Price reaches middle Bollinger band
     • 3-5% profit target achieved
     • Position held > 7 days without recovery
   Holding Period: 3-7 days (wait for bounce)
   Risk Level: MODERATE
   Works Best When: Choppy/sideways market, low volatility, established ranges

3. TREND FOLLOWING
   Best For: Sustained multi-week trends, strong momentum, sector rotation
   Entry Signals:
     • Price > MA7 > MA30 > MA90 (aligned uptrend)
     • Making higher highs and higher lows
     • Relative strength > +3% vs SPY
     • Leading sector with momentum
   Exit Signals:
     • Price closes below MA30 (trend break)
     • Relative strength turns negative
     • Market regime shifts bearish
     • 10-15% profit target or trailing stop hit
   Holding Period: 1-4 weeks (ride the trend)
   Risk Level: MODERATE
   Works Best When: Clear established trend, strong relative strength, sector leadership

4. VOLATILITY ARBITRAGE
   Best For: VIX spikes, panic selloffs, high volatility environments
   Entry Signals:
     • VIX spike > 20 (fear elevated)
     • Stock down > 4% on broad market selloff
     • Quality name with no stock-specific issues
     • RSI < 35 (oversold in panic)
   Exit Signals:
     • VIX normalizes < 18
     • Quick 3-5% bounce captured
     • Next trading day (quick flip)
     • Volatility remains elevated > 2 days (thesis failed)
   Holding Period: 1-2 days (capture volatility)
   Risk Level: AGGRESSIVE
   Works Best When: High volatility, VIX > 20, broad market selloffs

5. DEFENSIVE CASH
   Best For: Bear markets, high uncertainty, capital preservation
   Actions:
     • HOLD CASH (primary strategy)
     • Close any losing positions
     • Tighten stops on winning positions
     • Only trade extreme volatility spikes (VIX > 25)
   Holding Period: Sit on sidelines
   Risk Level: LOW (protect capital)
   Works Best When: Bear market, downtrends, high drawdowns, extreme uncertainty

TASK: STRATEGY SELECTION
══════════════════════════════════════
Based on the comprehensive market analysis above (48-hour, 30-day, and 90-day timeframes), select the ONE strategy that gives you the best edge for the current market environment.

Consider:
1. What is the dominant market regime across all timeframes?
2. Are short-term and long-term trends aligned or diverging?
3. What level of risk is appropriate given current volatility?
4. Which strategy has the highest probability of success RIGHT NOW?
5. What are the key factors that make this strategy optimal?

Respond with ONLY valid JSON (no markdown, no code blocks):
{
  "chosenStrategy": "momentum_breakout" | "mean_reversion" | "trend_following" | "volatility_arbitrage" | "defensive_cash",
  "reasoning": "Detailed explanation of WHY this strategy is optimal given current conditions. Minimum 200 characters. Reference specific data points from the market analysis (e.g., SPY returns, VIX levels, momentum, volatility, sector trends). Explain your logic.",
  "confidence": 0.85,
  "alternativeStrategy": "mean_reversion",
  "keyFactors": ["Factor 1 that influenced decision", "Factor 2", "Factor 3"]
}

IMPORTANT:
- Your reasoning must be data-driven and reference specific metrics from above
- Confidence should reflect alignment of timeframes (higher when all point same direction)
- Consider both opportunities AND risks in your decision
- Be honest if conditions are unclear - defensive_cash is a valid choice`;
}

/**
 * Parse AI strategy selection response
 */
export function parseStrategySelection(response: string): StrategyChoice {
  try {
    // Remove markdown code blocks if present
    let cleaned = response.trim();
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/```\n?/g, '');
    }

    const parsed = JSON.parse(cleaned);

    // Validate strategy
    const validStrategies: TradingStrategy[] = [
      'momentum_breakout',
      'mean_reversion',
      'trend_following',
      'volatility_arbitrage',
      'defensive_cash',
    ];

    if (!validStrategies.includes(parsed.chosenStrategy)) {
      throw new Error(`Invalid strategy: ${parsed.chosenStrategy}`);
    }

    // Validate confidence
    if (typeof parsed.confidence !== 'number' || parsed.confidence < 0 || parsed.confidence > 1) {
      parsed.confidence = 0.7; // Default
    }

    // Validate reasoning length
    if (!parsed.reasoning || parsed.reasoning.length < 100) {
      throw new Error('Reasoning too short or missing');
    }

    // Ensure keyFactors is an array
    if (!Array.isArray(parsed.keyFactors)) {
      parsed.keyFactors = ['Market conditions analyzed'];
    }

    return {
      chosenStrategy: parsed.chosenStrategy,
      reasoning: parsed.reasoning,
      confidence: parsed.confidence,
      alternativeStrategy: parsed.alternativeStrategy,
      keyFactors: parsed.keyFactors,
    };
  } catch (error: any) {
    console.error('Error parsing strategy selection:', error.message);
    console.error('Response was:', response);

    // Return default conservative strategy
    return {
      chosenStrategy: 'defensive_cash',
      reasoning: `Failed to parse AI response: ${error.message}. Defaulting to defensive cash for safety.`,
      confidence: 0.3,
      keyFactors: ['Error in strategy selection'],
    };
  }
}

/**
 * Get strategy instructions for chosen strategy
 */
export function getStrategyInstructions(strategy: TradingStrategy): string {
  const instructions: Record<TradingStrategy, string> = {
    momentum_breakout: `
═══════════════════════════════════════
YOUR CHOSEN STRATEGY: MOMENTUM BREAKOUT
═══════════════════════════════════════

You have analyzed the market and selected MOMENTUM BREAKOUT as your optimal strategy.

ENTRY SIGNALS (What to Look For):
✓ Price breaks above MA7 with 2x average volume
✓ RSI > 60 (momentum building, not overbought)
✓ Daily gain > 3% with strong sector support
✓ Stock making new 20-day highs

EXIT SIGNALS (When to Close):
✗ Price closes below MA7 (momentum broken)
✗ Volume dries up (< 0.5x avg)
✗ RSI > 75 (overbought, take profits)
✗ Quick 5-7% profit target hit

EXECUTION GUIDELINES:
• Holding Period: 1-3 days (quick flips)
• Risk Level: AGGRESSIVE (tight stops)
• Position Sizing: High confidence only (0.8+)
• Focus: Stocks with strong volume confirmation

WHAT TO AVOID:
✗ Don't buy stocks already extended (>7% above MA7)
✗ Don't chase without volume confirmation
✗ Don't hold through momentum breaks`,

    mean_reversion: `
═══════════════════════════════════════
YOUR CHOSEN STRATEGY: MEAN REVERSION
═══════════════════════════════════════

You have analyzed the market and selected MEAN REVERSION as your optimal strategy.

ENTRY SIGNALS (What to Look For):
✓ RSI < 30 (oversold on quality stock)
✓ Price touches lower Bollinger band
✓ Down > 5% in week without negative news
✓ Strong fundamentals intact

EXIT SIGNALS (When to Close):
✗ RSI normalizes to 50-60
✗ Price reaches middle Bollinger band
✗ 3-5% profit target achieved
✗ Position held > 7 days without recovery

EXECUTION GUIDELINES:
• Holding Period: 3-7 days (wait for bounce)
• Risk Level: MODERATE (buy dips)
• Position Sizing: Moderate confidence (0.7+)
• Focus: Quality names with temporary weakness

WHAT TO AVOID:
✗ Don't catch falling knives (check for support)
✗ Don't buy stocks with negative news
✗ Don't hold dead bounces (exit if no recovery in 7d)`,

    trend_following: `
═══════════════════════════════════════
YOUR CHOSEN STRATEGY: TREND FOLLOWING
═══════════════════════════════════════

You have analyzed the market and selected TREND FOLLOWING as your optimal strategy.

ENTRY SIGNALS (What to Look For):
✓ Price > MA7 > MA30 > MA90 (aligned uptrend)
✓ Making higher highs and higher lows
✓ Relative strength > +3% vs SPY
✓ Leading sector with momentum

EXIT SIGNALS (When to Close):
✗ Price closes below MA30 (trend break)
✗ Relative strength turns negative
✗ Market regime shifts bearish
✗ 10-15% profit target or trailing stop hit

EXECUTION GUIDELINES:
• Holding Period: 1-4 weeks (ride the trend)
• Risk Level: MODERATE (wider stops)
• Position Sizing: Moderate to high (0.75+)
• Focus: Strongest trends with relative strength

WHAT TO AVOID:
✗ Don't fight the trend (no counter-trend trades)
✗ Don't exit on minor pullbacks (use MA30 as guide)
✗ Don't trade weak relative strength stocks`,

    volatility_arbitrage: `
═══════════════════════════════════════
YOUR CHOSEN STRATEGY: VOLATILITY ARBITRAGE
═══════════════════════════════════════

You have analyzed the market and selected VOLATILITY ARBITRAGE as your optimal strategy.

ENTRY SIGNALS (What to Look For):
✓ VIX spike > 20 (fear elevated)
✓ Stock down > 4% on broad market selloff
✓ Quality name with no stock-specific issues
✓ RSI < 35 (oversold in panic)

EXIT SIGNALS (When to Close):
✗ VIX normalizes < 18
✗ Quick 3-5% bounce captured
✗ Next trading day (quick flip)
✗ Volatility remains elevated > 2 days (thesis failed)

EXECUTION GUIDELINES:
• Holding Period: 1-2 days (capture volatility)
• Risk Level: AGGRESSIVE (fast moves)
• Position Sizing: High confidence (0.8+)
• Focus: Quality stocks in panic selloffs

WHAT TO AVOID:
✗ Don't hold longer than 2 days
✗ Don't trade stock-specific bad news
✗ Don't trade if VIX stays elevated (thesis wrong)`,

    defensive_cash: `
═══════════════════════════════════════
YOUR CHOSEN STRATEGY: DEFENSIVE CASH
═══════════════════════════════════════

You have analyzed the market and selected DEFENSIVE CASH as your optimal strategy.

⚠️  BEAR MARKET / HIGH UNCERTAINTY - CAPITAL PRESERVATION MODE ⚠️

ACTIONS TO TAKE:
✓ HOLD CASH (primary strategy)
✓ Close any losing positions
✓ Tighten stops on winning positions
✓ Only trade extreme volatility spikes (VIX > 25)

WHAT NOT TO DO:
✗ Don't open new long positions
✗ Don't buy dips in downtrends (falling knives)
✗ Don't chase momentum (fades quickly in bear markets)
✗ Don't fight the trend

EXECUTION GUIDELINES:
• Holding Period: Sit on sidelines
• Risk Level: LOW (protect capital)
• Position Sizing: Minimal to none
• Focus: Capital preservation, wait for clarity

WHEN TO RECONSIDER:
• Market regime shifts back to bullish
• VIX spikes above 25 (volatility arbitrage opportunity)
• Clear trend reversal confirmed`,
  };

  return instructions[strategy];
}
