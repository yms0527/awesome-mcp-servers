# Memory Bank Path Handling

## Overview

This document describes the path handling in the Memory Bank MCP system. The system supports both standardized and custom paths for Memory Bank initialization and operation.

## Current Path Handling

### 1. Flexible Memory Bank Location

- Memory Bank can be created in a directory named `memory-bank` at the root of the current project (default behavior).
- Custom paths are supported for Memory Bank initialization through the `path` parameter.
- The system can find Memory Banks in the current directory or in specified paths.

### 2. Path Resolution

- Relative paths are resolved relative to the current working directory.
- Absolute paths are used as-is.
- The system handles both path formats correctly.

## Implementation Details

### Path Resolution Logic

The system uses the following logic to resolve paths:

1. Check if the path is absolute
2. If not, convert it to an absolute path using `path.resolve()`
3. Use the resolved path for all operations

### Memory Bank Detection

The system uses the following methods to detect Memory Banks:

1. Check if the specified directory exists
2. Check if the directory contains the required markdown files
3. If both conditions are met, the directory is considered a valid Memory Bank

## Usage Examples

### Using Default Path

```bash
# Initialize a Memory Bank in the default location (./memory-bank)
memory-bank-mcp initialize_memory_bank path=./memory-bank
```

### Using Custom Path

```bash
# Initialize a Memory Bank in a custom location
memory-bank-mcp initialize_memory_bank path=/path/to/custom/memory-bank

# Set a custom Memory Bank path
memory-bank-mcp set_memory_bank_path path=/path/to/custom/memory-bank
```

## Best Practices

1. **Use Relative Paths**: When possible, use relative paths to make your configuration more portable.
2. **Be Consistent**: Use the same path format throughout your configuration.

---

_Last updated: March 8, 2024_
