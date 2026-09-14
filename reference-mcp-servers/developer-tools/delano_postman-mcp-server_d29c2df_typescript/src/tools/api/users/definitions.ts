import { ToolDefinition } from '../../../types/index.js';

export const TOOL_DEFINITIONS: ToolDefinition[] = [
  {
    name: 'get_user_info',
    description: 'Get information about the authenticated user',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
];
