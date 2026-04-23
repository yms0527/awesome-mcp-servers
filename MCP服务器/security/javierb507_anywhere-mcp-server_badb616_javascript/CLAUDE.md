# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Build and Development
- `npm run build` - Compile TypeScript to JavaScript in dist/ directory
- `npm run dev` - Build and start the MCP server in development mode
- `npm start` - Start the compiled MCP server from dist/
- `npm run clean` - Remove dist/ directory and compiled files

### Environment Setup
- Copy `env.example` to `.env` and configure credentials:
  - USM Anywhere API v2.0: `ALIENVAULT_CLIENT_ID`, `ALIENVAULT_CLIENT_SECRET`, `ALIENVAULT_SUBDOMAIN`
  - Legacy OTX API: `ALIENVAULT_OTX_API_KEY`
- At least one set of credentials is required for the server to function

## Project Architecture

### Core Components
This is an MCP (Model Context Protocol) server that provides security analysis tools for AlienVault/LevelBlue platforms.

**Main Entry Point**: `src/index.ts`
- `AlienVaultMCPServer` class orchestrates the entire server
- Handles dual authentication for both USM Anywhere (OAuth 2.0) and legacy OTX (API key)
- Validates credentials on startup and tests API connections before serving

**Service Layer**: `src/services/alienvault.ts`
- `AlienVaultService` class manages all API interactions
- OAuth 2.0 flow with automatic token refresh for USM Anywhere API v2.0
- Legacy OTX API support using API key authentication
- Comprehensive error handling and request validation

**Tool Handlers**: `src/handlers/tools.ts`
- `ToolHandlers` class implements MCP tool interface
- Exposes 7 tools: 4 for USM Anywhere API, 3 for legacy OTX API
- Handles argument validation using Zod schemas
- Formats responses for MCP protocol compliance

**Type System**: `src/types/index.ts`
- Comprehensive Zod schemas for API responses and tool arguments
- Type-safe interfaces for both USM Anywhere and OTX APIs
- Validation schemas ensure data integrity throughout the application

### API Integration Architecture
The server supports two distinct APIs with different authentication methods:

1. **USM Anywhere API v2.0** (Primary)
   - OAuth 2.0 client credentials flow
   - Endpoints: alarms, events, alarm details, event details
   - Account-based filtering required for all operations

2. **Legacy OTX API** (Backward compatibility)
   - API key authentication
   - Endpoints: threat intelligence pulses, indicators, pulse details
   - Global threat intelligence data

### MCP Server Pattern
- Uses `@modelcontextprotocol/sdk` for standard MCP implementation
- Stdio transport for communication with MCP clients
- Tool-based interface exposing security analysis capabilities
- Error handling with structured responses

### Key Design Decisions
- Dual API support allows migration from legacy OTX to modern USM Anywhere
- Type-safe validation prevents runtime errors with external APIs
- Modular architecture separates concerns (auth, API calls, MCP protocol)
- Environment-based configuration supports different deployment scenarios

## Available Tools

### USM Anywhere API v2.0 Tools
- `get_alarms` - Retrieve security alarms with filtering options
- `get_events` - Retrieve security events with filtering options  
- `get_alarm_details` - Get detailed information about a specific alarm
- `get_event_details` - Get detailed information about a specific event

### Investigation Management Tools
- `get_investigations` - Retrieve security investigations with filtering options
- `get_investigation_details` - Get detailed information about a specific investigation
- `create_investigation` - Create a new security investigation
- `update_investigation` - Update an existing investigation (status, priority, assignee, etc.)
- `add_investigation_note` - Add notes to an investigation for documentation
- `delete_investigation` - Delete an investigation

### Legacy OTX API Tools
- `search_pulses` - Search threat intelligence pulses
- `get_indicator` - Get indicator information (IP, domain, hash)
- `get_pulse` - Get detailed pulse information

## Development Notes

### Testing API Connections
The server automatically tests API connections on startup. If connections fail:
- Check credentials in `.env` file
- Verify subdomain format for USM Anywhere (without .alienvault.cloud suffix)
- Ensure network connectivity to respective API endpoints

