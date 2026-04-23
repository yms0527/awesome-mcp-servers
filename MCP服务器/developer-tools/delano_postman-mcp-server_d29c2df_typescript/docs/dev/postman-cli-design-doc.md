# Postman API & CLI MCP Server Design Document

## 1. Overview

This document outlines the design for integrating Postman CLI capabilities into the existing Postman API MCP server. The design focuses on providing a simple and efficient interface to the official Postman CLI tool while leveraging the existing API infrastructure.

## 2. System Architecture

### 2.1 Core Components

```
postman-api-server/
├── src/
│   ├── index.ts                # Entry point
│   ├── server.ts               # Main server implementation
│   ├── types.ts                # Shared type definitions
│   ├── tools/                  # API operation tools
│   │   ├── api/                # API-specific operations
│   │   │   ├── collections.ts  # Collection operations
│   │   │   ├── environments.ts # Environment operations
│   │   │   ├── users.ts        # User management
│   │   │   └── workspaces.ts   # Workspace operations
│   │   └── cli/                # CLI operations
│   │       └── index.ts        # CLI tool implementations
```

### 2.2 Key Design Decisions

1. **Direct CLI Integration**
   - Maps directly to official Postman CLI commands
   - Uses native CLI functionality for core operations
   - Leverages built-in reporting capabilities

2. **Pattern Usage**
   - Tool Handler Pattern for consistent interface
   - Command Pattern for CLI operations
   - Error Handler Pattern for consistent error management

3. **Simplicity First**
   - Minimal custom logic
   - Direct command mapping
   - Native CLI behavior preservation

## 3. Core Functionality

### 3.1 CLI Tools

The CLI tools provide direct access to core Postman CLI capabilities:

```typescript
class PostmanCLITools implements ToolHandler {
  getToolDefinitions(): ToolDefinition[] {
    return [
      {
        name: 'run_collection',
        description: 'Run a Postman collection with configurable reporting options',
        inputSchema: {
          type: 'object',
          properties: {
            collection: {
              type: 'string',
              description: 'Collection ID'
            },
            environment: {
              type: 'string',
              description: 'Optional environment ID'
            },
            apiKey: {
              type: 'string',
              description: 'Postman API key'
            },
            // Reporter configuration
            reporters: {
              type: 'array',
              items: {
                type: 'string',
                enum: ['cli', 'json', 'junit', 'html']
              },
              description: 'Report formats to generate (default: cli)'
            },
            reporterOptions: {
              type: 'object',
              properties: {
                // CLI reporter options
                cliSilent: { type: 'boolean' },
                cliShowTimestamps: { type: 'boolean' },
                cliNoSummary: { type: 'boolean' },
                cliNoFailures: { type: 'boolean' },
                cliNoAssertions: { type: 'boolean' },
                cliNoSuccessAssertions: { type: 'boolean' },
                cliNoConsole: { type: 'boolean' },
                cliNoBanner: { type: 'boolean' },

                // JSON/HTML reporter options
                exportPath: { type: 'string' },
                omitRequestBodies: { type: 'boolean' },
                omitResponseBodies: { type: 'boolean' },
                omitHeaders: { type: 'boolean' },
                omitAllHeadersAndBody: { type: 'boolean' },
                jsonStructure: {
                  type: 'string',
                  enum: ['default', 'newman']
                }
              }
            },
            // Run configuration
            iterationCount: {
              type: 'number',
              description: 'Number of iterations to run'
            },
            folderNames: {
              type: 'array',
              items: { type: 'string' },
              description: 'Specific folders to run'
            },
            // CI/CD configuration
            ciProvider: {
              type: 'string',
              enum: ['github', 'gitlab', 'jenkins', 'azure', 'circleci'],
              description: 'CI/CD provider for configuration'
            },
            ciOptions: {
              type: 'object',
              properties: {
                workingDirectory: { type: 'string' },
                artifactPath: { type: 'string' },
                environmentVariables: {
                  type: 'object',
                  additionalProperties: { type: 'string' }
                }
              }
            },
            // Advanced options
            bail: {
              type: 'boolean',
              description: 'Stop on first test failure'
            },
            delayRequest: {
              type: 'number',
              description: 'Delay between requests in ms'
            },
            timeoutRequest: {
              type: 'number',
              description: 'Request timeout in ms'
            }
          },
          required: ['collection', 'apiKey']
        }
      },
      {
        name: 'api_lint',
        description: 'Run API governance checks (Enterprise only)',
        inputSchema: {
          type: 'object',
          properties: {
            api: {
              type: 'string',
              description: 'API ID or definition file'
            },
            apiKey: {
              type: 'string',
              description: 'Postman API key'
            },
            failSeverity: {
              type: 'string',
              enum: ['HINT', 'INFO', 'WARN', 'ERROR'],
              description: 'Minimum severity to trigger failure'
            }
          },
          required: ['api', 'apiKey']
        }
      }
    ];
  }
}
```

