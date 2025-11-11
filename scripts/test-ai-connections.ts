/**
 * Test script to verify all AI model connections are working
 * Tests each AI with a simple prompt and reports success/failure
 */

import 'dotenv/config';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';

interface TestResult {
  model: string;
  status: 'success' | 'error';
  error?: string;
  responseTime?: number;
}

const results: TestResult[] = [];

// Test GPT-5 (OpenAI)
async function testOpenAI(): Promise<TestResult> {
  const start = Date.now();
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: 'Say "OK" if you can read this.' }],
      max_tokens: 10,
    });

    if (completion.choices[0].message.content) {
      return {
        model: 'GPT-5 (gpt-4o)',
        status: 'success',
        responseTime: Date.now() - start,
      };
    } else {
      return {
        model: 'GPT-5 (gpt-4o)',
        status: 'error',
        error: 'No response content',
      };
    }
  } catch (error: any) {
    return {
      model: 'GPT-5 (gpt-4o)',
      status: 'error',
      error: error.message,
    };
  }
}

// Test Claude Sonnet 4.5
async function testClaude(): Promise<TestResult> {
  const start = Date.now();
  try {
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 10,
      messages: [{ role: 'user', content: 'Say "OK" if you can read this.' }],
    });

    if (message.content[0] && message.content[0].type === 'text') {
      return {
        model: 'Claude Sonnet 4.5 (claude-sonnet-4-20250514)',
        status: 'success',
        responseTime: Date.now() - start,
      };
    } else {
      return {
        model: 'Claude Sonnet 4.5 (claude-sonnet-4-20250514)',
        status: 'error',
        error: 'No response content',
      };
    }
  } catch (error: any) {
    return {
      model: 'Claude Sonnet 4.5 (claude-sonnet-4-20250514)',
      status: 'error',
      error: error.message,
    };
  }
}

// Test Gemini Flash
async function testGemini(): Promise<TestResult> {
  const start = Date.now();
  try {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent('Say "OK" if you can read this.');

    if (result.response.text()) {
      return {
        model: 'Gemini Flash (gemini-2.0-flash)',
        status: 'success',
        responseTime: Date.now() - start,
      };
    } else {
      return {
        model: 'Gemini Flash (gemini-2.0-flash)',
        status: 'error',
        error: 'No response content',
      };
    }
  } catch (error: any) {
    return {
      model: 'Gemini Flash (gemini-2.0-flash)',
      status: 'error',
      error: error.message,
    };
  }
}

// Test DeepSeek
async function testDeepSeek(): Promise<TestResult> {
  const start = Date.now();
  try {
    const response = await axios.post(
      'https://api.deepseek.com/chat/completions',
      {
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: 'Say "OK" if you can read this.' }],
        max_tokens: 10,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        },
      }
    );

    if (response.data.choices[0].message.content) {
      return {
        model: 'DeepSeek (deepseek-chat)',
        status: 'success',
        responseTime: Date.now() - start,
      };
    } else {
      return {
        model: 'DeepSeek (deepseek-chat)',
        status: 'error',
        error: 'No response content',
      };
    }
  } catch (error: any) {
    return {
      model: 'DeepSeek (deepseek-chat)',
      status: 'error',
      error: error.response?.data?.error?.message || error.message,
    };
  }
}

// Test Qwen
async function testQwen(): Promise<TestResult> {
  const start = Date.now();
  try {
    const response = await axios.post(
      'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
      {
        model: 'qwen-plus',
        messages: [{ role: 'user', content: 'Say "OK" if you can read this.' }],
        max_tokens: 10,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.QWEN_API_KEY}`,
        },
      }
    );

    if (response.data.choices[0].message.content) {
      return {
        model: 'Qwen (qwen-plus)',
        status: 'success',
        responseTime: Date.now() - start,
      };
    } else {
      return {
        model: 'Qwen (qwen-plus)',
        status: 'error',
        error: 'No response content',
      };
    }
  } catch (error: any) {
    return {
      model: 'Qwen (qwen-plus)',
      status: 'error',
      error: error.response?.data?.message || error.message,
    };
  }
}

// Test Grok
async function testGrok(): Promise<TestResult> {
  const start = Date.now();
  try {
    const response = await axios.post(
      'https://api.x.ai/v1/chat/completions',
      {
        model: 'grok-2-1212',
        messages: [{ role: 'user', content: 'Say "OK" if you can read this.' }],
        max_tokens: 10,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.XAI_API_KEY}`,
        },
      }
    );

    if (response.data.choices[0].message.content) {
      return {
        model: 'Grok (grok-2-1212)',
        status: 'success',
        responseTime: Date.now() - start,
      };
    } else {
      return {
        model: 'Grok (grok-2-1212)',
        status: 'error',
        error: 'No response content',
      };
    }
  } catch (error: any) {
    return {
      model: 'Grok (grok-2-1212)',
      status: 'error',
      error: error.response?.data?.error?.message || error.message,
    };
  }
}

// Test Kimi K2
async function testKimi(): Promise<TestResult> {
  const start = Date.now();
  try {
    const response = await axios.post(
      'https://api.moonshot.ai/v1/chat/completions',
      {
        model: 'moonshot-v1-128k',
        messages: [{ role: 'user', content: 'Say "OK" if you can read this.' }],
        max_tokens: 10,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.KIMI_API_KEY}`,
        },
      }
    );

    if (response.data.choices[0].message.content) {
      return {
        model: 'Kimi K2 (moonshot-v1-128k)',
        status: 'success',
        responseTime: Date.now() - start,
      };
    } else {
      return {
        model: 'Kimi K2 (moonshot-v1-128k)',
        status: 'error',
        error: 'No response content',
      };
    }
  } catch (error: any) {
    return {
      model: 'Kimi K2 (moonshot-v1-128k)',
      status: 'error',
      error: error.response?.data?.error?.message || error.message,
    };
  }
}

// Run all tests
async function runTests() {
  console.log('🧪 Testing all AI model connections...\n');

  const tests = [
    testOpenAI(),
    testClaude(),
    testGemini(),
    testDeepSeek(),
    testQwen(),
    testGrok(),
    testKimi(),
  ];

  const results = await Promise.all(tests);

  console.log('═══════════════════════════════════════════════════════════');
  console.log('TEST RESULTS');
  console.log('═══════════════════════════════════════════════════════════\n');

  let successCount = 0;
  let errorCount = 0;

  results.forEach(result => {
    if (result.status === 'success') {
      console.log(`✅ ${result.model}`);
      console.log(`   Response time: ${result.responseTime}ms\n`);
      successCount++;
    } else {
      console.log(`❌ ${result.model}`);
      console.log(`   Error: ${result.error}\n`);
      errorCount++;
    }
  });

  console.log('═══════════════════════════════════════════════════════════');
  console.log(`Summary: ${successCount} working, ${errorCount} errors`);
  console.log('═══════════════════════════════════════════════════════════');

  if (errorCount > 0) {
    process.exit(1);
  }
}

runTests();
