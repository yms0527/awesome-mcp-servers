/**
 * MCP tool definitions for musclesworked.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { MusclesWorkedApiError, MusclesWorkedClient } from "./client.js";

function formatError(err: unknown): string {
  if (err instanceof MusclesWorkedApiError) {
    switch (err.status) {
      case 401:
        return "Invalid API key. Check your MUSCLESWORKED_API_KEY.";
      case 403:
        return "Account not approved. Visit musclesworked.com to check your status.";
      case 404:
        return err.detail;
      case 429:
        return "Rate limit exceeded. Please wait before retrying.";
      default:
        if (err.status >= 500) {
          return "API temporarily unavailable. Try again shortly.";
        }
        return err.detail;
    }
  }
  if (err instanceof Error) {
    return err.message;
  }
  return String(err);
}

export function registerTools(server: McpServer, client: MusclesWorkedClient): void {
  server.tool(
    "get_muscles_worked",
    "Get the primary, secondary, and stabilizer muscles worked by an exercise. " +
      "Use search_exercises first if you don't know the exercise ID.",
    { exercise: z.string().describe("Exercise ID or name (e.g. 'barbell_bench_press')") },
    async ({ exercise }) => {
      try {
        const result = await client.getMusclesWorked(exercise);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (err) {
        return { content: [{ type: "text", text: formatError(err) }], isError: true };
      }
    },
  );

  server.tool(
    "find_exercises",
    "Find exercises that target a specific muscle, with optional filters. " +
      "Use search_muscles first if you don't know the muscle ID.",
    {
      muscle: z.string().describe("Muscle ID or name (e.g. 'pectoralis_major_sternal')"),
      equipment: z
        .enum([
          "barbell", "dumbbell", "kettlebell", "cable", "machine", "bodyweight",
          "band", "smith_machine", "trap_bar", "ez_bar", "suspension",
          "medicine_ball", "plate", "landmine", "none",
        ])
        .optional()
        .describe("Filter by equipment type"),
      difficulty: z
        .enum(["beginner", "intermediate", "advanced"])
        .optional()
        .describe("Filter by difficulty level"),
      movement_pattern: z
        .enum([
          "horizontal_push", "horizontal_pull", "vertical_push", "vertical_pull",
          "squat", "hinge", "lunge", "carry", "rotation", "anti_rotation",
          "flexion", "extension", "isolation", "abduction", "adduction",
        ])
        .optional()
        .describe("Filter by movement pattern"),
      exercise_type: z
        .enum(["compound", "isolation", "isometric"])
        .optional()
        .describe("Filter by exercise type"),
      role: z
        .enum(["primary", "secondary", "stabilizer"])
        .optional()
        .describe("Filter by muscle role"),
      limit: z
        .number()
        .int()
        .min(1)
        .max(200)
        .optional()
        .describe("Max results (default: 50)"),
    },
    async ({ muscle, ...filters }) => {
      try {
        const result = await client.findExercises(muscle, filters);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (err) {
        return { content: [{ type: "text", text: formatError(err) }], isError: true };
      }
    },
  );

  server.tool(
    "analyze_workout",
    "Analyze a workout for muscle coverage, gaps, and imbalances. " +
      "Pass a list of exercise names or IDs.",
    {
      exercises: z
        .array(z.string())
        .min(1)
        .describe("List of exercise IDs or names"),
    },
    async ({ exercises }) => {
      try {
        const result = await client.analyzeWorkout(exercises);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (err) {
        return { content: [{ type: "text", text: formatError(err) }], isError: true };
      }
    },
  );

  server.tool(
    "get_alternatives",
    "Find alternative exercises ranked by muscle overlap score. " +
      "Use search_exercises first if you don't know the exercise ID.",
    {
      exercise: z.string().describe("Exercise ID or name"),
      limit: z
        .number()
        .int()
        .min(1)
        .max(50)
        .optional()
        .describe("Max results (default: 10)"),
    },
    async ({ exercise, limit }) => {
      try {
        const result = await client.getAlternatives(exercise, limit);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (err) {
        return { content: [{ type: "text", text: formatError(err) }], isError: true };
      }
    },
  );

  server.tool(
    "search_exercises",
    "Search for exercises by name. Returns matching exercise IDs and names. " +
      "Use this to discover exercise IDs before calling get_muscles_worked or get_alternatives.",
    {
      query: z
        .string()
        .min(2)
        .describe("Search query (e.g. 'bench press', 'squat')"),
    },
    async ({ query }) => {
      try {
        const result = await client.searchExercises(query);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (err) {
        return { content: [{ type: "text", text: formatError(err) }], isError: true };
      }
    },
  );

  server.tool(
    "search_muscles",
    "Search for muscles by name. Returns matching muscle IDs and names. " +
      "Use this to discover muscle IDs before calling find_exercises.",
    {
      query: z
        .string()
        .min(2)
        .describe("Search query (e.g. 'chest', 'bicep', 'quad')"),
    },
    async ({ query }) => {
      try {
        const result = await client.searchMuscles(query);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (err) {
        return { content: [{ type: "text", text: formatError(err) }], isError: true };
      }
    },
  );
}
