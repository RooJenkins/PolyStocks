# API Key Setup Guide

This guide will help you get API keys for the 3 remaining AI models: Grok (X.AI), Qwen, and Kimi K2.

---

## 1. Grok (X.AI) - NEEDED ⚠️

**Status:** XAI_API_KEY is empty in .env

**Steps to get API key:**

1. Go to https://x.ai
2. Click "Get API Key" or sign in
3. Navigate to API Keys section
4. Create new API key
5. Copy the key (starts with `xai-...`)

**Add to .env:**
```bash
XAI_API_KEY="xai-YOUR_KEY_HERE"
```

**Pricing:**
- Free tier: Limited requests
- Paid: $5 per 1M input tokens, $15 per 1M output tokens
- Model: grok-2-1212

**Test command:**
```bash
npx tsx scripts/test-ai-connections.ts
```

---

## 2. Qwen (Alibaba Cloud) - KEY MIGHT BE EXPIRED ⚠️

**Status:** Getting 403 Forbidden error
**Current key:** sk-0081954c2a8d456c9c9d46fcdc1a60d8

**Steps to get NEW API key:**

1. Go to https://dashscope.aliyuncs.com
2. Sign in with Alibaba Cloud account
3. Go to "API Keys" section
4. Check if current key is active/expired
5. If expired, create new API key
6. Copy the new key (starts with `sk-...`)

**Common issues:**
- Key expired (most likely)
- Account needs identity verification
- Billing needs to be enabled
- Free quota exhausted

**Add to .env:**
```bash
QWEN_API_KEY="sk-YOUR_NEW_KEY_HERE"
```

**Pricing:**
- qwen-plus: ¥0.004/1K tokens (~$0.0006)
- qwen-max: ¥0.02/1K tokens (~$0.003)
- Free tier available with limits

**API Endpoint:**
```
https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions
```

---

## 3. Kimi K2 (Moonshot AI) - INVALID AUTH ⚠️

**Status:** Invalid Authentication error
**Current key:** sk-wT76YginGJtTtSVNauO89KrV59N1uAD2jWpKEMHK6RSNV8TB

**Steps to get NEW API key:**

1. Go to https://platform.moonshot.cn
2. Sign in (requires Chinese phone number or email)
3. Navigate to "API 密钥" (API Keys) section
4. Check if current key is valid
5. If invalid, create new API key
6. Copy the new key (starts with `sk-...`)

**Common issues:**
- Key expired
- Account suspended
- Key format changed
- Free quota exhausted

**Add to .env:**
```bash
KIMI_API_KEY="sk-YOUR_NEW_KEY_HERE"
```

**Pricing:**
- moonshot-v1-8k: ¥0.012/1K tokens
- moonshot-v1-32k: ¥0.024/1K tokens
- moonshot-v1-128k: ¥0.06/1K tokens
- Free tier: ¥15 credit for new users

**API Endpoint:**
```
https://api.moonshot.ai/v1/chat/completions (Global - Recommended)
https://api.moonshot.cn/v1/chat/completions (China - Requires identity verification)
```

---

## Quick Test Script

After adding any API key to .env, run:

```bash
npx tsx scripts/test-ai-connections.ts
```

This will test all 7 AI models and show which ones are working.

---

## Priority Order

If you can only set up a few, prioritize in this order:

1. **Grok (X.AI)** - English, easy to set up, good for US users
2. **Qwen** - Chinese service, very cheap, good performance
3. **Kimi K2** - Chinese service, requires Chinese verification

---

## Current Working Models (4/7)

✅ GPT-5 (OpenAI)
✅ Claude Sonnet 4.5 (Anthropic)
✅ Gemini Flash (Google)
✅ DeepSeek

The system is fully functional with these 4 models!

---

## Alternative: Remove Non-Working AIs

If you prefer to run with only the 4 working models, let me know and I can:
1. Remove Grok, Qwen, and Kimi from the agent list
2. Update the UI to show only active AIs
3. Clean up the database

This is a valid approach since the 4 working AIs are the strongest models anyway.
