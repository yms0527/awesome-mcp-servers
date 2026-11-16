import { z } from "zod";
import { tgCall, resolveChatId, formatResult, ok, err } from "../../utils/api.js";

// ─── Verification & Suggested Posts ────────────────────────────────────────────

export function registerChatVerifyTools(server) {
  // verify_user
  server.tool(
    "verify_user",
    "Verify a user on behalf of the bot.",
    {
      user_id: z.number().describe("User ID to verify"),
      custom_description: z.string().optional().describe("Custom description (0-70 chars)"),
    },
    async ({ user_id, custom_description }) => {
      try {
        const params = { user_id };
        if (custom_description !== undefined) params.custom_description = custom_description;
        const result = await tgCall("verifyUser", params);
        return ok(`User ${user_id} verified.\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // verify_chat
  server.tool(
    "verify_chat",
    "Verify a chat on behalf of the bot.",
    {
      chat_id: z.union([z.string(), z.number()]).optional()
        .describe("Chat ID or @channel_username. Optional — defaults to log group"),
      custom_description: z.string().optional().describe("Custom description (0-70 chars)"),
    },
    async ({ chat_id, custom_description }) => {
      try {
        const params = { chat_id: resolveChatId(chat_id) };
        if (custom_description !== undefined) params.custom_description = custom_description;
        const result = await tgCall("verifyChat", params);
        return ok(`Chat verified.\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // remove_user_verification
  server.tool(
    "remove_user_verification",
    "Remove verification from a user.",
    {
      user_id: z.number().describe("User ID"),
    },
    async ({ user_id }) => {
      try {
        const result = await tgCall("removeUserVerification", { user_id });
        return ok(`User ${user_id} verification removed.\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // remove_chat_verification
  server.tool(
    "remove_chat_verification",
    "Remove verification from a chat.",
    {
      chat_id: z.union([z.string(), z.number()]).optional()
        .describe("Chat ID or @channel_username. Optional — defaults to log group"),
    },
    async ({ chat_id }) => {
      try {
        const result = await tgCall("removeChatVerification", { chat_id: resolveChatId(chat_id) });
        return ok(`Chat verification removed.\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // approve_suggested_post
  server.tool(
    "approve_suggested_post",
    "Approve a suggested post.",
    {
      chat_id: z.union([z.string(), z.number()]).optional()
        .describe("Chat ID. Optional — defaults to log group"),
      message_id: z.number().describe("Message ID of the suggested post"),
    },
    async ({ chat_id, message_id }) => {
      try {
        const result = await tgCall("approveSuggestedPost", {
          chat_id: resolveChatId(chat_id),
          message_id,
        });
        return ok(`Suggested post approved.\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // decline_suggested_post
  server.tool(
    "decline_suggested_post",
    "Decline a suggested post.",
    {
      chat_id: z.union([z.string(), z.number()]).optional()
        .describe("Chat ID. Optional — defaults to log group"),
      message_id: z.number().describe("Message ID of the suggested post"),
    },
    async ({ chat_id, message_id }) => {
      try {
        const result = await tgCall("declineSuggestedPost", {
          chat_id: resolveChatId(chat_id),
          message_id,
        });
        return ok(`Suggested post declined.\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // unpin_all_general_forum_topic_messages
  server.tool(
    "unpin_all_general_forum_topic_messages",
    "Unpin all messages in the General forum topic.",
    {
      chat_id: z.union([z.string(), z.number()]).optional()
        .describe("Chat ID or @channel_username. Optional — defaults to log group"),
    },
    async ({ chat_id }) => {
      try {
        const result = await tgCall("unpinAllGeneralForumTopicMessages", {
          chat_id: resolveChatId(chat_id),
        });
        return ok(`All messages unpinned from General forum topic.\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );
}
