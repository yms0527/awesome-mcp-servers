/**
 * Code Execution Prompts
 */

import { p } from "@mcpc/utils";

const PROMPT_TEMPLATE =
  `Agentic tool \`{toolName}\` executes JavaScript code with MCP tool access.

<manual>
{description}
</manual>

<api>
**\`tool(toolName, params)\`** — Call any MCP tool. Returns \`{ content: [{ type: "text", text: "..." }] }\`.

\`\`\`js
const result = await tool("add", { a: 1, b: 2 });
const value = result.content[0].text;  // "3"
\`\`\`

**\`console.log(...)\`** — Print output (the only way to return values from \`exec\`).
</api>

<available_tools>
{availableTools}
</available_tools>

<parameters>
\`tool\` - "man" to inspect tool schemas, "exec" to execute code
\`args\` - For "man": { tools: ["tool1"] }. For "exec": { code: "..." }
</parameters>

<rules>
1. Use \`man\` to inspect tool schemas before calling unfamiliar tools
2. Use \`exec\` to run JavaScript; call tools with \`await tool(name, params)\` and print results with \`console.log\`
</rules>`;

export const compilePrompt = p(PROMPT_TEMPLATE);
