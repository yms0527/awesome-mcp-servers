import { ErrorCode, McpError } from "@modelcontextprotocol/sdk/types.js";

export function handleError(error: unknown): never {
  if (error instanceof Error) {
    throw new McpError(ErrorCode.InternalError, error.message);
  }
  throw new McpError(ErrorCode.InternalError, String(error));
}
