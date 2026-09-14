# Integrating OneNote MCP with Claude Desktop

This guide explains how to integrate the OneNote Model Context Protocol (MCP) tool with Claude Desktop, allowing Claude to read from and write to OneNote notebooks.

## Overview

The integration between Claude Desktop and OneNote provides these key capabilities:

1. **Knowledge Storage**: Claude can store important information in OneNote
2. **Knowledge Retrieval**: Claude can access previously stored information
3. **Relationship Tracking**: Claude can create and track relationships between concepts
4. **Contextual Information**: Claude can maintain context across conversations

## Setup Instructions

### Step 1: Install Dependencies

Run the dependency installation script from the command prompt:

```bash
cd D:\fetch-mcp\onenote-mcp
install-deps.bat
```

This will install the necessary Node.js packages:
- express (for the API server)
- cors (for cross-origin requests)
- playwright (for browser automation)

### Step 2: Prepare OneNote Notebook

1. Open your OneNote notebook in a web browser
2. Create the following sections:
   - Entities
   - Relationships
   - Contexts
   - Configuration

### Step 3: Start the MCP Server

Run the integration startup script:

```bash
cd D:\fetch-mcp\onenote-mcp
start-claude-desktop-integration.bat
```

This will:
1. Start the MCP server on http://localhost:3030
2. Open your OneNote notebook in a browser
3. Provide instructions for connecting to Claude Desktop

### Step 4: Configure Claude Desktop

1. Open Claude Desktop
2. Go to Settings or Preferences
3. Look for "Extensions", "Plugins", or similar
4. Select "Add Local Extension" or "Import Plugin"
5. Browse to and select: `D:\fetch-mcp\onenote-mcp\claude-desktop-plugin.json`
6. If asked for permissions, approve network access

### Step 5: Test the Integration

1. In Claude Desktop, try sending these commands:
   - "Initialize OneNote MCP"
   - "Store in OneNote as entity 'TestEntity' of type 'Test' with observations ['This is a test']"
   - "Retrieve from OneNote entity 'TestEntity' of type 'Test'"

2. You should see Claude interact with the OneNote notebook and respond with relevant information.

## Using the Integration

Here are the key commands you can use with Claude Desktop:

### Initializing the Connection

Before using other commands, initialize the connection:

```
Initialize OneNote MCP
```

### Storing Information

To store an entity:

```
Store in OneNote as entity "EntityName" of type "EntityType" with observations ["Observation 1", "Observation 2"]
```

To store context:

```
Store in OneNote as context "ContextName" with content "Detailed context information..."
```

To create relationships:

```
Create relationship in OneNote from "EntityA" to "EntityB" of type "relates_to"
```

### Retrieving Information

To retrieve an entity:

```
Retrieve from OneNote entity "EntityName" of type "EntityType"
```

To retrieve context:

```
Retrieve from OneNote context "ContextName"
```

### Searching

To search for information:

```
Search OneNote for "query"
```

Or to search specific types:

```
Search OneNote for "query" in entities
```

## Natural Language Commands

Claude understands natural language requests like:

- "Can you save this information to OneNote?"
- "What do we know about this topic from previous notes?"
- "Please retrieve any information about XYZ from OneNote"
- "Create a connection between these two concepts"

## Use Cases

Here are some effective ways to use the Claude-OneNote integration:

1. **Research Summaries**: Ask Claude to store research findings in OneNote for later reference
2. **Project Tracking**: Maintain project details, requirements, and statuses
3. **Knowledge Base**: Build a personal knowledge base where Claude helps organize information
4. **Learning Notes**: Store and retrieve learning materials across different sessions
5. **Reference Library**: Keep references, quotes, and citations organized and accessible

## Troubleshooting

If you encounter issues with the integration:

### Server Issues
- Check that the server is running (Command window should be open)
- Verify you can access http://localhost:3030/health in a browser
- Check logs in `D:\fetch-mcp\onenote-mcp\logs\server-output.log`

### Browser Automation Issues
- Look at screenshots in `D:\fetch-mcp\onenote-mcp\screenshots` to see what's happening
- Make sure your OneNote link is valid and accessible
- Adjust timeout settings if operations are taking too long

### Claude Desktop Issues
- Ensure the plugin is properly registered in Claude Desktop
- Check that Claude has permission to access network resources
- Try restarting Claude Desktop if the plugin isn't responding

## Advanced Configuration

You can modify the integration by editing these files:

- `mcp-server.js`: API server implementation
- `onenote-browser-automation.js`: Browser automation settings
- `claude-desktop-plugin.json`: Plugin configuration for Claude Desktop

## Extending the Integration

To extend the functionality:

1. Add new API endpoints to `mcp-server.js`
2. Add corresponding functions to `claude-integration.js`
3. Update `claude-desktop-plugin.json` with the new endpoints
4. Test the new features with the example script

## Keeping the Integration Running

To keep the integration available whenever you use Claude Desktop:

1. Create a shortcut to `start-claude-desktop-integration.bat` in your Startup folder
2. Run the script when you start your computer or before using Claude Desktop
3. Close the command window when you're done to shut down the server

## Support and Resources

If you need help with the integration:

- Check the logs in `D:\fetch-mcp\onenote-mcp\logs`
- Run the example script (`node claude-desktop-example.js`) to test core functionality
- Review the implementation code for detailed comments and documentation
