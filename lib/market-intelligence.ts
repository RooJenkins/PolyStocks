/**
 * Enhanced Market Intelligence Module
 *
 * Provides comprehensive market analysis across multiple timeframes:
 * - 48 hours: Recent momentum and volatility
 * - 30 days: Monthly trends and patterns
 * - 90 days: Quarterly context and regime
 *
 * This data helps AIs make informed strategy selection decisions.
 */

import { prisma } from './prisma';
import type { Stock } from '@/types';
import type { MarketContext } from './market-context';

export interface MarketIntelligence {
  // Recent Activity (48 hours)
  last48Hours: {
    spyChange: number;
    vixChange: number;
    avgStockChange: number;
    biggestMovers: Array<{
      symbol: string;
      change: number;
      direction: 'up' | 'down';
    }>;
    volatilityLevel: 'low' | 'normal' | 'elevated' | 'high';
    momentum: 'accelerating' | 'steady' | 'decelerating';
    summary: string;
  };

  // Monthly Trends (30 days)
  last30Days: {
    spyReturn: number;
    vixAverage: number;
    trendingStocks: Array<{
      symbol: string;
      return: number;
      strength: 'strong' | 'moderate' | 'weak';
    }>;
    sectorLeaders: Array<{
      sector: string;
      return: number;
    }>;
    marketRegime: 'bull' | 'bear' | 'choppy' | 'transitioning';
    winningStrategies: string[]; // Which strategies worked this month
    summary: string;
  };

  // Quarterly Context (90 days)
  last90Days: {
    spyReturn: number;
    spyVolatility: number;
    maxDrawdown: number;
    trendDirection: 'strong_up' | 'moderate_up' | 'sideways' | 'moderate_down' | 'strong_down';
    averageVIX: number;
    marketPhase: 'early_bull' | 'mid_bull' | 'late_bull' | 'distribution' | 'early_bear' | 'mid_bear' | 'late_bear' | 'accumulation';
    keyEvents: Array<{
      date: Date;
      event: string;
      impact: 'high' | 'medium' | 'low';
    }>;
    summary: string;
  };

  // Overall Assessment
  overallAssessment: {
    shortTermOutlook: string; // 48h
    mediumTermOutlook: string; // 30d
    longTermOutlook: string; // 90d
    confidence: number;
    keyRisks: string[];
    keyOpportunities: string[];
  };
}

/**
 * Get comprehensive market intelligence across all timeframes
 */
export async function getMarketIntelligence(
  stocks: Stock[],
  marketContext: MarketContext
): Promise<MarketIntelligence> {
  const now = new Date();
  const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

  // Fetch historical price data
  const [spyPrices, allStockPrices] = await Promise.all([
    prisma.stockPrice.findMany({
      where: {
        symbol: 'SPY',
        timestamp: { gte: ninetyDaysAgo },
      },
      orderBy: { timestamp: 'asc' },
    }),
    prisma.stockPrice.findMany({
      where: {
        timestamp: { gte: ninetyDaysAgo },
      },
      orderBy: { timestamp: 'asc' },
    }),
  ]);

  // Analyze 48-hour activity
  const last48Hours = analyze48Hours(stocks, marketContext, spyPrices, twoDaysAgo);

  // Analyze 30-day trends
  const last30Days = analyze30Days(stocks, spyPrices, allStockPrices, thirtyDaysAgo);

  // Analyze 90-day context
  const last90Days = analyze90Days(spyPrices, ninetyDaysAgo);

  // Generate overall assessment
  const overallAssessment = generateOverallAssessment(last48Hours, last30Days, last90Days);

  return {
    last48Hours,
    last30Days,
    last90Days,
    overallAssessment,
  };
}

/**
 * Analyze last 48 hours of market activity
 */
