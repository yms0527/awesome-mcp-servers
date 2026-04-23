import { z } from "zod";
import {
  tgCall, tgUpload, resolveChatId,
  formatResult, parseJSON, ok, err, isFilePath
} from "../utils/api.js";

export function registerBusinessTools(server) {
  // set_business_account_bio
  server.tool(
    "set_business_account_bio",
    "Set the bio of a business account.",
    {
      business_connection_id: z.string().describe("Business connection ID"),
      bio: z.string().max(120).optional().describe("New bio text (0-120 chars)"),
    },
    async ({ business_connection_id, bio }) => {
      try {
        const params = { business_connection_id };
        if (bio !== undefined) params.bio = bio;
        const result = await tgCall("setBusinessAccountBio", params);
        return ok(`Business account bio updated.\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // set_business_account_name
  server.tool(
    "set_business_account_name",
    "Set the name of a business account.",
    {
      business_connection_id: z.string().describe("Business connection ID"),
      first_name: z.string().max(64).describe("First name (1-64 chars)"),
      last_name: z.string().max(64).optional().describe("Last name (0-64 chars)"),
    },
    async ({ business_connection_id, first_name, last_name }) => {
      try {
        const params = { business_connection_id, first_name };
        if (last_name !== undefined) params.last_name = last_name;
        const result = await tgCall("setBusinessAccountName", params);
        return ok(`Business account name updated.\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // set_business_account_username
  server.tool(
    "set_business_account_username",
    "Set the username of a business account.",
    {
      business_connection_id: z.string().describe("Business connection ID"),
      username: z.string().optional().describe("New username (empty to remove)"),
    },
    async ({ business_connection_id, username }) => {
      try {
        const params = { business_connection_id };
        if (username !== undefined) params.username = username;
        const result = await tgCall("setBusinessAccountUsername", params);
        return ok(`Business account username updated.\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // set_business_account_profile_photo
  server.tool(
    "set_business_account_profile_photo",
    "Set the profile photo of a business account.",
    {
      business_connection_id: z.string().describe("Business connection ID"),
      photo: z.string().describe("JSON object with InputProfilePhoto"),
      is_public: z.boolean().optional().describe("Whether photo is public"),
    },
    async ({ business_connection_id, photo, is_public }) => {
      try {
        const params = {
          business_connection_id,
          photo: parseJSON(photo),
        };
        if (is_public !== undefined) params.is_public = is_public;
        const result = await tgCall("setBusinessAccountProfilePhoto", params);
        return ok(`Business account profile photo updated.\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // remove_business_account_profile_photo
  server.tool(
    "remove_business_account_profile_photo",
    "Remove the profile photo of a business account.",
    {
      business_connection_id: z.string().describe("Business connection ID"),
      is_public: z.boolean().optional().describe("Whether to remove public photo"),
    },
    async ({ business_connection_id, is_public }) => {
      try {
        const params = { business_connection_id };
        if (is_public !== undefined) params.is_public = is_public;
        const result = await tgCall("removeBusinessAccountProfilePhoto", params);
        return ok(`Business account profile photo removed.\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // set_business_account_gift_settings
  server.tool(
    "set_business_account_gift_settings",
    "Set gift settings of a business account.",
    {
      business_connection_id: z.string().describe("Business connection ID"),
      show_gift_button: z.boolean().describe("Show gift button on profile"),
      accepted_gift_types: z.string().describe("JSON object with AcceptedGiftTypes"),
    },
    async ({ business_connection_id, show_gift_button, accepted_gift_types }) => {
      try {
        const params = {
          business_connection_id,
          show_gift_button,
          accepted_gift_types: parseJSON(accepted_gift_types),
        };
        const result = await tgCall("setBusinessAccountGiftSettings", params);
        return ok(`Business account gift settings updated.\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // get_business_account_star_balance
  server.tool(
    "get_business_account_star_balance",
    "Get the Telegram Star balance of a business account.",
    {
      business_connection_id: z.string().describe("Business connection ID"),
    },
    async ({ business_connection_id }) => {
      try {
        const result = await tgCall("getBusinessAccountStarBalance", { business_connection_id });
        return ok(`Business account star balance: ${result.amount} stars\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // transfer_business_account_stars
  server.tool(
    "transfer_business_account_stars",
    "Transfer Telegram Stars from a business account to the bot's account.",
    {
      business_connection_id: z.string().describe("Business connection ID"),
      star_count: z.number().min(1).describe("Number of stars to transfer"),
    },
    async ({ business_connection_id, star_count }) => {
      try {
        const result = await tgCall("transferBusinessAccountStars", {
          business_connection_id,
          star_count,
        });
        return ok(`Transferred ${star_count} stars.\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // delete_business_messages
  server.tool(
    "delete_business_messages",
    "Delete messages sent on behalf of a business account.",
    {
      business_connection_id: z.string().describe("Business connection ID"),
      chat_id: z.union([z.string(), z.number()]).describe("Chat ID"),
      message_ids: z.string().describe("JSON array of message IDs to delete"),
    },
    async ({ business_connection_id, chat_id, message_ids }) => {
      try {
        const result = await tgCall("deleteBusinessMessages", {
          business_connection_id,
          chat_id,
          message_ids: parseJSON(message_ids),
        });
        return ok(`Business messages deleted.\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // read_business_message
  server.tool(
    "read_business_message",
    "Mark a message as read on behalf of a business account.",
    {
      business_connection_id: z.string().describe("Business connection ID"),
      chat_id: z.union([z.string(), z.number()]).describe("Chat ID"),
      message_id: z.number().describe("Message ID to mark as read"),
    },
    async ({ business_connection_id, chat_id, message_id }) => {
      try {
        const result = await tgCall("readBusinessMessage", {
          business_connection_id,
          chat_id,
          message_id,
        });
        return ok(`Message ${message_id} marked as read.\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );
}
