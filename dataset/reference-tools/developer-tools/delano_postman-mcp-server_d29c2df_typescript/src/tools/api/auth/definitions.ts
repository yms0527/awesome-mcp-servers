import { ToolDefinition } from '../../../types/index.js';

export const TOOL_DEFINITIONS: ToolDefinition[] = [
  {
    name: 'list_collection_access_keys',
    description: 'List collection access keys with optional filtering by collection ID',
    inputSchema: {
      type: 'object',
      properties: {
        collectionId: {
          type: 'string',
          description: 'Filter results by collection ID'
        },
        cursor: {
          type: 'string',
          description: 'Pagination cursor'
        }
      },
      required: [] // No required fields
    }
  },
  {
    name: 'delete_collection_access_key',
    description: 'Delete a collection access key',
    inputSchema: {
      type: 'object',
      required: ['keyId'],
      properties: {
        keyId: {
          type: 'string',
          description: 'The collection access key ID to delete'
        }
      }
    }
  },
  {
    name: 'list_workspace_roles',
    description: 'Get all available workspace roles based on team\'s plan',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [] // No required fields
    }
  },
  {
    name: 'get_workspace_roles',
    description: 'Get roles for a specific workspace',
    inputSchema: {
      type: 'object',
      required: ['workspaceId'],
      properties: {
        workspaceId: {
          type: 'string',
          description: 'The workspace ID'
        },
        includeScim: {
          type: 'boolean',
          description: 'Include SCIM info in response'
        }
      }
    }
  },
  {
    name: 'update_workspace_roles',
    description: 'Update workspace roles for users and groups (limited to 50 operations per call)',
    inputSchema: {
      type: 'object',
      required: ['workspaceId', 'operations'],
      properties: {
        workspaceId: {
          type: 'string',
          description: 'The workspace ID'
        },
        operations: {
          type: 'array',
          maxItems: 50,
          items: {
            type: 'object',
            required: ['op', 'path', 'value'],
            properties: {
              op: {
                type: 'string',
                enum: ['update'],
                description: 'Operation type'
              },
              path: {
                type: 'string',
                enum: ['/user', '/group', '/team'],
                description: 'Resource path'
              },
              value: {
                type: 'array',
                items: {
                  type: 'object',
                  required: ['id', 'role'],
                  properties: {
                    id: {
                      type: 'number',
                      description: 'User/group/team ID'
                    },
                    role: {
                      type: 'string',
                      enum: ['VIEWER', 'EDITOR'],
                      description: 'Role to assign'
                    }
                  }
                }
              }
            }
          }
        },
        identifierType: {
          type: 'string',
          enum: ['scim'],
          description: 'Optional SCIM identifier type'
        }
      }
    }
  },
  {
    name: 'get_collection_roles',
    description: 'Get roles for a collection',
    inputSchema: {
      type: 'object',
      required: ['collectionId'],
      properties: {
        collectionId: {
          type: 'string',
          description: 'The collection ID'
        }
      }
    }
  },
  {
    name: 'update_collection_roles',
    description: 'Update collection roles (requires EDITOR role)',
    inputSchema: {
      type: 'object',
      required: ['collectionId', 'operations'],
      properties: {
        collectionId: {
          type: 'string',
          description: 'The collection ID'
        },
        operations: {
          type: 'array',
          items: {
            type: 'object',
            required: ['op', 'path', 'value'],
            properties: {
              op: {
                type: 'string',
                enum: ['update'],
                description: 'Operation type'
              },
              path: {
                type: 'string',
                enum: ['/user', '/group', '/team'],
                description: 'Resource path'
              },
              value: {
                type: 'array',
                items: {
                  type: 'object',
                  required: ['id', 'role'],
                  properties: {
                    id: {
                      type: 'number',
                      description: 'User/group/team ID'
                    },
                    role: {
                      type: 'string',
                      enum: ['VIEWER', 'EDITOR'],
                      description: 'Role to assign'
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  {
    name: 'get_authenticated_user',
    description: 'Get authenticated user information',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [] // No required fields
    }
  }
];
