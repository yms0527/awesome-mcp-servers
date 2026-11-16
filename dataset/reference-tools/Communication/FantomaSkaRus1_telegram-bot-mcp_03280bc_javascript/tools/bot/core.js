import { z } from "zod";
import { tgCall, formatResult, parseJSON, ok, err } from "../../utils/api.js";

// ─── Format Helpers ─────────────────────────────────────────────────────────

function formatFrom(from) {
  if (!from) return "Unknown";
  const name = `${from.first_name || ""}${from.last_name ? " " + from.last_name : ""}`.trim();
  return `${name || "Unknown"} (@${from.username || "no_username"})`;
}

function formatChat(chat) {
  const label = chat.title || chat.username || chat.id;
  return `${label} (${chat.id})`;
}

// ─── Bot Core Methods ────────────────────────────────────────────────────────

export function registerBotCoreTools(server) {
  // get_me
  server.tool(
    "get_me",
    "Get info about the bot (username, name, id). Use to verify the bot is working.",
    {},
    async () => {
      try {
        const result = await tgCall("getMe");
        return ok(formatResult(result));
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // log_out
  server.tool(
    "log_out",
    "Log out the bot from Telegram Bot API.",
    {},
    async () => {
      try {
        const result = await tgCall("logOut");
        return ok(`Bot logged out successfully.\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // close_bot
  server.tool(
    "close_bot",
    "Close the bot instance (can be restarted later).",
    {},
    async () => {
      try {
        const result = await tgCall("close");
        return ok(`Bot instance closed.\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // get_updates
  server.tool(
    "get_updates",
    "Get recent incoming messages and updates. Returns latest messages sent to the bot.",
    {
      limit: z.number().min(1).max(100).optional().describe("Max number of updates (1-100, default: 10)"),
      offset: z.number().optional()
        .describe("Offset for pagination. Use update_id+1 from last update to get only new ones."),
      timeout: z.number().min(0).optional()
        .describe("Long polling timeout in seconds (0 = short poll). Default: 0"),
      allowed_updates: z.string().optional()
        .describe("JSON array of update types to receive (e.g. '[\"message\",\"callback_query\"]')"),
    },
    async ({ limit, offset, timeout, allowed_updates }) => {
      try {
        const params = { limit: limit || 10 };
        if (offset !== undefined) params.offset = offset;
        if (timeout !== undefined) params.timeout = timeout;
        if (allowed_updates) params.allowed_updates = parseJSON(allowed_updates);
        const result = await tgCall("getUpdates", params);

        if (result.length === 0) {
          return ok("No new updates.");
        }

        const lines = result.map((u) => {
          // message / edited_message / channel_post / edited_channel_post
          const msg = u.message || u.edited_message || u.channel_post || u.edited_channel_post;
          if (msg) {
            const from = formatFrom(msg.from);
            const chat = formatChat(msg.chat);
            const text = msg.text || msg.caption || "[non-text content]";
            const date = new Date(msg.date * 1000).toLocaleString();
            const tags = [];
            if (u.edited_message || u.edited_channel_post) tags.push("edited");
            if (u.channel_post || u.edited_channel_post) tags.push("channel post");
            const tagStr = tags.length ? ` (${tags.join(", ")})` : "";
            return `[${u.update_id}] ${date}${tagStr}\n  From: ${from}\n  Chat: ${chat}\n  Text: ${text}`;
          }

          // callback_query
          if (u.callback_query) {
            const cb = u.callback_query;
            const from = formatFrom(cb.from);
            const data = cb.data || "[no data]";
            let msgInfo = "";
            if (cb.message) {
              msgInfo = `\n  Chat: ${formatChat(cb.message.chat)}\n  Message ID: ${cb.message.message_id}`;
            }
            return `[${u.update_id}] [CALLBACK QUERY]\n  From: ${from}${msgInfo}\n  Data: ${data}`;
          }

          // inline_query
          if (u.inline_query) {
            const from = formatFrom(u.inline_query.from);
            const query = u.inline_query.query || "[empty query]";
            return `[${u.update_id}] [INLINE QUERY]\n  From: ${from}\n  Query: ${query}`;
          }

          // chosen_inline_result
          if (u.chosen_inline_result) {
            const from = formatFrom(u.chosen_inline_result.from);
            return `[${u.update_id}] [CHOSEN INLINE RESULT]\n  From: ${from}\n  Result ID: ${u.chosen_inline_result.result_id}\n  Query: ${u.chosen_inline_result.query || ""}`;
          }

          // poll
          if (u.poll) {
            const options = u.poll.options.map(o => `${o.text} (${o.voter_count})`).join(", ");
            return `[${u.update_id}] [POLL]\n  Question: ${u.poll.question}\n  Options: ${options}\n  Total voters: ${u.poll.total_voter_count}`;
          }

          // poll_answer
          if (u.poll_answer) {
            const from = formatFrom(u.poll_answer.user);
            return `[${u.update_id}] [POLL ANSWER]\n  From: ${from}\n  Poll ID: ${u.poll_answer.poll_id}\n  Options: ${u.poll_answer.option_ids.join(", ")}`;
          }

          // my_chat_member / chat_member
          const memberUpdate = u.my_chat_member || u.chat_member;
          if (memberUpdate) {
            const tag = u.my_chat_member ? "MY CHAT MEMBER" : "CHAT MEMBER";
            const from = formatFrom(memberUpdate.from);
            const chat = formatChat(memberUpdate.chat);
            const oldStatus = memberUpdate.old_chat_member?.status || "?";
            const newStatus = memberUpdate.new_chat_member?.status || "?";
            return `[${u.update_id}] [${tag}]\n  From: ${from}\n  Chat: ${chat}\n  Status: ${oldStatus} → ${newStatus}`;
          }

          // chat_join_request
          if (u.chat_join_request) {
            const from = formatFrom(u.chat_join_request.from);
            const chat = formatChat(u.chat_join_request.chat);
            return `[${u.update_id}] [CHAT JOIN REQUEST]\n  From: ${from}\n  Chat: ${chat}`;
          }

          // shipping_query
          if (u.shipping_query) {
            const from = formatFrom(u.shipping_query.from);
            return `[${u.update_id}] [SHIPPING QUERY]\n  From: ${from}\n  Payload: ${u.shipping_query.invoice_payload}`;
          }

          // pre_checkout_query
          if (u.pre_checkout_query) {
            const from = formatFrom(u.pre_checkout_query.from);
            return `[${u.update_id}] [PRE-CHECKOUT QUERY]\n  From: ${from}\n  Amount: ${u.pre_checkout_query.total_amount} ${u.pre_checkout_query.currency}\n  Payload: ${u.pre_checkout_query.invoice_payload}`;
          }

          // message_reaction / message_reaction_count
          if (u.message_reaction) {
            const from = formatFrom(u.message_reaction.user);
            const chat = formatChat(u.message_reaction.chat);
            return `[${u.update_id}] [MESSAGE REACTION]\n  From: ${from}\n  Chat: ${chat}\n  Message ID: ${u.message_reaction.message_id}`;
          }
          if (u.message_reaction_count) {
            const chat = formatChat(u.message_reaction_count.chat);
            return `[${u.update_id}] [REACTION COUNT]\n  Chat: ${chat}\n  Message ID: ${u.message_reaction_count.message_id}`;
          }

          // chat_boost / removed_chat_boost
          if (u.chat_boost) {
            const chat = formatChat(u.chat_boost.chat);
            return `[${u.update_id}] [CHAT BOOST]\n  Chat: ${chat}`;
          }
          if (u.removed_chat_boost) {
            const chat = formatChat(u.removed_chat_boost.chat);
            return `[${u.update_id}] [REMOVED CHAT BOOST]\n  Chat: ${chat}`;
          }

          return `[${u.update_id}] Unknown update type: ${Object.keys(u).filter(k => k !== "update_id").join(", ")}`;
        });

        return ok(`${result.length} update(s):\n\n${lines.join("\n\n")}\n\n---\nRaw:\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );
}
