## Additional Features

### Billing
- Get accounts (`GET /accounts`)
  - Description: Gets Postman billing account details for the given team
  - Responses:
    - 200: `#/components/responses/getAccounts`
    - 400: `#/components/responses/invoicesNoTeam400Error`
    - 401: `#/components/responses/unauthorizedError`
    - 500: `#/components/responses/common500ErrorServerError`

- List account invoices (`GET /accounts/{accountId}/invoices`)
  - Parameters:
    - `#/components/parameters/billingAccountId`
    - `#/components/parameters/billingAccountStatus`
  - Description: Gets all invoices for a Postman billing account filtered by status
  - Responses:
    - 200: `#/components/responses/getAccountInvoices`
    - 400: `#/components/responses/invoiceMissingStatus400Error`
    - 401: `#/components/responses/unauthorizedError`
    - 403: `#/components/responses/invoicesForbidden403Error`
    - 500: `#/components/responses/common500ErrorServerError`

### Comment Resolution
- Resolve comment thread (`POST /comments-resolutions/{threadId}`)
  - Parameters:
    - `#/components/parameters/threadId` (required)
  - Description: Resolves a comment and any associated replies
  - Note: Thread IDs return in GET comments response for APIs, collections, and collection items
  - Responses:
    - 204: No Content (Successful Response)
    - 401: `#/components/responses/comment401Error`
    - 404: `#/components/responses/comment404Error`
    - 500: `#/components/responses/comment500Error`

### Private API Network (Enterprise)
- Get all elements and folders (`GET /network/private`)
  - Parameters:
    - `#/components/parameters/since`
    - `#/components/parameters/until`
    - `#/components/parameters/panAddedBy`
    - `#/components/parameters/panElementName`
    - `#/components/parameters/panSummary`
    - `#/components/parameters/panElementDescription`
    - `#/components/parameters/sortCreatedUpdatedAt`
    - `#/components/parameters/direction`
    - `#/components/parameters/createdBy`
    - `#/components/parameters/offset`
    - `#/components/parameters/limitDefault1000`
    - `#/components/parameters/panParentFolderId`
    - `#/components/parameters/elementTypeQuery`
  - Note: limit/offset applied separately to elements and folders
  - Responses:
    - 200: `#/components/responses/getPanElementsAndFolders`
    - 401: `#/components/responses/common401Error`
    - 403: `#/components/responses/common403Error`
    - 500: `#/components/responses/common500ErrorServerError`

- Add element or folder (`POST /network/private`)
  - Note: Only one element object type per call
  - Request Body: `#/components/requestBodies/postPanElementOrFolder`
    - Required fields:
      - type: Element type (api/collection/workspace/folder)
      - name: Element/folder name
    - Optional fields (based on type):
      - description: Element/folder description
      - summary: Element summary
      - parentFolderId: Parent folder ID
      - elementId: ID of API/collection/workspace to add
  - Responses:
    - 201: `#/components/responses/postPanElementOrFolder`
    - 401: `#/components/responses/common401Error`
    - 403: `#/components/responses/common403Error`
    - 404: `#/components/responses/instanceNotFoundElementFolder`
    - 500: `#/components/responses/common500ErrorServerError`

- Update element or folder (`PUT /network/private/{elementType}/{elementId}`)
  - Parameters:
    - `#/components/parameters/elementId` (required)
    - `#/components/parameters/elementType` (required)
  - Note: Only one element object type per call
  - Request Body: `#/components/requestBodies/updatePanElementOrFolder`
    - Optional fields:
      - name: Updated name
      - description: Updated description
      - summary: Updated summary
      - parentFolderId: New parent folder ID
  - Responses:
    - 200: `#/components/responses/updatePanElementOrFolder`
    - 401: `#/components/responses/common401Error`
    - 403: `#/components/responses/common403Error`
    - 404: `#/components/responses/instanceNotFoundElementFolder`
    - 500: `#/components/responses/common500ErrorServerError`

- Remove element or folder (`DELETE /network/private/{elementType}/{elementId}`)
  - Parameters:
    - `#/components/parameters/elementId` (required)
    - `#/components/parameters/elementType` (required)
  - Note: Only removes from Private API Network, does not delete the resource
  - Responses:
    - 200: `#/components/responses/deletePanElementOrFolder`
    - 400: `#/components/responses/panFolder400ErrorNotEmpty`
    - 401: `#/components/responses/common401Error`
    - 403: `#/components/responses/common403Error`
    - 404: `#/components/responses/instanceNotFoundElementFolder`
    - 500: `#/components/responses/common500ErrorServerError`

- Get element add requests (`GET /network/private/network-entity/request/all`)
  - Parameters:
    - `#/components/parameters/since`
    - `#/components/parameters/until`
    - `#/components/parameters/panRequestedBy`
    - `#/components/parameters/elementTypeQuery`
    - `#/components/parameters/panRequestStatus`
    - `#/components/parameters/panElementName`
    - `#/components/parameters/sortCreatedUpdatedAt`
    - `#/components/parameters/direction`
    - `#/components/parameters/offset`
    - `#/components/parameters/limitDefault1000`
  - Responses:
    - 200: `#/components/responses/getAllPanAddElementRequests`
    - 400: `#/components/responses/pan400ErrorInvalidQueryParams`
    - 401: `#/components/responses/common401Error`
    - 403: `#/components/responses/common403Error`
    - 500: `#/components/responses/common500ErrorServerError`

- Respond to element add request (`PUT /network/private/network-entity/request/{requestId}`)
  - Parameters:
    - `#/components/parameters/panRequestId` (required)
  - Request Body: `#/components/requestBodies/respondPanElementAddRequest`
    - Required fields:
      - status: New request status (approved/rejected)
      - comment: Optional response comment
  - Responses:
    - 200: `#/components/responses/respondPanElementAddRequest`
    - 400: `#/components/responses/pan400ErrorInvalidParams`
    - 401: `#/components/responses/common401Error`
    - 403: `#/components/responses/common403Error`
    - 500: `#/components/responses/common500ErrorServerError`

