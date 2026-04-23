# List Allowed Directories Tool Feature

## Feature Type

MCP Tool

## Purpose and Scope

The List Allowed Directories tool provides functionality to retrieve a list of directories that the server is allowed to access. This is useful for understanding which directories are available before trying to access files.

This tool is responsible for:
- Retrieving the list of allowed directories
- Formatting the list in a readable format
- Returning the list in a structured format

## Requirements

### Functional Requirements

- List all directories that the server is allowed to access
- Format the output in a user-friendly way

### Non-Functional Requirements

- Performance: Immediate response without file system access
- Usability: Clear presentation of allowed directories

## Technical Design

### Data Structures

- Empty input schema as this tool doesn't require any parameters

### Implementation Details

The tool simply returns the list of directories that have been configured as allowed for the filesystem tools.

## Dependencies

### Feature Dependencies

- `tool-fs-helpers/getAllowedDirectories`: For retrieving the list of allowed directories

## Testing Strategy

### Unit Testing

- Test that the correct list of allowed directories is returned
- Test formatting of the output

### Integration Testing

- Test that the tool correctly reflects changes to the allowed directories configuration
