#!/bin/bash
# Helper script to add/update API keys in .env file

echo "🔑 API Key Setup Helper"
echo "======================="
echo ""
echo "Which API key do you want to add/update?"
echo "1) Grok (X.AI) - XAI_API_KEY"
echo "2) Qwen - QWEN_API_KEY"
echo "3) Kimi K2 - KIMI_API_KEY"
echo "4) Show current status"
echo "5) Exit"
echo ""
read -p "Enter choice (1-5): " choice

case $choice in
  1)
    echo ""
    echo "📝 Adding Grok (X.AI) API key"
    echo "Get your key from: https://x.ai"
    echo ""
    read -p "Enter your XAI API key: " api_key

    if [ -z "$api_key" ]; then
      echo "❌ No key entered"
      exit 1
    fi

    # Update .env file
    if grep -q "XAI_API_KEY=" .env; then
      # Replace existing
      sed -i '' "s|XAI_API_KEY=.*|XAI_API_KEY=\"$api_key\"|" .env
      echo "✅ Updated XAI_API_KEY in .env"
    else
      # Add new
      echo "XAI_API_KEY=\"$api_key\"" >> .env
      echo "✅ Added XAI_API_KEY to .env"
    fi

    echo ""
    echo "Testing Grok connection..."
    npx tsx scripts/test-ai-connections.ts 2>&1 | grep -A 2 "Grok"
    ;;

  2)
    echo ""
    echo "📝 Adding Qwen API key"
    echo "Get your key from: https://dashscope.aliyuncs.com"
    echo ""
    read -p "Enter your Qwen API key: " api_key

    if [ -z "$api_key" ]; then
      echo "❌ No key entered"
      exit 1
    fi

    # Update .env file
    sed -i '' "s|QWEN_API_KEY=.*|QWEN_API_KEY=\"$api_key\"|" .env
    echo "✅ Updated QWEN_API_KEY in .env"

    echo ""
    echo "Testing Qwen connection..."
    npx tsx scripts/test-ai-connections.ts 2>&1 | grep -A 2 "Qwen"
    ;;

  3)
    echo ""
    echo "📝 Adding Kimi K2 API key"
    echo "Get your key from: https://platform.moonshot.cn"
    echo ""
    read -p "Enter your Kimi API key: " api_key

    if [ -z "$api_key" ]; then
      echo "❌ No key entered"
      exit 1
    fi

    # Update .env file
    sed -i '' "s|KIMI_API_KEY=.*|KIMI_API_KEY=\"$api_key\"|" .env
    echo "✅ Updated KIMI_API_KEY in .env"

    echo ""
    echo "Testing Kimi connection..."
    npx tsx scripts/test-ai-connections.ts 2>&1 | grep -A 2 "Kimi"
    ;;

  4)
    echo ""
    echo "📊 Current API Key Status:"
    echo "=========================="
    echo ""
    echo "Testing all connections..."
    npx tsx scripts/test-ai-connections.ts
    ;;

  5)
    echo "Goodbye!"
    exit 0
    ;;

  *)
    echo "❌ Invalid choice"
    exit 1
    ;;
esac

echo ""
echo "✅ Done! Run './scripts/add-api-key.sh' again to add more keys."