### Webhooks
- Create webhook (`POST /webhooks`)
  - Parameters:
    - `#/components/parameters/workspaceQuery`
  - Description: Creates webhook that triggers collection with custom payload
  - Note: Webhook URL returned in webhookUrl response property
  - Request Body: `#/components/requestBodies/createWebhook`
    - Required fields:
      - name: Webhook name
      - collection: Collection ID to trigger
    - Optional fields:
      - description: Webhook description
      - events: Array of events to trigger on
  - Responses:
    - 200: `#/components/responses/createWebhook`
    - 400: `#/components/responses/createWebhookParamMissing400Error`
    - 401: `#/components/responses/common401Error`
    - 403: `#/components/responses/featureUnavailable403Error`
    - 500: `#/components/responses/common500ErrorServerError`

### Tags (Enterprise)
- Get elements by tag (`GET /tags/{slug}/entities`)
  - Parameters:
    - `#/components/parameters/tagsSlug` (required)
    - `#/components/parameters/tagsEntitiesLimit`
    - `#/components/parameters/tagsEntitiesDirection`
    - `#/components/parameters/tagsCursor`
    - `#/components/parameters/tagsEntityType`
  - Responses:
    - 200: `#/components/responses/getTaggedEntities`
    - 400: `#/components/responses/tagElement400Error`
    - 401: `#/components/responses/tag401Error`
    - 403: `#/components/responses/tag403Error`
    - 404: `#/components/responses/tag404Error`
    - 500: `#/components/responses/tag500Error`

- Get workspace tags (`GET /workspaces/{workspaceId}/tags`)
  - Parameters:
    - `#/components/parameters/workspaceId` (required)
  - Responses:
    - 200: `#/components/responses/tagGetPut`
    - 401: `#/components/responses/tag401Error`
    - 403: `#/components/responses/tag403Error`
    - 404: `#/components/responses/tag404Error`
    - 500: `#/components/responses/tag500Error`

- Update workspace tags (`PUT /workspaces/{workspaceId}/tags`)
  - Parameters:
    - `#/components/parameters/workspaceId` (required)
  - Request Body: `#/components/requestBodies/tagUpdateTags`
    - Required fields:
      - tags: Array of tag objects with slug and name
  - Responses:
    - 200: `#/components/responses/tagGetPut`
    - 400: `#/components/responses/tag400Error`
    - 401: `#/components/responses/tag401Error`
    - 403: `#/components/responses/tag403Error`
    - 404: `#/components/responses/tag404Error`
    - 500: `#/components/responses/tag500Error`

- Get collection tags (`GET /collections/{collectionId}/tags`)
  - Parameters:
    - `#/components/parameters/collectionUid` (required)
  - Responses:
    - 200: `#/components/responses/tagGetPut`
    - 401: `#/components/responses/tag401Error`
    - 403: `#/components/responses/tag403Error`
    - 500: `#/components/responses/tag500Error`

- Update collection tags (`PUT /collections/{collectionId}/tags`)
  - Parameters:
    - `#/components/parameters/collectionUid` (required)
  - Request Body: `#/components/requestBodies/tagUpdateTags`
    - Required fields:
      - tags: Array of tag objects with slug and name
  - Responses:
    - 200: `#/components/responses/tagGetPut`
    - 400: `#/components/responses/tag400Error`
    - 401: `#/components/responses/tag401Error`
    - 403: `#/components/responses/tag403Error`
    - 404: `#/components/responses/tag404Error`
    - 500: `#/components/responses/tag500Error`

- Get API tags (`GET /apis/{apiId}/tags`)
  - Parameters:
    - `#/components/parameters/apiId` (required)
    - `#/components/parameters/v10Accept`
  - Responses:
    - 200: `#/components/responses/tagGetPut`
    - 400: `#/components/responses/v10HeaderMissing`
    - 401: `#/components/responses/tag401Error`
    - 403: Multiple possible responses:
      - `#/components/schemas/tag403Error`
      - `#/components/schemas/featureUnavailable403Error`
    - 404: `#/components/responses/tag404Error`
    - 500: `#/components/responses/tag500Error`

- Update API tags (`PUT /apis/{apiId}/tags`)
  - Parameters:
    - `#/components/parameters/apiId` (required)
    - `#/components/parameters/v10Accept`
  - Request Body: `#/components/requestBodies/tagUpdateTags`
    - Required fields:
      - tags: Array of tag objects with slug and name
  - Responses:
    - 200: `#/components/responses/tagGetPut`
    - 400: Multiple possible responses:
      - `#/components/schemas/tag400Error`
      - `#/components/schemas/v10HeaderMissing`
    - 401: `#/components/responses/tag401Error`
    - 403: Multiple possible responses:
      - `#/components/schemas/tag403Error`
      - `#/components/schemas/featureUnavailable403Error`
    - 404: `#/components/responses/tag404Error`
    - 500: `#/components/responses/tag500Error`

### Key Features
- Private API Network
  - Element and folder management
  - Request approval workflow
  - Enterprise-level control
  - Resource organization

- Webhooks
  - Collection triggering
  - Custom payloads
  - Workspace integration

- Tags
  - Enterprise feature
  - Multi-resource tagging
  - Tag-based search
  - Consistent tag operations
  - Workspace/API/Collection support

- Billing
  - Team billing details
  - Invoice management
  - Status filtering

- Comment Resolution
  - Thread-based resolution
  - Bulk thread management
  - API/Collection/Item support
