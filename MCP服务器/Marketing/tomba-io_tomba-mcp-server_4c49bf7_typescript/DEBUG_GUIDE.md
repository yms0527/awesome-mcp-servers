# 🔍 Tomba MCP Server - Debug & Test Guide

This guide shows you how to debug, test, and inspect your Tomba MCP Server using various tools and methods.

## 🚀 Quick Start Testing

### 1. Build and Debug with Inspector

```bash
# Build the project and launch MCP Inspector
yarn debug
```

This will:

-   Compile TypeScript to JavaScript
-   Launch the MCP Inspector web interface
-   Open your browser to inspect and test tools

### 2. Development Mode with Inspector

```bash
# Run TypeScript directly with inspector
yarn debug:dev
```

### 3. Run Integration Tests

```bash
# Run automated integration tests
yarn test:integration
```

## 🛠️ Debugging Methods

### Method 1: MCP Inspector (Recommended)

The MCP Inspector provides a web-based UI for testing MCP servers:

```bash
# Option A: Build first, then inspect
yarn build
npx @modelcontextprotocol/inspector server/index.js

# Option B: Use npm script
yarn debug
```

**What you'll see:**

-   🌐 Browser opens automatically
-   📋 List of all available tools
-   🧪 Interactive tool testing interface
-   📊 Request/response inspection
-   ⚡ Real-time debugging

### Method 2: Manual MCP Testing

Test the server directly via JSON-RPC:

```bash
# Start the server
yarn build
node server/index.js

# In another terminal, send MCP messages:
echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0.0"}}}' | node server/index.js

echo '{"jsonrpc":"2.0","id":2,"method":"tools/list"}' | node server/index.js
```

### Method 3: Integration Testing

Run the automated integration test suite:

```bash
yarn test:integration
```

This test:

-   ✅ Starts the MCP server
-   ✅ Sends initialization requests
-   ✅ Lists available tools
-   ✅ Tests tool calls
-   ✅ Validates responses
-   ✅ Handles cleanup

## 🧪 Testing Individual Tools

### Using MCP Inspector

1. **Start the inspector**:

    ```bash
    yarn debug
    ```

2. **Test Domain Search**:

    - Tool: `domain_search`
    - Arguments: `{"domain": "example.com", "limit": 10}`

3. **Test Email Finder**:

    - Tool: `email_finder`
    - Arguments: `{"domain": "example.com", "firstName": "John", "lastName": "Doe"}`

4. **Test Email Verifier**:
    - Tool: `email_verifier`
    - Arguments: `{"email": "test@example.com"}`

### Using cURL (Advanced)

Test tools via HTTP API:

```bash
# Example domain search
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/call",
    "params": {
      "name": "email_finder",
      "arguments": {
        "domain": "stripe.com",
        "firstName": "Patrick",
        "lastName": "Collison"
      }
    },
    "id": 1
  }'
```

## 🐛 Common Issues & Solutions

### Issue 1: "Tomba client not initialized"

**Solution**: Make sure environment variables are set:

```bash
export TOMBA_API_KEY="your_api_key"
export TOMBA_SECRET_KEY="your_secret_key"
```

### Issue 2: "Unknown file extension .ts"

**Solution**: Use the build step:

```bash
yarn build
yarn debug
```

### Issue 3: API Rate Limits

**Solution**: Use test mode or mock responses:

```bash
# Set test credentials for development
export TOMBA_API_KEY="test_key"
export TOMBA_SECRET_KEY="test_secret"
```

### Issue 4: Inspector Won't Start

**Solution**: Check if port is in use:

```bash
# Kill any processes using the port
lsof -ti:3000 | xargs kill -9

# Try again
yarn debug
```

## 📊 Monitoring & Logs

### Server Logs

The server outputs logs to stderr:

```bash
# View logs in real-time
yarn debug 2>&1 | tee debug.log
```

### Enable Verbose Logging

Add debug environment variable:

```bash
export DEBUG="tomba:*"
yarn debug
```

### Request/Response Tracing

Use the MCP Inspector's network tab to see all JSON-RPC messages.

## 🧪 Test Scenarios

### Scenario 1: Basic Tool Testing

```javascript
// Test all tools with sample data
const testCases = [
    { tool: "domain_search", args: { domain: "github.com" } },
    {
        tool: "email_finder",
        args: { domain: "github.com", firstName: "John", lastName: "Doe" },
    },
    { tool: "email_verifier", args: { email: "test@github.com" } },
    { tool: "email_enrichment", args: { email: "test@github.com" } },
    { tool: "phone_validator", args: { phone: "+1234567890" } },
];
```

### Scenario 2: Error Handling

Test with invalid inputs:

```javascript
// Test error responses
const errorTests = [
    { tool: "domain_search", args: { domain: "" } }, // Empty domain
    { tool: "email_finder", args: { domain: "test" } }, // Missing required fields
    { tool: "phone_validator", args: { phone: "invalid" } }, // Invalid phone
];
```

### Scenario 3: Rate Limiting

```javascript
// Test multiple rapid requests
for (let i = 0; i < 10; i++) {
    // Send requests quickly to test rate limiting
}
```

## 📈 Performance Testing

### Load Testing

```bash
# Install Artillery for load testing
npm install -g artillery

# Create artillery config
cat > load-test.yml << EOF
config:
  target: 'http://localhost:3000'
  phases:
    - duration: 60
      arrivalRate: 10
scenarios:
  - name: "Tool testing"
    requests:
      - post:
          url: "/tools/domain_search"
          json:
            domain: "example.com"
EOF

# Run load test
artillery run load-test.yml
```

## 🔧 Advanced Debugging

### Using Node.js Debugger

```bash
# Start with debugger
node --inspect-brk server/index.js

# Then open Chrome DevTools at chrome://inspect
```

### Memory Profiling

```bash
# Profile memory usage
node --inspect --heap-prof server/index.js
```

### CPU Profiling

```bash
# Profile CPU usage
node --prof server/index.js
node --prof-process isolate-*.log > profile.txt
```

## 📝 Debug Checklist

Before reporting issues, check:

-   [ ] Environment variables are set correctly
-   [ ] TypeScript compiles without errors (`yarn build`)
-   [ ] Tests pass (`yarn test`)
-   [ ] Integration test passes (`yarn test:integration`)
-   [ ] MCP Inspector can connect (`yarn debug`)
-   [ ] Server starts without errors
-   [ ] Tools are listed correctly
-   [ ] Sample tool calls work

## 🆘 Getting Help

If you're still having issues:

1. **Check logs**: Look at server stderr output
2. **Run integration test**: `yarn test:integration`
3. **Test with inspector**: `yarn debug`
4. **Check environment**: Verify API credentials
5. **Update dependencies**: `yarn install` or `npm install`

## 📚 Resources

-   [MCP Specification](https://modelcontextprotocol.io/)
-   [Tomba.io API Documentation](https://docs.tomba.io/introduction/)
-   [TypeScript Debugging Guide](https://code.visualstudio.com/docs/typescript/typescript-debugging)
-   [Node.js Debugging Guide](https://nodejs.org/en/guides/debugging-getting-started/)
