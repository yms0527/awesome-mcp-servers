# Tools Reference

This document provides comprehensive reference for all Context Optimizer MCP Server tools, including parameters, schemas, and examples.

## Tool Overview

The Context Optimizer MCP Server provides 5 tools for context optimization and research:

| Tool | Purpose | Requires API Keys | Session Data |
|------|---------|-------------------|--------------|
| `askAboutFile` | Extract specific information from files | LLM Provider | No |
| `runAndExtract` | Execute commands with LLM analysis | LLM Provider | Yes |
| `askFollowUp` | Ask follow-up questions about previous commands | LLM Provider | Yes |
| `researchTopic` | Quick web research | LLM Provider + Exa.ai | No |
| `deepResearch` | Comprehensive research analysis | LLM Provider + Exa.ai | No |

## Tool Details

### 1. askAboutFile

Extract specific information from files without loading entire contents into chat context.

#### Input Schema
```json
{
  "type": "object",
  "properties": {
    "filePath": {
      "type": "string",
      "description": "Full absolute path to the file to analyze (e.g., \"C:\\Users\\username\\project\\src\\file.ts\", \"/home/user/project/docs/README.md\")"
    },
    "question": {
      "type": "string", 
      "description": "Specific question about the file content (e.g., \"Does this file export a validateEmail function?\", \"What is the main purpose described in this spec?\", \"Extract all import statements\")"
    }
  },
  "required": ["filePath", "question"]
}
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `filePath` | string | Yes | Full absolute path to the file to analyze |
| `question` | string | Yes | Specific question about the file content |

#### Security Validation
- File path must be within configured `CONTEXT_OPT_ALLOWED_PATHS`
- File size must not exceed `CONTEXT_OPT_MAX_FILE_SIZE` (default: 1MB)
- File must exist and be readable

#### Example Usage
```json
{
  "name": "askAboutFile",
  "arguments": {
    "filePath": "/Users/username/project/src/components/Header.tsx",
    "question": "Does this file export a validateEmail function?"
  }
}
```

#### Response Format
```json
{
  "content": [{
    "type": "text",
    "text": "No, this file does not export a validateEmail function. The file exports a Header component and contains imports for React and styled-components."
  }]
}
```

#### Common Use Cases
- Check if files contain specific functions or classes
- Extract import/export statements
- Understand file purpose without reading full content
- Validate API signatures
- Extract configuration values

### 2. runAndExtract

Execute terminal commands and extract relevant information using LLM analysis.

#### Input Schema
```json
{
  "type": "object",
  "properties": {
    "terminalCommand": {
      "type": "string",
      "description": "Shell command to execute. Must be non-interactive (no user input prompts). Navigation commands (cd, pushd, etc.) are not allowed - use workingDirectory instead."
    },
    "extractionPrompt": {
      "type": "string",
      "description": "Natural language description of what information to extract from the command output. Examples: \"Show me the raw output\", \"Summarize the results\", \"Extract all error messages\", \"Find version numbers\", \"List all files\", \"Did the command succeed?\", \"Are there any warnings?\""
    },
    "workingDirectory": {
      "type": "string",
      "description": "Full absolute path where command should be executed (e.g., \"C:\\Users\\username\\project\", \"/home/user/project\"). Must be within configured security boundaries."
    }
  },
  "required": ["terminalCommand", "extractionPrompt", "workingDirectory"]
}
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `terminalCommand` | string | Yes | Shell command to execute (non-interactive) |
| `extractionPrompt` | string | Yes | Description of what information to extract |
| `workingDirectory` | string | Yes | Full absolute path where command should run |

#### Security Validation
- Working directory must be within `CONTEXT_OPT_ALLOWED_PATHS`
- Command must pass security validation (no dangerous commands)
- No interactive commands allowed
- No directory navigation commands (use `workingDirectory` instead)
- Command timeout: `CONTEXT_OPT_COMMAND_TIMEOUT` (default: 30s)

#### Blocked Commands
- Interactive commands: `vi`, `nano`, `emacs`, `less`, `more`
- Navigation commands: `cd`, `pushd`, `popd`
- Dangerous system commands: `rm -rf`, `sudo rm`, `format`, `del /s`
- Network tools requiring interaction: `ssh`, `ftp`, `telnet`

#### Example Usage
```json
{
  "name": "runAndExtract",
  "arguments": {
    "terminalCommand": "npm list --depth=0",
    "extractionPrompt": "Summarize the installed packages and highlight any security warnings",
    "workingDirectory": "/Users/username/project"
  }
}
```

#### Response Format
```json
{
  "content": [{
    "type": "text", 
    "text": "**Package Summary:**\n- 15 packages installed\n- Notable packages: express@4.18.2, lodash@4.17.21\n- **⚠️ Security Warning**: lodash has known vulnerabilities, consider updating\n- All other packages appear up-to-date"
  }]
}
```

#### Session Management
The tool automatically saves session data for follow-up questions:
- Command executed
- Command output (raw)
- Extraction prompt
- Extracted information
- Working directory
- Timestamp