function analyze48Hours(
  stocks: Stock[],
  marketContext: MarketContext,
  spyPrices: any[],
  twoDaysAgo: Date
): MarketIntelligence['last48Hours'] {
  const recentSPY = spyPrices.filter(p => new Date(p.timestamp) >= twoDaysAgo);

  const spyChange = recentSPY.length >= 2
    ? ((recentSPY[recentSPY.length - 1].price - recentSPY[0].price) / recentSPY[0].price) * 100
    : marketContext.spyTrend.dailyChange;

  // Find biggest movers in last 48h
  const biggestMovers = stocks
    .map(s => ({
      symbol: s.symbol,
      change: s.changePercent,
      direction: s.changePercent > 0 ? 'up' as const : 'down' as const,
    }))
    .sort((a, b) => Math.abs(b.change) - Math.abs(a.change))
    .slice(0, 5);

  const avgStockChange = stocks.reduce((sum, s) => sum + s.changePercent, 0) / stocks.length;

  // Determine volatility level
  let volatilityLevel: 'low' | 'normal' | 'elevated' | 'high';
  if (marketContext.vix.level < 12) volatilityLevel = 'low';
  else if (marketContext.vix.level < 16) volatilityLevel = 'normal';
  else if (marketContext.vix.level < 20) volatilityLevel = 'elevated';
  else volatilityLevel = 'high';

  // Determine momentum
  let momentum: 'accelerating' | 'steady' | 'decelerating';
  if (Math.abs(spyChange) > 1.5) momentum = 'accelerating';
  else if (Math.abs(spyChange) < 0.5) momentum = 'decelerating';
  else momentum = 'steady';

  const summary = generate48HourSummary(spyChange, avgStockChange, volatilityLevel, momentum, biggestMovers);

  return {
    spyChange,
    vixChange: 0, // Could calculate VIX change if we had historical VIX
    avgStockChange,
    biggestMovers,
    volatilityLevel,
    momentum,
    summary,
  };
}

function generate48HourSummary(
  spyChange: number,
  avgStockChange: number,
  volatilityLevel: string,
  momentum: string,
  biggestMovers: any[]
): string {
  const direction = spyChange > 0 ? 'rallied' : 'declined';
  const strength = Math.abs(spyChange) > 1 ? 'sharply' : 'modestly';

  return `Market has ${strength} ${direction} ${Math.abs(spyChange).toFixed(2)}% in last 48 hours. Volatility is ${volatilityLevel}. Momentum is ${momentum}. Top mover: ${biggestMovers[0].symbol} (${biggestMovers[0].change >= 0 ? '+' : ''}${biggestMovers[0].change.toFixed(1)}%).`;
}

/**
 * Analyze last 30 days of market trends
 */
