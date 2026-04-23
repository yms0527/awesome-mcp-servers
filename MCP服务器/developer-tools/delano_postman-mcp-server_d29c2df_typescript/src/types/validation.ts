import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';

// Validation helper
export function validateArgs<T>(
  obj: unknown,
  validator: (obj: unknown) => obj is T,
  errorMessage: string
): T {
  if (!validator(obj)) {
    throw new McpError(ErrorCode.InvalidParams, errorMessage);
  }
  return obj;
}