#### Common Use Cases
- Analyze npm/yarn package installations
- Extract errors from build outputs
- Summarize test results
- Check system status and versions
- Analyze log files
- Monitor resource usage

### 3. askFollowUp

Ask follow-up questions about the previous terminal command execution without re-running the command.

#### Input Schema
```json
{
  "type": "object",
  "properties": {
    "question": {
      "type": "string",
      "description": "Follow-up question about the previous terminal command execution and its output"
    }
  },
  "required": ["question"]
}
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `question` | string | Yes | Follow-up question about previous terminal execution |

#### Prerequisites
- Must have an active session from a previous `runAndExtract` call
- Session must not have expired (`CONTEXT_OPT_SESSION_TIMEOUT`, default: 30 minutes)

#### Example Usage
```json
{
  "name": "askFollowUp", 
  "arguments": {
    "question": "Were there any security vulnerabilities mentioned in those packages?"
  }
}
```

#### Response Format
```json
{
  "content": [{
    "type": "text",
    "text": "Yes, based on the npm list output from the previous command, lodash@4.17.21 was flagged with potential security vulnerabilities. I recommend running 'npm audit' for detailed vulnerability information and 'npm audit fix' to attempt automatic fixes."
  }]
}
```

#### Session Context
The tool has access to complete context from the previous `runAndExtract` execution:
- Original command and working directory
- Full command output (not just the extracted summary)
- Original extraction prompt
- Timestamp and execution details

#### Common Use Cases
- Ask for more details about specific errors
- Request different analysis of the same output
- Clarify ambiguous results
- Ask for recommendations based on command results
- Drill down into specific parts of large outputs

### 4. researchTopic

Conduct quick, focused web research on software development topics using Exa.ai's research capabilities.

#### Input Schema
```json
{
  "type": "object",
  "properties": {
    "topic": {
      "type": "string",
      "description": "The research topic or problem you want to investigate. Be as detailed as possible about what you want to learn, any specific aspects to focus on, timeframes, geographical scope, or particular angles of interest."
    }
  },
  "required": ["topic"]
}
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `topic` | string | Yes | Research topic with specific details about what to learn |

#### Requirements
- Valid Exa.ai API key (`CONTEXT_OPT_EXA_KEY`)
- LLM provider configured for result processing

#### Example Usage
```json
{
  "name": "researchTopic",
  "arguments": {
    "topic": "How to implement JWT authentication in Node.js Express apps with refresh tokens"
  }
}
```

#### Response Format
```json
{
  "content": [{
    "type": "text",
    "text": "# JWT Authentication in Node.js Express\n\n## Overview\nJSON Web Tokens (JWT) provide a stateless authentication mechanism...\n\n## Implementation Steps\n1. Install required packages: jsonwebtoken, bcrypt\n2. Create JWT utilities for token generation and verification\n3. Implement refresh token rotation\n\n## Security Best Practices\n- Use secure token storage\n- Implement proper token expiration\n- Rotate refresh tokens\n\n## Code Examples\n[Provides practical implementation examples]\n\n## Sources\n- Auth0 JWT Best Practices Guide\n- Node.js Security Documentation\n- Express.js Authentication Patterns"
  }]
}
```

#### Research Focus
- Software development topics
- Current best practices and patterns
- Implementation guidance
- Security considerations
- Recent developments and trends

#### Common Use Cases
- Learn new technologies and frameworks
- Research implementation patterns
- Find security best practices
- Compare different approaches
- Get up-to-date information on evolving topics

### 5. deepResearch

Conduct comprehensive, in-depth research using Exa.ai's exhaustive analysis capabilities for critical decision-making and complex architectural planning.

