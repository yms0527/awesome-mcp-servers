#!/bin/bash

# Start Bidirectional Telegram-Claude Bridges
# This script starts both the Telegram→Claude and Claude→Telegram bridges

echo "🚀 Starting Telegram-Claude Bidirectional Bridges..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${RED}❌ Error: .env file not found${NC}"
    echo "Please create a .env file with TELEGRAM_BOT_TOKEN"
    exit 1
fi

# Check if TELEGRAM_BOT_TOKEN is set
if ! grep -q "TELEGRAM_BOT_TOKEN" .env; then
    echo -e "${RED}❌ Error: TELEGRAM_BOT_TOKEN not found in .env${NC}"
    exit 1
fi

# Create named pipe directory if it doesn't exist
PIPE_DIR="/tmp"
PIPE_PATH="$PIPE_DIR/claude-telegram-pipe"

if [ ! -p "$PIPE_PATH" ]; then
    echo -e "${YELLOW}📡 Creating named pipe at $PIPE_PATH...${NC}"
    mkfifo "$PIPE_PATH"
    chmod 666 "$PIPE_PATH"
fi

# Function to cleanup on exit
cleanup() {
    echo -e "\n${YELLOW}🧹 Cleaning up...${NC}"
    
    # Kill background processes
    if [ ! -z "$TG_BRIDGE_PID" ]; then
        kill $TG_BRIDGE_PID 2>/dev/null
    fi
    
    # Remove named pipe
    if [ -p "$PIPE_PATH" ]; then
        rm -f "$PIPE_PATH"
    fi
    
    echo -e "${GREEN}✅ Cleanup complete${NC}"
    exit 0
}

# Set up trap for cleanup
trap cleanup EXIT INT TERM

# Start Telegram to Claude bridge in background
echo -e "${GREEN}📱 Starting Telegram → Claude bridge...${NC}"
npm run tg-claude-bridge &
TG_BRIDGE_PID=$!

# Wait a moment for the bridge to start
sleep 3

# Check if bridge started successfully
if ! kill -0 $TG_BRIDGE_PID 2>/dev/null; then
    echo -e "${RED}❌ Failed to start Telegram → Claude bridge${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Telegram → Claude bridge started (PID: $TG_BRIDGE_PID)${NC}"

# Instructions
echo -e "\n${GREEN}🎉 Bidirectional bridges are ready!${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "📝 Usage Instructions:"
echo -e "1. In a new terminal, run: ${GREEN}npm run claude-session${NC}"
echo -e "2. Messages from Telegram will appear in Claude"
echo -e "3. Claude responses will be sent back to Telegram"
echo -e "\n${YELLOW}💡 Tips:${NC}"
echo -e "- Use ${GREEN}claude-tg${NC} command for CLI forwarding"
echo -e "- Session timeout: 30 minutes of inactivity"
echo -e "- Press Ctrl+C to stop bridges"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Keep script running
echo -e "\n${GREEN}🔄 Bridges are running. Press Ctrl+C to stop.${NC}"
wait $TG_BRIDGE_PID