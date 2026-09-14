# Architecture Overview

The Context Optimizer MCP Server uses a modular architecture that separates concerns across multiple layers: configuration management, security validation, tool execution, LLM integration, and session management.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    AI Assistant                            │
│              (VS Code, Claude Desktop, etc.)               │
└─────────────────────┬───────────────────────────────────────┘
                      │ JSON-RPC over stdio
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                  MCP Server                                │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Server Layer                           │   │
│  │  - Request/Response handling                        │   │
│  │  - Tool registration & discovery                    │   │
│  │  - Error handling & logging                         │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Tool Layer                             │   │
│  │  - askAboutFile    - runAndExtract                  │   │
│  │  - askFollowUp     - researchTopic                  │   │
│  │  - deepResearch                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │            Security Layer                           │   │
│  │  - Path validation                                  │   │
│  │  - Command filtering                                │   │
│  │  - File size limits                                 │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │           Provider Layer                            │   │
│  │  - Gemini Provider   - Claude Provider              │   │
│  │  - OpenAI Provider   - Factory Pattern              │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │          Configuration Layer                        │   │
│  │  - Environment variable loading                     │   │
│  │  - Schema validation                                │   │
│  │  - Security settings                                │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│              External Services                              │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────────┐    │
│  │    Gemini    │ │    Claude    │ │     Exa.ai       │    │
│  │   API        │ │     API      │ │   Research API   │    │
│  └──────────────┘ └──────────────┘ └──────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

## Core Components

### 1. Server Layer (`src/server.ts`)

The main entry point that implements the MCP protocol:

- **ContextOptimizerMCPServer**: Main server class that manages tools and handles MCP requests
- **Tool Registration**: Dynamic discovery and registration of available tools
- **Request Handling**: JSON-RPC request processing for `listTools` and `callTool`
- **Error Handling**: Centralized error management with proper MCP response formatting
- **Graceful Shutdown**: Signal handling for clean server termination

**Key Features:**
- Stdio transport for MCP communication
- Automatic tool discovery and registration
- Standardized error responses
- Logging integration

### 2. Tool Layer (`src/tools/`)

Implements the five core MCP tools using a common base class:

#### Base Tool (`src/tools/base.ts`)
- **BaseMCPTool**: Abstract base class defining common tool interface
- **Response Management**: Standardized success/error response creation
- **Validation**: Common parameter validation utilities
- **Logging**: Operation logging with configurable levels
- **MCP Integration**: Conversion to MCP SDK tool format

#### Tool Implementations
- **AskAboutFileTool**: File analysis using LLM processing
- **RunAndExtractTool**: Terminal command execution with output analysis
- **AskFollowUpTool**: Session-based follow-up questions
- **ResearchTopicTool**: Quick web research using Exa.ai
- **DeepResearchTool**: Comprehensive research with task polling

### 3. Security Layer (`src/security/`)

Implements security controls to prevent unauthorized access:

#### Path Validator (`src/security/pathValidator.ts`)
- **Allowed Paths**: Validates file/directory access against configured allowed paths
- **Path Traversal Protection**: Prevents `../` attacks and absolute path escapes
- **Case Sensitivity**: Handles Windows/Unix path differences
- **Validation Logic**: Ensures all file operations stay within security boundaries

#### Command Validator (`src/security/commandValidator.ts`)
- **Command Filtering**: Blocks dangerous system commands
- **Interactive Command Prevention**: Prevents commands requiring user input
- **Navigation Blocking**: Blocks directory navigation commands
- **Security Patterns**: Uses regex patterns to identify prohibited commands

### 4. Provider Layer (`src/providers/`)

Abstracts LLM provider implementations using factory pattern:

#### Base Provider (`src/providers/base.ts`)
- **BaseLLMProvider**: Abstract class defining provider interface
- **Response Formatting**: Standardized LLM response structure
- **Error Handling**: Provider-specific error management

#### Provider Implementations
- **GeminiProvider**: Google Gemini API integration
- **ClaudeProvider**: Anthropic Claude API integration  
- **OpenAIProvider**: OpenAI API integration

#### Factory (`src/providers/factory.ts`)
- **LLMProviderFactory**: Singleton factory for provider creation
- **Provider Selection**: Dynamic provider instantiation based on configuration
- **Interface Abstraction**: Unified interface for all providers

### 5. Configuration Layer (`src/config/`)

Manages all server configuration through environment variables:

#### Configuration Manager (`src/config/manager.ts`)
- **Environment Loading**: Loads all `CONTEXT_OPT_*` environment variables
- **Validation**: Validates required configuration and API keys
- **Singleton Pattern**: Provides global configuration access
- **Path Normalization**: Handles cross-platform path formatting

#### Configuration Schema (`src/config/schema.ts`)
- **Type Definitions**: TypeScript interfaces for configuration structure
- **Security Settings**: File size limits, timeouts, allowed paths
- **LLM Configuration**: Provider selection and API keys
- **Server Settings**: Logging levels and session storage

### 6. Session Management (`src/session/`)

Handles persistent session data for follow-up questions:

#### Session Manager (`src/session/manager.ts`)
- **File-based Storage**: JSON session files in temporary directory
- **Session Expiration**: Automatic cleanup of expired sessions
- **Terminal Session Data**: Stores command history, output, and extraction results
- **Error Resilience**: Graceful handling of missing or corrupted session files

**Session Data Structure:**
```typescript
interface TerminalSessionData {
  command: string;           // Original command executed
  output: string;           // Command output
  exitCode: number;         // Command exit status
  extractionPrompt: string; // Original extraction request
  extractedInfo: string;    // LLM-processed information
  timestamp: string;        // Session creation time
  workingDirectory: string; // Command execution directory
}
```

