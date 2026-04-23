# Contributing to arvo-mcp

Thank you for your interest in contributing to arvo-mcp! This document provides guidelines for contributing.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone.

## How to Contribute

### Reporting Bugs

1. Check existing [issues](https://github.com/arvo-health/arvo-mcp/issues) to avoid duplicates
2. Use the bug report template when creating a new issue
3. Include:
   - Node.js version
   - MCP client (Claude Desktop, Cursor, etc.)
   - Steps to reproduce
   - Expected vs actual behavior
   - Error messages or logs

### Suggesting Features

1. Check existing issues for similar suggestions
2. Use the feature request template
3. Explain the use case and expected behavior
4. Consider backwards compatibility

### Pull Requests

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes
4. Run tests: `npm test`
5. Run linting: `npm run lint`
6. Run type checking: `npm run typecheck`
7. Commit with conventional commits: `feat: add new feature`
8. Push and create a pull request

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/arvo-mcp.git
cd arvo-mcp

# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test

# Lint
npm run lint
```

## Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `chore:` Maintenance tasks
- `refactor:` Code refactoring
- `test:` Test additions/changes

## Testing

- Write tests for new functionality
- Ensure existing tests pass
- Use Vitest for testing

## Code Style

- TypeScript strict mode
- ESLint for linting
- Follow existing code patterns

## Questions?

- Open a [discussion](https://github.com/arvo-health/arvo-mcp/discussions)
- Email hello@arvo.guru

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
