import { z } from "zod";

export const CreatePromptRequestSchema = z.object({
  url: z.string().describe("The URL of the prompt"),
  prompt: z.string().describe("The prompt to create"),
  schema: z.object({
    type: z.enum(["object"]),
    properties: z.record(
      z.string(),
      z.object({
        type: z.enum(["array"]),
        description: z.string().describe("The description of the array"),
        items: z.object({
          type: z.enum(["object"]),
          properties: z.record(
            z.string(),
            z.object({
              type: z.enum(["string"]).describe("The type of the property"),
              description: z
                .string()
                .describe("The description of the property"),
            })
          ),
          required: z.array(z.string()),
          additionalProperties: z.boolean().default(false),
        }),
      })
    ),
    required: z.array(z.string()),
    additionalProperties: z.boolean().default(false),
  }),
  options: z.object({
    deep: z.boolean().optional().default(false).describe("Whether to crawl additional pages searching for more data"),
    maxPages: z.number().optional().default(1).describe("The maximum number of pages to crawl"),
  }),
});

export const CreatePromptResponseSchema = z.object({
  success: z.boolean(),
  data: z.record(z.string(), z.array(z.record(z.string(), z.any()))),
});
