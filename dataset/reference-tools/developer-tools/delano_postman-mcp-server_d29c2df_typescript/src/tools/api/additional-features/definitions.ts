import { ToolDefinition } from '../../../types/index.js';

export const TOOL_DEFINITIONS: ToolDefinition[] = [
  // Billing
  {
    name: 'get_accounts',
    description: 'Gets Postman billing account details for the given team',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'list_account_invoices',
    description: 'Gets all invoices for a Postman billing account filtered by status',
    inputSchema: {
      type: 'object',
      properties: {
        accountId: {
          type: 'string',
          description: "The account's ID"
        },
        status: {
          type: 'string',
          enum: ['PAID'],
          description: "The account's status"
        }
      },
      required: ['accountId', 'status']
    }
  },

  // Comment Resolution
  {
    name: 'resolve_comment_thread',
    description: 'Resolves a comment and any associated replies',
    inputSchema: {
      type: 'object',
      properties: {
        threadId: {
          type: 'string',
          description: 'The comment thread ID'
        }
      },
      required: ['threadId']
    }
  },

  // Private API Network
  {
    name: 'list_pan_elements',
    description: 'Get all elements and folders in Private API Network',
    inputSchema: {
      type: 'object',
      properties: {
        since: {
          type: 'string',
          description: 'Return only results created since the given time (ISO 8601)'
        },
        until: {
          type: 'string',
          description: 'Return only results created until this given time (ISO 8601)'
        },
        addedBy: {
          type: 'integer',
          description: 'Return only elements published by the given user ID'
        },
        name: {
          type: 'string',
          description: 'Return only elements whose name includes the given value'
        },
        summary: {
          type: 'string',
          description: 'Return only elements whose summary includes the given value'
        },
        description: {
          type: 'string',
          description: 'Return only elements whose description includes the given value'
        },
        sort: {
          type: 'string',
          enum: ['createdAt', 'updatedAt'],
          description: 'Sort field'
        },
        direction: {
          type: 'string',
          enum: ['asc', 'desc'],
          description: 'Sort direction'
        },
        offset: {
          type: 'integer',
          description: 'Number of results to skip'
        },
        limit: {
          type: 'integer',
          description: 'Maximum number of results to return'
        },
        parentFolderId: {
          type: 'integer',
          description: 'Return elements in specific folder. Use 0 for root folder.'
        },
        type: {
          type: 'string',
          enum: ['api', 'folder', 'collection', 'workspace'],
          description: 'Filter by element type'
        }
      },
      required: []
    }
  },
  {
    name: 'add_pan_element',
    description: 'Add element or folder to Private API Network',
    inputSchema: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          enum: ['api', 'collection', 'workspace', 'folder'],
          description: 'Element type'
        },
        name: {
          type: 'string',
          description: 'Element/folder name'
        },
        description: {
          type: 'string',
          description: 'Element/folder description'
        },
        summary: {
          type: 'string',
          description: 'Element summary'
        },
        parentFolderId: {
          type: 'integer',
          description: 'Parent folder ID'
        },
        elementId: {
          type: 'string',
          description: 'ID of API/collection/workspace to add'
        }
      },
      required: ['type', 'name']
    }
  },
  {
    name: 'update_pan_element',
    description: 'Update element or folder in Private API Network',
    inputSchema: {
      type: 'object',
      properties: {
        elementId: {
          type: 'string',
          description: 'Element ID'
        },
        elementType: {
          type: 'string',
          enum: ['api', 'collection', 'workspace', 'folder'],
          description: 'Element type'
        },
        name: {
          type: 'string',
          description: 'Updated name'
        },
        description: {
          type: 'string',
          description: 'Updated description'
        },
        summary: {
          type: 'string',
          description: 'Updated summary'
        },
        parentFolderId: {
          type: 'integer',
          description: 'New parent folder ID'
        }
      },
      required: ['elementId', 'elementType']
    }
  },
  {
    name: 'remove_pan_element',
    description: 'Remove element or folder from Private API Network',
    inputSchema: {
      type: 'object',
      properties: {
        elementId: {
          type: 'string',
          description: 'Element ID'
        },
        elementType: {
          type: 'string',
          enum: ['api', 'collection', 'workspace', 'folder'],
          description: 'Element type'
        }
      },
      required: ['elementId', 'elementType']
    }
  },

  // Webhooks
  {
    name: 'create_webhook',
    description: 'Creates webhook that triggers collection with custom payload',
    inputSchema: {
      type: 'object',
      properties: {
        workspace: {
          type: 'string',
          description: 'Workspace ID'
        },
        webhook: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Webhook name'
            },
            collection: {
              type: 'string',
              description: 'Collection ID to trigger'
            },
            description: {
              type: 'string',
              description: 'Webhook description'
            },
            events: {
              type: 'array',
              description: 'Array of events to trigger on',
              items: {
                type: 'string'
              }
            }
          },
          required: ['name', 'collection']
        }
      },
      required: ['workspace', 'webhook']
    }
  },

  // Tags
  {
    name: 'get_tagged_elements',
    description: 'Get elements by tag',
    inputSchema: {
      type: 'object',
      properties: {
        slug: {
          type: 'string',
          description: 'Tag slug'
        },
        limit: {
          type: 'integer',
          description: 'Maximum number of results to return'
        },
        direction: {
          type: 'string',
          enum: ['asc', 'desc'],
          description: 'Sort direction'
        },
        cursor: {
          type: 'string',
          description: 'Pagination cursor'
        },
        entityType: {
          type: 'string',
          enum: ['api', 'collection', 'workspace'],
          description: 'Filter by entity type'
        }
      },
      required: ['slug']
    }
  },
  {
    name: 'get_workspace_tags',
    description: 'Get workspace tags',
    inputSchema: {
      type: 'object',
      properties: {
        workspaceId: {
          type: 'string',
          description: 'Workspace ID'
        }
      },
      required: ['workspaceId']
    }
  },
  {
    name: 'update_workspace_tags',
    description: 'Update workspace tags',
    inputSchema: {
      type: 'object',
      properties: {
        workspaceId: {
          type: 'string',
          description: 'Workspace ID'
        },
        tags: {
          type: 'array',
          description: 'Array of tag objects',
          items: {
            type: 'object',
            properties: {
              slug: {
                type: 'string',
                description: 'Tag slug'
              },
              name: {
                type: 'string',
                description: 'Tag name'
              }
            },
            required: ['slug', 'name']
          }
        }
      },
      required: ['workspaceId', 'tags']
    }
  }
];
