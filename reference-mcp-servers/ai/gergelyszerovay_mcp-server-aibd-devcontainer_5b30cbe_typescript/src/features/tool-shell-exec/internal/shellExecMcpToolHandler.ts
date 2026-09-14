import type { AppState } from "@features/app-state/AppState";
import type { JsonContent } from "@shared/mcp-tool/JsonContent";
import { McpToolError } from "@shared/mcp-tool/McpToolError";
import { exec } from "child_process";
import util from "util";
import type { ShellExecInput } from "./ShellExecInputSchema";
import type { ShellExecOutput } from "./ShellExecOutputSchema";

const execPromise = util.promisify(exec);

type ShellExecMcpToolHandlerParams = {
  params: ShellExecInput;
  appState: AppState;
};

/**
 * Handler for the shell_exec MCP tool
 * Executes a shell command and returns the output
 *
 * @param params - Tool parameters including the command to execute
 * @param appState - Application state to check if the tool is enabled
 * @returns Command output as text or an error
 */
export async function shellExecMcpToolHandler({
  params,
  appState,
}: ShellExecMcpToolHandlerParams): Promise<
  Array<JsonContent<ShellExecOutput>> | McpToolError
> {
  // Double-check that the tool is enabled, even though it should only be included
  // in the tools list when enableShellExecTool is true
  if (!appState.enableShellExecTool) {
    return new McpToolError(
      "Shell execution is disabled. Enable with --enableShellExecTool flag."
    );
  }

  try {
    const { command, timeout = 60000 } = params;

    // Set up the execution options
    const options = {
      timeout: timeout,
      maxBuffer: 1024 * 1024, // 1MB max output
      shell: true,
    };

    // Execute the command
    let exitCode = 0;
    let stdout = "";
    let stderr = "";

    try {
      const result = await execPromise(command, options);
      stdout = result.stdout;
      stderr = result.stderr;
      exitCode = 0; // Successful execution
    } catch (err) {
      // If the command exited with non-zero status, we'll still get the stdout/stderr
      if (err && typeof err === "object") {
        if ("stdout" in err) stdout = String(err.stdout || "");
        if ("stderr" in err) stderr = String(err.stderr || "");

        // Try to extract the exit code
        if ("code" in err && typeof err.code === "number") {
          exitCode = err.code;
        } else if ("status" in err && typeof err.status === "number") {
          exitCode = err.status;
        } else {
          exitCode = 1; // Default to 1 for general error
        }
      } else {
        throw err; // Re-throw unexpected errors
      }
    }

    // Truncate if output is too large
    const MAX_OUTPUT_LENGTH = 100000; // About 100KB of text
    let stdoutTruncated = stdout;
    let stderrTruncated = stderr || "";

    if (stdoutTruncated.length > MAX_OUTPUT_LENGTH) {
      stdoutTruncated =
        stdoutTruncated.substring(0, MAX_OUTPUT_LENGTH) +
        "\n\n[Output truncated due to size limitations]";
    }

    if (stderrTruncated.length > MAX_OUTPUT_LENGTH) {
      stderrTruncated =
        stderrTruncated.substring(0, MAX_OUTPUT_LENGTH) +
        "\n\n[Error output truncated due to size limitations]";
    }

    return [
      {
        type: "json",
        data: {
          stdout: stdoutTruncated || "",
          stderr: stderrTruncated,
          exitCode: exitCode,
        },
      },
    ];
  } catch (error) {
    // Handle different types of errors
    if (error instanceof Error) {
      const errorMessage = error.message || "Unknown error";

      // Handle timeout errors
      if (
        errorMessage.includes("ETIMEDOUT") ||
        errorMessage.includes("timed out")
      ) {
        return new McpToolError(`Command execution timed out: ${errorMessage}`);
      }

      // Handle permission errors
      if (errorMessage.includes("EACCES")) {
        return new McpToolError(`Permission denied: ${errorMessage}`);
      }

      // Handle command not found errors
      if (
        errorMessage.includes("ENOENT") ||
        errorMessage.includes("command not found")
      ) {
        return new McpToolError(`Command not found: ${errorMessage}`);
      }

      return new McpToolError(`Command execution failed: ${errorMessage}`);
    }

    return new McpToolError(
      "An unexpected error occurred during command execution"
    );
  }
}
