# Edit File Tool Feature

## Feature Type

MCP Tool

## Purpose and Scope

The Edit File tool provides functionality to make line-based edits to a text file, replacing exact line sequences with new content. It ensures that file access is restricted to allowed directories for security.

This tool is responsible for:
- Validating that the requested file path is within allowed directories
- Performing line-based edits on text files
- Generating git-style diffs showing the changes made
- Supporting dry run mode to preview changes without writing to the file
- Handling error cases gracefully

## Requirements

### Functional Requirements

- Make precise text replacements in files
- Support multiple edits in a single operation
- Generate git-style diffs to show changes
- Support dry run mode for previewing changes
- Only allow access to files within designated safe directories
- Validate file paths to prevent directory traversal attacks
- Provide clear error messages for access violations or edit failures

### Non-Functional Requirements

- Security: Strict path validation
- Data integrity: Ensure accurate text replacement
- Error handling: Clear, user-friendly error messages
- Usability: Informative diffs showing changes

## Technical Design

### Data Structures

- `EditFileInput`: Type definition for the tool's input parameters
- `EditOperation`: Type for a single edit operation (old text to new text)
- `EditFileInputSchema`: Zod schema for validating input parameters

### Implementation Details

The tool uses:
- Node.js fs/promises API for file operations
- diff library for generating git-style diffs
- Custom algorithms for line-by-line text replacement

## Dependencies

### External Dependencies

- `fs/promises`: For file system operations
- `path`: For path manipulation and validation
- `diff`: For generating git-style diffs

### Feature Dependencies

- `tool-fs-helpers/validatePath`: For validating file paths against allowed directories
- `tool-fs-helpers/internal/fileEditor`: For file editing and diff generation utilities

## Testing Strategy

### Unit Testing

- Test successful edits with valid paths and edit operations
- Test dry run mode to verify diff generation without file changes
- Test error handling for invalid paths
- Test error handling for edit operations with no matching text
- Test multiple edits in a single operation

### Integration Testing

- Test with various file types and sizes
- Test access control with different directory configurations
- Test complex edit scenarios with multiple overlapping edits
