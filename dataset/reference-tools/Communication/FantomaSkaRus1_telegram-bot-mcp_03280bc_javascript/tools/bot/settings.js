import { z } from "zod";
import { tgCall, resolveChatId, formatResult, parseJSON, ok, err } from "../../utils/api.js";

// ─── Bot Settings & Interactions ──────────────────────────────────────────────

export function registerBotSettingsTools(server) {
  // set_my_default_administrator_rights
  server.tool(
    "set_my_default_administrator_rights",
    "Set the bot's default administrator rights.",
    {
      rights: z.string().optional().describe("JSON object with ChatAdministratorRights"),
      for_channels: z.boolean().optional().describe("Apply to channels"),
    },
    async ({ rights, for_channels }) => {
      try {
        const params = {};
        if (rights !== undefined) params.rights = parseJSON(rights);
        if (for_channels !== undefined) params.for_channels = for_channels;
        const result = await tgCall("setMyDefaultAdministratorRights", params);
        return ok(`Default administrator rights updated.\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // get_my_default_administrator_rights
  server.tool(
    "get_my_default_administrator_rights",
    "Get the bot's default administrator rights.",
    {
      for_channels: z.boolean().optional().describe("Get rights for channels"),
    },
    async ({ for_channels }) => {
      try {
        const params = {};
        if (for_channels !== undefined) params.for_channels = for_channels;
        const result = await tgCall("getMyDefaultAdministratorRights", params);
        return ok(`Default administrator rights:\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // get_user_chat_boosts
  server.tool(
    "get_user_chat_boosts",
    "Get boosts added by a user to a chat.",
    {
      chat_id: z.union([z.string(), z.number()]).optional().describe("Chat ID (defaults to log group)"),
      user_id: z.number().describe("User ID"),
    },
    async ({ chat_id, user_id }) => {
      try {
        const resolved_chat_id = resolveChatId(chat_id);
        const params = { chat_id: resolved_chat_id, user_id };
        const result = await tgCall("getUserChatBoosts", params);
        return ok(`User chat boosts:\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // get_business_connection
  server.tool(
    "get_business_connection",
    "Get info about a business connection.",
    {
      business_connection_id: z.string().describe("Business connection ID"),
    },
    async ({ business_connection_id }) => {
      try {
        const result = await tgCall("getBusinessConnection", { business_connection_id });
        return ok(`Business connection info:\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // answer_callback_query
  server.tool(
    "answer_callback_query",
    "Answer a callback query from an inline button press. Must be called after receiving a callback_query update.",
    {
      callback_query_id: z.string().describe("ID of the callback query to answer"),
      text: z.string().optional().describe("Text to show to the user (up to 200 chars)"),
      show_alert: z.boolean().optional().describe("Show an alert instead of a toast notification"),
      url: z.string().optional().describe("URL to open in the user's browser"),
      cache_time: z.number().optional().describe("Time in seconds to cache the answer"),
    },
    async ({ callback_query_id, text, show_alert, url, cache_time }) => {
      try {
        const params = { callback_query_id };
        if (text) params.text = text;
        if (show_alert !== undefined) params.show_alert = show_alert;
        if (url) params.url = url;
        if (cache_time !== undefined) params.cache_time = cache_time;
        await tgCall("answerCallbackQuery", params);
        return ok(`Callback query ${callback_query_id} answered.`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // answer_inline_query
  server.tool(
    "answer_inline_query",
    "Answer an inline query with results.",
    {
      inline_query_id: z.string().describe("ID of the inline query to answer"),
      results: z.string().describe("JSON array of InlineQueryResult objects"),
      cache_time: z.number().optional().describe("Cache time in seconds (default: 300)"),
      is_personal: z.boolean().optional().describe("Results should be personalized"),
      next_offset: z.string().optional().describe("Offset for next page of results"),
      button: z.string().optional().describe("JSON object with InlineQueryResultsButton (button shown above results)"),
    },
    async ({ inline_query_id, results, cache_time, is_personal, next_offset, button }) => {
      try {
        const params = { inline_query_id, results: parseJSON(results) };
        if (cache_time !== undefined) params.cache_time = cache_time;
        if (is_personal !== undefined) params.is_personal = is_personal;
        if (next_offset) params.next_offset = next_offset;
        if (button) params.button = parseJSON(button);
        await tgCall("answerInlineQuery", params);
        return ok(`Inline query ${inline_query_id} answered.`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // answer_web_app_query
  server.tool(
    "answer_web_app_query",
    "Answer a Web App query sent via a Web App integration.",
    {
      web_app_query_id: z.string().describe("Web App query ID from the WebAppInitData"),
      result: z.string().describe("JSON string with InlineQueryResult object to send"),
    },
    async ({ web_app_query_id, result }) => {
      try {
        const params = { web_app_query_id, result: parseJSON(result) };
        const sentMessage = await tgCall("answerWebAppQuery", params);
        return ok(`Web App query answered! Message sent.\n\n${formatResult(sentMessage)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // set_passport_data_errors
  server.tool(
    "set_passport_data_errors",
    "Report errors in Telegram Passport data.",
    {
      user_id: z.number().describe("User ID"),
      errors: z.string().describe("JSON array of PassportElementError objects"),
    },
    async ({ user_id, errors }) => {
      try {
        const params = { user_id, errors: parseJSON(errors) };
        const result = await tgCall("setPassportDataErrors", params);
        return ok(`Passport data errors reported.\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );
}
