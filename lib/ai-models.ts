import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';
import {
  getMultiSourceToolsForOpenAI,
  callMultiSourceTool,
  getMultiSourceUsageSummary,
} from './multi-source-tools';

interface MarketContext {
  stocks: Array<{
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
    weekTrend?: number; // 7-day trend
    ma7?: number; // 7-day moving average
    ma30?: number; // 30-day moving average
    volume?: number;
    volumeStatus?: 'high' | 'low' | 'normal';
  }>;
  cashBalance: number;
  accountValue: number;
  positions: Array<{
    symbol: string;
    name: string;
    quantity: number;
    entryPrice: number;
    currentPrice: number;
    unrealizedPnL: number;
    unrealizedPnLPercent: number;
  }>;
  // Phase 1: Market context
  marketTrend?: {
    daily: number;
    weekly: number;
  };
  // Phase 1: Agent performance stats
  agentStats?: {
    winRate: number;
    totalTrades: number;
    avgWin: number;
    avgLoss: number;
    bestTrade: number;
    worstTrade: number;
  };
  // Phase 2: News for big movers
  news?: Array<{
    symbol: string;
    headline: string;
    sentiment: 'positive' | 'negative' | 'neutral';
  }>;
}

interface TradingDecision {
  action: 'BUY' | 'SELL' | 'SELL_SHORT' | 'BUY_TO_COVER' | 'HOLD';
  symbol?: string;
  quantity?: number;
  reasoning: string;
  confidence: number;
  riskAssessment?: string;
  targetPrice?: number;
  stopLoss?: number;
  invalidationCondition?: string; // New: Exit condition if thesis breaks
}