### 7. Utility Layer (`src/utils/`)

Provides common utilities used across the system:

#### Logger (`src/utils/logger.ts`)
- **Stderr Logging**: Logs to stderr to avoid MCP protocol interference
- **Level-based Logging**: Error, warn, info, debug levels
- **Structured Output**: Consistent log formatting
- **Configuration Integration**: Respects configured log levels

#### Error Handling (`src/utils/errorHandling.ts`)
- **Error Classification**: Categorizes different error types
- **Response Formatting**: Converts errors to MCP-compatible responses
- **Stack Trace Management**: Controlled error detail exposure

#### File Utilities (`src/utils/fileUtils.ts`)
- **File Reading**: Safe file access with size limits
- **Path Resolution**: Cross-platform path handling
- **Permission Checking**: File access validation

#### Terminal Utilities (`src/utils/terminalUtils.ts`)
- **Command Execution**: Safe terminal command execution
- **Output Processing**: Command output handling and formatting
- **Timeout Management**: Command execution timeouts

## Design Patterns

### 1. Factory Pattern
Used for LLM provider creation, allowing dynamic provider selection without tight coupling.

### 2. Singleton Pattern
Configuration manager ensures single source of truth for configuration across the application.

### 3. Template Method Pattern
Base tool class provides common functionality while allowing specific tool implementations.

### 4. Strategy Pattern
Different LLM providers implement the same interface, allowing runtime provider switching.

### 5. Builder Pattern
Response builders create consistent MCP-formatted responses.

## Data Flow

### Tool Execution Flow
1. **Request Reception**: MCP server receives tool call request
2. **Tool Lookup**: Server finds registered tool by name
3. **Parameter Validation**: Tool validates input parameters
4. **Security Check**: Security layer validates paths/commands
5. **Execution**: Tool performs its specific operation
6. **LLM Processing**: (If applicable) Provider processes content
7. **Response Creation**: Tool creates MCP-formatted response
8. **Response Return**: Server returns response to client

### Configuration Loading Flow
1. **Environment Scan**: Manager scans for `CONTEXT_OPT_*` variables
2. **Validation**: Required variables checked, optional ones defaulted
3. **Security Setup**: Allowed paths normalized and validated
4. **Provider Validation**: LLM provider and API keys verified
5. **Configuration Cache**: Validated configuration cached for runtime use

### Session Management Flow
1. **Session Check**: Tool checks for existing session data
2. **Session Load**: (If exists) Load previous terminal session data
3. **Expiration Check**: Validate session hasn't expired
4. **Session Update**: Save new session data after tool execution
5. **Cleanup**: Remove expired sessions periodically

## Security Architecture

### Defense in Depth
1. **Environment Variable Isolation**: No config files that could be compromised
2. **Path Validation**: Multiple layers of path security checking
3. **Command Filtering**: Proactive blocking of dangerous commands
4. **API Key Protection**: Keys never logged or exposed in responses
5. **Session Isolation**: Sessions stored in secure temporary directories
6. **Resource Limits**: File size and execution timeouts prevent abuse

### Threat Mitigation
- **Path Traversal**: Blocked by path validator
- **Command Injection**: Prevented by command validator
- **Resource Exhaustion**: Limited by timeouts and file size limits
- **Information Disclosure**: API keys masked in logs
- **Session Hijacking**: Sessions expire automatically

## Extension Points

### Adding New Tools
1. Extend `BaseMCPTool` class
2. Implement required methods (`execute`, `toMCPTool`)
3. Define input schema and validation
4. Register in server tool setup
5. Add comprehensive tests

### Adding New LLM Providers
1. Extend `BaseLLMProvider` class
2. Implement provider-specific API integration
3. Add to provider factory
4. Add environment variable configuration
5. Update configuration schema

### Adding New Security Validators
1. Create validator class with validation methods
2. Integrate into tool execution pipeline
3. Add configuration options if needed
4. Add comprehensive security tests

## Performance Considerations

### Caching Strategy
- **Provider Instances**: Singleton pattern prevents provider recreation
- **Configuration**: Loaded once at startup and cached
- **Session Data**: File-based persistence for follow-up questions

### Resource Management
- **File Size Limits**: Prevent memory exhaustion from large files
- **Command Timeouts**: Prevent hanging processes
- **Session Cleanup**: Automatic cleanup of expired sessions
- **Lazy Loading**: Tools and providers instantiated only when needed

### Scalability
- **Stateless Design**: Each tool execution is independent
- **Memory Efficient**: Streaming file reads for large files
- **Concurrent Safe**: Thread-safe session management
- **Resource Limits**: Configurable limits prevent resource abuse

## Error Handling Strategy

### Error Categories
1. **Configuration Errors**: Invalid environment variables
2. **Security Errors**: Path/command validation failures
3. **Tool Execution Errors**: Tool-specific failures
4. **LLM Provider Errors**: API communication failures
5. **System Errors**: File system or network issues

### Error Response Format
All errors follow MCP standard format:
```typescript
{
  content: [{
    type: 'text',
    text: '❌ **Error Category**: Specific error message'
  }],
  isError: true,
  errorMessage: 'Machine-readable error message'
}
```

### Recovery Mechanisms
- **Graceful Degradation**: Tools continue working even if optional features fail
- **Retry Logic**: Automatic retries for transient failures
- **Fallback Behavior**: Alternative execution paths when primary methods fail
- **Error Logging**: Comprehensive error logging for debugging

This architecture provides a structured, secure, and extensible foundation for the Context Optimizer MCP Server while maintaining separation of concerns and following established design patterns.
