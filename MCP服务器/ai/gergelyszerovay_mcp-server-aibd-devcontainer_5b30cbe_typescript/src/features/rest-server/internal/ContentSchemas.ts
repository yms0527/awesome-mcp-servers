import { z } from "zod";

/**
 * Schema for validating TextContent objects
 * Represents a text response from an MCP tool
 */
export const TextContentSchema = z.object({
  type: z.literal("text"),
  text: z.string(),
});

/**
 * Schema for validating ImageContent objects
 * Represents an image response from an MCP tool
 */
export const ImageContentSchema = z.object({
  type: z.literal("image"),
  data: z.string(),
  mimeType: z.string(),
});

/**
 * Creates a schema for validating JsonContent objects with a specific data type
 * Represents a JSON response from an MCP tool
 *
 * @param dataSchema - Zod schema for the data property
 * @returns A Zod schema for JsonContent with the specified data type
 */
export function createJsonContentSchema<T extends z.ZodTypeAny>(dataSchema: T) {
  return z.object({
    type: z.literal("json"),
    data: dataSchema,
  });
}

/**
 * Schema for validating arrays of content objects
 * This approach allows for mixed arrays containing any combination of
 * TextContent, ImageContent, and optionally JsonContent objects
 *
 * @param jsonDataSchema - Optional Zod schema for JSON data (if JsonContent is expected)
 * @returns A Zod schema for an array of content objects
 */
export function createContentArraySchema(jsonDataSchema?: z.ZodTypeAny) {
  // Create the array schema using discriminated union for type safety
  return z.array(
    z.discriminatedUnion("type", [
      TextContentSchema,
      ImageContentSchema,
      ...(jsonDataSchema ? [createJsonContentSchema(jsonDataSchema)] : []),
    ])
  );
}
