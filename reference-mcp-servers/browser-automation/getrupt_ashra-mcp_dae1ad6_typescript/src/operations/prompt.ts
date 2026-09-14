import { z } from "zod";
import { ashraRequest } from "../common/utils.js";
import {
  CreatePromptRequestSchema,
  CreatePromptResponseSchema,
} from "../common/types.js";

export async function Create(
  params: z.infer<typeof CreatePromptRequestSchema>
) {
  const { url, prompt, schema, options } =
    CreatePromptRequestSchema.parse(params);
  const response = await ashraRequest(`https://api.ashra.ai/prompt`, {
    method: "POST",
    body: { url, prompt, schema, options },
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.ASHRA_API_KEY}`,
    },
  });
  return CreatePromptResponseSchema.parse(response);
}