function analyze30Days(
  stocks: Stock[],
  spyPrices: any[],
  allStockPrices: any[],
  thirtyDaysAgo: Date
): MarketIntelligence['last30Days'] {
  const monthlySPY = spyPrices.filter(p => new Date(p.timestamp) >= thirtyDaysAgo);

  const spyReturn = monthlySPY.length >= 2
    ? ((monthlySPY[monthlySPY.length - 1].price - monthlySPY[0].price) / monthlySPY[0].price) * 100
    : 0;

  // Calculate 30-day returns for each stock
  const trendingStocks = stocks
    .map(s => {
      const stockPrices = allStockPrices
        .filter(p => p.symbol === s.symbol && new Date(p.timestamp) >= thirtyDaysAgo);

      const return30d = stockPrices.length >= 2
        ? ((stockPrices[stockPrices.length - 1].price - stockPrices[0].price) / stockPrices[0].price) * 100
        : s.monthTrend || 0;

      let strength: 'strong' | 'moderate' | 'weak';
      if (Math.abs(return30d) > 10) strength = 'strong';
      else if (Math.abs(return30d) > 5) strength = 'moderate';
      else strength = 'weak';

      return {
        symbol: s.symbol,
        return: return30d,
        strength,
      };
    })
    .sort((a, b) => b.return - a.return)
    .slice(0, 10);

  // Sector leaders (simplified - group by known sectors)
  const sectorMap: Record<string, string[]> = {
    tech: ['AAPL', 'MSFT', 'NVDA', 'GOOGL', 'META'],
    financials: ['JPM', 'BAC', 'V', 'MA'],
    healthcare: ['UNH', 'JNJ', 'LLY'],
    energy: ['XOM', 'CVX'],
    consumer: ['WMT', 'PG', 'KO', 'COST'],
  };

  const sectorLeaders = Object.entries(sectorMap)
    .map(([sector, symbols]) => {
      const sectorStocks = trendingStocks.filter(s => symbols.includes(s.symbol));
      const avgReturn = sectorStocks.length > 0
        ? sectorStocks.reduce((sum, s) => sum + s.return, 0) / sectorStocks.length
        : 0;
      return { sector, return: avgReturn };
    })
    .sort((a, b) => b.return - a.return);

  // Determine market regime
  let marketRegime: 'bull' | 'bear' | 'choppy' | 'transitioning';
  if (spyReturn > 5) marketRegime = 'bull';
  else if (spyReturn < -5) marketRegime = 'bear';
  else if (Math.abs(spyReturn) < 2) marketRegime = 'choppy';
  else marketRegime = 'transitioning';

  // Determine winning strategies
  const winningStrategies = determineWinningStrategies(spyReturn, marketRegime);

  const summary = generate30DaySummary(spyReturn, marketRegime, sectorLeaders, trendingStocks);

  return {
    spyReturn,
    vixAverage: 15, // Default - could calculate from historical data
    trendingStocks,
    sectorLeaders,
    marketRegime,
    winningStrategies,
    summary,
  };
}

function determineWinningStrategies(spyReturn: number, regime: string): string[] {
  const strategies: string[] = [];

  if (spyReturn > 5) {
    strategies.push('Momentum Breakout', 'Trend Following');
  } else if (spyReturn < -5) {
    strategies.push('Defensive Cash', 'Volatility Arbitrage');
  } else if (Math.abs(spyReturn) < 2) {
    strategies.push('Mean Reversion');
  } else {
    strategies.push('Trend Following', 'Mean Reversion');
  }

  return strategies;
}

function generate30DaySummary(
  spyReturn: number,
  marketRegime: string,
  sectorLeaders: any[],
  trendingStocks: any[]
): string {
  const direction = spyReturn > 0 ? 'gained' : 'lost';
  return `SPY has ${direction} ${Math.abs(spyReturn).toFixed(1)}% over 30 days. Market regime: ${marketRegime}. Leading sector: ${sectorLeaders[0].sector} (${sectorLeaders[0].return >= 0 ? '+' : ''}${sectorLeaders[0].return.toFixed(1)}%). Top performer: ${trendingStocks[0].symbol} (${trendingStocks[0].return >= 0 ? '+' : ''}${trendingStocks[0].return.toFixed(1)}%).`;
}

/**
 * Analyze last 90 days for quarterly context
 */