#### Input Schema
```json
{
  "type": "object",
  "properties": {
    "topic": {
      "type": "string",
      "description": "The research topic or problem you want to investigate comprehensively. Be as detailed as possible about what you want to learn, including technical requirements, architectural considerations, performance needs, security concerns, or strategic implications you want analyzed in depth."
    }
  },
  "required": ["topic"]
}
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `topic` | string | Yes | Detailed research topic including requirements, considerations, and implications |

#### Requirements
- Valid Exa.ai API key (`CONTEXT_OPT_EXA_KEY`)
- LLM provider configured for result processing

#### Processing Method
This tool uses Exa.ai's deep research capabilities with task polling:
1. Submits comprehensive research request
2. Polls for completion (may take several minutes)
3. Processes and formats extensive results
4. Provides detailed analysis with multiple perspectives

#### Example Usage
```json
{
  "name": "deepResearch",
  "arguments": {
    "topic": "Compare microservices vs monolithic architecture for a fintech startup with 10-person team, considering scalability requirements for 100K users, security compliance (PCI DSS), development velocity, operational complexity, and 2-year growth projections"
  }
}
```

#### Response Format
```json
{
  "content": [{
    "type": "text",
    "text": "# Microservices vs Monolithic Architecture for Fintech Startup\n\n## Executive Summary\nFor a 10-person fintech team targeting 100K users with PCI DSS requirements, a monolithic approach is recommended initially...\n\n## Detailed Analysis\n\n### Scalability Considerations\n**Monolithic:**\n- Simpler horizontal scaling initially\n- Single deployment unit reduces complexity\n- Performance bottlenecks easier to identify\n\n**Microservices:**\n- Independent scaling of components\n- Higher operational overhead\n- Complex distributed system challenges\n\n### Security & Compliance (PCI DSS)\n**Monolithic:**\n- Smaller attack surface\n- Easier to secure single application\n- Simpler compliance auditing\n\n**Microservices:**\n- Network security complexity\n- Multiple service boundaries to secure\n- Distributed compliance challenges\n\n### Team & Development Considerations\n**For 10-person team:**\n- Monolithic enables faster feature development\n- Shared codebase improves knowledge transfer\n- Microservices may lead to team fragmentation\n\n### Growth Trajectory (2-year projections)\n**Year 1**: Monolithic advantages dominate\n**Year 2**: Consider microservices migration for specific domains\n\n## Recommendations\n1. Start with modular monolith\n2. Design with future microservices migration in mind\n3. Implement domain boundaries within monolith\n4. Plan migration strategy for Year 2\n\n## Sources & References\n[Extensive list of authoritative sources from fintech industry, architecture experts, and compliance guidelines]"
  }]
}
```

#### Use Cases
- Strategic technology decisions
- Architecture planning for complex systems
- Comprehensive market analysis
- Due diligence research
- Long-term technology roadmap planning
- Risk assessment and mitigation strategies

## Error Handling

### Common Error Responses

#### Configuration Errors
```json
{
  "content": [{
    "type": "text",
    "text": "❌ **Configuration Error**: CONTEXT_OPT_GEMINI_KEY environment variable is required when using gemini provider"
  }],
  "isError": true,
  "errorMessage": "API key not configured for provider: gemini"
}
```

#### Security Errors
```json
{
  "content": [{
    "type": "text", 
    "text": "❌ **Security Error**: Path validation failed: /forbidden/path is not within allowed base paths"
  }],
  "isError": true,
  "errorMessage": "Path outside allowed boundaries"
}
```

#### Tool Execution Errors
```json
{
  "content": [{
    "type": "text",
    "text": "❌ **Tool Error**: Command timed out after 30000ms"
  }],
  "isError": true,
  "errorMessage": "Command execution timeout"
}
```

### Error Recovery
- **Transient Errors**: Automatic retries for network-related failures
- **Configuration Errors**: Clear guidance on required environment variables
- **Security Errors**: Specific information about validation failures
- **Resource Errors**: Suggestions for adjusting limits or retrying

## Performance Characteristics

### Tool Performance

| Tool | Typical Response Time | Resource Usage | Notes |
|------|----------------------|----------------|--------|
| `askAboutFile` | 2-5 seconds | Low | Depends on file size and LLM provider |
| `runAndExtract` | 5-30 seconds | Medium | Depends on command execution time |
| `askFollowUp` | 1-3 seconds | Low | No command execution, just LLM processing |
| `researchTopic` | 10-30 seconds | Medium | Network-dependent, Exa.ai API calls |
| `deepResearch` | 2-10 minutes | Medium | Comprehensive research with task polling |

### Optimization Tips
- Use specific questions for `askAboutFile` to get faster, more relevant results
- Keep `runAndExtract` commands focused to reduce execution time
- Use `askFollowUp` for additional analysis rather than re-running commands
- Be specific in research topics to get more targeted results
- Use `researchTopic` for quick lookups, `deepResearch` for strategic decisions

## Security Considerations

### Path Security
- All file paths validated against `CONTEXT_OPT_ALLOWED_PATHS`
- Path traversal attacks prevented (`../` sequences blocked)
- Symbolic link resolution with security checks

### Command Security
- Dangerous commands blocked by security validator
- No interactive commands allowed
- Execution timeouts prevent resource abuse
- Working directory restrictions enforced

### API Key Security
- Keys never logged or included in responses
- Environment variable isolation
- Separate keys for different providers
- Key validation on startup

### Session Security
- Sessions stored in secure temporary directories
- Automatic session expiration
- No persistent sensitive data storage
- Session data includes only command metadata

## Integration Examples

### VS Code Integration
```json
{
  "servers": {
    "context-optimizer": {
      "type": "stdio",
      "command": "context-optimizer-mcp"
    }
  }
}
```

### Claude Desktop Integration
```json
{
  "mcpServers": {
    "context-optimizer": {
      "command": "context-optimizer-mcp"
    }
  }
}
```

### Environment Configuration
```bash
export CONTEXT_OPT_LLM_PROVIDER="gemini"
export CONTEXT_OPT_GEMINI_KEY="your-api-key"
export CONTEXT_OPT_EXA_KEY="your-exa-key"
export CONTEXT_OPT_ALLOWED_PATHS="/home/user/projects"
```

This comprehensive tools reference provides information needed to use the Context Optimizer MCP Server tools. For additional help, see the troubleshooting guide and usage documentation.
