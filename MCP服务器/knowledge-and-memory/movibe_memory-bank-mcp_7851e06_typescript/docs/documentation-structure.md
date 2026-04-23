# Documentation Structure

## Overview

This document describes the documentation structure for the Memory Bank MCP project.

## Documentation Directory

All documentation for the Memory Bank MCP project is located in the `/docs` directory at the root of the project. This directory contains comprehensive documentation organized into several categories.

## Documentation Categories

### Core Documentation

Core documentation provides essential information about the project's development, building, and testing:

- **build-with-bun.md** - Guide for building the project with Bun
- **testing.md** - Information about testing the project
- **clinerules-integration.md** - Guide for integrating with clinerules
- **testing-clinerules.md** - Guide for testing clinerules integration

### Usage Documentation

Usage documentation provides information about how to use the Memory Bank MCP features:

- **usage-modes.md** - Detailed descriptions of each mode and usage examples
- **rule-examples.md** - Complete examples of rule files in JSON, YAML, and TOML
- **rule-formats.md** - Documentation on supported file formats for rules
- **implementation-plan-rule-formats.md** - Implementation plan for multi-format rule support

### Integration Documentation

Integration documentation provides information about integrating Memory Bank MCP with other systems:

- **roo-code-integration.md** - Explanation of the relationship with Roo Code Memory Bank
- **ai-assistant-integration.md** - Guide for integrating with AI assistants
- **integration-testing-guide.md** - Step-by-step testing instructions for integration
- **mcp-protocol-specification.md** - Complete specification of the Memory Bank MCP protocol

## Documentation Index

The `/docs/README.md` file serves as an index for all documentation, providing links to each document and a brief description of its contents. This makes it easy to find the specific documentation needed.

## Main README.md

The main `README.md` file at the root of the project includes a "Documentation" section that points to the `/docs` directory and highlights key documentation files:

```markdown
## Documentation

For detailed documentation, see the [docs](docs) directory, which includes:

- [Usage Modes](docs/usage-modes.md)
- [Rule Formats](docs/rule-formats.md)
- [AI Assistant Integration](docs/ai-assistant-integration.md)
- [Integration Testing Guide](docs/integration-testing-guide.md)
- [MCP Protocol Specification](docs/mcp-protocol-specification.md)
```

## Documentation Standards

All documentation follows these standards:

1. **Markdown Format**: All documentation is written in Markdown format for easy reading and editing.
2. **English Language**: All documentation is written in English.
3. **Comprehensive Headers**: Each document includes clear headers and subheaders for easy navigation.
4. **Code Examples**: Where appropriate, documentation includes code examples to illustrate concepts.
5. **Links**: Documentation includes links to related documents and external resources.
6. **Consistent Formatting**: Documentation follows consistent formatting for readability.

## Documentation Maintenance

When updating the project, follow these guidelines for documentation maintenance:

1. **Update Relevant Documents**: When adding or changing features, update the relevant documentation.
2. **Add New Documents**: When adding new major features, create new documentation files as needed.
3. **Update Index**: When adding new documents, update the `/docs/README.md` index.
4. **Update Main README**: When adding significant new documentation, consider updating the main `README.md` to reference it.
5. **Review Existing Documentation**: Periodically review existing documentation for accuracy and completeness.

## Documentation History

- **March 2025**: Consolidated all documentation into a single `/docs` directory
- **March 2025**: Created comprehensive documentation for AI assistant integration
- **March 2025**: Added documentation for multi-format rule support
- **March 2025**: Created initial documentation structure