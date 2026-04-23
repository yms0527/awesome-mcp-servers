## Collections

NOTE: The `#/` references herein can be found in the relevant reference files of the same (or very similar) name. For example, `collectionId` can be found in docs/reference/postman-api-parameters. The `mergeEnvironmentFork` request and response objects can be found in docs/reference/postman-api-requestBodies.yaml and docs/reference/postman-api-responsesonly.yaml, respectively. Also docs/reference/postman-api-schemasonly.yaml contains the schemas for the request and response objects.


### Implemented Operations
- Get all collections (`GET /collections`) ✓
  - Parameters:
    - workspaceQuery (`#/components/parameters/workspaceQuery`)
    - collectionNameQuery (`#/components/parameters/collectionNameQuery`)
    - limitNoDefault (`#/components/parameters/limitNoDefault`)
    - offsetNoDefault (`#/components/parameters/offsetNoDefault`)
  - Note: Filtering with name parameter is not supported when using limit/offset
  - Note: Invalid workspace ID returns empty array with 200 status
  - Implementation: Fully implemented with query parameter support
  - Responses:
    - 200: `#/components/responses/getCollections`
    - 401: `#/components/responses/common401Error`
    - 500: `#/components/responses/common500ErrorServerError`

- Get a specific collection (`GET /collections/{collectionId}`) ✓
  - Parameters:
    - collectionId (`#/components/parameters/collectionId`)
    - collectionAccessKeyQuery (`#/components/parameters/collectionAccessKeyQuery`)
    - collectionModelQuery (`#/components/parameters/collectionModelQuery`)
  - Implementation: Fully implemented with access key and model query support
  - Responses:
    - 200: `#/components/responses/getCollection`
    - 400: `#/components/responses/collection400ErrorCollectionNotFound`
    - 401: `#/components/responses/common401Error`
    - 500: `#/components/responses/common500ErrorServerError`

- Create collection (`POST /collections`) ✓
  - Supports Postman Collection v2.1.0 format
  - Note: Creates in "My Workspace" if workspace not specified
  - Parameters:
    - workspaceQuery (`#/components/parameters/workspaceQuery`)
  - Request Body: `#/components/requestBodies/createCollection`
  - Implementation: Fully implemented with workspace support
  - Responses:
    - 200: `#/components/responses/createCollection`
    - 400: `#/components/responses/collection400ErrorInstanceFound`
    - 401: `#/components/responses/common401Error`
    - 500: `#/components/responses/common500ErrorServerError`

- Update collection (`PUT /collections/{collectionId}`) ✓
  - Full collection replacement
  - Note: Maximum collection size: 20 MB
  - Important: Include collection item IDs to prevent recreation
  - Parameters:
    - collectionId (`#/components/parameters/collectionId`)
  - Request Body: `#/components/requestBodies/putCollection`
  - Implementation: Fully implemented with size limit validation
  - Responses:
    - 200: `#/components/responses/putCollection`
    - 400: `#/components/responses/collection400ErrorMalformedRequest`
    - 401: `#/components/responses/common401Error`
    - 403: `#/components/responses/common403Error`
    - 404: `#/components/responses/instanceNotFoundCollection`
    - 500: `#/components/responses/common500ErrorServerError`

- Patch collection (`PATCH /collections/{collectionId}`)  ✓
  - Parameters:
    - collectionId (`#/components/parameters/collectionId`)
  - Implementation: Fully implemented with proper error handling
  - Request Body: `#/components/requestBodies/patchCollection`
  - Responses:
    - 200: `#/components/responses/patchCollection`
    - 400: `#/components/responses/collection400ErrorInvalidKeyParam`
    - 401: `#/components/responses/common401Error`
    - 403: `#/components/responses/common403Error`
    - 404: `#/components/responses/instanceNotFoundCollection`
    - 500: `#/components/responses/common500ErrorServerError`

