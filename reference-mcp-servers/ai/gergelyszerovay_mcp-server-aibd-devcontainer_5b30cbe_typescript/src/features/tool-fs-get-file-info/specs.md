# Get File Info Tool Feature

## Feature Type

MCP Tool

## Purpose and Scope

The Get File Info tool provides functionality to retrieve detailed metadata about a file or directory. It ensures that file access is restricted to allowed directories for security.

This tool is responsible for:
- Validating that the requested file path is within allowed directories
- Retrieving comprehensive file metadata
- Formatting the metadata in a readable format
- Handling error cases gracefully
- Returning the file information in a structured format

## Requirements

### Functional Requirements

- Retrieve detailed metadata about files and directories
- Include size, creation time, last modified time, permissions, and type
- Only allow access within designated safe directories
- Validate paths to prevent directory traversal attacks
- Provide clear error messages for access violations or permission issues

### Non-Functional Requirements

- Security: Strict path validation
- Error handling: Clear, user-friendly error messages
- Readability: Well-formatted output for easy consumption

## Technical Design

### Data Structures

- `GetFileInfoInput`: Type definition for the tool's input parameters
- `GetFileInfoInputSchema`: Zod schema for validating input parameters
- `FileInfo`: Type for representing file metadata

### Implementation Details

The tool uses Node.js fs/promises API to get file statistics, with proper validation of file paths before access.

## Dependencies

### External Dependencies

- `fs/promises`: For file system operations
- `path`: For path manipulation and validation

### Feature Dependencies

- `tool-fs-helpers/validatePath`: For validating file paths against allowed directories
- `tool-fs-helpers/getFileStats`: For retrieving file statistics

## Testing Strategy

### Unit Testing

- Test successful information retrieval for files
- Test successful information retrieval for directories
- Test error handling for invalid paths
- Test error handling for permission issues

### Integration Testing

- Test with various file types and sizes
- Test with directories of different depths
- Test access control with different directory configurations
