# Memory Bank MCP - Documentation

## Overview

This directory contains the documentation for Memory Bank MCP, an MCP (Model Context Protocol) server that provides tools and resources for managing memory banks. Memory Bank MCP allows AI assistants to store and retrieve information across sessions.

## Documentation Structure

The documentation is organized into the following categories:

### 1. Getting Started

- [**README.md**](../README.md) - Main project README with overview and quick start
- [**npx-usage.md**](./npx-usage.md) - Guide for using Memory Bank MCP with npx
- [**build-with-bun.md**](./build-with-bun.md) - Guide for building the project with Bun

### 2. Core Concepts

- [**memory-bank-status-prefix.md**](./memory-bank-status-prefix.md) - Documentation on the Memory Bank status prefix system
- [**usage-modes.md**](./usage-modes.md) - Detailed descriptions of each mode and usage examples
- [**file-naming-convention.md**](./file-naming-convention.md) - Documentation on file naming conventions (kebab-case)

### 3. Integration Guides

- [**cursor-integration.md**](./cursor-integration.md) - Detailed guide for integrating with Cursor code editor
- [**cline-integration.md**](./cline-integration.md) - Guide for integrating with clinerules (includes auto-creation)
- [**roo-code-integration.md**](./roo-code-integration.md) - Explanation of the relationship with Roo Code Memory Bank
- [**ai-assistant-integration.md**](./ai-assistant-integration.md) - Guide for integrating with AI assistants
- [**mcp-protocol-specification.md**](./mcp-protocol-specification.md) - Complete specification of the Memory Bank MCP protocol

### 4. Rule Formats and Examples

- [**rule-formats.md**](./rule-formats.md) - Documentation on supported file formats for rules
- [**rule-examples.md**](./rule-examples.md) - Complete examples of rule files in JSON, YAML, and TOML
- [**implementation-plan-rule-formats.md**](./implementation-plan-rule-formats.md) - Implementation plan for multi-format rule support

### 5. Testing and Development

- [**testing.md**](./testing.md) - Information about testing the project
- [**testing-guide.md**](./testing-guide.md) - Comprehensive guide for testing
- [**testing-clinerules.md**](./testing-clinerules.md) - Guide for testing clinerules integration
- [**integration-testing-guide.md**](./integration-testing-guide.md) - Step-by-step testing instructions for integration
- [**test-coverage.md**](./test-coverage.md) - Documentation on test coverage

### 6. Architecture and Design

- [**architecture-plan.md**](./architecture-plan.md) - Overall architecture plan
- [**modular-architecture-proposal.md**](./modular-architecture-proposal.md) - Proposal for modular architecture
- [**documentation-structure.md**](./documentation-structure.md) - Documentation on the structure of documentation
- [**logging-system.md**](./logging-system.md) - Documentation on the logging system

### 7. Migration and Updates

- [**migration-guide.md**](./migration-guide.md) - Guide for migrating between versions
- [**bun-migration.md**](./bun-migration.md) - Guide for migrating to Bun
- [**memory-bank-path-changes.md**](./memory-bank-path-changes.md) - Documentation on path handling changes
- [**file-naming-convention-update.md**](./file-naming-convention-update.md) - Update on file naming convention (camelCase to kebab-case)
- [**memory-bank-bug-fixes.md**](./memory-bank-bug-fixes.md) - Documentation on bug fixes
- [**memory-bank-status-fix.md**](./memory-bank-status-fix.md) - Documentation on Memory Bank status detection fix
- [**code-improvements.md**](./code-improvements.md) - Documentation on code improvements

## Supported Modes

Memory Bank MCP supports the following operation modes:

1. **Architect Mode** - For high-level planning and system design
2. **Code Mode** - For implementation and development
3. **Ask Mode** - For providing information and explanations
4. **Debug Mode** - For problem-solving and troubleshooting
5. **Test Mode** - For test-driven development and quality assurance

Each mode is configured through rule files (`.clinerules-[mode]`) that can be written in JSON, YAML, or TOML.

## Supported File Formats

Memory Bank MCP supports the following formats for rule files:

- **JSON** (JavaScript Object Notation)
- **YAML** (YAML Ain't Markup Language)
- **TOML** (Tom's Obvious, Minimal Language)

## AI Assistant Integration

Memory Bank MCP can be integrated with any AI assistant that supports the Model Context Protocol, including:

- Claude (via Anthropic's MCP implementation)
- GPT models (via OpenAI's MCP implementation)
- Custom AI assistants built on MCP-compatible frameworks

## Supported Editors

Memory Bank MCP can be integrated with the following code editors:

- **Cursor** - AI-powered code editor built on VS Code
- **VS Code** - Through custom extensions that support MCP
- **Any editor** - Through command-line interface

## Inspiration

Memory Bank MCP was inspired by [Roo Code Memory Bank](https://github.com/GreatScottyMac/roo-code-memory-bank) developed by Scott MacKenzie.

---

_Last updated: March 8, 2024_

_Memory Bank MCP - Maintaining context and memory across sessions_
