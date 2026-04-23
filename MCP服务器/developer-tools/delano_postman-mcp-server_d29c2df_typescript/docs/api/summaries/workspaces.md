## Workspaces

**Important:**
When working with workspaces, keep track of the `createdBy` (owner ID) from the workspace response. This ID is essential for constructing valid resource identifiers when accessing related workspace resources.

For example, a workspace response includes:
```json
{
  "id": "5ead536b-e095-403c-89f9-f9f03872537a",
  "name": "My Workspace",
  "type": "personal",
  "visibility": "personal",
  "createdBy": "31912785"
}
```

### Implemented Operations
- Get all workspaces (`GET /workspaces`)
  - Parameters:
    - workspaceTypeQuery (`#/components/parameters/workspaceTypeQuery`)
    - workspaceCreatedBy (`#/components/parameters/workspaceCreatedBy`)
    - workspaceIncludeQuery (`#/components/parameters/workspaceIncludeQuery`)
  - Supports filtering by workspace type and creator
  - Responses:
    - 200: `#/components/responses/getWorkspaces`
    - 401: `#/components/responses/common401Error`
    - 500: `#/components/responses/common500ErrorServerError`
- Get a specific workspace (`GET /workspaces/{workspaceId}`)
  - Parameters:
    - workspaceId (`#/components/parameters/workspaceId`)
    - workspaceIncludeQuery (`#/components/parameters/workspaceIncludeQuery`)
  - Responses:
    - 200: `#/components/responses/getWorkspace`
    - 401: `#/components/responses/common401Error`
    - 404: `#/components/responses/workspace404ErrorNotFound`
    - 500: `#/components/responses/common500ErrorServerError`

- Create workspace (`POST /workspaces`)
  - Supports setting name, description, type, and visibility
  - Note: Returns 403 if user lacks permission to create workspaces
  - Important: Linking collections/environments between workspaces is deprecated
  - Request Body: `#/components/requestBodies/createWorkspace`
  - Responses:
    - 200: `#/components/responses/createWorkspace`
    - 400: `#/components/responses/workspace400ErrorMalformedRequest`
    - 401: `#/components/responses/common401Error`
    - 403: `#/components/responses/workspace403ErrorUnauthorized`
    - 500: `#/components/responses/common500ErrorServerError`

- Update workspace (`PUT /workspaces/{workspaceId}`)
  - Parameters:
    - workspaceId (`#/components/parameters/workspaceId`)
  - Can modify workspace properties and linked resources
  - Important: Linking collections/environments between workspaces is deprecated
  - Request Body: `#/components/requestBodies/updateWorkspace`
  - Responses:
    - 200: `#/components/responses/updateWorkspace`
    - 400: `#/components/responses/workspace400ErrorMalformedRequest`
    - 403: `#/components/responses/workspace403Error`
    - 404: `#/components/responses/instanceNotFoundWorkspace`
    - 500: `#/components/responses/common500ErrorServerError`

- Delete workspace (`DELETE /workspaces/{workspaceId}`)
  - Parameters:
    - workspaceId (`#/components/parameters/workspaceId`)
  - Important: Deleting a workspace with linked collections/environments affects all workspaces
  - Responses:
    - 200: `#/components/responses/deleteWorkspace`
    - 400: `#/components/responses/workspace400Error`
    - 401: `#/components/responses/common401Error`
    - 500: `#/components/responses/common500ErrorServerError`

- Get workspace global variables (`GET /workspaces/{workspaceId}/global-variables`)
  - Parameters:
    - workspaceId (`#/components/parameters/workspaceId`)
  - Responses:
    - 200: `#/components/responses/getWorkspaceGlobalVariables`
    - 500: `#/components/responses/globalVariables500Error`

- Update workspace global variables (`PUT /workspaces/{workspaceId}/global-variables`)
  - Parameters:
    - workspaceId (`#/components/parameters/workspaceId`)
  - Note: Replaces all existing global variables
  - Request Body: `#/components/requestBodies/updateWorkspaceGlobalVariables`
  - Responses:
    - 200: `#/components/responses/updateWorkspaceGlobalVariables`
    - 500: `#/components/responses/globalVariables500Error`

- Get workspace roles (`GET /workspaces/{workspaceId}/roles`)
  - Parameters:
    - workspaceId (`#/components/parameters/workspaceId`)
    - workspaceIncludeScimQuery (`#/components/parameters/workspaceIncludeScimQuery`)
  - Responses:
    - 200: `#/components/responses/getWorkspaceRoles`
    - 401: `#/components/responses/unauthorizedError`
    - 403: `#/components/responses/common403ErrorPermissions`
    - 404: `#/components/responses/resourceNotFound404Error`
    - 500: `#/components/responses/common500ErrorInternalServer`

- Update workspace roles (`PATCH /workspaces/{workspaceId}/roles`)
  - Parameters:
    - workspaceId (`#/components/parameters/workspaceId`)
    - identifierType (`#/components/parameters/identifierType`)
  - Supports updating roles for users and user groups
  - Available roles: Viewer, Editor, Admin
  - Note: Cannot set roles for personal/partner workspaces
  - Limited to 50 operations per call
  - Request Body: `#/components/requestBodies/updateWorkspaceRoles`
  - Responses:
    - 200: `#/components/responses/updateWorkspaceRoles`
    - 400: `#/components/responses/workspaceRoles400Error`
    - 401: `#/components/responses/unauthorizedError`
    - 403: `#/components/responses/common403ErrorPermissions`
    - 404: `#/components/responses/resourceNotFound404Error`
    - 422: `#/components/responses/workspaceRoles422UnsupportRoleError`
    - 500: `#/components/responses/common500ErrorInternalServer`

- Get all roles (`GET /workspaces-roles`)
  - Lists available roles based on team's plan
  - Responses:
    - 200: `#/components/responses/getAllWorkspaceRoles`
    - 401: `#/components/responses/api401ErrorUnauthorized`
    - 403: `#/components/responses/common403ErrorPermissions`
    - 500: `#/components/responses/common500ErrorInternalServer`

- Get workspace tags (`GET /workspaces/{workspaceId}/tags`)
  - Parameters:
    - workspaceId (`#/components/parameters/workspaceId`)
  - Responses:
    - 200: `#/components/responses/tagGetPut`
    - 401: `#/components/responses/tag401Error`
    - 403: `#/components/responses/tag403Error`
    - 404: `#/components/responses/tag404Error`
    - 500: `#/components/responses/tag500Error`

- Update workspace tags (`PUT /workspaces/{workspaceId}/tags`)
  - Parameters:
    - workspaceId (`#/components/parameters/workspaceId`)
  - Description: Updates a workspace's associated tags. Replaces all existing tags.
  - Request Body: `#/components/requestBodies/tagUpdateTags`
  - Responses:
    - 200: `#/components/responses/tagGetPut`
    - 400: `#/components/responses/tag400Error`
    - 401: `#/components/responses/tag401Error`
    - 403: `#/components/responses/tag403Error`
    - 404: `#/components/responses/tag404Error`
    - 500: `#/components/responses/tag500Error`

### Key Features
- Support for workspace types: personal, team, private, public, partner
- Workspace visibility control
- Basic workspace metadata (name, description)
- Workspace resource listings (collections, environments, mocks, monitors, APIs)
- Global variables management
- Role-based access control
- Tags management (Enterprise plans)