function analyze90Days(
  spyPrices: any[],
  ninetyDaysAgo: Date
): MarketIntelligence['last90Days'] {
  const quarterlySPY = spyPrices.filter(p => new Date(p.timestamp) >= ninetyDaysAgo);

  if (quarterlySPY.length < 2) {
    return {
      spyReturn: 0,
      spyVolatility: 0,
      maxDrawdown: 0,
      trendDirection: 'sideways',
      averageVIX: 15,
      marketPhase: 'accumulation',
      keyEvents: [],
      summary: 'Insufficient historical data for 90-day analysis.',
    };
  }

  const spyReturn = ((quarterlySPY[quarterlySPY.length - 1].price - quarterlySPY[0].price) / quarterlySPY[0].price) * 100;

  // Calculate volatility (standard deviation of returns)
  const dailyReturns = quarterlySPY.slice(1).map((price, i) =>
    ((price.price - quarterlySPY[i].price) / quarterlySPY[i].price) * 100
  );
  const avgReturn = dailyReturns.reduce((a, b) => a + b, 0) / dailyReturns.length;
  const variance = dailyReturns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / dailyReturns.length;
  const spyVolatility = Math.sqrt(variance);

  // Calculate max drawdown
  let maxPrice = quarterlySPY[0].price;
  let maxDrawdown = 0;
  for (const priceData of quarterlySPY) {
    if (priceData.price > maxPrice) {
      maxPrice = priceData.price;
    }
    const drawdown = ((maxPrice - priceData.price) / maxPrice) * 100;
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
    }
  }

  // Determine trend direction
  let trendDirection: MarketIntelligence['last90Days']['trendDirection'];
  if (spyReturn > 10) trendDirection = 'strong_up';
  else if (spyReturn > 3) trendDirection = 'moderate_up';
  else if (spyReturn > -3) trendDirection = 'sideways';
  else if (spyReturn > -10) trendDirection = 'moderate_down';
  else trendDirection = 'strong_down';

  // Determine market phase
  let marketPhase: MarketIntelligence['last90Days']['marketPhase'];
  if (spyReturn > 15 && maxDrawdown < 5) marketPhase = 'early_bull';
  else if (spyReturn > 10 && maxDrawdown < 10) marketPhase = 'mid_bull';
  else if (spyReturn > 5 && maxDrawdown > 8) marketPhase = 'late_bull';
  else if (spyReturn > -5 && spyReturn < 5 && maxDrawdown > 10) marketPhase = 'distribution';
  else if (spyReturn < -5 && spyReturn > -15) marketPhase = 'early_bear';
  else if (spyReturn < -15) marketPhase = 'mid_bear';
  else if (spyReturn < -10 && maxDrawdown > 20) marketPhase = 'late_bear';
  else marketPhase = 'accumulation';

  const summary = generate90DaySummary(spyReturn, maxDrawdown, trendDirection, marketPhase);

  return {
    spyReturn,
    spyVolatility,
    maxDrawdown,
    trendDirection,
    averageVIX: 15, // Default
    marketPhase,
    keyEvents: [], // Could be populated from news API
    summary,
  };
}

function generate90DaySummary(
  spyReturn: number,
  maxDrawdown: number,
  trendDirection: string,
  marketPhase: string
): string {
  const direction = spyReturn > 0 ? 'up' : 'down';
  return `SPY ${direction} ${Math.abs(spyReturn).toFixed(1)}% over 90 days. Trend: ${trendDirection.replace(/_/g, ' ')}. Max drawdown: ${maxDrawdown.toFixed(1)}%. Market phase: ${marketPhase.replace(/_/g, ' ')}.`;
}

/**
 * Generate overall market assessment
 */
function generateOverallAssessment(
  last48Hours: MarketIntelligence['last48Hours'],
  last30Days: MarketIntelligence['last30Days'],
  last90Days: MarketIntelligence['last90Days']
): MarketIntelligence['overallAssessment'] {
  // Short-term outlook (48h)
  const shortTermOutlook = last48Hours.momentum === 'accelerating'
    ? `Strong ${last48Hours.spyChange > 0 ? 'bullish' : 'bearish'} momentum. Market moving decisively.`
    : last48Hours.momentum === 'decelerating'
    ? 'Momentum fading. Potential consolidation or reversal ahead.'
    : 'Steady momentum. Market in balanced state.';

  // Medium-term outlook (30d)
  const mediumTermOutlook = last30Days.marketRegime === 'bull'
    ? `Bull market conditions. ${last30Days.winningStrategies.join(' and ')} strategies performing well.`
    : last30Days.marketRegime === 'bear'
    ? 'Bear market conditions. Defensive positioning recommended.'
    : last30Days.marketRegime === 'choppy'
    ? 'Choppy, range-bound market. Mean reversion strategies favored.'
    : 'Market transitioning. Watch for regime change.';

  // Long-term outlook (90d)
  const longTermOutlook = `${last90Days.marketPhase.replace(/_/g, ' ')} phase. Trend is ${last90Days.trendDirection.replace(/_/g, ' ')}. Volatility: ${last90Days.spyVolatility > 2 ? 'high' : last90Days.spyVolatility > 1 ? 'moderate' : 'low'}.`;

  // Calculate confidence
  const confidence = calculateConfidence(last48Hours, last30Days, last90Days);

  // Identify key risks
  const keyRisks = identifyKeyRisks(last48Hours, last30Days, last90Days);

  // Identify key opportunities
  const keyOpportunities = identifyKeyOpportunities(last48Hours, last30Days, last90Days);

  return {
    shortTermOutlook,
    mediumTermOutlook,
    longTermOutlook,
    confidence,
    keyRisks,
    keyOpportunities,
  };
}

