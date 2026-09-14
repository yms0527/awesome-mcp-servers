#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema
} from "@modelcontextprotocol/sdk/types.js";
import type { CallToolRequest } from "@modelcontextprotocol/sdk/types.js";
import { transcribeVideo, transcribeVideoFile, transcribeImage } from "./modules/transcribe.js";
import { checkServerAvailability } from "./modules/utils.js";

const VERSION = '0.0.1';

/**
 * Initialize service
 */
async function initialize(): Promise<void> {
  // 在測試環境中跳過初始化檢查
  if (process.env.NODE_ENV === 'test') {
    return;
  }

  try {
    // Check if the Optivus server is available
    const isAvailable = await checkServerAvailability();
    
    if (!isAvailable) {
      console.warn('Warning: Optivus server is not available. Transcription services may not work properly.');
    }
  } catch (error) {
    console.error('Initialization failed:', error);
    process.exit(1);
  }
}

const server = new Server(
  {
    name: "video-transcribe-mcp",
    version: VERSION,
  },
  {
    capabilities: {
      tools: {}
    },
  }
);

/**
 * Returns the list of available tools.
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "transcribe_video",
        description: "Transcribe video from URL to text",
        inputSchema: {
          type: "object",
          properties: {
            urls: { type: "array", description: "URL of the video" },
          },
          required: ["urls"],
        },
      },
      {
        name: "transcribe_video_file",
        description: "Transcribe video file to text",
        inputSchema: {
          type: "object",
          properties: {
            file_path: { type: "string", description: "Paths to the video files" },
          },
          required: ["file_path"],
        },
      },
      {
        name: "transcribe_image",
        description: "image to text description",
        inputSchema: {
          type: "object",
          properties: {
            file_path: { type: "string", description: "Path to the image file" },
          },
          required: ["file_path"],
        },
      },
    ],
  };
});

/**
 * Handle tool execution with unified error handling
 * @param action Async operation to execute
 * @param errorPrefix Error message prefix
 */
async function handleToolExecution<T>(
  action: () => Promise<T>,
  errorPrefix: string
): Promise<{
  content: Array<{ type: "text", text: string }>,
  isError?: boolean
}> {
  try {
    const result = await action();
    return {
      content: [{ type: "text", text: String(result) }]
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [{ type: "text", text: `${errorPrefix}: ${errorMessage}` }],
      isError: true
    };
  }
}

/**
 * Handles tool execution requests.
 */
server.setRequestHandler(
  CallToolRequestSchema,
  async (request: CallToolRequest) => {
    const toolName = request.params.name;
    const args = request.params.arguments as { 
      urls?: string[];
      file_path?: string;
    };

    if (toolName === "transcribe_video") {
      if (!args.urls) {
        return {
          content: [{ type: "text", text: "URL is required for video transcription" }],
          isError: true
        };
      }
      return handleToolExecution(
        () => transcribeVideo(args.urls!),
        "Error transcribing video"
      );
    } else if (toolName === "transcribe_video_file") {
      if (!args.file_path) {
        return {
          content: [{ type: "text", text: "File path is required for video file transcription" }],
          isError: true
        };
      }
      return handleToolExecution(
        () => transcribeVideoFile(args.file_path!),
        "Error transcribing video file"
      );
    } else if (toolName === "transcribe_image") {
      if (!args.file_path) {
        return {
          content: [{ type: "text", text: "File path is required for image transcription" }],
          isError: true
        };
      }
      return handleToolExecution(
        () => transcribeImage(args.file_path!),
        "Error transcribing image"
      );
    } else {
      return {
        content: [{ type: "text", text: `Unknown tool: ${toolName}` }],
        isError: true
      };
    }
  }
);

/**
 * Starts the server using Stdio transport.
 */
async function startServer() {
  await initialize();
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

// Start the server and handle potential errors
startServer().catch(console.error);