- Delete collection (`DELETE /collections/{collectionId}`)
  - Parameters:
    - collectionId (`#/components/parameters/collectionId`)

  - Responses:
    - 200: `#/components/responses/deleteCollection`
    - 401: `#/components/responses/common401Error`
    - 404: `#/components/responses/instanceNotFoundCollection`
    - 500: `#/components/responses/common500ErrorServerError`

#### Collection Items Management
- Create folder (`POST /collections/{collectionId}/folders`)
  - Note: Empty name creates folder with blank name
  - Parameters:
    - collectionId (`#/components/parameters/collectionId`)
  - Request Body: `#/components/requestBodies/createCollectionFolder`
  - Responses:
    - 200: `#/components/responses/createCollectionFolder`
    - 400: `#/components/responses/collectionFolder400Error`
    - 401: `#/components/responses/collectionFolder401Error`
    - 500: `#/components/responses/common500Error`

- Get folder (`GET /collections/{collectionId}/folders/{folderId}`)
  - Parameters:
    - collectionId (`#/components/parameters/collectionId`)
    - collectionFolderId (`#/components/parameters/collectionFolderId`)
    - collectionItemsIdQuery (`#/components/parameters/collectionItemsIdQuery`)
    - collectionItemsUidFormatQuery (`#/components/parameters/collectionItemsUidFormatQuery`)
    - collectionItemsPopulateQuery (`#/components/parameters/collectionItemsPopulateQuery`)
  - Implementation: Fully implemented with all query parameter support
  - Responses:
    - 200: `#/components/responses/getCollectionFolder`
    - 401: `#/components/responses/collectionFolder401Error`
    - 404: `#/components/responses/collectionFolder404Error`
    - 500: `#/components/responses/common500Error`

- Update folder (`PUT /collections/{collectionId}/folders/{folderId}`)
  - Note: Acts like PATCH, only updates provided values
  - Parameters:
    - collectionId (`#/components/parameters/collectionId`)
    - collectionFolderId (`#/components/parameters/collectionFolderId`)
  - Request Body: `#/components/requestBodies/updateCollectionFolder`
  - Responses:
    - 200: `#/components/responses/updateCollectionFolder`
    - 400: `#/components/responses/collectionFolder400Error`
    - 401: `#/components/responses/collectionFolder401Error`
    - 404: `#/components/responses/collectionFolder404Error`
    - 500: `#/components/responses/common500Error`

- Delete folder (`DELETE /collections/{collectionId}/folders/{folderId}`) ✓
  - Parameters:
    - collectionId (`#/components/parameters/collectionId`)
    - collectionFolderId (`#/components/parameters/collectionFolderId`)
  - Implementation: Fully implemented with proper error handling
  - Responses:
    - 200: `#/components/responses/deleteCollectionFolder`
    - 401: `#/components/responses/collectionFolder401Error`
    - 404: `#/components/responses/collectionFolder404Error`
    - 500: `#/components/responses/common500Error`

#### Request and Response Management
- Create request (`POST /collections/{collectionId}/requests`)
  - Note: Empty name creates request with blank name
  - Parameters:
    - collectionId (`#/components/parameters/collectionId`)
    - collectionRequestFolderIdQuery (`#/components/parameters/collectionRequestFolderIdQuery`)
  - Request Body: `#/components/requestBodies/createCollectionRequest`
  - Responses:
    - 200: `#/components/responses/createCollectionRequest`
    - 400: `#/components/responses/collectionRequest400Error`
    - 401: `#/components/responses/collectionRequest401Error`
    - 500: `#/components/responses/common500Error`

