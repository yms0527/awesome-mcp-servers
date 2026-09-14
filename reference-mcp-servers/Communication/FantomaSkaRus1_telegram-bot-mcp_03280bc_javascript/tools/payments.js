import { z } from "zod";
import {
  tgCall, resolveChatId, resolveThreadId,
  formatResult, parseJSON, ok, err
} from "../utils/api.js";

export function registerPaymentTools(server) {
  // send_invoice
  server.tool(
    "send_invoice",
    "Send an invoice to a chat.",
    {
      chat_id: z.union([z.string(), z.number()]).optional().describe("Chat ID (defaults to log group)"),
      title: z.string().describe("Product title (1-32 chars)"),
      description: z.string().describe("Product description (1-255 chars)"),
      payload: z.string().describe("Bot-defined invoice payload (1-128 chars)"),
      currency: z.string().describe("Three-letter ISO 4217 currency code"),
      prices: z.string().describe("JSON array of LabeledPrice objects"),
      provider_token: z.string().optional().describe("Payment provider token"),
      max_tip_amount: z.number().optional().describe("Maximum accepted tip amount"),
      suggested_tip_amounts: z.string().optional().describe("JSON array of suggested tip amounts"),
      start_parameter: z.string().optional().describe("Deep-linking parameter for generating invoice link via the bot"),
      photo_url: z.string().optional().describe("Product photo URL"),
      photo_size: z.number().optional().describe("Product photo size in bytes"),
      photo_width: z.number().optional().describe("Product photo width"),
      photo_height: z.number().optional().describe("Product photo height"),
      need_name: z.boolean().optional().describe("Require user's full name"),
      need_phone_number: z.boolean().optional().describe("Require user's phone number"),
      need_email: z.boolean().optional().describe("Require user's email"),
      need_shipping_address: z.boolean().optional().describe("Require shipping address"),
      send_phone_number_to_provider: z.boolean().optional().describe("Send user's phone number to the provider"),
      send_email_to_provider: z.boolean().optional().describe("Send user's email to the provider"),
      is_flexible: z.boolean().optional().describe("Final price depends on shipping"),
      message_thread_id: z.number().optional().describe("Topic/thread ID for supergroups with topics"),
      disable_notification: z.boolean().optional().describe("Send silently without notification"),
      protect_content: z.boolean().optional().describe("Protect message from forwarding/saving"),
      reply_parameters: z.string().optional().describe("JSON object with ReplyParameters (e.g. {\"message_id\": 123})"),
      reply_markup: z.string().optional().describe("JSON string with inline keyboard markup"),
      message_effect_id: z.string().optional().describe("Unique identifier of the message effect to apply"),
    },
    async ({ chat_id, title, description, payload, currency, prices, provider_token, max_tip_amount, suggested_tip_amounts, start_parameter, photo_url, photo_size, photo_width, photo_height, need_name, need_phone_number, need_email, need_shipping_address, send_phone_number_to_provider, send_email_to_provider, is_flexible, message_thread_id, disable_notification, protect_content, reply_parameters, reply_markup, message_effect_id }) => {
      try {
        const resolved_chat_id = resolveChatId(chat_id);
        const resolvedThreadId = resolveThreadId(chat_id, message_thread_id);
        const params = {
          chat_id: resolved_chat_id,
          title,
          description,
          payload,
          currency,
          prices: parseJSON(prices),
        };
        if (provider_token) params.provider_token = provider_token;
        if (max_tip_amount !== undefined) params.max_tip_amount = max_tip_amount;
        if (suggested_tip_amounts) params.suggested_tip_amounts = parseJSON(suggested_tip_amounts);
        if (start_parameter) params.start_parameter = start_parameter;
        if (photo_url) params.photo_url = photo_url;
        if (photo_size !== undefined) params.photo_size = photo_size;
        if (photo_width !== undefined) params.photo_width = photo_width;
        if (photo_height !== undefined) params.photo_height = photo_height;
        if (need_name !== undefined) params.need_name = need_name;
        if (need_phone_number !== undefined) params.need_phone_number = need_phone_number;
        if (need_email !== undefined) params.need_email = need_email;
        if (need_shipping_address !== undefined) params.need_shipping_address = need_shipping_address;
        if (send_phone_number_to_provider !== undefined) params.send_phone_number_to_provider = send_phone_number_to_provider;
        if (send_email_to_provider !== undefined) params.send_email_to_provider = send_email_to_provider;
        if (is_flexible !== undefined) params.is_flexible = is_flexible;
        if (resolvedThreadId) params.message_thread_id = resolvedThreadId;
        if (disable_notification) params.disable_notification = true;
        if (protect_content) params.protect_content = true;
        if (reply_parameters) params.reply_parameters = parseJSON(reply_parameters);
        if (reply_markup) params.reply_markup = parseJSON(reply_markup);
        if (message_effect_id) params.message_effect_id = message_effect_id;
        const result = await tgCall("sendInvoice", params);
        return ok(`Invoice sent.\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // create_invoice_link
  server.tool(
    "create_invoice_link",
    "Create a link for an invoice (can be sent to any chat).",
    {
      title: z.string().describe("Product title (1-32 chars)"),
      description: z.string().describe("Product description (1-255 chars)"),
      payload: z.string().describe("Bot-defined invoice payload (1-128 chars)"),
      currency: z.string().describe("Three-letter ISO 4217 currency code"),
      prices: z.string().describe("JSON array of LabeledPrice objects"),
      provider_token: z.string().optional().describe("Payment provider token"),
      max_tip_amount: z.number().optional().describe("Maximum accepted tip amount"),
      suggested_tip_amounts: z.string().optional().describe("JSON array of suggested tip amounts"),
      photo_url: z.string().optional().describe("Product photo URL"),
      photo_size: z.number().optional().describe("Product photo size in bytes"),
      photo_width: z.number().optional().describe("Product photo width"),
      photo_height: z.number().optional().describe("Product photo height"),
      need_name: z.boolean().optional().describe("Require user's full name"),
      need_phone_number: z.boolean().optional().describe("Require user's phone number"),
      need_email: z.boolean().optional().describe("Require user's email"),
      need_shipping_address: z.boolean().optional().describe("Require shipping address"),
      send_phone_number_to_provider: z.boolean().optional().describe("Send user's phone number to the provider"),
      send_email_to_provider: z.boolean().optional().describe("Send user's email to the provider"),
      is_flexible: z.boolean().optional().describe("Final price depends on shipping"),
    },
    async ({ title, description, payload, currency, prices, provider_token, max_tip_amount, suggested_tip_amounts, photo_url, photo_size, photo_width, photo_height, need_name, need_phone_number, need_email, need_shipping_address, send_phone_number_to_provider, send_email_to_provider, is_flexible }) => {
      try {
        const params = {
          title,
          description,
          payload,
          currency,
          prices: parseJSON(prices),
        };
        if (provider_token) params.provider_token = provider_token;
        if (max_tip_amount !== undefined) params.max_tip_amount = max_tip_amount;
        if (suggested_tip_amounts) params.suggested_tip_amounts = parseJSON(suggested_tip_amounts);
        if (photo_url) params.photo_url = photo_url;
        if (photo_size !== undefined) params.photo_size = photo_size;
        if (photo_width !== undefined) params.photo_width = photo_width;
        if (photo_height !== undefined) params.photo_height = photo_height;
        if (need_name !== undefined) params.need_name = need_name;
        if (need_phone_number !== undefined) params.need_phone_number = need_phone_number;
        if (need_email !== undefined) params.need_email = need_email;
        if (need_shipping_address !== undefined) params.need_shipping_address = need_shipping_address;
        if (send_phone_number_to_provider !== undefined) params.send_phone_number_to_provider = send_phone_number_to_provider;
        if (send_email_to_provider !== undefined) params.send_email_to_provider = send_email_to_provider;
        if (is_flexible !== undefined) params.is_flexible = is_flexible;
        const result = await tgCall("createInvoiceLink", params);
        return ok(`Invoice link created: ${result}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // answer_shipping_query
  server.tool(
    "answer_shipping_query",
    "Reply to a shipping query (for flexible invoices).",
    {
      shipping_query_id: z.string().describe("Shipping query ID"),
      ok: z.boolean().describe("Whether shipping is available"),
      shipping_options: z.string().optional().describe("JSON array of ShippingOption objects (required if ok=true)"),
      error_message: z.string().optional().describe("Error message (required if ok=false)"),
    },
    async ({ shipping_query_id, ok: okFlag, shipping_options, error_message }) => {
      try {
        const params = {
          shipping_query_id,
          ok: okFlag,
          shipping_options: shipping_options ? parseJSON(shipping_options) : undefined,
          error_message,
        };
        const result = await tgCall("answerShippingQuery", params);
        return ok(`Shipping query answered.\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // answer_pre_checkout_query
  server.tool(
    "answer_pre_checkout_query",
    "Reply to a pre-checkout query.",
    {
      pre_checkout_query_id: z.string().describe("Pre-checkout query ID"),
      ok: z.boolean().describe("Whether checkout is allowed"),
      error_message: z.string().optional().describe("Error message (required if ok=false)"),
    },
    async ({ pre_checkout_query_id, ok: okFlag, error_message }) => {
      try {
        const params = {
          pre_checkout_query_id,
          ok: okFlag,
          error_message,
        };
        const result = await tgCall("answerPreCheckoutQuery", params);
        return ok(`Pre-checkout query answered.\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // get_star_transactions
  server.tool(
    "get_star_transactions",
    "Get Telegram Star transactions.",
    {
      offset: z.number().optional().describe("Offset for pagination"),
      limit: z.number().optional().describe("Limit (1-100, default 100)"),
    },
    async ({ offset, limit }) => {
      try {
        const params = {};
        if (offset !== undefined) params.offset = offset;
        if (limit !== undefined) params.limit = limit;
        const result = await tgCall("getStarTransactions", params);
        return ok(`Star transactions:\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // ─── Gifts ──────────────────────────────────────────────────────────────────────

  // send_gift
  server.tool(
    "send_gift",
    "Send a gift to a user.",
    {
      user_id: z.number().describe("User ID to send gift to"),
      gift_id: z.string().describe("Gift ID to send"),
      text: z.string().optional().describe("Text to accompany the gift (0-255 chars with entities, 0-100 chars without)"),
      text_parse_mode: z.enum(["Markdown", "MarkdownV2", "HTML"]).optional().describe("Text formatting mode"),
      text_entities: z.string().optional().describe("JSON array of MessageEntity objects for text"),
    },
    async ({ user_id, gift_id, text, text_parse_mode, text_entities }) => {
      try {
        const params = { user_id, gift_id };
        if (text) params.text = text;
        if (text_parse_mode) params.text_parse_mode = text_parse_mode;
        if (text_entities) params.text_entities = parseJSON(text_entities);
        const result = await tgCall("sendGift", params);
        return ok(`Gift sent!\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // ─── Stars ──────────────────────────────────────────────────────────────────────

  // refund_star_payment
  server.tool(
    "refund_star_payment",
    "Refund a successful payment in Telegram Stars.",
    {
      user_id: z.number().describe("User ID that made the payment"),
      telegram_payment_charge_id: z.string().describe("Telegram payment charge ID from the successful payment"),
    },
    async ({ user_id, telegram_payment_charge_id }) => {
      try {
        const params = { user_id, telegram_payment_charge_id };
        const result = await tgCall("refundStarPayment", params);
        return ok(`Star payment refunded!\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // gift_premium_subscription
  server.tool(
    "gift_premium_subscription",
    "Gift a Telegram Premium subscription to a user. Returns True on success.",
    {
      user_id: z.number().describe("User ID who will receive the Premium subscription"),
      month_count: z.union([z.literal(3), z.literal(6), z.literal(12)])
        .describe("Number of months: 3, 6, or 12"),
      star_count: z.number().describe("Stars to pay: 1000 for 3 months, 1500 for 6 months, 2500 for 12 months"),
      text: z.string().max(128).optional().describe("Text shown with the service message (0-128 chars)"),
      text_parse_mode: z.enum(["Markdown", "MarkdownV2", "HTML"]).optional()
        .describe("Text formatting mode"),
      text_entities: z.string().optional().describe("JSON array of MessageEntity objects"),
    },
    async ({ user_id, month_count, star_count, text, text_parse_mode, text_entities }) => {
      try {
        const params = { user_id, month_count, star_count };
        if (text !== undefined) params.text = text;
        if (text_parse_mode) params.text_parse_mode = text_parse_mode;
        if (text_entities) params.text_entities = parseJSON(text_entities);
        const result = await tgCall("giftPremiumSubscription", params);
        return ok(`Premium subscription gifted to user ${user_id} for ${month_count} months!\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // ─── Gifts API ──────────────────────────────────────────────────────────────────

  // get_available_gifts
  server.tool(
    "get_available_gifts",
    "Get the list of gifts available for sending.",
    {},
    async () => {
      try {
        const result = await tgCall("getAvailableGifts");
        return ok(`Available gifts: ${result.gifts?.length || 0}\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // get_chat_gifts
  server.tool(
    "get_chat_gifts",
    "Get gifts sent to a chat.",
    {
      chat_id: z.union([z.string(), z.number()]).optional().describe("Chat ID (defaults to log group)"),
    },
    async ({ chat_id }) => {
      try {
        const result = await tgCall("getChatGifts", { chat_id: resolveChatId(chat_id) });
        return ok(`Chat gifts: ${result.total_count || 0}\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // get_user_gifts
  server.tool(
    "get_user_gifts",
    "Get gifts received by a user.",
    {
      user_id: z.number().describe("User ID"),
      exclude_unsaved: z.boolean().optional().describe("Exclude unsaved gifts"),
      exclude_saved: z.boolean().optional().describe("Exclude saved gifts"),
      exclude_unique: z.boolean().optional().describe("Exclude unique gifts"),
      sort_by_price: z.string().optional().describe("Sort direction: 'ascending' or 'descending'"),
    },
    async ({ user_id, exclude_unsaved, exclude_saved, exclude_unique, sort_by_price }) => {
      try {
        const params = { user_id };
        if (exclude_unsaved !== undefined) params.exclude_unsaved = exclude_unsaved;
        if (exclude_saved !== undefined) params.exclude_saved = exclude_saved;
        if (exclude_unique !== undefined) params.exclude_unique = exclude_unique;
        if (sort_by_price) params.sort_by_price = sort_by_price;
        const result = await tgCall("getUserGifts", params);
        return ok(`User gifts: ${result.total_count || 0}\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // get_business_account_gifts
  server.tool(
    "get_business_account_gifts",
    "Get gifts owned by a business account.",
    {
      business_connection_id: z.string().describe("Business connection ID"),
      exclude_unsaved: z.boolean().optional().describe("Exclude unsaved gifts"),
      exclude_saved: z.boolean().optional().describe("Exclude saved gifts"),
      exclude_unique: z.boolean().optional().describe("Exclude unique gifts"),
      sort_by_price: z.string().optional().describe("Sort direction"),
    },
    async ({ business_connection_id, exclude_unsaved, exclude_saved, exclude_unique, sort_by_price }) => {
      try {
        const params = { business_connection_id };
        if (exclude_unsaved !== undefined) params.exclude_unsaved = exclude_unsaved;
        if (exclude_saved !== undefined) params.exclude_saved = exclude_saved;
        if (exclude_unique !== undefined) params.exclude_unique = exclude_unique;
        if (sort_by_price) params.sort_by_price = sort_by_price;
        const result = await tgCall("getBusinessAccountGifts", params);
        return ok(`Business account gifts: ${result.total_count || 0}\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // transfer_gift
  server.tool(
    "transfer_gift",
    "Transfer a gift to another user.",
    {
      business_connection_id: z.string().describe("Business connection ID"),
      owned_gift_id: z.string().describe("Owned gift ID"),
      new_owner_chat_id: z.union([z.string(), z.number()]).describe("Recipient chat ID"),
      star_count: z.number().optional().describe("Stars to transfer with gift"),
    },
    async ({ business_connection_id, owned_gift_id, new_owner_chat_id, star_count }) => {
      try {
        const params = { business_connection_id, owned_gift_id, new_owner_chat_id };
        if (star_count !== undefined) params.star_count = star_count;
        const result = await tgCall("transferGift", params);
        return ok(`Gift transferred.\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // upgrade_gift
  server.tool(
    "upgrade_gift",
    "Upgrade a gift to a unique gift.",
    {
      business_connection_id: z.string().describe("Business connection ID"),
      owned_gift_id: z.string().describe("Owned gift ID"),
      keep_original_details: z.boolean().optional().describe("Keep original details"),
    },
    async ({ business_connection_id, owned_gift_id, keep_original_details }) => {
      try {
        const params = { business_connection_id, owned_gift_id };
        if (keep_original_details !== undefined) params.keep_original_details = keep_original_details;
        const result = await tgCall("upgradeGift", params);
        return ok(`Gift upgraded.\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );

  // convert_gift_to_stars
  server.tool(
    "convert_gift_to_stars",
    "Convert a gift to Telegram Stars.",
    {
      business_connection_id: z.string().describe("Business connection ID"),
      owned_gift_id: z.string().describe("Owned gift ID"),
    },
    async ({ business_connection_id, owned_gift_id }) => {
      try {
        const result = await tgCall("convertGiftToStars", { business_connection_id, owned_gift_id });
        return ok(`Gift converted to stars.\n\n${formatResult(result)}`);
      } catch (e) {
        return err(`Error: ${e.message}`);
      }
    }
  );
}
