import { createMcpHandler, McpServer } from '@modelcontextprotocol/server'
import { env } from 'cloudflare:workers'
import { z } from 'zod'

// 默认 legacy: 'stateless'：2026-07-28 新协议按请求无状态服务，2025 旧客户端走无状态兼容路径
const mcp = createMcpHandler(() => {
  const server = new McpServer({ name: 'GitHub Stars', version: '0.0.2' })
  server.registerTool(
    'search_github_stars',
    {
      description: 'Search GitHub Starred Repositories',
      inputSchema: z.object({ query: z.string() }),
    },
    async ({ query }) => {
      const answer = await env.AI.autorag(env.AUTO_RAG_NAME).search({
        query,
      })

      return {
        content: [{ type: 'text', text: JSON.stringify(answer.data) }],
      }
    },
  )
  return server
})

export default {
  fetch: (req) => {
    const authHeader = req.headers.get('Authorization')
    const apiKey = authHeader?.replace('Bearer ', '').trim()

    if (env.MCP_API_KEY && apiKey !== env.MCP_API_KEY) {
      return new Response('Unauthorized', { status: 401 })
    }

    return mcp.fetch(req)
  },
}
