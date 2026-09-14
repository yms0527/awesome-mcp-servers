#!/bin/bash

# Test Telegram-Claude Bridges Setup

echo "🧪 Testing Telegram-Claude Bridge Setup..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Test 1: Check environment
echo -e "\n${YELLOW}📋 Checking environment...${NC}"

if [ -f .env ]; then
    echo -e "${GREEN}✅ .env file found${NC}"
else
    echo -e "${RED}❌ .env file missing${NC}"
    exit 1
fi

if grep -q "TELEGRAM_BOT_TOKEN" .env; then
    echo -e "${GREEN}✅ TELEGRAM_BOT_TOKEN configured${NC}"
else
    echo -e "${RED}❌ TELEGRAM_BOT_TOKEN missing${NC}"
    exit 1
fi

# Test 2: Check dependencies
echo -e "\n${YELLOW}📦 Checking dependencies...${NC}"

if [ -d node_modules ]; then
    echo -e "${GREEN}✅ Node modules installed${NC}"
else
    echo -e "${RED}❌ Node modules missing - run 'npm install'${NC}"
    exit 1
fi

# Test 3: Test CLI bridge
echo -e "\n${YELLOW}🔄 Testing CLI → Telegram bridge...${NC}"
echo "Test message from bridge setup" | npm run cli-bridge &
CLI_PID=$!
sleep 3
kill $CLI_PID 2>/dev/null

# Test 4: Check if scripts exist
echo -e "\n${YELLOW}📂 Checking bridge scripts...${NC}"

SCRIPTS=(
    "src/cli-telegram-bridge.ts"
    "src/telegram-to-claude-bridge.ts"
    "src/claude-telegram-session.ts"
    "scripts/start-bridges.sh"
)

for script in "${SCRIPTS[@]}"; do
    if [ -f "$script" ]; then
        echo -e "${GREEN}✅ $script exists${NC}"
    else
        echo -e "${RED}❌ $script missing${NC}"
    fi
done

# Test 5: Docker configuration
echo -e "\n${YELLOW}🐳 Checking Docker configuration...${NC}"

if [ -f "docker-compose.bridges.yml" ]; then
    echo -e "${GREEN}✅ Docker Compose file exists${NC}"
else
    echo -e "${RED}❌ docker-compose.bridges.yml missing${NC}"
fi

echo -e "\n${GREEN}🎉 Setup test complete!${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "📝 Next steps:"
echo -e "1. Run: ${GREEN}npm run bridges:start${NC}"
echo -e "2. In another terminal: ${GREEN}npm run claude-session${NC}"
echo -e "3. Send messages from Telegram to interact!"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"