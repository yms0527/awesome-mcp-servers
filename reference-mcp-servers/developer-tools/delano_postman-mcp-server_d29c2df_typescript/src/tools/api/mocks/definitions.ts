import { ToolDefinition } from '../../../types/index.js';

export const TOOL_DEFINITIONS: ToolDefinition[] = [
  {
    name: 'list_mocks',
    description: 'List all mock servers',
    inputSchema: {
      type: 'object',
      properties: {
        teamId: {
          type: 'string',
          description: 'Return only results that belong to the given team ID'
        },
        workspace: {
          type: 'string',
          description: 'Return only results found in the given workspace. If both teamId and workspace provided, only workspace is used.'
        }
      },
      required: [] // No required fields for list operation
    }
  },
  {
    name: 'create_mock',
    description: 'Create a new mock server. Creates in Personal workspace if workspace not specified.',
    inputSchema: {
      type: 'object',
      properties: {
        workspace: {
          type: 'string',
          description: 'Workspace ID to create the mock in'
        },
        mock: {
          type: 'object',
          required: ['collection', 'name'],
          properties: {
            collection: {
              type: 'string',
              description: 'Collection ID to mock'
            },
            name: {
              type: 'string',
              description: 'Mock server name'
            },
            description: {
              type: 'string',
              description: 'Mock server description'
            },
            environment: {
              type: 'string',
              description: 'Environment ID to use'
            },
            private: {
              type: 'boolean',
              description: 'Access control setting'
            },
            versionTag: {
              type: 'string',
              description: 'Collection version tag'
            }
          }
        }
      },
      required: ['mock'] // mock object is required for creation
    }
  },
  {
    name: 'get_mock',
    description: 'Get details of a specific mock server',
    inputSchema: {
      type: 'object',
      required: ['mockId'],
      properties: {
        mockId: {
          type: 'string',
          description: 'The mock server ID'
        }
      }
    }
  },
  {
    name: 'update_mock',
    description: 'Update an existing mock server',
    inputSchema: {
      type: 'object',
      required: ['mockId', 'mock'],
      properties: {
        mockId: {
          type: 'string',
          description: 'The mock server ID'
        },
        mock: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'New mock server name'
            },
            description: {
              type: 'string',
              description: 'Updated description'
            },
            environment: {
              type: 'string',
              description: 'New environment ID'
            },
            private: {
              type: 'boolean',
              description: 'Updated access control setting'
            },
            versionTag: {
              type: 'string',
              description: 'Updated collection version tag'
            }
          }
        }
      }
    }
  },
  {
    name: 'delete_mock',
    description: 'Delete a mock server',
    inputSchema: {
      type: 'object',
      required: ['mockId'],
      properties: {
        mockId: {
          type: 'string',
          description: 'The mock server ID'
        }
      }
    }
  },
  {
    name: 'get_mock_call_logs',
    description: 'Get mock call logs. Maximum 6.5MB or 100 call logs per API call. Retention period based on Postman plan.',
    inputSchema: {
      type: 'object',
      required: ['mockId'],
      properties: {
        mockId: {
          type: 'string',
          description: 'The mock server ID'
        },
        limit: {
          type: 'number',
          description: 'Maximum number of logs to return (default: 100)'
        },
        cursor: {
          type: 'string',
          description: 'Pagination cursor'
        },
        until: {
          type: 'string',
          description: 'Return logs until this timestamp'
        },
        since: {
          type: 'string',
          description: 'Return logs since this timestamp'
        },
        responseStatusCode: {
          type: 'number',
          description: 'Filter by response status code'
        },
        responseType: {
          type: 'string',
          description: 'Filter by response type'
        },
        requestMethod: {
          type: 'string',
          description: 'Filter by request method'
        },
        requestPath: {
          type: 'string',
          description: 'Filter by request path'
        },
        sort: {
          type: 'string',
          enum: ['servedAt'],
          description: 'Sort field'
        },
        direction: {
          type: 'string',
          enum: ['asc', 'desc'],
          description: 'Sort direction'
        },
        include: {
          type: 'string',
          description: 'Include additional data (request.headers, request.body, response.headers, response.body)'
        }
      }
    }
  },
  {
    name: 'publish_mock',
    description: 'Publish mock server (sets Access Control to public)',
    inputSchema: {
      type: 'object',
      required: ['mockId'],
      properties: {
        mockId: {
          type: 'string',
          description: 'The mock server ID'
        }
      }
    }
  },
  {
    name: 'unpublish_mock',
    description: 'Unpublish mock server (sets Access Control to private)',
    inputSchema: {
      type: 'object',
      required: ['mockId'],
      properties: {
        mockId: {
          type: 'string',
          description: 'The mock server ID'
        }
      }
    }
  },
  {
    name: 'list_server_responses',
    description: 'Get all server responses for a mock',
    inputSchema: {
      type: 'object',
      required: ['mockId'],
      properties: {
        mockId: {
          type: 'string',
          description: 'The mock server ID'
        }
      }
    }
  },
  {
    name: 'create_server_response',
    description: 'Create a server response. Only one server response can be active at a time.',
    inputSchema: {
      type: 'object',
      required: ['mockId', 'serverResponse'],
      properties: {
        mockId: {
          type: 'string',
          description: 'The mock server ID'
        },
        serverResponse: {
          type: 'object',
          required: ['name', 'code', 'headers', 'body'],
          properties: {
            name: {
              type: 'string',
              description: 'Response name'
            },
            code: {
              type: 'number',
              description: 'HTTP status code'
            },
            headers: {
              type: 'array',
              description: 'Response headers',
              items: {
                type: 'object',
                properties: {
                  key: { type: 'string' },
                  value: { type: 'string' }
                }
              }
            },
            body: {
              type: 'string',
              description: 'Response body content'
            },
            active: {
              type: 'boolean',
              description: 'Set as active response'
            },
            delay: {
              type: 'number',
              description: 'Response delay in milliseconds'
            }
          }
        }
      }
    }
  },
  {
    name: 'get_server_response',
    description: 'Get a specific server response',
    inputSchema: {
      type: 'object',
      required: ['mockId', 'serverResponseId'],
      properties: {
        mockId: {
          type: 'string',
          description: 'The mock server ID'
        },
        serverResponseId: {
          type: 'string',
          description: 'The server response ID'
        }
      }
    }
  },
  {
    name: 'update_server_response',
    description: 'Update a server response',
    inputSchema: {
      type: 'object',
      required: ['mockId', 'serverResponseId', 'serverResponse'],
      properties: {
        mockId: {
          type: 'string',
          description: 'The mock server ID'
        },
        serverResponseId: {
          type: 'string',
          description: 'The server response ID'
        },
        serverResponse: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Updated response name'
            },
            code: {
              type: 'number',
              description: 'Updated HTTP status code'
            },
            headers: {
              type: 'array',
              description: 'Updated response headers',
              items: {
                type: 'object',
                properties: {
                  key: { type: 'string' },
                  value: { type: 'string' }
                }
              }
            },
            body: {
              type: 'string',
              description: 'Updated response body'
            },
            active: {
              type: 'boolean',
              description: 'Change active status'
            },
            delay: {
              type: 'number',
              description: 'Updated response delay'
            }
          }
        }
      }
    }
  },
  {
    name: 'delete_server_response',
    description: 'Delete a server response',
    inputSchema: {
      type: 'object',
      required: ['mockId', 'serverResponseId'],
      properties: {
        mockId: {
          type: 'string',
          description: 'The mock server ID'
        },
        serverResponseId: {
          type: 'string',
          description: 'The server response ID'
        }
      }
    }
  }
];
