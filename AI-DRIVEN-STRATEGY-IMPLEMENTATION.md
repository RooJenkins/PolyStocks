# AI-Driven Strategy Selection Implementation

## Overview

Instead of forcing each AI into a fixed trading strategy OR using rules-based strategy selection, the system now lets **each AI independently analyze market conditions and choose their own optimal trading strategy**.

This tests AI intelligence at both:
1. **Strategy Selection** - Which AI is better at reading markets?
2. **Strategy Execution** - Which AI is better at executing the chosen strategy?

---

## Architecture

### Two-Phase AI Decision Making

```
PHASE 1: Strategy Selection (NEW)
├─ AI receives comprehensive market intelligence (48h, 30d, 90d)
├─ AI analyzes trends, volatility, momentum, risks, opportunities
├─ AI independently chooses optimal strategy
└─ Returns: chosen_strategy, reasoning, confidence, key_factors

PHASE 2: Trading Decision (ENHANCED)
├─ AI receives strategy instructions for chosen strategy
├─ AI receives all market data and portfolio metrics
├─ AI makes trading decision using chosen strategy
└─ Returns: action, symbol, quantity, reasoning, confidence
```

---

## Market Intelligence (48h, 30d, 90d Analysis)

### File: `lib/market-intelligence.ts`

Provides comprehensive multi-timeframe market analysis:

**48-Hour Analysis:**
- Recent momentum (accelerating/steady/decelerating)
- Volatility level (low/normal/elevated/high)
- SPY and average stock changes
- Biggest movers
- Summary of recent market activity

**30-Day Analysis:**
- Monthly returns
- Market regime (bull/bear/choppy/transitioning)
- Trending stocks by sector
- Sector leaders and laggards
- Winning strategies for the month
- Summary of monthly trends

**90-Day Analysis:**
- Quarterly returns and volatility
- Max drawdown
- Trend direction (strong/moderate/sideways)
- Market phase (early_bull/mid_bull/late_bull/distribution/etc.)
- Key events (extensible)
- Summary of quarterly context

**Overall Assessment:**
- Short-term outlook (48h)
- Medium-term outlook (30d)
- Long-term outlook (90d)
- Confidence level (20-90%)
- Key risks (array of risk factors)
- Key opportunities (array of opportunities)

---

## AI Strategy Selection

### File: `lib/ai-strategy-selection.ts`

**Available Strategies:**
1. **Momentum Breakout** - Strong uptrends, high volume, breakouts
2. **Mean Reversion** - Range-bound markets, oversold bounces
3. **Trend Following** - Sustained trends, strong momentum
4. **Volatility Arbitrage** - VIX spikes, panic selloffs
5. **Defensive Cash** - Bear markets, capital preservation

**Strategy Selection Prompt:**
- Comprehensive market intelligence (48h, 30d, 90d)
- Current market state (SPY trend, VIX, sectors)
- Detailed descriptions of all 5 strategies
- Entry/exit signals for each strategy
- Risk levels and holding periods
- Best market conditions for each strategy

**AI Response Format:**
```json
{
  "chosenStrategy": "momentum_breakout",
  "reasoning": "Detailed explanation with data points (200+ chars)",
  "confidence": 0.85,
  "alternativeStrategy": "trend_following",
  "keyFactors": [
    "SPY up 3.2% this week with accelerating momentum",
    "VIX at 14 indicates low fear",
    "Tech sector leading with +5.1% relative strength"
  ]
}
```

---

## Database Schema Updates

### File: `prisma/schema.prisma`

Added AI strategy selection fields to `Decision` table:

```prisma
model Decision {
  // ... existing fields ...

  // AI Strategy Selection (NEW)
  chosenStrategy       String? // momentum_breakout, mean_reversion, etc.
  strategyReasoning    String? // Why AI chose this strategy
  strategyConfidence   Float?  // AI's confidence in strategy (0-1)
  alternativeStrategy  String? // Backup strategy considered
}
```

---

## Integration Points