function createPrompt(context: MarketContext, maxToolCalls: number = 15, useMCPTools: boolean = false): string {
  // Format positions
  const positionsStr = context.positions.length > 0
    ? context.positions.map(p => `${p.symbol}: ${p.quantity}@$${p.entryPrice.toFixed(2)} P&L:${p.unrealizedPnLPercent.toFixed(1)}%`).join(', ')
    : 'None';

  // Format market trend
  const marketTrendStr = context.marketTrend
    ? `Market today: ${context.marketTrend.daily >= 0 ? '+' : ''}${context.marketTrend.daily.toFixed(2)}%`
    : '';

  // Format agent stats
  const agentStatsStr = context.agentStats && context.agentStats.totalTrades > 0
    ? `Your stats: ${context.agentStats.winRate.toFixed(0)}% win rate (${context.agentStats.totalTrades} trades), Avg win: $${context.agentStats.avgWin.toFixed(0)}, Avg loss: $${context.agentStats.avgLoss.toFixed(0)}`
    : '';

  // Format news if available
  const newsStr = context.news && context.news.length > 0
    ? '\nNEWS:\n' + context.news.map(n => `${n.symbol}: ${n.headline} [${n.sentiment}]`).join('\n')
    : '';

  // Format stocks with technical indicators
  const stocksStr = context.stocks.map(s => {
    const parts = [`${s.symbol}:$${s.price.toFixed(2)}`];

    // Today's change
    parts.push(`(${s.changePercent >= 0 ? '+' : ''}${s.changePercent.toFixed(1)}%)`);

    // 7-day trend if available
    if (s.weekTrend !== undefined) {
      parts.push(`7d:${s.weekTrend >= 0 ? '+' : ''}${s.weekTrend.toFixed(1)}%`);
    }

    // Moving averages if available
    if (s.ma7 !== undefined && s.ma30 !== undefined) {
      const vsMA7 = ((s.price - s.ma7) / s.ma7 * 100).toFixed(1);
      const vsMA30 = ((s.price - s.ma30) / s.ma30 * 100).toFixed(1);
      parts.push(`MA7:${Number(vsMA7) >= 0 ? '+' : ''}${vsMA7}%`);
      parts.push(`MA30:${Number(vsMA30) >= 0 ? '+' : ''}${vsMA30}%`);
    }

    // Volume status if available
    if (s.volumeStatus) {
      parts.push(`Vol:${s.volumeStatus}`);
    }

    return parts.join(' ');
  }).join('\n');

  return `STOCK TRADER - S&P 500

==== TIMESTAMP ====
Market data as of: ${new Date().toISOString()}
IMPORTANT: Price data is ordered OLDEST to NEWEST

==== PORTFOLIO ====
Value: $${context.accountValue.toFixed(0)} | Cash Available: $${context.cashBalance.toFixed(0)}
Positions: ${positionsStr}

==== MARKET CONTEXT ====
${marketTrendStr}
${stocksStr}${newsStr}

Format: Symbol:Price (Today%) 7d:Week% MA7:vsMA7% MA30:vsMA30% Vol:status
- MA7/MA30: % above/below moving average (positive = bullish momentum)
- Vol: high/normal/low trading volume

==== YOUR PERFORMANCE ====
${agentStatsStr || 'No trade history yet'}

==== POSITION SIZING BASED ON CONFIDENCE ====
Your confidence score determines position size:
- Confidence 0.9-1.0 (Very High): 25% of cash available
- Confidence 0.8-0.9 (High): 20% of cash available
- Confidence 0.7-0.8 (Medium): 15% of cash available
- Confidence <0.7: DO NOT TRADE (reject the opportunity)

Higher conviction = larger position. Lower conviction = smaller position or wait.

==== RISK RULES ====
- Max 25% cash per trade (for high confidence 0.9+)
- Max 30% portfolio in single stock
- Min 3 positions for diversification
- AUTOMATIC EXIT ENFORCEMENT: Your stopLoss and targetPrice will execute WITHOUT your input
  * When currentPrice ≤ stopLoss → Position AUTO-CLOSES
  * When currentPrice ≥ targetPrice → Position AUTO-CLOSES
  * These are PRE-REGISTERED commitments that WILL execute

==== TRADING PRINCIPLES ====
✓ Buy dips in strong uptrends with positive market sentiment
✓ Take profits on parabolic moves (>15% gains)
✓ Cut losses early on weak stocks (<-8%)
✓ Fewer, larger, higher-conviction trades > many small trades
✗ Avoid chasing breakouts without confirmation
✗ Don't average down on falling stocks without support
✗ Don't trade on low conviction (<0.7 confidence)

${useMCPTools ? `==== TOOL CALL BUDGET: ${maxToolCalls} maximum ====
Use efficiently based on situation:
- ROUTINE MONITORING (no opportunities): 2-3 calls
  Example: get_quote(symbol) for quick checks

- INVESTIGATING OPPORTUNITY (interesting signal): 8-10 calls
  Example: get_quote → get_rsi → get_macd → get_news_sentiment

- CRITICAL DECISION (large risk/reward at stake): 12-15 calls
  Example: Full analysis including fundamentals, multiple indicators, news

Available tools:
- get_quote(symbol): Real-time price & daily change
- get_rsi(symbol, interval='daily'): Relative Strength Index (overbought >70, oversold <30)
- get_macd(symbol, interval='daily'): Momentum indicator (bullish/bearish signal)
- get_company_overview(symbol): P/E ratio, market cap, sector, description
- get_news_sentiment(symbol): Recent news headlines with sentiment scores

Use tools to gather data, then make ONE trading decision.
` : ''}
==== DECISION ====
Actions: BUY (long), SELL (close long), SELL_SHORT (bet on drop), BUY_TO_COVER (close short), HOLD

Respond with JSON only:
{
  "action":"BUY|SELL|SELL_SHORT|BUY_TO_COVER|HOLD",
  "symbol":"AAPL",
  "quantity":5,
  "reasoning":"Why this trade fits market context and strategy",
  "confidence":0.85,
  "riskAssessment":"Low|Med|High",
  "targetPrice":200,
  "stopLoss":175,
  "invalidationCondition":"Exit if 4H RSI breaks below 40, signaling momentum failure"
}

CRITICAL EXIT PLANNING:
- targetPrice: Price at which to take profits (WILL AUTO-EXECUTE)
- stopLoss: Price at which to cut losses (WILL AUTO-EXECUTE)
- invalidationCondition: Market condition that voids your thesis (e.g., "Break below support at $180", "Volume drops below 1M shares", "RSI reversal")

For BUY trades:
- targetPrice must be ABOVE currentPrice
- stopLoss must be BELOW currentPrice
- Both are required and will execute automatically

For HOLD: {"action":"HOLD","reasoning":"Why waiting is best","confidence":0.7}`;
}

export async function getAIDecision(
  agentId: string,
  agentName: string,
  context: MarketContext
): Promise<TradingDecision> {
  console.log(`  🤖 Getting decision from ${agentName}...`);

  try {
    switch (agentId) {
      case 'gpt4':
        return await callOpenAI(context, agentId, agentName);
      case 'claude':
        return await callClaude(context, agentId, agentName);
      case 'gemini':
        return await callGemini(context);
      case 'deepseek':
        return await callDeepSeek(context);
      case 'qwen':
        return await callQwen(context);
      default:
        return getRandomDecision(context);
    }
  } catch (error: any) {
    console.error(`  ❌ Error getting AI decision for ${agentName}:`, error.message);
    return {
      action: 'HOLD',
      reasoning: `Error communicating with AI: ${error.message}`,
      confidence: 0.1,
    };
  }
}

