import type { CliArgs } from "./CliArgs";
import { createCliParser } from "./internal/createCliParser";

/**
 * Parses command line arguments and returns the parsed CLI options
 *
 * @returns Parsed command line arguments
 */
export function parseCliArgs(): CliArgs {
  const cli = createCliParser();
  const flags = cli.flags;

  // Validate initialMode is one of the allowed values
  const initialMode = flags.initialMode as string;
  if (initialMode !== "mcpAct" && initialMode !== "mcpPlan") {
    throw new Error(
      `Invalid initialMode: ${initialMode}. Must be either "mcpAct" or "mcpPlan".`
    );
  }

  return {
    ...flags,
    initialMode: initialMode as "mcpAct" | "mcpPlan",
  } as CliArgs;
}
