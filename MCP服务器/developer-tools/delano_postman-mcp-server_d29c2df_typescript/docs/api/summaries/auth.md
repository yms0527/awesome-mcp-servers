## Authentication & Authorization

### Authentication
- API Key authentication via `x-api-key` header
- Support for SCIM API key authentication
- Collection access key support

### Authorization
- Role-based access control
- Workspace-level permissions
- Team-level permissions
- Enterprise features access control

### Response References

#### Collection Access Keys
- GET `/collection-access-keys`
  - Parameters:
    - `#/components/parameters/collectionUidQuery`
    - `#/components/parameters/cursor`
  - Responses:
    - 200: `#/components/responses/getCollectionAccessKeys`
    - 400: `#/components/responses/common400ErrorInvalidCursor`
    - 401: `#/components/responses/common401Error`
    - 403: `#/components/responses/common403ErrorForbidden`
    - 500: `#/components/responses/common500ErrorSomethingWrong`

- DELETE `/collection-access-keys/{keyId}`
  - Parameters:
    - `#/components/parameters/collectionAccessKeyId` (required)
  - Responses:
    - 204: No Content (successful deletion)
    - 401: `#/components/responses/common401Error`
    - 403: `#/components/responses/common403ErrorForbidden`
    - 404: `#/components/responses/collectionAccessKeyNotFound404Error`
    - 500: `#/components/responses/common500ErrorSomethingWrong`

#### Roles & Permissions

##### Workspace Roles
- GET `/workspaces-roles`
  - Description: Gets all available roles based on team's plan
  - Responses:
    - 200: `#/components/responses/getAllWorkspaceRoles`
    - 401: `#/components/responses/api401ErrorUnauthorized`
    - 403: `#/components/responses/common403ErrorPermissions`
    - 500: `#/components/responses/common500ErrorInternalServer`

- GET `/workspaces/{workspaceId}/roles`
  - Parameters:
    - `#/components/parameters/workspaceId` (required)
    - `#/components/parameters/workspaceIncludeScimQuery`
  - Responses:
    - 200: `#/components/responses/getWorkspaceRoles`
    - 401: `#/components/responses/unauthorizedError`
    - 403: `#/components/responses/common403ErrorPermissions`
    - 404: `#/components/responses/resourceNotFound404Error`
    - 500: `#/components/responses/common500ErrorInternalServer`

- PATCH `/workspaces/{workspaceId}/roles`
  - Parameters:
    - `#/components/parameters/workspaceId` (required)
    - `#/components/parameters/identifierType`
  - Notes:
    - Groups available on Enterprise plans
    - Include `identifierType=scim` header for SCIM IDs
    - Cannot set roles for personal and partner workspaces
    - Does not support Partner or Guest external roles
    - Limited to 50 operations per call
    - Request body must contain one unique action per user/group
  - Request Body: `#/components/requestBodies/updateWorkspaceRoles`
  - Responses:
    - 200: `#/components/responses/updateWorkspaceRoles`
    - 400: `#/components/responses/workspaceRoles400Error`
    - 401: `#/components/responses/unauthorizedError`
    - 403: `#/components/responses/common403ErrorPermissions`
    - 404: `#/components/responses/resourceNotFound404Error`
    - 422: `#/components/responses/workspaceRoles422UnsupportRoleError`
    - 500: `#/components/responses/common500ErrorInternalServer`

##### Collection Roles
- GET `/collections/{collectionId}/roles`
  - Parameters:
    - `#/components/parameters/collectionId` (required)
  - Responses:
    - 200: `#/components/responses/getCollectionRoles`
    - 401: `#/components/responses/unauthorizedError`
    - 403: `#/components/responses/common403ErrorPermissions`
    - 404: `#/components/responses/collection404ErrorInstanceNotFound`
    - 500: `#/components/responses/common500ErrorInternalServer`

- PATCH `/collections/{collectionId}/roles`
  - Parameters:
    - `#/components/parameters/collectionId` (required)
  - Notes:
    - Only users with EDITOR role can use this endpoint
    - Does not support Partner or Guest external roles
  - Request Body: `#/components/requestBodies/updateCollectionRoles`
  - Responses:
    - 204: No Content (successful update)
    - 400: `#/components/responses/collectionRoles400ErrorMissingProperty`
    - 401: `#/components/responses/unauthorizedError`
    - 403: `#/components/responses/common403ErrorPermissions`
    - 404: `#/components/responses/collection404ErrorInstanceNotFound`
    - 500: `#/components/responses/common500ErrorInternalServer`

### User Information
- GET `/me` (Get authenticated user)
  - Note: Different response for Guest and Partner roles
  - Note: `flow_count` only returns for Free plan users
  - Responses:
    - 200: `#/components/responses/getAuthenticatedUser`
    - 401: `#/components/responses/common401Error`
    - 500: `#/components/responses/common500ErrorServerError`

### Key Features
- Multiple authentication methods
  - API key
  - SCIM API key
  - Collection access keys
- Role-based access control
  - Workspace roles
  - Collection roles
  - Team roles
- Permission management
  - User permissions
  - Group permissions (Enterprise)
  - Role assignment limits
- Enterprise features
  - SCIM support
  - Group management
  - Advanced role controls

### Notes
- Role operations support both user and user group management
- SCIM ID support available with `identifierType=scim` header
- Role operations are limited to 50 operations per call
- Partner and Guest external roles are not supported via the API
- Personal and partner workspace roles cannot be modified