async function callOpenAI(context: MarketContext, agentId: string = 'gpt4', agentName: string = 'GPT-4'): Promise<TradingDecision> {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  // Use function calling with Alpha Vantage tools
  return await callOpenAIWithTools(openai, context, agentId, agentName);
}

async function callOpenAIWithTools(
  openai: OpenAI,
  context: MarketContext,
  agentId: string,
  agentName: string
): Promise<TradingDecision> {
  const MAX_TOOL_CALLS = 15;
  let toolCallsUsed = 0;

  const tools = getMultiSourceToolsForOpenAI();
  const messages: any[] = [
    {
      role: 'system',
      content: `You are an expert stock trader. You have access to multi-source financial data tools:
- Yahoo Finance (yf_*): Unlimited free quotes, historical data, company info, trending stocks
- Alpha Vantage (get_*): Technical indicators (RSI, MACD), news sentiment (LIMITED: 25 calls/day, use sparingly!)

Use them wisely to make informed trading decisions. Budget: ${MAX_TOOL_CALLS} tool calls maximum.

Strategy: Prefer Yahoo Finance tools (unlimited), use Alpha Vantage only for technical indicators you really need.`,
    },
    {
      role: 'user',
      content: createPrompt(context, MAX_TOOL_CALLS, true),
    },
  ];

  console.log(`  🔧 Multi-source function calling enabled (${MAX_TOOL_CALLS} tool budget)`);

  while (toolCallsUsed < MAX_TOOL_CALLS) {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      tools,
      temperature: 0.7,
      max_tokens: 1000,
    });

    const message = response.choices[0].message;
    messages.push(message);

    // If AI returns a decision (no more tool calls)
    if (!message.tool_calls || message.tool_calls.length === 0) {
      if (message.content) {
        console.log(`  ✅ Decision made after ${toolCallsUsed} tool calls`);
        return parseAIResponse(message.content);
      }
      // No content and no tool calls - error
      throw new Error('AI returned no decision or tool calls');
    }

    // Execute tool calls
    for (const toolCall of message.tool_calls) {
      toolCallsUsed++;

      // Type guard for function tool calls
      if (toolCall.type !== 'function' || !toolCall.function) continue;

      console.log(`  🔧 Tool call ${toolCallsUsed}/${MAX_TOOL_CALLS}: ${toolCall.function.name}`);

      try {
        const args = JSON.parse(toolCall.function.arguments);
        const result = await callMultiSourceTool(toolCall.function.name, args, agentId, agentName);

        messages.push({
          role: 'tool',
          tool_call_id: toolCall.id,
          content: JSON.stringify(result),
        });
      } catch (error: any) {
        console.log(`  ⚠️  Tool error: ${error.message}`);
        messages.push({
          role: 'tool',
          tool_call_id: toolCall.id,
          content: JSON.stringify({ error: error.message }),
        });
      }
    }

    // Add budget reminder
    if (toolCallsUsed < MAX_TOOL_CALLS) {
      messages.push({
        role: 'system',
        content: `Tool calls used: ${toolCallsUsed}/${MAX_TOOL_CALLS}. ${MAX_TOOL_CALLS - toolCallsUsed} remaining. Make your decision or continue investigating.`,
      });
    }
  }

  // Budget exhausted, force decision
  console.log(`  ⚠️  Tool budget exhausted (${MAX_TOOL_CALLS} calls), forcing decision`);
  const finalResponse = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      ...messages,
      {
        role: 'system',
        content: 'Budget exhausted. Make your final trading decision NOW based on the data you gathered. Respond with JSON only.',
      },
    ],
    temperature: 0.7,
    max_tokens: 500,
  });

  const content = finalResponse.choices[0].message.content || '{"action":"HOLD","reasoning":"Budget exhausted","confidence":0.5}';
  return parseAIResponse(content);
}

async function callClaude(context: MarketContext, agentId: string = 'claude', agentName: string = 'Claude'): Promise<TradingDecision> {
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  // Using Claude Haiku instead of Sonnet (95% cost reduction)
  const message = await anthropic.messages.create({
    model: 'claude-3-5-haiku-20241022',
    max_tokens: 200, // Reduced from 1024
    messages: [
      {
        role: 'user',
        content: createPrompt(context),
      },
    ],
  });

  const response = message.content[0].type === 'text' ? message.content[0].text : '{}';
  return parseAIResponse(response);
}

