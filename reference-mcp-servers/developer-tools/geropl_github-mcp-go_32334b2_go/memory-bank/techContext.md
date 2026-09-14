# Technical Context

## Technologies Used

### Core Libraries

1. **mcp-go**
   - Go implementation of the Model Context Protocol
   - Provides server framework for exposing tools, resources, and prompts
   - Handles protocol communication and message formatting

2. **go-github**
   - Go client for the GitHub API
   - Provides typed access to GitHub resources
   - Handles authentication and API rate limiting

3. **logrus**
   - Structured logging library for Go
   - Provides leveled logging and formatting options
   - Will be used for error handling and debugging

### Testing Libraries

1. **go-vcr**
   - Records HTTP interactions for testing
   - Allows for deterministic testing without live API calls
   - Supports table-driven tests with recorded cassettes
   - Sanitizes sensitive information in cassettes
   - Provides matching options for request/response pairs

2. **testify**
   - Testing toolkit for Go
   - Provides assertions and mocking capabilities
   - Used for unit and integration tests

3. **Golden Files**
   - Not a library but a testing pattern
   - Stores expected test results in JSON format
   - Updated with `-golden` flag when test behavior changes
   - Used for comparing actual results against expected results

## Development Environment

- Go 1.21 or later
- Git for version control
- GitHub API access via personal access token
- Testing flags:
  - `-record`: Records new HTTP interactions
  - `-golden`: Updates golden files with current test results

## API Dependencies

- GitHub API v3
- Authentication via personal access token
- Rate limiting considerations for GitHub API

## Configuration

- Environment variables for authentication
- Configuration for server name and version
- Optional logging configuration

## Documentation Approach

### Project Requirement Documents (PRDs)

- Each significant feature begins with a Project Requirement Document
- PRDs are stored in the `prds/` directory with sequential numbering
- PRDs document both requirements and implementation progress
- PRD structure includes:
  - Overview
  - Background
  - Requirements
  - Implementation Details
  - Testing Strategy
  - Progress
  - Future Considerations

### Memory Bank

- Core project documentation is maintained in the memory bank
- Memory bank files provide context for the project's purpose, architecture, and progress
- Updated regularly to reflect current state and decisions

### Code Documentation

- Go doc comments for exported functions and types
- README.md for high-level project overview
- TESTING.md for testing approach and instructions
- CHANGELOG.md for tracking changes between releases
