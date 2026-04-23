## Common Features

### Pagination
- Cursor-based pagination
  - Used in endpoints like:
    - `/apis` with `#/components/parameters/cursor`
    - `/collection-access-keys` with `#/components/parameters/cursor`
    - `/detected-secrets/{secretId}/locations` with `#/components/parameters/cursor`
  - Often paired with `limit` parameter to control page size
  - Provides consistent forward pagination
  - Returns next cursor in response for subsequent requests

- Limit/offset pagination
  - Used in endpoints like:
    - `/collections` with `#/components/parameters/limitNoDefault` and `#/components/parameters/offsetNoDefault`
    - `/network/private` with `#/components/parameters/limitDefault1000` and `#/components/parameters/offset`
  - Different default limits per endpoint (e.g., 1000 for Private API Network)
  - Allows random access to result pages
  - Supports both forward and backward pagination

### Error Handling
- Standard HTTP status codes
  - 200: Successful operation
  - 201: Resource created
  - 202: Accepted (async operations)
  - 204: No content (successful deletion)
  - 400: Bad request/Invalid parameters
  - 401: Unauthorized
  - 403: Forbidden/Feature unavailable
  - 404: Resource not found
  - 422: Unprocessable entity
  - 500: Internal server error

- Detailed error messages
  - Consistent error response format
  - Specific error types for different scenarios
  - Error categorization by domain (e.g., API errors, collection errors)
  - Clear error descriptions and potential solutions

### Resource Management
- Workspace scoping
  - Most resources belong to a workspace
  - Workspace ID required for creation operations
  - Workspace-level permissions and visibility
  - Support for different workspace types:
    - Personal
    - Team
    - Private
    - Public
    - Partner

- Resource metadata
  - Creation and modification timestamps
  - Owner/creator information
  - Version information where applicable
  - Resource relationships and dependencies

- Version control
  - Forking support
  - Merge capabilities
  - Version history tracking
  - Git repository integration
  - Pull/merge request workflows

- Commenting system
  - Comments on various resources (APIs, collections, etc.)
  - Thread-based discussions
  - Maximum 10,000 characters per comment
  - Comment management (CRUD operations)
  - Thread deletion rules (deleting first comment deletes thread)

- Tags and categorization
  - Enterprise feature
  - Supported on:
    - Workspaces
    - APIs
    - Collections
  - Consistent tag operations across resources:
    - GET to retrieve tags
    - PUT to update tags (replaces all existing tags)
  - Common response schemas:
    - Success: `#/components/responses/tagGetPut`
    - Errors:
      - 400: `#/components/responses/tag400Error`
      - 401: `#/components/responses/tag401Error`
      - 403: `#/components/responses/tag403Error`
      - 404: `#/components/responses/tag404Error`
      - 500: `#/components/responses/tag500Error`

### Common Parameters
- Workspace identification
  - `#/components/parameters/workspaceId`
  - `#/components/parameters/workspaceQuery`
  - `#/components/parameters/workspaceIdQuery`
  - Used for resource scoping and access control

- Pagination control
  - `#/components/parameters/cursor`
  - `#/components/parameters/limit`
  - `#/components/parameters/offset`
  - Consistent across paginated endpoints

- Date range filtering
  - `#/components/parameters/since`
  - `#/components/parameters/until`
  - ISO 8601 timestamp format
  - Used for filtering time-based data

- Sorting and ordering
  - `#/components/parameters/direction`
  - Various sort parameters specific to resources
  - Consistent sort parameter naming

- API versioning
  - `#/components/parameters/v10Accept` header required for many endpoints
  - Version-specific error responses (e.g., `#/components/responses/v9Unsupported`)
  - Clear version requirements in documentation

### Common Response Patterns
- Success responses
  - Consistent data structure
  - Resource metadata included
  - Pagination information when applicable
  - Clear success indicators

- Error responses
  - Standard error format
  - Detailed error messages
  - Error codes for programmatic handling
  - Suggested solutions when applicable

- Asynchronous operations
  - 202 Accepted response
  - Task ID for status tracking
  - Polling endpoints for status updates
  - Clear completion indicators

### Key Features
- Consistent resource management
- Standardized error handling
- Flexible pagination options
- Comprehensive metadata
- Version control capabilities
- Enterprise feature support
- Clear API versioning
