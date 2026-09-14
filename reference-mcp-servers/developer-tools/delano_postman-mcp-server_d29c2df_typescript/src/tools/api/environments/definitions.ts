import { ToolDefinition } from '../../../types/index.js';

export const TOOL_DEFINITIONS: ToolDefinition[] = [
  {
    name: 'list_environments',
    description: 'List all environments in a workspace. If workspace not specified, lists environments in "My Workspace".',
    inputSchema: {
      type: 'object',
      properties: {
        workspace: {
          type: 'string',
          description: 'Workspace ID (optional)',
        },
      },
      required: [], // Empty array since workspace is optional
    },
  },
  {
    name: 'get_environment',
    description: 'Get details of a specific environment',
    inputSchema: {
      type: 'object',
      properties: {
        environmentId: {
          type: 'string',
          description: 'Environment ID in format: {ownerId}-{environmentId} (e.g., "31912785-b8cdb26a-0c58-4f35-9775-4945c39d7ee2")',
        },
      },
      required: ['environmentId'],
    },
  },
  {
    name: 'create_environment',
    description: 'Create a new environment in a workspace. Creates in "My Workspace" if workspace not specified.',
    inputSchema: {
      type: 'object',
      properties: {
        environment: {
          type: 'object',
          description: 'Environment details',
          properties: {
            name: { type: 'string', description: 'Environment name' },
            values: {
              type: 'array',
              description: 'Environment variables',
              items: {
                type: 'object',
                properties: {
                  key: { type: 'string', description: 'Variable name' },
                  value: { type: 'string', description: 'Variable value' },
                  type: { type: 'string', enum: ['default', 'secret'], description: 'Variable type' },
                  enabled: { type: 'boolean', description: 'Variable enabled status' }
                },
                required: ['key', 'value']
              }
            }
          },
          required: ['name']
        },
        workspace: { type: 'string', description: 'Workspace ID (optional)' }
      },
      required: ['environment']
    }
  },
  {
    name: 'update_environment',
    description: 'Update an existing environment. Only include variables that need to be modified.',
    inputSchema: {
      type: 'object',
      properties: {
        environmentId: {
          type: 'string',
          description: 'Environment ID in format: {ownerId}-{environmentId}'
        },
        environment: {
          type: 'object',
          description: 'Environment details to update',
          properties: {
            name: { type: 'string', description: 'New environment name (optional)' },
            values: {
              type: 'array',
              description: 'Environment variables to update (optional)',
              items: {
                type: 'object',
                properties: {
                  key: { type: 'string' },
                  value: { type: 'string' },
                  type: { type: 'string', enum: ['default', 'secret'] },
                  enabled: { type: 'boolean' }
                },
                required: ['key', 'value']
              }
            }
          }
        }
      },
      required: ['environmentId', 'environment']
    }
  },
  {
    name: 'delete_environment',
    description: 'Delete an environment',
    inputSchema: {
      type: 'object',
      properties: {
        environmentId: {
          type: 'string',
          description: 'Environment ID in format: {ownerId}-{environmentId}'
        }
      },
      required: ['environmentId']
    }
  },
  {
    name: 'fork_environment',
    description: 'Create a fork of an environment in a workspace',
    inputSchema: {
      type: 'object',
      properties: {
        environmentId: {
          type: 'string',
          description: 'Environment ID in format: {ownerId}-{environmentId}'
        },
        label: { type: 'string', description: 'Label/name for the forked environment' },
        workspace: { type: 'string', description: 'Target workspace ID' }
      },
      required: ['environmentId', 'label', 'workspace']
    }
  },
  {
    name: 'get_environment_forks',
    description: 'Get a list of environment forks',
    inputSchema: {
      type: 'object',
      properties: {
        environmentId: {
          type: 'string',
          description: 'Environment ID in format: {ownerId}-{environmentId}'
        },
        cursor: { type: 'string', description: 'Pagination cursor' },
        direction: { type: 'string', enum: ['asc', 'desc'], description: 'Sort direction' },
        limit: { type: 'number', description: 'Number of results per page' },
        sort: { type: 'string', enum: ['createdAt'], description: 'Sort field' }
      },
      required: ['environmentId']
    }
  },
  {
    name: 'merge_environment_fork',
    description: 'Merge a forked environment back into its parent',
    inputSchema: {
      type: 'object',
      properties: {
        environmentId: {
          type: 'string',
          description: 'Environment ID in format: {ownerId}-{environmentId}'
        },
        source: {
          type: 'string',
          description: 'Source environment ID in format: {ownerId}-{environmentId}'
        },
        destination: {
          type: 'string',
          description: 'Destination environment ID in format: {ownerId}-{environmentId}'
        },
        strategy: {
          type: 'object',
          description: 'Merge strategy options',
          properties: {
            deleteSource: { type: 'boolean', description: 'Whether to delete the source environment after merging' }
          }
        }
      },
      required: ['environmentId', 'source', 'destination']
    }
  },
  {
    name: 'pull_environment',
    description: 'Pull changes from parent environment into forked environment',
    inputSchema: {
      type: 'object',
      properties: {
        environmentId: {
          type: 'string',
          description: 'Environment ID in format: {ownerId}-{environmentId}'
        },
        source: {
          type: 'string',
          description: 'Source (parent) environment ID in format: {ownerId}-{environmentId}'
        },
        destination: {
          type: 'string',
          description: 'Destination (fork) environment ID in format: {ownerId}-{environmentId}'
        }
      },
      required: ['environmentId', 'source', 'destination']
    }
  }
];
