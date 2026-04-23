import { Server } from "@modelcontextprotocol/sdk/server/index";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse";
import { CallToolRequest, CallToolRequestSchema, ListToolsRequestSchema, Tool } from "@modelcontextprotocol/sdk/types";

import express from "express";
import { SlackClient } from "./slack-client";
import {
  AddReactionArgs,
  GetChannelHistoryArgs,
  GetThreadRepliesArgs,
  GetUserProfileArgs,
  GetUsersArgs,
  ListChannelsArgs,
  PostMessageArgs,
  ReplyToThreadArgs,
  tools,
} from "./tools";
import { SlackAPIClient } from "slack-web-api-client";

const app = express();

(async () => {
  const botToken = process.env.SLACK_BOT_TOKEN;
  if (!botToken) {
    console.error("Please set SLACK_BOT_TOKEN environment variable");
    process.exit(1);
  }

  console.log("Starting Slack MCP Server...");
  const server = new Server(
    {
      name: "Slack MCP Server",
      version: "1.0.0",
    },
    {
      capabilities: {
        tools: {},
      },
    },
  );

  const client = new SlackAPIClient(botToken);
  const authTest = await client.auth.test();
  const slackClient = new SlackClient(botToken, authTest.team_id!);
  server.setRequestHandler(CallToolRequestSchema, async (request: CallToolRequest) => {
    console.error("Received CallToolRequest:", request);
    try {
      if (!request.params.arguments) {
        throw new Error("No arguments provided");
      }

      switch (request.params.name) {
        case "slack_list_channels": {
          const args = request.params.arguments as unknown as ListChannelsArgs;
          const response = await slackClient.getChannels(args.limit, args.cursor);
          return {
            content: [{ type: "text", text: JSON.stringify(response) }],
          };
        }

        case "slack_post_message": {
          const args = request.params.arguments as unknown as PostMessageArgs;
          if (!args.channel_id || !args.text) {
            throw new Error("Missing required arguments: channel_id and text");
          }
          const response = await slackClient.postMessage(args.channel_id, args.text);
          return {
            content: [{ type: "text", text: JSON.stringify(response) }],
          };
        }

        case "slack_reply_to_thread": {
          const args = request.params.arguments as unknown as ReplyToThreadArgs;
          if (!args.channel_id || !args.thread_ts || !args.text) {
            throw new Error("Missing required arguments: channel_id, thread_ts, and text");
          }
          const response = await slackClient.postReply(args.channel_id, args.thread_ts, args.text);
          return {
            content: [{ type: "text", text: JSON.stringify(response) }],
          };
        }

        case "slack_add_reaction": {
          const args = request.params.arguments as unknown as AddReactionArgs;
          if (!args.channel_id || !args.timestamp || !args.reaction) {
            throw new Error("Missing required arguments: channel_id, timestamp, and reaction");
          }
          const response = await slackClient.addReaction(args.channel_id, args.timestamp, args.reaction);
          return {
            content: [{ type: "text", text: JSON.stringify(response) }],
          };
        }

        case "slack_get_channel_history": {
          const args = request.params.arguments as unknown as GetChannelHistoryArgs;
          if (!args.channel_id) {
            throw new Error("Missing required argument: channel_id");
          }
          const response = await slackClient.getChannelHistory(args.channel_id, args.limit);
          return {
            content: [{ type: "text", text: JSON.stringify(response) }],
          };
        }

        case "slack_get_thread_replies": {
          const args = request.params.arguments as unknown as GetThreadRepliesArgs;
          if (!args.channel_id || !args.thread_ts) {
            throw new Error("Missing required arguments: channel_id and thread_ts");
          }
          const response = await slackClient.getThreadReplies(args.channel_id, args.thread_ts);
          return {
            content: [{ type: "text", text: JSON.stringify(response) }],
          };
        }

        case "slack_get_users": {
          const args = request.params.arguments as unknown as GetUsersArgs;
          const response = await slackClient.getUsers(args.limit, args.cursor);
          return {
            content: [{ type: "text", text: JSON.stringify(response) }],
          };
        }

        case "slack_get_user_profile": {
          const args = request.params.arguments as unknown as GetUserProfileArgs;
          if (!args.user_id) {
            throw new Error("Missing required argument: user_id");
          }
          const response = await slackClient.getUserProfile(args.user_id);
          return {
            content: [{ type: "text", text: JSON.stringify(response) }],
          };
        }

        default:
          throw new Error(`Unknown tool: ${request.params.name}`);
      }
    } catch (error) {
      console.error("Error executing tool:", error);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              error: error instanceof Error ? error.message : String(error),
            }),
          },
        ],
      };
    }
  });

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    console.error("Received ListToolsRequest");
    return { tools };
  });

  let transport: SSEServerTransport;
  app.get("/sse", async (req, res) => {
    console.log("Received connection");
    transport = new SSEServerTransport("/messages", res);
    await server.connect(transport);

    server.onclose = async () => {
      await server.close();
      process.exit(0);
    };
  });

  app.post("/messages", async (req, res) => {
    console.log("Received message");
    await transport.handlePostMessage(req, res);
  });

  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})();
