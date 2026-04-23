import { ToolDefinition } from '../../../types/index.js';

export const TOOL_DEFINITIONS: ToolDefinition[] = [
  {
    name: 'list_monitors',
    description: 'Get all monitors',
    inputSchema: {
      type: 'object',
      properties: {
        workspace: {
          type: 'string',
          description: 'Return only monitors found in the given workspace'
        }
      },
      required: [] // Empty array since workspace is optional
    }
  },
  {
    name: 'get_monitor',
    description: 'Get details of a specific monitor',
    inputSchema: {
      type: 'object',
      properties: {
        monitorId: {
          type: 'string',
          description: 'Monitor ID'
        }
      },
      required: ['monitorId']
    }
  },
  {
    name: 'create_monitor',
    description: 'Create a new monitor. Cannot create monitors for collections added to an API definition.',
    inputSchema: {
      type: 'object',
      properties: {
        monitor: {
          type: 'object',
          description: 'Monitor details',
          properties: {
            name: { type: 'string', description: 'Monitor name' },
            collection: { type: 'string', description: 'Collection ID to monitor' },
            environment: { type: 'string', description: 'Environment ID to use' },
            schedule: {
              type: 'object',
              description: 'Schedule configuration',
              properties: {
                cron: { type: 'string', description: 'Cron expression for timing' },
                timezone: { type: 'string', description: 'Timezone for schedule' }
              },
              required: ['cron', 'timezone']
            },
            options: {
              type: 'object',
              description: 'Monitor options',
              properties: {
                strictSSL: { type: 'boolean', description: 'SSL verification setting' },
                followRedirects: { type: 'boolean', description: 'Redirect handling' },
                requestTimeout: { type: 'number', description: 'Request timeout in ms' }
              }
            }
          },
          required: ['name', 'collection', 'schedule']
        },
        workspace: { type: 'string', description: 'Workspace ID' }
      },
      required: ['monitor']
    }
  },
  {
    name: 'update_monitor',
    description: 'Update an existing monitor',
    inputSchema: {
      type: 'object',
      properties: {
        monitorId: {
          type: 'string',
          description: 'Monitor ID'
        },
        monitor: {
          type: 'object',
          description: 'Monitor details to update',
          properties: {
            name: { type: 'string', description: 'Updated monitor name' },
            collection: { type: 'string', description: 'New collection ID' },
            environment: { type: 'string', description: 'New environment ID' },
            schedule: {
              type: 'object',
              description: 'Updated schedule configuration',
              properties: {
                cron: { type: 'string', description: 'New cron expression' },
                timezone: { type: 'string', description: 'New timezone' }
              }
            },
            options: {
              type: 'object',
              description: 'Updated monitor options',
              properties: {
                strictSSL: { type: 'boolean', description: 'SSL verification setting' },
                followRedirects: { type: 'boolean', description: 'Redirect handling' },
                requestTimeout: { type: 'number', description: 'Request timeout in ms' }
              }
            }
          }
        }
      },
      required: ['monitorId', 'monitor']
    }
  },
  {
    name: 'delete_monitor',
    description: 'Delete a monitor',
    inputSchema: {
      type: 'object',
      properties: {
        monitorId: {
          type: 'string',
          description: 'Monitor ID'
        }
      },
      required: ['monitorId']
    }
  },
  {
    name: 'run_monitor',
    description: 'Run a monitor. For async=true, response won\'t include stats, executions, and failures. Use GET /monitors/{id} to get this information for async runs.',
    inputSchema: {
      type: 'object',
      properties: {
        monitorId: {
          type: 'string',
          description: 'Monitor ID'
        },
        async: {
          type: 'boolean',
          description: 'If true, runs the monitor asynchronously from the created monitor run task',
          default: false
        }
      },
      required: ['monitorId']
    }
  }
];
