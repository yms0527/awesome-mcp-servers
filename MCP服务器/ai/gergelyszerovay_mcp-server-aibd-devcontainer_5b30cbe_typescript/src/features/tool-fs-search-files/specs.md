# Search Files Tool Feature

## Feature Type

MCP Tool

## Purpose and Scope

The Search Files tool provides functionality to recursively search for files and directories matching a pattern. It ensures that file access is restricted to allowed directories for security.

This tool is responsible for:
- Validating that the requested search path is within allowed directories
- Recursively searching for files and directories matching a pattern
- Handling exclude patterns to filter results
- Handling error cases gracefully
- Returning the search results in a structured format

## Requirements

### Functional Requirements

- Recursively search for files and directories matching a pattern
- Support case-insensitive partial name matching
- Support exclusion patterns to filter results
- Only allow access within designated safe directories
- Validate paths to prevent directory traversal attacks
- Provide clear error messages for access violations or permission issues

### Non-Functional Requirements

- Security: Strict path validation
- Performance: Efficient directory traversal for large directory structures
- Error handling: Clear, user-friendly error messages
- Skip directories that can't be accessed instead of failing completely

## Technical Design

### Data Structures

- `SearchFilesInput`: Type definition for the tool's input parameters
- `SearchFilesInputSchema`: Zod schema for validating input parameters

### Implementation Details

The tool uses:
- Node.js fs/promises API for file system operations
- minimatch for glob pattern matching
- Custom recursive traversal algorithm with proper error handling

## Dependencies

### External Dependencies

- `fs/promises`: For file system operations
- `path`: For path manipulation and validation
- `minimatch`: For glob pattern matching

### Feature Dependencies

- `tool-fs-helpers/validatePath`: For validating file paths against allowed directories
- `tool-fs-helpers/searchFileSystem`: For the search implementation

## Testing Strategy

### Unit Testing

- Test successful search with various patterns
- Test search with exclude patterns
- Test error handling for invalid paths
- Test performance with large directory structures

### Integration Testing

- Test with various directory structures
- Test access control with different directory configurations
- Test with mixed valid and inaccessible paths
