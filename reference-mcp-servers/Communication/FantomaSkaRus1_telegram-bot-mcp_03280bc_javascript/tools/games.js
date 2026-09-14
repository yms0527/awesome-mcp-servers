import { z } from "zod";
import {
  tgCall, resolveChatId, resolveThreadId,
  formatResult, parseJSON, ok, err
} from "../utils/api.js";

export function registerGameTools(server) {
  // send_game
  server.tool(
    "send_game",
    "Send a game to a chat.",
    {
      chat_id: z.union([z.string(), z.number()]).optional().describe("Chat ID (defaults to log group)"),
      game_short_name: z.string().describe("Game short name"),
      message_thread_id: z.number().optional().describe("Topic/thread ID for supergroups with topics"),
      disable_notification: z.boolean().optional().describe("Send silently without notification"),
      protect_content: z.boolean().optional().describe("Protect message from forwarding/saving"),
      reply_parameters: z.string().optional().describe("JSON object with ReplyParameters (e.g. {\"message_id\": 123})"),
      reply_markup: z.string().optional().describe("JSON string with inline keyboard markup"),
      message_effect_id: z.string().optional().describe("Unique identifier of the message effect to apply"),
    },
    async ({ chat_id, game_short_name, message_thread_id, disable_notification, protect_content, reply_parameters, reply_markup, message_effect_id }) => {
      try {
        const resolved_chat_id = resolveChatId(chat_id);
        const resolvedThreadId = resolveThreadId(chat_id, message_thread_id);
        const params = { chat_id: resolved_chat_id, game_short_name };
        if (resolvedThreadId) params.message_thread_id = resolvedThreadId;
        if (disable_notification) params.disable_notification = true;
        if (protect_content) params.protect_content = true;
        if (reply_parameters) params.reply_parameters = parseJSON(reply_parameters);
        if (reply_markup) params.reply_markup = parseJSON(reply_markup);
        if (message_effect_id) params.message_effect_id = message_effect_id;
        const result = await tgCall("sendGame", params);
        return ok(`Game sent.\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // set_game_score
  server.tool(
    "set_game_score",
    "Set the score of a user in a game.",
    {
      user_id: z.number().describe("User ID"),
      score: z.number().describe("New score"),
      force: z.boolean().optional().describe("Force score update (may decrease)"),
      disable_edit_message: z.boolean().optional().describe("Don't edit the game message"),
      chat_id: z.union([z.string(), z.number()]).optional().describe("Chat ID (required if inline_message_id not used)"),
      message_id: z.number().optional().describe("Message ID (required if inline_message_id not used)"),
      inline_message_id: z.string().optional().describe("Inline message ID"),
    },
    async ({ user_id, score, force, disable_edit_message, chat_id, message_id, inline_message_id }) => {
      try {
        const params = { user_id, score };
        if (force !== undefined) params.force = force;
        if (disable_edit_message !== undefined) params.disable_edit_message = disable_edit_message;
        if (chat_id !== undefined) params.chat_id = chat_id;
        if (message_id !== undefined) params.message_id = message_id;
        if (inline_message_id) params.inline_message_id = inline_message_id;
        const result = await tgCall("setGameScore", params);
        return ok(`Game score updated.\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // get_game_high_scores
  server.tool(
    "get_game_high_scores",
    "Get high scores for a game.",
    {
      user_id: z.number().describe("User ID"),
      chat_id: z.union([z.string(), z.number()]).optional().describe("Chat ID (required if inline_message_id not used)"),
      message_id: z.number().optional().describe("Message ID (required if inline_message_id not used)"),
      inline_message_id: z.string().optional().describe("Inline message ID"),
    },
    async ({ user_id, chat_id, message_id, inline_message_id }) => {
      try {
        const params = { user_id };
        if (chat_id !== undefined) params.chat_id = chat_id;
        if (message_id !== undefined) params.message_id = message_id;
        if (inline_message_id) params.inline_message_id = inline_message_id;
        const result = await tgCall("getGameHighScores", params);
        return ok(`Game high scores:\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );
}
