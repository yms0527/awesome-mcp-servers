## Security Features

### API Security Validation
- API definition security validation (`POST /security/api-validation`)
  - Description: Analyzes API definition against predefined rulesets
  - Note: Maximum definition size: 10 MB
  - Note: Requires imported and enabled OWASP security rules
  - Request Body: `#/components/requestBodies/schemaSecurityValidation`
    - Required fields:
      - type: Schema type (e.g., "openapi3")
      - definition: API definition content
      - rulesets: Array of ruleset IDs to validate against
  - Responses:
    - 200: `#/components/responses/schemaSecurityValidation`
    - 400: `#/components/responses/schemaSecurityValidation400Error`
    - 401: `#/components/responses/common401Error`
    - 403: `#/components/responses/featureUnavailable403Error`
    - 500: `#/components/responses/common500ErrorServerError`

### Secret Scanner (Enterprise)
- Get secret types (`GET /secret-types`)
  - Description: Gets metadata of supported secret types
  - Responses:
    - 200: `#/components/responses/getSecretTypes`
    - 401: `#/components/responses/secretScanner401Error`
    - 403: `#/components/responses/secretScanner403ErrorAndFeatureUnavailable`
    - 500: `#/components/responses/secretScanner500Error`

- Search detected secrets (`POST /detected-secrets-queries`)
  - Description: Returns secrets detected by Secret Scanner, grouped by workspace/resource
  - Parameters:
    - `#/components/parameters/limit`
    - `#/components/parameters/cursor`
    - `#/components/parameters/include`
    - `#/components/parameters/since`
    - `#/components/parameters/until`
  - Note: Empty request body returns all results
  - Request Body: `#/components/requestBodies/detectedSecretsQueries`
    - Optional fields:
      - workspaces: Array of workspace IDs to search
      - secretTypes: Array of secret type IDs
      - resolutions: Array of resolution statuses
      - resources: Array of resource types
  - Responses:
    - 200: `#/components/responses/detectedSecretsQueries`
    - 400: `#/components/responses/detectedSecretsQuery400Errors`
    - 401: `#/components/responses/secretScanner401Error`
    - 403: `#/components/responses/secretScanner403ErrorAndFeatureUnavailable`
    - 500: `#/components/responses/secretScanner500Error`

- Update secret resolution status (`PUT /detected-secrets/{secretId}`)
  - Parameters:
    - `#/components/parameters/secretId` (required)
  - Request Body: `#/components/requestBodies/updateSecretResolutions`
    - Required fields:
      - resolution: New resolution status
      - comment: Optional resolution comment
  - Responses:
    - 200: `#/components/responses/updateSecretResolutions`
    - 400: `#/components/responses/secretScanner400InvalidResolutionError`
    - 401: `#/components/responses/secretScanner401Error`
    - 403: `#/components/responses/secretScanner403ErrorAndFeatureUnavailable`
    - 500: `#/components/responses/secretScanner500Error`

- Get detected secrets locations (`GET /detected-secrets/{secretId}/locations`)
  - Parameters:
    - `#/components/parameters/secretId` (required)
    - `#/components/parameters/limit`
    - `#/components/parameters/cursor`
    - `#/components/parameters/workspaceIdQueryTrue`
    - `#/components/parameters/since`
    - `#/components/parameters/until`
    - `#/components/parameters/resourceType`
  - Responses:
    - 200: `#/components/responses/getSecretsLocations`
    - 400: `#/components/responses/secretScanner400Error`
    - 401: `#/components/responses/secretScanner401Error`
    - 403: `#/components/responses/secretScanner403ErrorAndFeatureUnavailable`
    - 500: `#/components/responses/secretScanner500Error`

### Audit Logs (Enterprise)
- Get team audit logs (`GET /audit/logs`)
  - Parameters:
    - `#/components/parameters/auditLogsSinceQuery`
    - `#/components/parameters/auditLogsUntilQuery`
    - `#/components/parameters/auditLogsLimitQuery`
    - `#/components/parameters/cursor`
    - `#/components/parameters/auditLogsOrderBy`
  - Responses:
    - 200: `#/components/responses/getAuditLogs`
    - 401: `#/components/responses/common401Error`
    - 500: `#/components/responses/common500ErrorServerError`

### Key Features
- API security validation
  - OWASP security rules integration
  - Schema validation
  - CI/CD process integration
  - Rule violation tracking
  - Solution suggestions

- Secret scanning
  - Multiple secret type support
  - Workspace/resource grouping
  - Location tracking
  - Resolution management
  - Enterprise-level control

- Audit logging
  - Team activity tracking
  - Event filtering
  - Pagination support
  - Enterprise plan feature
