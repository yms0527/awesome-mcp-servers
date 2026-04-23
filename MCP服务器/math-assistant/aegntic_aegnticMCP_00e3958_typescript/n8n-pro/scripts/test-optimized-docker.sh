#!/bin/bash
# Test script for optimized Docker build

set -e

echo "🧪 Testing Optimized Docker Build"
echo "================================="

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Build the optimized image
echo -e "\n📦 Building optimized Docker image..."
docker build -f Dockerfile.optimized -t n8n-mcp:optimized .

# Check image size
echo -e "\n📊 Checking image size..."
SIZE=$(docker images n8n-mcp:optimized --format "{{.Size}}")
echo "Image size: $SIZE"

# Extract size in MB for comparison
SIZE_MB=$(docker images n8n-mcp:optimized --format "{{.Size}}" | sed 's/MB//' | sed 's/GB/*1024/' | bc 2>/dev/null || echo "0")
if [ "$SIZE_MB" != "0" ] && [ "$SIZE_MB" -lt "300" ]; then
    echo -e "${GREEN}✅ Image size is optimized (<300MB)${NC}"
else
    echo -e "${RED}⚠️  Image might be larger than expected${NC}"
fi

# Test stdio mode
echo -e "\n🔍 Testing stdio mode..."
TEST_RESULT=$(echo '{"jsonrpc":"2.0","method":"tools/list","id":1}' | \
    docker run --rm -i -e MCP_MODE=stdio n8n-mcp:optimized 2>/dev/null | \
    grep -o '"name":"[^"]*"' | head -1)

if [ -n "$TEST_RESULT" ]; then
    echo -e "${GREEN}✅ Stdio mode working${NC}"
else
    echo -e "${RED}❌ Stdio mode failed${NC}"
fi

# Test HTTP mode
echo -e "\n🌐 Testing HTTP mode..."
docker run -d --name test-optimized \
    -e MCP_MODE=http \
    -e AUTH_TOKEN=test-token \
    -p 3002:3000 \
    n8n-mcp:optimized

# Wait for startup
sleep 5

# Test health endpoint
HEALTH=$(curl -s http://localhost:3002/health | grep -o '"status":"healthy"' || echo "")
if [ -n "$HEALTH" ]; then
    echo -e "${GREEN}✅ Health endpoint working${NC}"
else
    echo -e "${RED}❌ Health endpoint failed${NC}"
fi

# Test MCP endpoint
MCP_TEST=$(curl -s -H "Authorization: Bearer test-token" \
    -H "Content-Type: application/json" \
    -d '{"jsonrpc":"2.0","method":"tools/list","id":1}' \
    http://localhost:3002/mcp | grep -o '"tools":\[' || echo "")

if [ -n "$MCP_TEST" ]; then
    echo -e "${GREEN}✅ MCP endpoint working${NC}"
else
    echo -e "${RED}❌ MCP endpoint failed${NC}"
fi

# Test database statistics tool
STATS_TEST=$(curl -s -H "Authorization: Bearer test-token" \
    -H "Content-Type: application/json" \
    -d '{"jsonrpc":"2.0","method":"tools/call","params":{"name":"get_database_statistics","arguments":{}},"id":2}' \
    http://localhost:3002/mcp | grep -o '"totalNodes":[0-9]*' || echo "")

if [ -n "$STATS_TEST" ]; then
    echo -e "${GREEN}✅ Database statistics tool working${NC}"
    echo "Database stats: $STATS_TEST"
else
    echo -e "${RED}❌ Database statistics tool failed${NC}"
fi

# Cleanup
docker stop test-optimized >/dev/null 2>&1
docker rm test-optimized >/dev/null 2>&1

# Compare with original image
echo -e "\n📊 Size Comparison:"
echo "Original image: $(docker images n8n-mcp:latest --format "{{.Size}}" 2>/dev/null || echo "Not built")"
echo "Optimized image: $SIZE"

echo -e "\n✨ Testing complete!"