- Get request (`GET /collections/{collectionId}/requests/{requestId}`)
  - Parameters:
    - collectionId (`#/components/parameters/collectionId`)
    - collectionRequestId (`#/components/parameters/collectionRequestId`)
    - collectionItemsIdQuery (`#/components/parameters/collectionItemsIdQuery`)
    - collectionItemsUidFormatQuery (`#/components/parameters/collectionItemsUidFormatQuery`)
    - collectionItemsPopulateQuery (`#/components/parameters/collectionItemsPopulateQuery`)
  - Implementation: Fully implemented with all query parameter support
  - Responses:
    - 200: `#/components/responses/getCollectionRequest`
    - 401: `#/components/responses/collectionRequest401Error`
    - 404: `#/components/responses/collectionRequest404Error`
    - 500: `#/components/responses/common500Error`

- Update request (`PUT /collections/{collectionId}/requests/{requestId}`)
  - Note: Cannot change request folder
  - Parameters:
    - collectionId (`#/components/parameters/collectionId`)
    - collectionRequestId (`#/components/parameters/collectionRequestId`)
  - Request Body: `#/components/requestBodies/updateCollectionRequest`
  - Responses:
    - 200: `#/components/responses/updateCollectionRequest`
    - 400: `#/components/responses/collectionRequest400Error`
    - 401: `#/components/responses/collectionRequest401Error`
    - 404: `#/components/responses/collectionRequest404Error`
    - 500: `#/components/responses/common500Error`

- Delete request (`DELETE /collections/{collectionId}/requests/{requestId}`) ✓
  - Parameters:
    - collectionId (`#/components/parameters/collectionId`)
    - collectionRequestId (`#/components/parameters/collectionRequestId`)
  - Implementation: Fully implemented with proper error handling
  - Responses:
    - 200: `#/components/responses/deleteCollectionRequest`
    - 401: `#/components/responses/collectionRequest401Error`
    - 404: `#/components/responses/collectionRequest404Error`
    - 500: `#/components/responses/common500Error`

- Create response (`POST /collections/{collectionId}/responses`)
  - Note: Empty name creates response with blank name
  - Parameters:
    - collectionId (`#/components/parameters/collectionId`)
    - collectionResponseParentRequestId (`#/components/parameters/collectionResponseParentRequestId`)
  - Request Body: `#/components/requestBodies/createCollectionResponse`
  - Responses:
    - 200: `#/components/responses/createCollectionResponse`
    - 400: `#/components/responses/collectionResponse400Error`
    - 401: `#/components/responses/collectionResponse401Error`
    - 500: `#/components/responses/common500Error`

- Get response (`GET /collections/{collectionId}/responses/{responseId}`)
  - Parameters:
    - collectionId (`#/components/parameters/collectionId`)
    - collectionResponseId (`#/components/parameters/collectionResponseId`)
    - collectionItemsIdQuery (`#/components/parameters/collectionItemsIdQuery`)
    - collectionItemsUidFormatQuery (`#/components/parameters/collectionItemsUidFormatQuery`)
    - collectionItemsPopulateQuery (`#/components/parameters/collectionItemsPopulateQuery`)
  - Implementation: Fully implemented with all query parameter support
  - Responses:
    - 200: `#/components/responses/getCollectionResponse`
    - 401: `#/components/responses/collectionResponse401Error`
    - 404: `#/components/responses/collectionResponse404Error`
    - 500: `#/components/responses/common500Error`

- Update response (`PUT /collections/{collectionId}/responses/{responseId}`)
  - Note: Acts like PATCH, only updates provided values
  - Parameters:
    - collectionId (`#/components/parameters/collectionId`)
    - collectionResponseId (`#/components/parameters/collectionResponseId`)
  - Request Body: `#/components/requestBodies/updateCollectionResponse`
  - Responses:
    - 200: `#/components/responses/updateCollectionResponse`
    - 400: `#/components/responses/collectionResponse400Error`
    - 401: `#/components/responses/collectionResponse401Error`
    - 404: `#/components/responses/collectionResponse404Error`
    - 500: `#/components/responses/common500Error`

