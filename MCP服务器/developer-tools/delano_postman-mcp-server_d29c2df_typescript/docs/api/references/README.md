# Postman Reference

* [Overview](#overview)
  * [Collection SDK vs API](#collection-sdk-vs-api)
  * [YAML Files](#yaml-files)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Quick Start](#quick-start)
* [Authentication](#authentication)
  * [API Keys](#api-keys)
  * [Collection Access Keys](#collection-access-keys)
  * [Rate Limits](#rate-limits)
* [API Sections](#api-sections)
  * [Workspaces](#workspaces)
  * [Collections](#collections)
  * [Environments and Variables](#environments-and-variables)
  * [APIs](#apis)
  * [Mock Servers](#mock-servers)
  * [Monitors](#monitors)
  * [Comments](#comments)
  * [Forks](#forks)
  * [Pull Requests](#pull-requests)
  * [User and Usage Data](#user-and-usage-data)
  * [Users and User Groups](#users-and-user-groups)
  * [Roles](#roles)
  * [Billing](#billing)

## Overview

### Collection SDK vs API
The Postman platform offers two distinct tools for programmatic interaction:

#### Collection SDK
- Node.js module for programmatic collection manipulation
- Works locally without requiring API calls
- Focused on collection creation and modification
- [SDK Documentation](https://www.postmanlabs.com/postman-collection/)
- [GitHub Repository](https://github.com/postmanlabs/postman-collection)
- [Integration Guide](https://learning.postman.com/docs/developer/collection-sdk/)

#### Postman API
- REST API service for Postman's cloud platform
- Requires authentication and internet connectivity
- Full access to platform features (workspaces, environments, monitors etc)
- [API Documentation](https://learning.postman.com/docs/developer/postman-api/intro-api/)
- [API Reference](https://www.postman.com/postman/postman-public-workspace/documentation/i2uqzpp/postman-api)

While both follow the Postman Collection Schema, they serve different purposes:
- Use the SDK for local collection manipulation in development pipelines
- Use the API for cloud platform integration and team collaboration features

Example workflow: Generate collections with the SDK locally, then use the API to deploy to team workspaces and configure monitoring.

For detailed comparisons and use cases, see the [Developer Tools Overview](https://learning.postman.com/docs/developer/resources-intro/).

### YAML Files
The YAML files in this directory are derived from the Postman API OpenAPI 3 specification. Files are organized by major section and named accordingly to facilitate work with Claude and AI tools.

Note: The `#/` references can be found in the corresponding reference files. For example:
- `collectionId` is in `docs/reference/postman-api-parameters`
- Request/response objects for `mergeEnvironmentFork` are in `postman-api-requestBodies.yaml` and `postman-api-responsesonly.yaml`
- Schemas are in `postman-api-schemasonly.yaml`

## Getting Started

### Prerequisites
1. Access the [Postman API collection](https://www.postman.com/postman/postman-public-workspace/collection/i2uqzpp/postman-api?ctx=documentation)
2. Generate an API key in [Postman account settings](https://go.postman.co/settings/me/api-keys)
3. Store your API key securely:
   - Use [Postman Vault](https://learning.postman.com/docs/sending-requests/postman-vault/postman-vault-secrets/) for personal use
   - Use [environment variables](https://learning.postman.com/docs/sending-requests/variables/environment-variables/) (secret type) for team sharing

### Quick Start
1. Fork the Postman API collection to your workspace
2. Navigate to the User folder and locate the `/me` endpoint
3. Set your stored API key in the request headers
4. Send the request to verify authentication

For detailed instructions, see [Making your first Postman API call](https://learning.postman.com/docs/developer/postman-api/make-postman-api-call/).

## Authentication

### API Keys
- Generate API keys in your [Postman account settings](https://go.postman.co/settings/me/api-keys)
- Include the API key in the `X-API-Key` header for all requests
- API keys provide access to all Postman resources you have permissions for
- Store API keys as `postman-api-key` variables to use with the [Postman API collection](https://www.postman.com/postman/postman-public-workspace/documentation/i2uqzpp/postman-api)

### Collection Access Keys
- Generate collection-specific read-only access keys for API sharing
- Manage keys in the [API keys page](https://go.postman.co/settings/me/api-keys) under "Collection access keys"
- Each key grants access to a single collection
- Keys can be revoked at any time

For detailed authentication documentation, see [Postman API Authentication](https://learning.postman.com/docs/developer/postman-api/authentication/).

### Rate Limits
Per-user rate limits: 300 requests per minute. Monitor usage through response headers and monthly allowances.

Rate limit information is available through response headers:
- Current window limits via `RateLimit` and `X-RateLimit-*` headers
- Monthly usage via `RateLimit-Limit-Month` and `RateLimit-Remaining-Month`
- Retry timing via `RetryAfter` when limits are exceeded

Resources:
- [API Reference](https://www.postman.com/postman/postman-public-workspace/collection/i2uqzpp/postman-api)
- [Documentation](https://learning.postman.com/docs/developer/postman-api/postman-api-rate-limits/)
- [Usage monitoring](https://go.postman.co/billing/add-ons/overview)
- [Plan comparison](https://www.postman.com/pricing/)
- [Resource usage docs](https://learning.postman.com/docs/billing/resource-usage/#postman-api-usage)

## API Sections

### Workspaces
Manage Postman workspaces, including creating temporary test workspaces and backing up workspace resources.
- [API Reference](https://www.postman.com/postman/postman-public-workspace/folder/wppke9j/workspaces)
- [Documentation](https://learning.postman.com/docs/collaborating-in-postman/using-workspaces/create-workspaces/)

### Collections
Manage Postman Collections with operations for adding, deleting, and updating collections and their contents. Includes fork/PR management and OpenAPI import/export.
- [API Reference](https://www.postman.com/postman/postman-public-workspace/folder/b7pojjp/collections)
- [Documentation](https://learning.postman.com/docs/collections/collections-overview/)

### Environments and Variables
Manage Postman environments and variables (global and collection-level) for different deployment contexts.
- [API Reference](https://www.postman.com/postman/postman-public-workspace/folder/t1fblas/environments)
- [Documentation](https://learning.postman.com/docs/sending-requests/variables/managing-environments/)

### APIs
Manage APIs and integrate with CI/CD systems. Features include API definition updates, version management, and collection synchronization.
- [API Reference](https://www.postman.com/postman/postman-public-workspace/folder/j34rt1l/api)
- [Documentation](https://learning.postman.com/docs/designing-and-developing-your-api/creating-an-api/)

### Mock Servers
Create and manage mock servers with public/private settings, call logging, and error response management.
- [API Reference](https://www.postman.com/postman/postman-public-workspace/folder/zueaxnn/mocks)
- [Documentation](https://learning.postman.com/docs/designing-and-developing-your-api/mocking-data/setting-up-mock/)

### Monitors
Run collections programmatically based on CI/CD events and manage webhooks for collection execution.
- [API Reference](https://www.postman.com/postman/postman-public-workspace/folder/uu45lzt/monitors)
- [Documentation](https://learning.postman.com/docs/monitoring-your-api/intro-monitors/)

### Comments
Manage comments across APIs, collections, folders, requests, and responses.
- [API Reference](https://www.postman.com/postman/postman-public-workspace/folder/kyjatxe/comments)
- [Documentation](https://learning.postman.com/docs/collaborating-in-postman/comments/)

### Forks
Create and manage forks of collections and environments.
- [API Reference](https://www.postman.com/postman/postman-public-workspace/folder/yrtfwkg/forks)
- [Documentation](https://learning.postman.com/docs/collaborating-in-postman/using-version-control/forking-elements/)

### Pull Requests
Handle pull requests for collections, including creation, updates, and status management.
- [API Reference](https://www.postman.com/postman/postman-public-workspace/request/9wzo1v1/create-a-pull-request)
- [Documentation](https://learning.postman.com/docs/collaborating-in-postman/using-version-control/creating-pull-requests/)

### User and Usage Data
Access authenticated user information and account usage details.
- [API Reference](https://www.postman.com/postman/postman-public-workspace/request/ay0ymqy/get-authenticated-user)

### Users and User Groups
Manage team users and groups with capabilities to retrieve team member and group details.
- [API Reference](https://www.postman.com/postman/postman-public-workspace/folder/gpu5rwc/users)
- [Documentation](https://learning.postman.com/docs/administration/managing-your-team/managing-your-team/)

### Roles
Define and manage user permissions for workspaces, collections, and other Postman elements.
- [API Reference](https://www.postman.com/postman/postman-public-workspace/folder/c5hrwtj/roles)
- [Documentation](https://learning.postman.com/docs/collaborating-in-postman/roles-and-permissions/)

### Billing
Access billing account information and integrate with internal systems.
- [API Reference](https://www.postman.com/postman/postman-public-workspace/folder/7iix2ud/billing)