function calculateConfidence(
  last48Hours: MarketIntelligence['last48Hours'],
  last30Days: MarketIntelligence['last30Days'],
  last90Days: MarketIntelligence['last90Days']
): number {
  let confidence = 50; // Base confidence

  // Alignment of timeframes increases confidence
  const allBullish = last48Hours.spyChange > 0 && last30Days.spyReturn > 0 && last90Days.spyReturn > 0;
  const allBearish = last48Hours.spyChange < 0 && last30Days.spyReturn < 0 && last90Days.spyReturn < 0;

  if (allBullish || allBearish) confidence += 20;

  // Low volatility increases confidence
  if (last48Hours.volatilityLevel === 'low' || last48Hours.volatilityLevel === 'normal') {
    confidence += 10;
  } else if (last48Hours.volatilityLevel === 'high') {
    confidence -= 15;
  }

  // Strong momentum increases confidence
  if (last48Hours.momentum === 'accelerating') confidence += 10;
  if (last48Hours.momentum === 'decelerating') confidence -= 10;

  return Math.max(20, Math.min(90, confidence));
}

function identifyKeyRisks(
  last48Hours: MarketIntelligence['last48Hours'],
  last30Days: MarketIntelligence['last30Days'],
  last90Days: MarketIntelligence['last90Days']
): string[] {
  const risks: string[] = [];

  if (last48Hours.volatilityLevel === 'high' || last48Hours.volatilityLevel === 'elevated') {
    risks.push('Elevated volatility increases downside risk');
  }

  if (last90Days.maxDrawdown > 10) {
    risks.push(`Recent ${last90Days.maxDrawdown.toFixed(1)}% drawdown shows vulnerability`);
  }

  if (last30Days.marketRegime === 'bear' || last30Days.marketRegime === 'transitioning') {
    risks.push('Uncertain market regime - trend may reverse');
  }

  if (last48Hours.momentum === 'decelerating' && last30Days.spyReturn > 5) {
    risks.push('Momentum fading after rally - potential correction');
  }

  if (risks.length === 0) {
    risks.push('No major risks identified');
  }

  return risks;
}

function identifyKeyOpportunities(
  last48Hours: MarketIntelligence['last48Hours'],
  last30Days: MarketIntelligence['last30Days'],
  last90Days: MarketIntelligence['last90Days']
): string[] {
  const opportunities: string[] = [];

  if (last48Hours.momentum === 'accelerating' && last48Hours.spyChange > 0) {
    opportunities.push('Strong upward momentum - breakout opportunities');
  }

  if (last30Days.marketRegime === 'bull' && last90Days.marketPhase.includes('bull')) {
    opportunities.push('Sustained bull market - trend following favored');
  }

  if (last48Hours.volatilityLevel === 'low' && last30Days.marketRegime === 'choppy') {
    opportunities.push('Low volatility range - mean reversion setups');
  }

  if (last30Days.sectorLeaders.length > 0 && last30Days.sectorLeaders[0].return > 10) {
    opportunities.push(`${last30Days.sectorLeaders[0].sector} sector leading - sector rotation play`);
  }

  if (last48Hours.spyChange < -2 && last30Days.spyReturn > 0 && last90Days.spyReturn > 0) {
    opportunities.push('Pullback in uptrend - buy the dip opportunity');
  }

  if (opportunities.length === 0) {
    opportunities.push('Market in wait-and-see mode');
  }

  return opportunities;
}