- Delete response (`DELETE /collections/{collectionId}/responses/{responseId}`) ✓
  - Parameters:
    - collectionId (`#/components/parameters/collectionId`)
    - collectionResponseId (`#/components/parameters/collectionResponseId`)
  - Implementation: Fully implemented with proper error handling
  - Responses:
    - 200: `#/components/responses/deleteCollectionResponse`
    - 401: `#/components/responses/collectionResponse401Error`
    - 404: `#/components/responses/collectionResponse404Error`
    - 500: `#/components/responses/common500Error`

#### Collection Transfers
- Transfer folders (`POST /collection-folders-transfers`)
  - Description: Copy or move folders between collections
  - Request Body: `#/components/requestBodies/transferCollectionItems`
  - Responses:
    - 200: `#/components/responses/transferCollectionItems200Error`
    - 400: `#/components/responses/transferCollectionItems400Error`
    - 500: `#/components/responses/common500Error`

- Transfer requests (`POST /collection-requests-transfers`)
  - Description: Copy or move requests between collections/folders
  - Request Body: `#/components/requestBodies/transferCollectionItems`
  - Responses:
    - 200: `#/components/responses/transferCollectionItems200Error`
    - 400: `#/components/responses/transferCollectionItems400Error`
    - 500: `#/components/responses/common500Error`

- Transfer responses (`POST /collection-responses-transfers`)
  - Description: Copy or move responses between requests
  - Request Body: `#/components/requestBodies/transferCollectionItems`
  - Responses:
    - 200: `#/components/responses/transferCollectionItems200Error`
    - 400: `#/components/responses/transferCollectionItems400Error`
    - 500: `#/components/responses/common500Error`

#### Collection Forking & Merging
- Create fork (`POST /collections/fork/{collectionId}`)
  - Parameters:
    - collectionId (`#/components/parameters/collectionId`)
    - forkWorkspaceQuery (`#/components/parameters/forkWorkspaceQuery`)
  - Request Body: `#/components/requestBodies/createCollectionFork`
  - Responses:
    - 200: `#/components/responses/createCollectionFork`
    - 401: `#/components/responses/common401Error`
    - 404: `#/components/responses/instanceNotFoundCollection`
    - 500: `#/components/responses/common500ErrorServerError`

- Get collection forks (`GET /collections/{collectionId}/forks`)
  - Parameters:
    - collectionId (`#/components/parameters/collectionId`)
    - cursor (`#/components/parameters/cursor`)
    - limit (`#/components/parameters/limit`)
    - createdAtSort (`#/components/parameters/createdAtSort`)
  - Responses:
    - 200: `#/components/responses/getCollectionForks`
    - 400: `#/components/responses/forkCollection400ErrorNoForks`
    - 404: `#/components/responses/fork404Error`
    - 500: `#/components/responses/common500Error`

- Get all forked collections (`GET /collections/collection-forks`)
  - Parameters:
    - cursor (`#/components/parameters/cursor`)
    - limit (`#/components/parameters/limit`)
    - createdAtSort (`#/components/parameters/createdAtSort`)
  - Responses:
    - 200: `#/components/responses/getCollectionsForkedByUser`
    - 400: `#/components/responses/fork400ErrorNoUserFound`
    - 401: `#/components/responses/common401Error`
    - 500: `#/components/responses/common500Error`

- Merge or pull changes (`PUT /collection-merges`)
  - Description: Asynchronous operation with task status tracking
  - Request Body: `#/components/requestBodies/asyncCollectionForkMerge`
  - Responses:
    - 200: `#/components/responses/asyncMergeCollectionFork`
    - 400: `#/components/responses/collectionForks400ErrorMalformedRequest`
    - 401: `#/components/responses/common401Error`
    - 403: `#/components/responses/collectionForks403ErrorForbidden`
    - 500: `#/components/responses/common500Error`

