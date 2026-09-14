import { PterodactylApiError } from "../client/errors.js";

export function formatToolError(error: unknown): {
  content: { type: "text"; text: string }[];
  isError: true;
} {
  if (error instanceof PterodactylApiError) {
    // Map API errors to actionable LLM messages
    // NEVER include the API key or stack trace
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify({
            error: error.code,
            message: error.message,
            status: error.status,
          }),
        },
      ],
      isError: true,
    };
  }

  // Unknown errors - generic message, no stack trace
  const message = error instanceof Error ? error.message : "An unexpected error occurred";
  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify({ error: "INTERNAL_ERROR", message }),
      },
    ],
    isError: true,
  };
}