### 3.2 Command Execution

```typescript
class PostmanCLITools {
  private async executeCommand(command: string, args: string[]): Promise<string> {
    // Implementation using child_process
    // Handles command execution and output capture
    // Returns formatted result or throws error
  }

  private async runCollection(args: any): Promise<ToolCallResponse> {
    const cliArgs = ['collection', 'run'];

    // Collection ID
    cliArgs.push(args.collection);

    // Authentication
    cliArgs.push('--api-key', args.apiKey);

    // Environment
    if (args.environment) {
      cliArgs.push('-e', args.environment);
    }

    // Reporters
    if (args.reporters?.length) {
      cliArgs.push('-r', args.reporters.join(','));
    }

    // Reporter options
    if (args.reporterOptions) {
      const opts = args.reporterOptions;

      // CLI reporter options
      if (opts.cliSilent) cliArgs.push('--reporter-cli-silent');
      if (opts.cliShowTimestamps) cliArgs.push('--reporter-cli-show-timestamps');
      if (opts.cliNoSummary) cliArgs.push('--reporter-cli-no-summary');
      if (opts.cliNoFailures) cliArgs.push('--reporter-cli-no-failures');
      if (opts.cliNoAssertions) cliArgs.push('--reporter-cli-no-assertions');
      if (opts.cliNoSuccessAssertions) cliArgs.push('--reporter-cli-no-success-assertions');
      if (opts.cliNoConsole) cliArgs.push('--reporter-cli-no-console');
      if (opts.cliNoBanner) cliArgs.push('--reporter-cli-no-banner');

      // JSON/HTML reporter options
      if (opts.exportPath) {
        args.reporters.forEach(reporter => {
          if (reporter !== 'cli') {
            cliArgs.push(`--reporter-${reporter}-export`, opts.exportPath);
          }
        });
      }
      if (opts.omitRequestBodies) cliArgs.push('--reporter-omitRequestBodies');
      if (opts.omitResponseBodies) cliArgs.push('--reporter-omitResponseBodies');
      if (opts.omitHeaders) cliArgs.push('--reporter-omitHeaders');
      if (opts.omitAllHeadersAndBody) cliArgs.push('--reporter-omitAllHeadersAndBody');
      if (opts.jsonStructure === 'newman') cliArgs.push('--reporter-json-structure', 'newman');
    }

    // Run configuration
    if (args.iterationCount) {
      cliArgs.push('-n', args.iterationCount.toString());
    }
    if (args.folderNames?.length) {
      args.folderNames.forEach(name => {
        cliArgs.push('--folder', name);
      });
    }

    // CI/CD configuration
    if (args.ciProvider) {
      cliArgs.push('--ci-provider', args.ciProvider);

      if (args.ciOptions) {
        const opts = args.ciOptions;
        if (opts.workingDirectory) {
          cliArgs.push('--working-dir', opts.workingDirectory);
        }
        if (opts.artifactPath) {
          cliArgs.push('--artifact-path', opts.artifactPath);
        }
        if (opts.environmentVariables) {
          Object.entries(opts.environmentVariables).forEach(([key, value]) => {
            cliArgs.push('--env-var', `${key}=${value}`);
          });
        }
      }
    }

    // Advanced options
    if (args.bail) cliArgs.push('--bail');
    if (args.delayRequest) cliArgs.push('--delay-request', args.delayRequest.toString());
    if (args.timeoutRequest) cliArgs.push('--timeout-request', args.timeoutRequest.toString());

    try {
      const result = await this.executeCommand('postman', cliArgs);
      return {
        content: [{
          type: 'text',
          text: result
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `Collection run failed: ${error.message}`
        }],
        isError: true
      };
    }
  }
}
```