### 1. Trading Engine (`lib/trading-engine.ts`)

**Before each trading cycle:**
```typescript
// Generate market intelligence (48h, 30d, 90d)
const marketIntelligence = await getMarketIntelligence(stocks, marketContext);

// Pass to each agent
for (const agent of agents) {
  await processAgentTrading(
    agent,
    stocks,
    marketContext,
    marketIntelligence, // ← NEW
    ...
  );
}
```

**In `processAgentTrading`:**
```typescript
// Build enhanced context with market intelligence
const enhancedMarketContext = {
  stocks,
  cashBalance,
  accountValue,
  positions,
  marketTrend,
  agentStats,
  news,
  marketContext,     // ← Full market context for strategy selection
  marketIntelligence, // ← 48h, 30d, 90d analysis
  ...
};

// AI makes decision (internally does strategy selection first)
const decision = await getAIDecision(agent.id, agent.name, enhancedMarketContext);

// Log decision with strategy choice
await prisma.decision.create({
  data: {
    ...decision,
    chosenStrategy: decision.strategyChoice?.chosenStrategy,
    strategyReasoning: decision.strategyChoice?.reasoning,
    strategyConfidence: decision.strategyChoice?.confidence,
    alternativeStrategy: decision.strategyChoice?.alternativeStrategy,
  },
});
```

### 2. AI Models (`lib/ai-models.ts`)

**Two-phase decision making:**

```typescript
export async function getAIDecision(
  agentId: string,
  agentName: string,
  context: MarketContext
): Promise<TradingDecision> {

  // PHASE 1: AI selects strategy (if market intelligence available)
  let strategyChoice: StrategyChoice | undefined;

  if (context.marketIntelligence && context.marketContext) {
    strategyChoice = await selectAIStrategy(
      agentName,
      context.marketIntelligence,
      context.marketContext
    );

    // Inject strategy instructions into context
    context.strategyPrompt = getStrategyInstructions(strategyChoice.chosenStrategy);
  }

  // PHASE 2: AI makes trading decision with chosen strategy
  const decision = await callAI(context); // Calls appropriate AI model

  // Attach strategy choice to decision
  if (strategyChoice) {
    decision.strategyChoice = strategyChoice;
  }

  return decision;
}
```

**Strategy selection helper functions:**
- `callOpenAIForStrategy(prompt)` - GPT-5 strategy selection
- `callClaudeForStrategy(prompt)` - Claude Sonnet 4.5 strategy selection
- `callGeminiForStrategy(prompt)` - Gemini Flash strategy selection
- `callDeepSeekForStrategy(prompt)` - DeepSeek strategy selection
- `callQwenForStrategy(prompt)` - Qwen strategy selection
- `callGrokForStrategy(prompt)` - Grok strategy selection
- `callKimiForStrategy(prompt)` - Kimi K2 strategy selection

---

## Example Flow

### User's Perspective:

**Trading Cycle Runs:**
```
🔄 STARTING TRADING CYCLE
📊 Fetching stock prices... ✓
📈 Calculating trends... ✓
🌍 Analyzing market context... ✓
📊 Generating market intelligence (48h, 30d, 90d)... ✓
🤖 Processing 7 AI agents (AI-driven strategy selection)

━━━ GPT-5 (gpt-4o) ━━━
  💰 Account Value: $10,234.56
  🧠 GPT-5 analyzing market to select strategy...
  ✓ GPT-5 chose: MOMENTUM BREAKOUT (82% confidence)
  🤖 Getting trading decision...
  🎯 Decision: BUY NVDA x 5
  💭 Reasoning: "Strong momentum building in NVDA with price breaking above MA7..."

━━━ Claude Sonnet 4.5 (claude-sonnet-4-20250514) ━━━
  💰 Account Value: $10,017.13
  🧠 Claude Sonnet 4.5 analyzing market to select strategy...
  ✓ Claude Sonnet 4.5 chose: MEAN REVERSION (75% confidence)
  🤖 Getting trading decision...
  🎯 Decision: BUY AAPL x 3
  💭 Reasoning: "AAPL down 4.2% this week on no negative news, RSI at 28..."

━━━ Gemini Flash (gemini-2.0-flash-exp) ━━━
  💰 Account Value: $9,876.42
  🧠 Gemini Flash analyzing market to select strategy...
  ✓ Gemini Flash chose: TREND FOLLOWING (88% confidence)
  🤖 Getting trading decision...
  🎯 Decision: HOLD
  💭 Reasoning: "No clear trend setups meeting criteria..."
```