- Get merge/pull task status (`GET /collections-merges-tasks/{taskId}`)
  - Note: Task status available for 24 hours after completion
  - Parameters:
    - collectionForkTaskId (`#/components/parameters/collectionForkTaskId`)
  - Responses:
    - 200: `#/components/responses/asyncMergePullCollectionTaskStatus`
    - 401: `#/components/responses/common401Error`
    - 403: `#/components/responses/collectionForks403ErrorForbidden`
    - 404: `#/components/responses/collectionForks404ErrorTaskNotFound`
    - 500: `#/components/responses/common500Error`

- Pull changes (`PUT /collections/{collectionId}/pulls`)
  - Parameters:
    - collectionId (`#/components/parameters/collectionId`)
  - Responses:
    - 200: `#/components/responses/pullCollectionChanges`
    - 400: `#/components/responses/forkCollection400ErrorBadId`
    - 404: `#/components/responses/instanceNotFoundCollection`
    - 500: `#/components/responses/common500Error`

- Get source collection status (`GET /collections/{collectionId}/source-status`)
  - Note: May take a few minutes to return updated status
  - Parameters:
    - collectionId (`#/components/parameters/collectionId`)
  - Responses:
    - 200: `#/components/responses/getSourceCollectionStatus`
    - 400: `#/components/responses/forkCollection400ErrorNotForked`
    - 403: `#/components/responses/pullRequest403ErrorForbidden`
    - 500: `#/components/responses/common500Error`

#### Pull Requests
- Get pull request (`GET /pull-requests/{pullRequestId}`)
  - Parameters:
    - pullRequestId (`#/components/parameters/pullRequestId`) (required)
  - Responses:
    - 200: `#/components/responses/getPullRequest`
    - 403: `#/components/responses/pullRequest403ErrorForbidden`
    - 500: `#/components/responses/common500ErrorServerError`

- Update pull request (`PUT /pull-requests/{pullRequestId}`)
  - Parameters:
    - pullRequestId (`#/components/parameters/pullRequestId`) (required)
  - Request Body: `#/components/requestBodies/pullRequestUpdate`
    - Required fields:
      - name: Updated pull request name
      - description: Updated description
    - Optional fields:
      - destination: Updated destination details
      - source: Updated source details
  - Responses:
    - 200: `#/components/responses/pullRequestUpdate`
    - 403: `#/components/responses/pullRequest403ErrorForbidden`
    - 409: `#/components/responses/pullRequest409ErrorConflict`
    - 500: `#/components/responses/common500ErrorServerError`

- Review pull request (`POST /pull-requests/{pullRequestId}/tasks`)
  - Parameters:
    - pullRequestId (`#/components/parameters/pullRequestId`) (required)
  - Description: Updates the review status of a pull request
  - Request Body: `#/components/requestBodies/pullRequestReview`
    - Required fields:
      - action: Review action (approve/reject)
      - comment: Review comment
  - Responses:
    - 200: `#/components/responses/pullRequestReview200OK`
    - 400: Multiple possible responses:
      - `#/components/schemas/pullRequestReview400ErrorActionNotAllowed`
      - `#/components/schemas/pullRequestReview400ErrorInvalidAction`
    - 403: `#/components/responses/pullRequest403ErrorForbidden`
    - 500: `#/components/responses/common500ErrorServerError`

#### Collection Comments
- Get collection comments (`GET /collections/{collectionId}/comments`)
  - Parameters:
    - collectionUid (`#/components/parameters/collectionUid`)
  - Responses:
    - 200: `#/components/responses/commentGet`
    - 401: `#/components/responses/comment401Error`
    - 403: `#/components/responses/comment403Error`
    - 404: `#/components/responses/comment404Error`
    - 500: `#/components/responses/comment500Error`

- Create collection comment (`POST /collections/{collectionId}/comments`)
  - Parameters:
    - collectionUid (`#/components/parameters/collectionUid`)
  - Note: Maximum 10,000 characters
  - Request Body: `#/components/requestBodies/commentCreate`
  - Responses:
    - 201: `#/components/responses/commentCreated`
    - 401: `#/components/responses/comment401Error`
    - 403: `#/components/responses/comment403Error`
    - 404: `#/components/responses/comment404Error`
    - 500: `#/components/responses/comment500Error`