### Error Handling
All API calls include comprehensive error handling:
- OAuth token refresh on expiration
- 404 handling for missing resources
- Rate limiting and timeout management
- Structured error responses for MCP clients

### TypeScript Configuration
- Target: ES2022 with ESNext modules
- Strict mode enabled for type safety
- Output includes declarations and source maps
- ESM-only configuration (no CommonJS)

## Using with Claude Code

### MCP Server Integration
This server integrates seamlessly with Claude Code through the Model Context Protocol (MCP). Once configured, Claude Code can directly query AlienVault/USM Anywhere and OTX APIs through natural language.

### Configuration for Claude Code
1. **Install and Build the Server:**
   ```bash
   npm install
   npm run build
   ```

2. **Configure Environment:**
   - Copy `env.example` to `.env`
   - Add your credentials:
     ```
     ALIENVAULT_CLIENT_ID=your_usm_client_id
     ALIENVAULT_CLIENT_SECRET=your_usm_client_secret
     ALIENVAULT_SUBDOMAIN=your_subdomain
     ALIENVAULT_OTX_API_KEY=your_otx_api_key
     ```

3. **Add to Claude Code Configuration:**
   Add this server to your Claude Code MCP configuration:
   ```json
   {
     "mcpServers": {
       "alienvault": {
         "command": "node",
         "args": ["/path/to/alienvault-mcp-server/dist/index.js"],
         "env": {
           "ALIENVAULT_CLIENT_ID": "your_client_id",
           "ALIENVAULT_CLIENT_SECRET": "your_client_secret", 
           "ALIENVAULT_SUBDOMAIN": "your_subdomain",
           "ALIENVAULT_OTX_API_KEY": "your_otx_api_key"
         }
       }
     }
   }
   ```

### Natural Language Queries
Once configured, you can ask Claude Code questions like:

**Alarms and Events:**
- "Show me all high priority alarms from the last 24 hours"
- "Get details for alarm ID abc-123"
- "Find security events related to source IP 192.168.1.100"

**Investigations:**
- "Show me all open investigations assigned to john.doe"
- "Create a new critical investigation called 'Data Breach Response' and assign it to security.team"
- "Update investigation xyz-789 to mark it as resolved"
- "Add a note to investigation abc-123 with the investigation findings"
- "Show me all high priority investigations created this week"

**Threat Intelligence:**
- "Search for threat intelligence about domain malicious.com"
- "What indicators are associated with pulse ID xyz-456?"

### Account Name Requirements
For USM Anywhere API calls, you must provide an account name. Ask your AlienVault administrator for the correct account name to use in queries.

### Best Practices
- Use specific time ranges to limit data volume
- Include account names in USM Anywhere queries
- Test connectivity with `npm run dev` before integrating with Claude Code
- Monitor rate limits (100 requests/second for USM Anywhere API)

### Troubleshooting
- **Authentication Failures**: Verify credentials and subdomain format
- **No Data Returned**: Check account name and ensure user has proper permissions
- **Rate Limiting**: Reduce query frequency or batch requests
- **Network Issues**: Verify connectivity to alienvault.cloud and otx.alienvault.com

### Security Considerations
- Keep credentials secure and never commit to version control
- Use environment variables for sensitive configuration
- Monitor API usage and access logs
- Regularly rotate API keys and client credentials

## Standard Workflow
1. First think through the problem, read the codebase for relevant files, write a plan to work-logs/todo.md
2. The plan should have a list of todo items that you can checkoff as you complete them.
3. before you begin working, check in with me and I will verify the plan.
4. Once you begin working on the todo items, mark them as complete as you go.
5. Please exlpain every step of the way just to give me a high level explanation of what changes you make.
6. Make every task and code changes you do as simple as possible. We want to avoid making and massive or complex changes. Every cahnge should imapct as little code as possible. Everything is about simplicity.
7. Finally, add a review section to the todo.md file with a summary of the changes you made and any other relevant information.
