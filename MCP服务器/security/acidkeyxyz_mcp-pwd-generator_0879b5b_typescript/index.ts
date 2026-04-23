import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Create an MCP server
const server = new McpServer({
  name: "Demo",
  version: "1.0.0"
});
const allCharSets = {
    all: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*()_+',
    alpha: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
    numbers: '0123456789',
    letters: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
};
function generateRandomPassword(length, passwordType) {
    const charset = allCharSets[passwordType];
    if (!charset) {
        console.log('Valid password types are: all, alpha, numbers, letters');
        return '';
    }
    let password = '';
    const charsetLength = charset.length;

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charsetLength);
        password += charset[randomIndex];
    }

    return password;
}
// Add an addition tool
server.tool("generate-password",
    //options: all, alpha, numbers, letters; default: all
  { count: z.number(), length: z.number(),type: z.enum(["all", "alpha", "numbers", "letters"]).optional().default("all") },
  async ({ count, length, type }) => ({
    content: [{ type: "text", text: String(generateRandomPassword(length, type)) }]
  })
);



// Create an async main function
async function main() {
  // Start receiving messages on stdin and sending messages on stdout
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

// Call the main function
main().catch(console.error);