- Update collection comment (`PUT /collections/{collectionId}/comments/{commentId}`)
  - Parameters:
    - collectionUid (`#/components/parameters/collectionUid`)
    - commentId (`#/components/parameters/commentId`)
  - Note: Maximum 10,000 characters
  - Request Body: `#/components/requestBodies/commentUpdate`
  - Responses:
    - 200: `#/components/responses/commentUpdated`
    - 401: `#/components/responses/comment401Error`
    - 403: `#/components/responses/comment403Error`
    - 404: `#/components/responses/comment404Error`
    - 500: `#/components/responses/comment500Error`

- Delete collection comment (`DELETE /collections/{collectionId}/comments/{commentId}`)
  - Note: Deleting first comment deletes entire thread
  - Parameters:
    - collectionUid (`#/components/parameters/collectionUid`)
    - commentId (`#/components/parameters/commentId`)
  - Responses:
    - 204: No Content
    - 401: `#/components/responses/comment401Error`
    - 403: `#/components/responses/comment403Error`
    - 404: `#/components/responses/comment404Error`
    - 500: `#/components/responses/comment500Error`

#### Collection Access Keys
- Get collection access keys (`GET /collection-access-keys`)
  - Lists personal and team collection access keys
  - Includes expiration and last used information
  - Parameters:
    - collectionUidQuery (`#/components/parameters/collectionUidQuery`)
    - cursor (`#/components/parameters/cursor`)
  - Responses:
    - 200: `#/components/responses/getCollectionAccessKeys`
    - 400: `#/components/responses/common400ErrorInvalidCursor`
    - 401: `#/components/responses/common401Error`
    - 403: `#/components/responses/common403ErrorForbidden`
    - 500: `#/components/responses/common500ErrorSomethingWrong`

- Delete collection access key (`DELETE /collection-access-keys/{keyId}`)
  - Parameters:
    - collectionAccessKeyId (`#/components/parameters/collectionAccessKeyId`)
  - Responses:
    - 204: No Content
    - 401: `#/components/responses/common401Error`
    - 403: `#/components/responses/common403ErrorForbidden`
    - 404: `#/components/responses/cakNotFound404Error`
    - 500: `#/components/responses/common500ErrorSomethingWrong`
    -
#### Collection Roles
- Update collection roles (`PATCH /collections/{collectionId}/roles`)
  - Parameters:
    - collectionId (`#/components/parameters/collectionId`)
  - Note: Only EDITOR role can use this endpoint
  - Note: Does not support Partner or Guest external roles
  - Request Body: `#/components/requestBodies/updateCollectionRoles`
  - Responses:
    - 204: No Content
    - 400: `#/components/responses/collectionRoles400ErrorMissingProperty`
    - 401: `#/components/responses/unauthorizedError`
    - 403: `#/components/responses/common403ErrorPermissions`
    - 404: `#/components/responses/collection404ErrorInstanceNotFound`
    - 500: `#/components/responses/common500ErrorInternalServer`

#### Collection Transformations
- Transform collection to OpenAPI (`GET /collections/{collectionId}/transformations`)
  - Parameters:
    - `#/components/parameters/collectionId` (required)
    - `#/components/parameters/collectionTransformFormat`
  - Note: Does not create an API
  - Responses:
    - 200: `#/components/responses/transformCollectionToOpenAPI`
    - 401: `#/components/responses/collectionToApi401Error`
    - 404: `#/components/responses/collectionToApi404Error`
    - 500: `#/components/responses/collectionToApi500Error`



### Key Features
- Collection CRUD operations
- Support for Postman Collection Format v2.1.0
- Collection metadata management
- Nested folder structure support
- Request and response management
- Version control (fork, merge, pull)
- Commenting system
- Collection transfer capabilities
- Role-based access control
