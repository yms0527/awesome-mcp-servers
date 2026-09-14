import { z } from "zod";
import { IntercomClient } from "../api/client.js";

export const GetConversationsSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  customer: z.string().optional(),
  state: z.string().optional(),
});

export const SearchConversationsSchema = z.object({
  createdAt: z
    .object({
      operator: z.enum(["=", "!=", ">", "<"]),
      value: z.number(),
    })
    .optional(),
  updatedAt: z
    .object({
      operator: z.enum(["=", "!=", ">", "<"]),
      value: z.number(),
    })
    .optional(),
  sourceType: z.string().optional(),
  state: z.string().optional(),
  open: z.boolean().optional(),
  read: z.boolean().optional(),
  // Add more filters as needed
});

export async function searchConversations(
  args: z.infer<typeof SearchConversationsSchema>
) {
  const client = new IntercomClient();
  const params: Parameters<typeof client.searchConversations>[0] = {};

  if (args.createdAt) {
    params.createdAt = args.createdAt;
  }
  if (args.updatedAt) {
    params.updatedAt = args.updatedAt;
  }
  if (args.sourceType) {
    params.sourceType = args.sourceType;
  }
  if (args.state) {
    params.state = args.state;
  }
  if (args.open) {
    params.open = args.open;
  }
  if (args.read) {
    params.read = args.read;
  }

  const { conversations } = await client.searchConversations(params);

  return conversations.map((conv) => ({
    id: conv.id,
    created_at: new Date(conv.created_at * 1000).toISOString(),
    updated_at: new Date(conv.updated_at * 1000).toISOString(),
    state: conv.state,
    priority: conv.priority,
    contacts: conv.contacts.map((contact) => ({
      name: contact.name,
      id: contact.id,
      
    })),

  }));
}

export async function listConversationsFromLastWeek() {
  // Calculate last week's date range
  const client = new IntercomClient();
  const now = new Date();
  const lastWeekStart = new Date(now);
  lastWeekStart.setDate(now.getDate() - 7);
  lastWeekStart.setHours(0, 0, 0, 0);

  const lastWeekEnd = new Date(lastWeekStart);
  lastWeekEnd.setDate(lastWeekStart.getDate() + 6);
  lastWeekEnd.setHours(23, 59, 59, 999);

  // Convert to Unix timestamp (seconds)
  const startTimestamp = Math.floor(lastWeekStart.getTime() / 1000);
  const endTimestamp = Math.floor(lastWeekEnd.getTime() / 1000);

  return client.searchConversations({
    createdAt: {
      operator: ">",
      value: startTimestamp,
    },
    updatedAt: {
      operator: "<",
      value: endTimestamp,
    },
  });
}

// export async function getConversations(
//   args: z.infer<typeof GetConversationsSchema>
// ) {
//   const client = new IntercomClient();

//   const params: Parameters<typeof client.getConversations>[0] = {};

//   if (args.startDate) {
//     params.startDate = new Date(args.startDate);
//   }
//   if (args.endDate) {
//     params.endDate = new Date(args.endDate);
//   }
//   if (args.customer) {
//     params.customer = args.customer;
//   }
//   if (args.state) {
//     params.state = args.state;
//   }

//   const { conversations } = await client.getConversations(params);

//   return conversations.map((conv) => ({
//     id: conv.id,
//     created_at: new Date(conv.created_at * 1000).toISOString(),
//     updated_at: new Date(conv.updated_at * 1000).toISOString(),
//     state: conv.state,
//     priority: conv.priority,
//     contacts: conv.contacts.map((contact) => ({
//       name: contact.name,
//       id: contact.id,
//     })),
//     statistics: {
//       responses: conv.statistics.responses,
//       reopens: conv.statistics.reopens,
//     },
//   }));
// }
