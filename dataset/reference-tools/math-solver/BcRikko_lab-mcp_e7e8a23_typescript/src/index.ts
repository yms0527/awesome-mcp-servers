import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'

const server = new McpServer({
  name: 'server-time',
  version: '0.0.1',
  capabilities: {
    // Resources will be registered here in the future.
    resources: {},
    tools: {},
  },
})

server.tool(
  'get-server-time',
  'サーバーの現在時刻を取得します。',
  {
    state: z.string().optional(),
  },
  async ({ state }) => {
    console.log(state)
    const date = new Date()
    return {
      content: [
        {
          type: 'text',
          text: `サーバーの現在時刻は ${date.toLocaleString()} です。`,
        },
      ],
    }
  },
)

async function main() {
  const transport = new StdioServerTransport()
  await server.connect(transport)
  console.log('Server is running...')
}

main().catch((error) => {
  console.error('Error starting server:', error)
  process.exit(1)
})