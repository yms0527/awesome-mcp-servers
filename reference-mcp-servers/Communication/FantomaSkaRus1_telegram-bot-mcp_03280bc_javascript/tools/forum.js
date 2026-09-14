import { z } from "zod";
import { tgCall, resolveChatId, formatResult, ok, err } from "../utils/api.js";

export function registerForumTools(server) {
  // create_forum_topic
  server.tool(
    "create_forum_topic",
    "Create a new topic in a supergroup forum. If chat_id is omitted, creates in the default log group.",
    {
      chat_id: z.union([z.string(), z.number()]).optional()
        .describe("Chat ID or @channel_username. Optional — defaults to log group"),
      name: z.string().describe("Topic name"),
      icon_color: z.number().optional()
        .describe("Icon color (0x6FB9F0, 0xFFD67E, 0xCB86DB, 0x8EEE98, 0xFF93B2, 0xFB6F5F)"),
      icon_custom_emoji_id: z.string().optional()
        .describe("Custom emoji ID for topic icon"),
    },
    async ({ chat_id, name, icon_color, icon_custom_emoji_id }) => {
      try {
        const params = { chat_id: resolveChatId(chat_id), name };
        if (icon_color !== undefined) params.icon_color = icon_color;
        if (icon_custom_emoji_id) params.icon_custom_emoji_id = icon_custom_emoji_id;
        const result = await tgCall("createForumTopic", params);
        return ok(`Topic created! Thread ID: ${result.message_thread_id}\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // edit_forum_topic
  server.tool(
    "edit_forum_topic",
    "Edit a forum topic's name and icon.",
    {
      chat_id: z.union([z.string(), z.number()]).optional()
        .describe("Chat ID or @channel_username. Optional — defaults to log group"),
      message_thread_id: z.number().describe("Topic/thread ID to edit"),
      name: z.string().optional().describe("New topic name"),
      icon_custom_emoji_id: z.string().optional().describe("New custom emoji ID for topic icon"),
    },
    async ({ chat_id, message_thread_id, name, icon_custom_emoji_id }) => {
      try {
        const params = { chat_id: resolveChatId(chat_id), message_thread_id };
        if (name !== undefined) params.name = name;
        if (icon_custom_emoji_id) params.icon_custom_emoji_id = icon_custom_emoji_id;
        const result = await tgCall("editForumTopic", params);
        return ok(`Topic ${message_thread_id} updated!\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // close_forum_topic
  server.tool(
    "close_forum_topic",
    "Close a topic in a supergroup forum. If chat_id is omitted, targets the default log group.",
    {
      chat_id: z.union([z.string(), z.number()]).optional()
        .describe("Chat ID or @channel_username. Optional — defaults to log group"),
      message_thread_id: z.number().describe("Topic/thread ID to close"),
    },
    async ({ chat_id, message_thread_id }) => {
      try {
        await tgCall("closeForumTopic", { chat_id: resolveChatId(chat_id), message_thread_id });
        return ok(`Topic ${message_thread_id} closed.`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // reopen_forum_topic
  server.tool(
    "reopen_forum_topic",
    "Reopen a closed forum topic.",
    {
      chat_id: z.union([z.string(), z.number()]).optional()
        .describe("Chat ID or @channel_username. Optional — defaults to log group"),
      message_thread_id: z.number().describe("Topic/thread ID to reopen"),
    },
    async ({ chat_id, message_thread_id }) => {
      try {
        const result = await tgCall("reopenForumTopic", {
          chat_id: resolveChatId(chat_id),
          message_thread_id,
        });
        return ok(`Topic ${message_thread_id} reopened!\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // delete_forum_topic
  server.tool(
    "delete_forum_topic",
    "Delete a topic in a supergroup forum. If chat_id is omitted, targets the default log group.",
    {
      chat_id: z.union([z.string(), z.number()]).optional()
        .describe("Chat ID or @channel_username. Optional — defaults to log group"),
      message_thread_id: z.number().describe("Topic/thread ID to delete"),
    },
    async ({ chat_id, message_thread_id }) => {
      try {
        await tgCall("deleteForumTopic", { chat_id: resolveChatId(chat_id), message_thread_id });
        return ok(`Topic ${message_thread_id} deleted.`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // unpin_all_forum_topic_messages
  server.tool(
    "unpin_all_forum_topic_messages",
    "Unpin all messages in a forum topic. If chat_id is omitted, targets the default log group.",
    {
      chat_id: z.union([z.string(), z.number()]).optional()
        .describe("Chat ID or @channel_username. Optional — defaults to log group"),
      message_thread_id: z.number().describe("Topic/thread ID to unpin messages from"),
    },
    async ({ chat_id, message_thread_id }) => {
      try {
        await tgCall("unpinAllForumTopicMessages", {
          chat_id: resolveChatId(chat_id),
          message_thread_id,
        });
        return ok(`All messages unpinned from topic ${message_thread_id}.`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // get_forum_topic_icon_stickers
  server.tool(
    "get_forum_topic_icon_stickers",
    "Get the list of custom emoji stickers for forum topic icons.",
    {},
    async () => {
      try {
        const result = await tgCall("getForumTopicIconStickers", {});
        return ok(`Forum topic icon stickers retrieved.\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // ─── General Forum Topic ────────────────────────────────────────────────────────

  // edit_general_forum_topic
  server.tool(
    "edit_general_forum_topic",
    "Edit the name of the General forum topic.",
    {
      chat_id: z.union([z.string(), z.number()]).optional().describe("Chat ID or @channel_username. Optional — defaults to log group"),
      name: z.string().describe("New topic name (1-128 chars)"),
    },
    async ({ chat_id, name }) => {
      try {
        const resolvedChatId = resolveChatId(chat_id);
        const result = await tgCall("editGeneralForumTopic", { chat_id: resolvedChatId, name });
        return ok(`General forum topic name updated to "${name}".\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // close_general_forum_topic
  server.tool(
    "close_general_forum_topic",
    "Close the General forum topic.",
    {
      chat_id: z.union([z.string(), z.number()]).optional().describe("Chat ID or @channel_username. Optional — defaults to log group"),
    },
    async ({ chat_id }) => {
      try {
        const resolvedChatId = resolveChatId(chat_id);
        const result = await tgCall("closeGeneralForumTopic", { chat_id: resolvedChatId });
        return ok(`General forum topic closed.\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // reopen_general_forum_topic
  server.tool(
    "reopen_general_forum_topic",
    "Reopen the General forum topic.",
    {
      chat_id: z.union([z.string(), z.number()]).optional().describe("Chat ID or @channel_username. Optional — defaults to log group"),
    },
    async ({ chat_id }) => {
      try {
        const resolvedChatId = resolveChatId(chat_id);
        const result = await tgCall("reopenGeneralForumTopic", { chat_id: resolvedChatId });
        return ok(`General forum topic reopened.\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // hide_general_forum_topic
  server.tool(
    "hide_general_forum_topic",
    "Hide the General forum topic.",
    {
      chat_id: z.union([z.string(), z.number()]).optional().describe("Chat ID or @channel_username. Optional — defaults to log group"),
    },
    async ({ chat_id }) => {
      try {
        const resolvedChatId = resolveChatId(chat_id);
        const result = await tgCall("hideGeneralForumTopic", { chat_id: resolvedChatId });
        return ok(`General forum topic hidden.\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // unhide_general_forum_topic
  server.tool(
    "unhide_general_forum_topic",
    "Unhide the General forum topic.",
    {
      chat_id: z.union([z.string(), z.number()]).optional().describe("Chat ID or @channel_username. Optional — defaults to log group"),
    },
    async ({ chat_id }) => {
      try {
        const resolvedChatId = resolveChatId(chat_id);
        const result = await tgCall("unhideGeneralForumTopic", { chat_id: resolvedChatId });
        return ok(`General forum topic unhidden.\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );
}