/**
 * Format market intelligence for AI consumption
 */
export function formatMarketIntelligenceForAI(intelligence: MarketIntelligence): string {
  return `
═══════════════════════════════════════════════════════════
COMPREHENSIVE MARKET INTELLIGENCE
═══════════════════════════════════════════════════════════

📊 LAST 48 HOURS (Recent Activity)
──────────────────────────────────────────────────────────
${intelligence.last48Hours.summary}

• SPY: ${intelligence.last48Hours.spyChange >= 0 ? '+' : ''}${intelligence.last48Hours.spyChange.toFixed(2)}%
• Average Stock Change: ${intelligence.last48Hours.avgStockChange >= 0 ? '+' : ''}${intelligence.last48Hours.avgStockChange.toFixed(2)}%
• Volatility: ${intelligence.last48Hours.volatilityLevel.toUpperCase()}
• Momentum: ${intelligence.last48Hours.momentum.toUpperCase()}

Top Movers (48h):
${intelligence.last48Hours.biggestMovers.map(m =>
  `  ${m.symbol}: ${m.change >= 0 ? '+' : ''}${m.change.toFixed(1)}%`
).join('\n')}

📈 LAST 30 DAYS (Monthly Trends)
──────────────────────────────────────────────────────────
${intelligence.last30Days.summary}

• SPY 30-Day Return: ${intelligence.last30Days.spyReturn >= 0 ? '+' : ''}${intelligence.last30Days.spyReturn.toFixed(1)}%
• Market Regime: ${intelligence.last30Days.marketRegime.toUpperCase()}
• Winning Strategies: ${intelligence.last30Days.winningStrategies.join(', ')}

Sector Performance (30d):
${intelligence.last30Days.sectorLeaders.map(s =>
  `  ${s.sector.toUpperCase()}: ${s.return >= 0 ? '+' : ''}${s.return.toFixed(1)}%`
).join('\n')}

Top Performers (30d):
${intelligence.last30Days.trendingStocks.slice(0, 5).map(s =>
  `  ${s.symbol}: ${s.return >= 0 ? '+' : ''}${s.return.toFixed(1)}% (${s.strength})`
).join('\n')}

📉 LAST 90 DAYS (Quarterly Context)
──────────────────────────────────────────────────────────
${intelligence.last90Days.summary}

• SPY 90-Day Return: ${intelligence.last90Days.spyReturn >= 0 ? '+' : ''}${intelligence.last90Days.spyReturn.toFixed(1)}%
• Volatility (Daily): ${intelligence.last90Days.spyVolatility.toFixed(2)}%
• Max Drawdown: -${intelligence.last90Days.maxDrawdown.toFixed(1)}%
• Trend Direction: ${intelligence.last90Days.trendDirection.replace(/_/g, ' ').toUpperCase()}
• Market Phase: ${intelligence.last90Days.marketPhase.replace(/_/g, ' ').toUpperCase()}

🎯 OVERALL ASSESSMENT
──────────────────────────────────────────────────────────
Confidence Level: ${intelligence.overallAssessment.confidence}%

Short-Term (48h): ${intelligence.overallAssessment.shortTermOutlook}
Medium-Term (30d): ${intelligence.overallAssessment.mediumTermOutlook}
Long-Term (90d): ${intelligence.overallAssessment.longTermOutlook}

⚠️  KEY RISKS:
${intelligence.overallAssessment.keyRisks.map(r => `  • ${r}`).join('\n')}

✨ KEY OPPORTUNITIES:
${intelligence.overallAssessment.keyOpportunities.map(o => `  • ${o}`).join('\n')}

═══════════════════════════════════════════════════════════
`;
}
