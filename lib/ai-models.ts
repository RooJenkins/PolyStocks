import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';

interface MarketContext {
  stocks: Array<{
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
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
}

interface TradingDecision {
  action: 'BUY' | 'SELL' | 'HOLD';
  symbol?: string;
  quantity?: number;
  reasoning: string;
  confidence: number;
  riskAssessment?: string;
  targetPrice?: number;
  stopLoss?: number;
}

function createPrompt(context: MarketContext): string {
  // Optimized prompt - reduced from ~1200 tokens to ~600 tokens
  const positionsStr = context.positions.length > 0
    ? context.positions.map(p => `${p.symbol}: ${p.quantity}@$${p.entryPrice.toFixed(2)} P&L:${p.unrealizedPnLPercent.toFixed(1)}%`).join(', ')
    : 'None';

  return `Stock trader. Portfolio: $${context.accountValue.toFixed(0)}, Cash: $${context.cashBalance.toFixed(0)}
Positions: ${positionsStr}

Market (S&P 500):
${context.stocks.map(s => `${s.symbol}:$${s.price.toFixed(2)}(${s.changePercent >= 0 ? '+' : ''}${s.changePercent.toFixed(1)}%)`).join(' ')}

Decide: BUY (max 20% cash), SELL position, or HOLD.

JSON only:
{"action":"BUY|SELL|HOLD","symbol":"AAPL","quantity":5,"reasoning":"brief","confidence":0.75,"riskAssessment":"Low|Med|High","targetPrice":200,"stopLoss":175}

HOLD: action, reasoning, confidence only.`;
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
        return await callOpenAI(context);
      case 'claude':
        return await callClaude(context);
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

async function callOpenAI(context: MarketContext): Promise<TradingDecision> {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  // Using GPT-4o-mini instead of GPT-4 (98% cost reduction)
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'Stock trader. JSON only.',
      },
      {
        role: 'user',
        content: createPrompt(context),
      },
    ],
    temperature: 0.7,
    max_tokens: 150, // Reduced from 500
  });

  const response = completion.choices[0].message.content || '{}';
  return parseAIResponse(response);
}

async function callClaude(context: MarketContext): Promise<TradingDecision> {
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
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

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
    if (!['BUY', 'SELL', 'HOLD'].includes(decision.action)) {
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