---

## Benefits

### 1. Tests AI Intelligence at Strategy Selection
Which AI is better at reading markets? This becomes part of the competition.

### 2. Natural Portfolio Diversification
Not all AIs make the same trades, reducing correlation risk.

### 3. More Interesting Competition
Users see how different AIs "think" about the same market conditions.

### 4. Emergent AI Personalities
- GPT-5 might be aggressive (always sees momentum)
- Claude might be conservative (waits for clear signals)
- Gemini might be contrarian (fades the crowd)

### 5. Better Risk Management
If one AI misreads the market, others might save the portfolio.

### 6. Educational Value
Users learn:
- How different AIs analyze the same data
- Which strategies work in which market conditions
- How market regimes affect strategy selection

---

## Files Created/Modified

### New Files:
- `lib/market-intelligence.ts` - 48h, 30d, 90d market analysis
- `lib/ai-strategy-selection.ts` - Strategy selection prompts and parsing
- `scripts/add-strategy-fields.ts` - Database migration script
- `scripts/test-strategy-selector.ts` - Test market regime detection
- `AI-DRIVEN-STRATEGY-IMPLEMENTATION.md` - This document

### Modified Files:
- `lib/ai-models.ts` - Two-phase AI decision making
- `lib/trading-engine.ts` - Market intelligence integration
- `prisma/schema.prisma` - Added strategy selection fields
- `.env` - No changes needed (uses existing API keys)

---

## Database Migration

**Adds to `Decision` table:**
```sql
ALTER TABLE "Decision"
ADD COLUMN "chosenStrategy" TEXT,
ADD COLUMN "strategyReasoning" TEXT,
ADD COLUMN "strategyConfidence" DOUBLE PRECISION,
ADD COLUMN "alternativeStrategy" TEXT;
```

**Run migration:**
```bash
npx tsx scripts/add-strategy-fields.ts
```

---

## Testing

**Test strategy selector:**
```bash
npx tsx scripts/test-strategy-selector.ts
```

Shows:
- Current market regime detection
- Optimal strategy recommendation
- Strategy instructions that would be sent to AIs

---

## Future Enhancements

1. **UI Display** - Show each AI's chosen strategy in the dashboard
2. **Strategy Analytics** - Track which strategies each AI prefers
3. **Adaptive Learning** - AIs learn from their strategy selection success rate
4. **User Override** - Let users force a specific strategy (Option 3)
5. **Strategy Explanations** - Display AI's reasoning for strategy choice

---

## Comparison: Before vs After

| Aspect | Before (Rules-Based) | After (AI-Driven) |
|--------|---------------------|-------------------|
| Strategy Selection | System calculates once for all | Each AI chooses independently |
| Diversification | All AIs use same strategy | Natural diversification |
| AI Intelligence Test | Trading execution only | Strategy selection + execution |
| Market Analysis | Limited (SPY, VIX) | Comprehensive (48h, 30d, 90d) |
| Emergent Behavior | None | AI personalities develop |
| Educational Value | Low | High (see AI reasoning) |
| Risk Management | Correlated (all same) | Diversified (different strategies) |

---

## Key Insight

**Professional traders don't use the same strategy in all markets.**

- Trend following funds trade when markets trend
- Mean reversion funds trade when markets range
- Volatility arb funds trade when VIX spikes

The system now respects this principle while letting each AI independently determine which market condition we're in and which strategy to apply.

**Result:** The competition tests which AI is better at BOTH reading markets AND executing trades.
