# Contributing to Context Optimizer MCP Server

Thank you for your interest in contributing to the Context Optimizer MCP Server! This document provides guidelines for contributing to the project.

## How to Contribute

### Reporting Issues

Before creating an issue, please:

1. **Search existing issues** to avoid duplicates
2. **Use our issue templates** for bug reports and feature requests
3. **Provide detailed information** including:
   - Your environment (OS, Node.js version, VS Code version)
   - Steps to reproduce the issue
   - Expected vs actual behavior
   - Relevant logs or error messages

### Submitting Changes

1. **Fork the repository** and create a feature branch
2. **Follow our coding standards** (see below)
3. **Write or update tests** for your changes
4. **Update documentation** if needed
5. **Ensure all tests pass** with `npm test`
6. **Submit a pull request** with a clear description

## Development Setup

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Local Development

```bash
# Clone your fork
git clone https://github.com/your-username/context-optimizer-mcp-server.git
cd context-optimizer-mcp-server

# Install dependencies
npm install

# Set up environment variables
export CONTEXT_OPT_LLM_PROVIDER="gemini"
export CONTEXT_OPT_GEMINI_KEY="your-test-api-key"
export CONTEXT_OPT_ALLOWED_PATHS="/tmp/test-workspace"

# Build the project
npm run build

# Run tests
npm test

# Run in development mode
npm run dev
```

### Environment Variables for Testing

```bash
# Required for integration tests
export CONTEXT_OPT_LLM_PROVIDER="gemini"
export CONTEXT_OPT_GEMINI_KEY="your-test-key"
export CONTEXT_OPT_EXA_KEY="your-exa-test-key"
export CONTEXT_OPT_ALLOWED_PATHS="/tmp/test-workspace"

# Optional test settings
export CONTEXT_OPT_LOG_LEVEL="debug"
export CONTEXT_OPT_COMMAND_TIMEOUT="10000"
```

## Coding Standards

### TypeScript Guidelines

- Use strict TypeScript configuration
- Prefer interfaces over types for object shapes
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Follow existing code formatting

### Code Style

```typescript
// Good: Clear interface definition
interface ToolParameters {
  filePath: string;
  question: string;
}

// Good: Descriptive function name with error handling
async function analyzeFileContent(params: ToolParameters): Promise<ToolResponse> {
  try {
    // Implementation
  } catch (error) {
    return createErrorResponse(`Failed to analyze file: ${error.message}`);
  }
}

// Good: Environment variable with validation
const apiKey = process.env.CONTEXT_OPT_GEMINI_KEY;
if (!apiKey) {
  throw new Error('CONTEXT_OPT_GEMINI_KEY environment variable is required');
}
```

### Testing Guidelines

- Write unit tests for all new functionality
- Include integration tests for LLM interactions
- Mock external dependencies appropriately
- Test error conditions and edge cases
- Maintain or improve test coverage

```typescript
// Example test structure
describe('AskAboutFile Tool', () => {
  beforeEach(() => {
    // Setup test environment
  });

  it('should extract information from files', async () => {
    // Test implementation
  });

  it('should handle file not found errors', async () => {
    // Error handling test
  });
});
```

## Project Structure

```
src/
├── server.ts              # Main MCP server entry point
├── config/                # Configuration management
├── providers/             # LLM provider implementations
├── security/              # Security validation
├── session/               # Session management
├── tools/                 # MCP tool implementations
└── utils/                 # Utility functions

test/                      # Test files
├── *.test.ts             # Unit tests
├── *.integration.test.ts # Integration tests
└── setup.ts              # Test configuration

docs/                     # Documentation
```

## Feature Development

### Adding New Tools

1. **Create tool class** extending `BaseMCPTool`
2. **Implement required methods**: `execute()`, parameter schema
3. **Add comprehensive tests** including integration tests
4. **Register tool** in server.ts
5. **Update documentation** in README.md

Example tool structure:
```typescript
export class NewTool extends BaseMCPTool {
  name = 'newTool';
  description = 'Description of what the tool does';

  async execute(params: NewToolParams): Promise<MCPToolResponse> {
    // Implementation
  }

  toMCPTool(): Tool {
    return {
      name: this.name,
      description: this.description,
      inputSchema: {
        // JSON schema for parameters
      }
    };
  }
}
```

### Adding LLM Providers

1. **Implement provider interface** in `src/providers/`
2. **Add environment variable** for API key
3. **Update configuration schema** and validation
4. **Add provider to factory** in `src/providers/factory.ts`
5. **Write comprehensive tests** including API integration
6. **Document configuration** in `../reference/api-keys.md`
7. **Update architecture documentation** in `../architecture.md`

## Documentation

### Requirements

- Update README.md for new features
- Add/update API documentation in `../tools.md`
- Include code examples
- Update troubleshooting guides if needed
- Update architecture documentation for significant changes
- Follow existing documentation style

### Documentation Style

- Use clear, concise language
- Include code examples with explanations
- Provide platform-specific instructions when needed
- Keep examples up-to-date with current API

## Pull Request Process

### Before Submitting

- [ ] All tests pass (`npm test`)
- [ ] Code builds successfully (`npm run build`)
- [ ] Documentation updated
- [ ] Commit messages are descriptive
- [ ] Branch is up-to-date with main

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring
- [ ] Other: ___

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] All tests pass
- [ ] Manual testing completed

## Documentation
- [ ] README updated
- [ ] API documentation updated
- [ ] Comments added to code
```

### Review Process

1. **Automated checks** must pass (tests, build, linting)
2. **Code review** by maintainers
3. **Documentation review** for clarity and completeness
4. **Manual testing** of changes
5. **Approval** and merge

## Release Process

### Version Bumping

```bash
# Patch version (bug fixes)
npm run version:patch

# Minor version (new features)
npm run version:minor

# Major version (breaking changes)
npm run version:major
```

### Release Checklist

- [ ] All tests pass
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] Version bumped appropriately
- [ ] Package built and validated
- [ ] Release notes prepared

## Community Guidelines

### Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Maintain a professional environment

### Communication

- **Issues**: For bug reports and feature requests
- **Discussions**: For questions and general discussion
- **Pull Requests**: For code contributions
- **Email**: For security issues only

## Getting Help

- **Documentation**: Check README.md and other docs
- **Issues**: Search existing issues or create new ones
- **Community**: Participate in project discussions
- **Troubleshooting**: Review TROUBLESHOOTING.md

## Recognition

Contributors will be recognized in:
- GitHub contributors list
- Release notes for significant contributions
- Project documentation (when appropriate)

Thank you for contributing to the Context Optimizer MCP Server!
