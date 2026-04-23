import { ToolDefinition } from '../../../types/index.js';

export const TOOL_DEFINITIONS: ToolDefinition[] =  [
  {
    name: 'list_workspaces',
    description: 'List all workspaces',
    inputSchema: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          enum: ['personal', 'team', 'private', 'public', 'partner'],
          description: 'Filter workspaces by type',
        },
        createdBy: {
          type: 'string',
          description: 'Filter workspaces by creator',
        },
        include: {
          type: 'string',
          description: 'Additional data to include in response',
        },
      },
      required: [],
    },
  },
  {
    name: 'get_workspace',
    description: 'Get details of a specific workspace',
    inputSchema: {
      type: 'object',
      properties: {
        workspace: {
          type: 'string',
          description: 'Workspace ID',
        },
        include: {
          type: 'string',
          description: 'Additional data to include in response',
        },
      },
      required: ['workspace'],
    },
  },
];