async function callGemini(context: MarketContext): Promise<TradingDecision> {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

  const result = await model.generateContent(createPrompt(context));
  const response = result.response.text();
  return parseAIResponse(response);
}

async function callDeepSeek(context: MarketContext): Promise<TradingDecision> {
  const response = await axios.post(
    'https://api.deepseek.com/v1/chat/completions',
    {
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: 'You are an expert stock trader. Always respond with valid JSON only.',
        },
        {
          role: 'user',
          content: createPrompt(context),
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
    }
  );

  const text = response.data.choices[0].message.content;
  return parseAIResponse(text);
}

async function callQwen(context: MarketContext): Promise<TradingDecision> {
  const response = await axios.post(
    'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
    {
      model: 'qwen-max',
      input: {
        messages: [
          {
            role: 'system',
            content: 'You are an expert stock trader. Always respond with valid JSON only.',
          },
          {
            role: 'user',
            content: createPrompt(context),
          },
        ],
      },
      parameters: {
        temperature: 0.7,
        max_tokens: 500,
      },
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.QWEN_API_KEY}`,
      },
    }
  );

  const text = response.data.output.text;
  return parseAIResponse(text);
}

function parseAIResponse(response: string): TradingDecision {
  try {
    // Extract JSON from markdown code blocks if present
    let jsonStr = response;
    const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1];
    }

    // Try to find JSON object in the response
    const jsonStart = jsonStr.indexOf('{');
    const jsonEnd = jsonStr.lastIndexOf('}');
    if (jsonStart !== -1 && jsonEnd !== -1) {
      jsonStr = jsonStr.substring(jsonStart, jsonEnd + 1);
    }

    const decision = JSON.parse(jsonStr);

    // Validate and normalize the decision
    if (!['BUY', 'SELL', 'SELL_SHORT', 'BUY_TO_COVER', 'HOLD'].includes(decision.action)) {
      throw new Error('Invalid action');
    }

    return {
      action: decision.action,
      symbol: decision.symbol,
      quantity: decision.quantity ? Math.floor(decision.quantity) : undefined,
      reasoning: decision.reasoning || 'No reasoning provided',
      confidence: Math.max(0, Math.min(1, decision.confidence || 0.5)),
      riskAssessment: decision.riskAssessment,
      targetPrice: decision.targetPrice,
      stopLoss: decision.stopLoss,
      invalidationCondition: decision.invalidationCondition,
    };
  } catch (error) {
    console.error('  ⚠️  Failed to parse AI response, defaulting to HOLD:', error);
    return {
      action: 'HOLD',
      reasoning: 'Failed to parse AI response. Holding position for safety.',
      confidence: 0.1,
    };
  }
}

function getRandomDecision(context: MarketContext): TradingDecision {
  const random = Math.random();

  // 40% HOLD, 35% BUY, 25% SELL
  if (random < 0.4) {
    return {
      action: 'HOLD',
      reasoning: 'Waiting for better market conditions',
      confidence: 0.5,
    };
  }

  if (random < 0.75 && context.cashBalance > 100) {
    // BUY
    const stock = context.stocks[Math.floor(Math.random() * context.stocks.length)];
    const maxInvestment = context.cashBalance * 0.15;
    const quantity = Math.floor(maxInvestment / stock.price);

    if (quantity === 0) {
      return {
        action: 'HOLD',
        reasoning: 'Insufficient funds for purchase',
        confidence: 0.3,
      };
    }

    return {
      action: 'BUY',
      symbol: stock.symbol,
      quantity,
      reasoning: `Buying ${stock.symbol} based on momentum (${stock.changePercent.toFixed(2)}% today)`,
      confidence: 0.6,
      riskAssessment: 'Medium',
      targetPrice: stock.price * 1.1,
      stopLoss: stock.price * 0.95,
    };
  }

  // SELL
  if (context.positions.length === 0) {
    return {
      action: 'HOLD',
      reasoning: 'No positions to sell',
      confidence: 0.5,
    };
  }

  const position = context.positions[Math.floor(Math.random() * context.positions.length)];

  return {
    action: 'SELL',
    symbol: position.symbol,
    quantity: position.quantity,
    reasoning: `Closing ${position.symbol} position (P&L: ${position.unrealizedPnL >= 0 ? '+' : ''}$${position.unrealizedPnL.toFixed(2)})`,
    confidence: 0.55,
  };
}