## 4. Error Handling

```typescript
class PostmanCLITools {
  private handleError(error: unknown): ToolCallResponse {
    // Standard error response format
    return {
      content: [{
        type: 'text',
        text: error instanceof Error ? error.message : 'Unknown error occurred'
      }],
      isError: true
    };
  }
}
```

## 5. Server Integration

```typescript
class PostmanAPIServer {
  constructor() {
    // Initialize CLI tools
    this.cliTools = new PostmanCLITools();

    // Add CLI tool definitions
    this.toolDefinitions = [
      ...this.workspaceTools.getToolDefinitions(),
      ...this.environmentTools.getToolDefinitions(),
      ...this.collectionTools.getToolDefinitions(),
      ...this.userTools.getToolDefinitions(),
      ...this.cliTools.getToolDefinitions()
    ];

    // Register CLI tool handlers
    this.toolHandlers.set('run_collection', this.cliTools);
    this.toolHandlers.set('api_lint', this.cliTools);
  }
}
```

## 6. Implementation Strategy

1. Phase 1: Core Collection Runner
   - Basic collection run functionality
   - Environment support
   - Authentication handling
   - Basic reporting (CLI output)

2. Phase 2: Advanced Reporting
   - Multiple reporter support
   - Reporter configuration options
   - Custom export paths
   - Report content filtering

3. Phase 3: CI/CD Integration
   - Provider-specific configurations
   - Environment variable handling
   - Artifact management
   - Pipeline integration

4. Phase 4: Testing & Documentation
   - Unit tests
   - Integration tests
   - Usage examples
   - CI/CD workflow examples

## 7. Key Features & Limitations

### Features
1. **Collection Running**
   - Local and CI/CD execution
   - Environment integration
   - Folder-specific runs
   - Multiple iterations

2. **Authentication**
   - API key based auth
   - Secure key handling
   - CI/CD variable support

3. **Reporting**
   - Multiple reporter support
   - CLI, JSON, JUnit, HTML formats
   - Customizable output paths
   - Content filtering options

4. **CI/CD Integration**
   - Multiple provider support
   - Environment variable handling
   - Artifact management
   - Pipeline configuration

### Limitations
1. **Authentication**
   - Interactive auth flows not supported
   - Pre-configured tokens required

2. **File Handling**
   - Local file references not supported
   - Files must be uploaded to Postman

3. **Real-time Feedback**
   - Limited to CLI reporter output
   - No streaming response support

## 8. Conclusion

This design provides a streamlined implementation of Postman CLI functionality through the MCP server, with focus on:

1. **Simplicity**
   - Direct CLI command mapping
   - Minimal custom logic
   - Clear interfaces

2. **Reliability**
   - Native CLI functionality
   - Built-in reporting
   - Standard error handling

3. **Usability**
   - Familiar command structure
   - Consistent interface
   - Clear documentation

4. **Maintainability**
   - Simple architecture
   - Easy to update
   - Well-defined boundaries

The implementation provides a clean and efficient interface to Postman CLI capabilities while maintaining simplicity and reliability. Key improvements in this revision include:

1. Comprehensive reporter configuration
2. Enhanced CI/CD integration
3. Better authentication handling
4. Clearer output management
5. More focused scope
