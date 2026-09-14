import { z } from "zod";
import { tgCall, formatResult, parseJSON, ok, err } from "../../utils/api.js";

// ─── Bot Commands & Description Methods ───────────────────────────────────────

export function registerBotCommandsTools(server) {
  // set_my_commands
  server.tool(
    "set_my_commands",
    "Set the bot's commands for the given scope.",
    {
      commands: z.string().describe("JSON array of BotCommand objects [{command, description}]"),
      scope: z.string().optional().describe("JSON object with BotCommandScope"),
      language_code: z.string().optional().describe("Language code (e.g., 'en', 'ru')"),
    },
    async ({ commands, scope, language_code }) => {
      try {
        const params = { commands: parseJSON(commands) };
        if (scope) params.scope = parseJSON(scope);
        if (language_code) params.language_code = language_code;
        await tgCall("setMyCommands", params);
        return ok(`Bot commands set.`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // delete_my_commands
  server.tool(
    "delete_my_commands",
    "Delete the bot's commands for the given scope.",
    {
      scope: z.string().optional().describe("JSON object with BotCommandScope"),
      language_code: z.string().optional().describe("Language code (e.g., 'en', 'ru')"),
    },
    async ({ scope, language_code }) => {
      try {
        const params = {};
        if (scope) params.scope = parseJSON(scope);
        if (language_code) params.language_code = language_code;
        await tgCall("deleteMyCommands", params);
        return ok(`Bot commands deleted.`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // get_my_commands
  server.tool(
    "get_my_commands",
    "Get the current list of bot commands.",
    {
      scope: z.string().optional().describe("JSON BotCommandScope (e.g. '{\"type\":\"default\"}')"),
      language_code: z.string().optional().describe("Two-letter language code"),
    },
    async ({ scope, language_code }) => {
      try {
        const params = {};
        if (scope) params.scope = parseJSON(scope);
        if (language_code) params.language_code = language_code;
        const result = await tgCall("getMyCommands", params);
        if (result.length === 0) {
          return ok(`No commands set.\n\n${formatResult(result)}`);
        }
        let list = "Bot commands:\n";
        for (const cmd of result) {
          list += `/${cmd.command} — ${cmd.description}\n`;
        }
        return ok(`${list}\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // get_my_name
  server.tool(
    "get_my_name",
    "Get the current bot name.",
    {
      language_code: z.string().optional().describe("Two-letter language code"),
    },
    async ({ language_code }) => {
      try {
        const params = {};
        if (language_code) params.language_code = language_code;
        const result = await tgCall("getMyName", params);
        return ok(`Bot name: ${result.name}\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // set_my_name
  server.tool(
    "set_my_name",
    "Set the bot name (max 64 chars). Empty string removes the name.",
    {
      name: z.string().max(64).optional().describe("New bot name (empty to remove)"),
      language_code: z.string().optional().describe("Two-letter language code"),
    },
    async ({ name, language_code }) => {
      try {
        const params = {};
        if (name !== undefined) params.name = name;
        if (language_code) params.language_code = language_code;
        await tgCall("setMyName", params);
        return ok(`Bot name ${name ? `set to "${name}"` : "cleared"}.`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // get_my_description
  server.tool(
    "get_my_description",
    "Get the current bot description.",
    {
      language_code: z.string().optional().describe("Two-letter language code"),
    },
    async ({ language_code }) => {
      try {
        const params = {};
        if (language_code) params.language_code = language_code;
        const result = await tgCall("getMyDescription", params);
        return ok(`Bot description: ${result.description || "(not set)"}\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // set_my_description
  server.tool(
    "set_my_description",
    "Set the bot description (max 512 chars).",
    {
      description: z.string().max(512).optional().describe("New bot description"),
      language_code: z.string().optional().describe("Two-letter language code"),
    },
    async ({ description, language_code }) => {
      try {
        const params = {};
        if (description !== undefined) params.description = description;
        if (language_code) params.language_code = language_code;
        await tgCall("setMyDescription", params);
        return ok(`Bot description ${description ? "updated" : "cleared"}.`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // get_my_short_description
  server.tool(
    "get_my_short_description",
    "Get the current bot short description.",
    {
      language_code: z.string().optional().describe("Two-letter language code"),
    },
    async ({ language_code }) => {
      try {
        const params = {};
        if (language_code) params.language_code = language_code;
        const result = await tgCall("getMyShortDescription", params);
        return ok(`Bot short description: ${result.short_description || "(not set)"}\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // set_my_short_description
  server.tool(
    "set_my_short_description",
    "Set the bot short description (max 120 chars).",
    {
      short_description: z.string().max(120).optional().describe("New short description"),
      language_code: z.string().optional().describe("Two-letter language code"),
    },
    async ({ short_description, language_code }) => {
      try {
        const params = {};
        if (short_description !== undefined) params.short_description = short_description;
        if (language_code) params.language_code = language_code;
        await tgCall("setMyShortDescription", params);
        return ok(`Bot short description ${short_description ? "updated" : "cleared"}.`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );
}
