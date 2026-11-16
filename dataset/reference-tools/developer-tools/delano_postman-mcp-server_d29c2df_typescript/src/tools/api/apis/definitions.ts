import { ApiCollectionOperationType, ApiSchemaType } from '../../../types/apis.js';
import { ToolDefinition } from '../../../types/index.js';

export const TOOL_DEFINITIONS: ToolDefinition[] = [
  {
    name: 'list_apis',
    description: 'List all APIs in a workspace',
    inputSchema: {
      type: 'object',
      properties: {
        workspaceId: {
          type: 'string',
          description: 'Workspace ID (required)',
        },
        createdBy: {
          type: 'number',
          description: 'Filter by creator user ID',
        },
        cursor: {
          type: 'string',
          description: 'Pagination cursor',
        },
        description: {
          type: 'string',
          description: 'Filter by description text',
        },
        limit: {
          type: 'number',
          description: 'Maximum number of results',
        },
      },
      required: ['workspaceId'],
    },
  },
  {
    name: 'get_api',
    description: 'Get details of a specific API',
    inputSchema: {
      type: 'object',
      properties: {
        apiId: {
          type: 'string',
          description: 'API ID',
        },
        include: {
          type: 'array',
          items: {
            type: 'string',
            enum: ['collections', 'versions', 'schemas', 'gitInfo'],
          },
          description: 'Additional data to include',
        },
      },
      required: ['apiId'],
    },
  },
  {
    name: 'create_api',
    description: 'Create a new API',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'API name',
        },
        summary: {
          type: 'string',
          description: 'Brief description',
        },
        description: {
          type: 'string',
          description: 'Detailed description (supports Markdown)',
        },
        workspaceId: {
          type: 'string',
          description: 'Target workspace ID',
        },
      },
      required: ['name', 'workspaceId'],
    },
  },
  {
    name: 'update_api',
    description: 'Update an existing API',
    inputSchema: {
      type: 'object',
      properties: {
        apiId: {
          type: 'string',
          description: 'API ID',
        },
        name: {
          type: 'string',
          description: 'New API name',
        },
        summary: {
          type: 'string',
          description: 'Updated brief description',
        },
        description: {
          type: 'string',
          description: 'Updated detailed description',
        },
      },
      required: ['apiId'],
    },
  },
  {
    name: 'delete_api',
    description: 'Delete an API',
    inputSchema: {
      type: 'object',
      properties: {
        apiId: {
          type: 'string',
          description: 'API ID',
        },
      },
      required: ['apiId'],
    },
  },
  {
    name: 'add_api_collection',
    description: 'Add a collection to an API',
    inputSchema: {
      type: 'object',
      properties: {
        apiId: {
          type: 'string',
          description: 'API ID',
        },
        operationType: {
          type: 'string',
          enum: Object.values(ApiCollectionOperationType),
          description: 'Type of collection operation',
        },
        data: {
          type: 'object',
          description: 'Collection data based on operation type',
        },
      },
      required: ['apiId', 'operationType'],
    },
  },
  {
    name: 'get_api_collection',
    description: 'Get a specific collection from an API',
    inputSchema: {
      type: 'object',
      properties: {
        apiId: {
          type: 'string',
          description: 'API ID',
        },
        collectionId: {
          type: 'string',
          description: 'Collection ID',
        },
        versionId: {
          type: 'string',
          description: 'Version ID (required for API viewers)',
        },
      },
      required: ['apiId', 'collectionId'],
    },
  },
  {
    name: 'create_api_schema',
    description: 'Create a schema for an API',
    inputSchema: {
      type: 'object',
      properties: {
        apiId: {
          type: 'string',
          description: 'API ID',
        },
        type: {
          type: 'string',
          enum: Object.values(ApiSchemaType),
          description: 'Schema type',
        },
        files: {
          type: 'array',
          description: 'Schema files',
          items: {
            type: 'object',
            properties: {
              path: {
                type: 'string',
                description: 'File path',
              },
              content: {
                type: 'string',
                description: 'File content',
              },
              root: {
                type: 'object',
                properties: {
                  enabled: {
                    type: 'boolean',
                    description: 'Tag as root file (protobuf only)',
                  },
                },
              },
            },
            required: ['path', 'content'],
          },
        },
      },
      required: ['apiId', 'type', 'files'],
    },
  },
  {
    name: 'get_api_schema',
    description: 'Get a specific schema from an API',
    inputSchema: {
      type: 'object',
      properties: {
        apiId: {
          type: 'string',
          description: 'API ID',
        },
        schemaId: {
          type: 'string',
          description: 'Schema ID',
        },
        versionId: {
          type: 'string',
          description: 'Version ID (required for API viewers)',
        },
        bundled: {
          type: 'boolean',
          description: 'Return schema in bundled format',
        },
      },
      required: ['apiId', 'schemaId'],
    },
  },
  {
    name: 'create_api_version',
    description: 'Create a new version of an API',
    inputSchema: {
      type: 'object',
      properties: {
        apiId: {
          type: 'string',
          description: 'API ID',
        },
        name: {
          type: 'string',
          description: 'Version name',
        },
        schemas: {
          type: 'array',
          description: 'Schema references',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              filePath: { type: 'string' },
              directoryPath: { type: 'string' },
            },
          },
        },
        collections: {
          type: 'array',
          description: 'Collection references',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              filePath: { type: 'string' },
            },
          },
        },
        branch: {
          type: 'string',
          description: 'Git branch (for git-linked APIs)',
        },
        releaseNotes: {
          type: 'string',
          description: 'Version release notes',
        },
      },
      required: ['apiId', 'name', 'schemas', 'collections'],
    },
  },
  {
    name: 'get_api_versions',
    description: 'Get all versions of an API',
    inputSchema: {
      type: 'object',
      properties: {
        apiId: {
          type: 'string',
          description: 'API ID',
        },
        cursor: {
          type: 'string',
          description: 'Pagination cursor',
        },
        limit: {
          type: 'number',
          description: 'Maximum number of results',
        },
      },
      required: ['apiId'],
    },
  },
  {
    name: 'get_api_version',
    description: 'Get a specific version of an API',
    inputSchema: {
      type: 'object',
      properties: {
        apiId: {
          type: 'string',
          description: 'API ID',
        },
        versionId: {
          type: 'string',
          description: 'Version ID',
        },
      },
      required: ['apiId', 'versionId'],
    },
  },
  {
    name: 'update_api_version',
    description: 'Update an API version',
    inputSchema: {
      type: 'object',
      properties: {
        apiId: {
          type: 'string',
          description: 'API ID',
        },
        versionId: {
          type: 'string',
          description: 'Version ID',
        },
        name: {
          type: 'string',
          description: 'New version name',
        },
        releaseNotes: {
          type: 'string',
          description: 'Updated release notes',
        },
      },
      required: ['apiId', 'versionId', 'name'],
    },
  },
  {
    name: 'delete_api_version',
    description: 'Delete an API version',
    inputSchema: {
      type: 'object',
      properties: {
        apiId: {
          type: 'string',
          description: 'API ID',
        },
        versionId: {
          type: 'string',
          description: 'Version ID',
        },
      },
      required: ['apiId', 'versionId'],
    },
  },
  {
    name: 'get_api_comments',
    description: 'Get comments for an API',
    inputSchema: {
      type: 'object',
      properties: {
        apiId: {
          type: 'string',
          description: 'API ID',
        },
        cursor: {
          type: 'string',
          description: 'Pagination cursor',
        },
        limit: {
          type: 'number',
          description: 'Maximum number of results',
        },
      },
      required: ['apiId'],
    },
  },
  {
    name: 'create_api_comment',
    description: 'Create a new comment on an API (max 10,000 characters)',
    inputSchema: {
      type: 'object',
      properties: {
        apiId: {
          type: 'string',
          description: 'API ID',
        },
        content: {
          type: 'string',
          description: 'Comment text (max 10,000 characters)',
        },
        threadId: {
          type: 'number',
          description: 'Thread ID for replies',
        },
      },
      required: ['apiId', 'content'],
    },
  },
  {
    name: 'update_api_comment',
    description: 'Update an existing API comment (max 10,000 characters)',
    inputSchema: {
      type: 'object',
      properties: {
        apiId: {
          type: 'string',
          description: 'API ID',
        },
        commentId: {
          type: 'number',
          description: 'Comment ID',
        },
        content: {
          type: 'string',
          description: 'Updated comment text (max 10,000 characters)',
        },
      },
      required: ['apiId', 'commentId', 'content'],
    },
  },
  {
    name: 'delete_api_comment',
    description: 'Delete an API comment',
    inputSchema: {
      type: 'object',
      properties: {
        apiId: {
          type: 'string',
          description: 'API ID',
        },
        commentId: {
          type: 'number',
          description: 'Comment ID',
        },
      },
      required: ['apiId', 'commentId'],
    },
  },
  {
    name: 'get_api_tags',
    description: 'Get tags for an API',
    inputSchema: {
      type: 'object',
      properties: {
        apiId: {
          type: 'string',
          description: 'API ID',
        },
      },
      required: ['apiId'],
    },
  },
  {
    name: 'update_api_tags',
    description: 'Update tags for an API',
    inputSchema: {
      type: 'object',
      properties: {
        apiId: {
          type: 'string',
          description: 'API ID',
        },
        tags: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              slug: {
                type: 'string',
                description: 'Tag slug',
              },
              name: {
                type: 'string',
                description: 'Tag display name',
              },
            },
            required: ['slug'],
          },
          description: 'List of tags',
        },
      },
      required: ['apiId', 'tags'],
    },
  },
  {
    name: 'get_api_schema_files',
    description: 'Get files in an API schema',
    inputSchema: {
      type: 'object',
      properties: {
        apiId: {
          type: 'string',
          description: 'API ID',
        },
        schemaId: {
          type: 'string',
          description: 'Schema ID',
        },
        cursor: {
          type: 'string',
          description: 'Pagination cursor',
        },
        limit: {
          type: 'number',
          description: 'Maximum number of results',
        },
        versionId: {
          type: 'string',
          description: 'Version ID (required for API viewers)',
        },
      },
      required: ['apiId', 'schemaId'],
    },
  },
  {
    name: 'get_schema_file_contents',
    description: 'Get contents of a schema file',
    inputSchema: {
      type: 'object',
      properties: {
        apiId: {
          type: 'string',
          description: 'API ID',
        },
        schemaId: {
          type: 'string',
          description: 'Schema ID',
        },
        filePath: {
          type: 'string',
          description: 'Path to the schema file',
        },
        versionId: {
          type: 'string',
          description: 'Version ID (required for API viewers)',
        },
      },
      required: ['apiId', 'schemaId', 'filePath'],
    },
  },
  {
    name: 'create_update_schema_file',
    description: 'Create or update a schema file',
    inputSchema: {
      type: 'object',
      properties: {
        apiId: {
          type: 'string',
          description: 'API ID',
        },
        schemaId: {
          type: 'string',
          description: 'Schema ID',
        },
        filePath: {
          type: 'string',
          description: 'Path to the schema file',
        },
        content: {
          type: 'string',
          description: 'File content',
        },
        root: {
          type: 'object',
          properties: {
            enabled: {
              type: 'boolean',
              description: 'Tag as root file (protobuf only)',
            },
          },
        },
      },
      required: ['apiId', 'schemaId', 'filePath', 'content'],
    },
  },
  {
    name: 'delete_schema_file',
    description: 'Delete a schema file',
    inputSchema: {
      type: 'object',
      properties: {
        apiId: {
          type: 'string',
          description: 'API ID',
        },
        schemaId: {
          type: 'string',
          description: 'Schema ID',
        },
        filePath: {
          type: 'string',
          description: 'Path to the schema file',
        },
      },
      required: ['apiId', 'schemaId', 'filePath'],
    },
  },
  {
    name: 'sync_collection_with_schema',
    description: 'Sync a collection with its schema',
    inputSchema: {
      type: 'object',
      properties: {
        apiId: {
          type: 'string',
          description: 'API ID',
        },
        collectionId: {
          type: 'string',
          description: 'Collection ID',
        },
      },
      required: ['apiId', 'collectionId'],
    },
  },
  {
    name: 'get_task_status',
    description: 'Get status of an asynchronous task',
    inputSchema: {
      type: 'object',
      properties: {
        apiId: {
          type: 'string',
          description: 'API ID',
        },
        taskId: {
          type: 'string',
          description: 'Task ID',
        },
      },
      required: ['apiId', 'taskId'],
    },
  },
];
