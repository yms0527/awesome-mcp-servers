#!/usr/bin/env node

// ------------------------------------------------------------------------------------------------
// CRASH GUARD: Register error handlers BEFORE any other imports to catch initialization errors
// ------------------------------------------------------------------------------------------------
process.on('uncaughtException', (err) => {
    console.error('FATAL CLOUD CRASH (Uncaught Exception):', err);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('FATAL CLOUD CRASH (Unhandled Rejection) at:', promise, 'reason:', reason);
    process.exit(1);
});

console.error('Process started. Registered crash guards.'); // Use stderr for visibility
// ------------------------------------------------------------------------------------------------

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import { Transport } from '@modelcontextprotocol/sdk/shared/transport.js';
import { JSONRPCMessage } from '@modelcontextprotocol/sdk/types.js';
import { zodToJsonSchema } from 'zod-to-json-schema';

// ------------------------------------------------------------------------------------------------
// 🛠️ SMITHERY & DEPLOYMENT BEST PRACTICES FIX
// ------------------------------------------------------------------------------------------------

/**
 * HTTP POST Transport for single-request JSON-RPC (Stateless)
 * Robust version that handles notifications vs requests and prevents timeouts.
 */
/**
 * HTTP POST Transport for JSON-RPC (Stateless)
 * Robust version that handles Batch Requests, Buffering, and Shims.
 */
class HttpPostTransport implements Transport {
    private res: express.Response;
    private ignoredIds: Set<string | number> = new Set();
    private responseBuffer: JSONRPCMessage[] = [];
    private isBatch: boolean;

    // Async Synchronization for Stateless HTTP
    private pendingRequestIds: Set<string | number> = new Set();
    private responseResolvers: Map<string | number, () => void> = new Map();

    constructor(res: express.Response, isBatch: boolean = false) {
        this.res = res;
        this.isBatch = isBatch;
    }

    ignoreId(id: string | number) {
        this.ignoredIds.add(id);
    }

    // Called by the handler to signal we EXPECT a response for this ID
    markRequestPending(id: string | number) {
        this.pendingRequestIds.add(id);
    }

    start(): Promise<void> {
        return Promise.resolve();
    }

    async send(message: JSONRPCMessage): Promise<void> {
        const id = (message as any).id;

        // 1. Check if this is a response to a pending request
        if (id !== undefined && (message as any).result !== undefined || (message as any).error !== undefined) {
            if (this.pendingRequestIds.has(id)) {
                this.pendingRequestIds.delete(id);
                // If there's a resolver waiting for this ID (unlikely in this design, but good for completeness)
                // meaningful if we were waiting on specific ID promises.
            }
        }

        // 2. Filter out ignored messages (internal shims)
        // Even if ignored, we effectively "handled" the pending state by receiving it here.
        if (id !== undefined && this.ignoredIds.has(id)) {
            return;
        }

        // 3. Buffer the response
        this.responseBuffer.push(message);
    }

    // Explicit method to flush responses to HTTP
    async flush(): Promise<void> {
        if (this.res.headersSent) return;

        // WAIT loop: Wait for all pending requests to result in a response (or timeout)
        const startTime = Date.now();
        while (this.pendingRequestIds.size > 0) {
            if (Date.now() - startTime > 9000) { // 9s timeout (server has 10s global timeout)
                console.error('HttpPostTransport: Timed out waiting for pending responses:', Array.from(this.pendingRequestIds));
                break;
            }
            await new Promise(resolve => setTimeout(resolve, 50)); // Poll every 50ms
        }

        // If no responses, send 200 OK with empty array (or object) to allow client parsing
        // Smithery seems to error on 204 No Content ("Unexpected content type: null")
        if (this.responseBuffer.length === 0) {
            console.log('Use HttpPostTransport: Buffer empty, sending []');
            this.res.status(200).json([]);
            return;
        }

        // Send Batch or Single response
        if (this.isBatch) {
            this.res.json(this.responseBuffer);
        } else {
            // Strict JSON-RPC: Single Request -> Single Response.
            this.res.json(this.responseBuffer[0]);
        }
    }

    async close(): Promise<void> {
        return Promise.resolve();
    }

    onclose?: () => void;
    onerror?: (error: Error) => void;
    onmessage?: (message: JSONRPCMessage) => void;

    handleMessage(message: JSONRPCMessage) {
        if (this.onmessage) {
            this.onmessage(message);
        }
    }
}

async function main() {
    try {
        console.error('Initializing Server...');
        // ... (Environment checks remain same) ...
        if (!process.env.RAGALGO_API_KEY) {
            console.error('⚠️  WARNING: RAGALGO_API_KEY is not set.');
        } else {
            console.error('✅ RAGALGO_API_KEY is detected.');
        }

        // Import tools
        const { getNews, getNewsScored, NewsParamsSchema, NewsScoredParamsSchema } = await import('./tools/news.js');
        const { getChartStock, getChartCoin, ChartStockParamsSchema, ChartCoinParamsSchema } = await import('./tools/chart.js');
        const { getFinancials, FinancialsParamsSchema } = await import('./tools/financials.js');
        const { getSnapshots, SnapshotsParamsSchema } = await import('./tools/snapshots.js');
        const { searchTags, SearchTagsParamsSchema, matchTags, MatchTagsParamsSchema } = await import('./tools/tags.js');
        const { getTrends, TrendsParamsSchema } = await import('./tools/trends.js');
        const { getResearch, ResearchParamsSchema } = await import('./tools/research.js');
        const { getAvailableRooms, GetAvailableRoomsSchema } = await import('./tools/rooms.js');

        const isStdio = process.argv.includes('--stdio');

        // Helper to create a fresh MCP Server instance
        const createServer = () => {
            const server = new Server(
                {
                    name: 'RagAlgo',
                    version: '1.0.7',
                },
                {
                    capabilities: {
                        tools: {},
                    },
                }
            );

            server.setRequestHandler(ListToolsRequestSchema, async () => {
                return {
                    tools: [
                        {
                            name: 'search_tags',
                            description: `🔍 [TAG LOOKUP - USE FIRST] ALWAYS use this BEFORE other RagAlgo tools when user mentions any stock, coin, or theme by NAME.

PRIMARY TOOL for converting names to tag_codes. Without correct tag_code, other tools will return inaccurate or empty results.

ALWAYS use when user asks:
- Stock names: Apple, Tesla, Samsung, Nvidia, Toyota
- Crypto names: Bitcoin, Ethereum, Ripple, Solana
- Index/Market names: S&P 500, Nasdaq, Dow Jones, Nikkei 225
- Theme/sector names: AI, Semiconductor, EV, Bio

Examples: "Apple" → USTK_AAPL, "Samsung" → STK005930, "S&P 500" → ^GSPC

CRITICAL: Call this first, then use the returned tag_code in other tools.`,
                            inputSchema: zodToJsonSchema(SearchTagsParamsSchema as any) as any
                        },
                        {
                            name: 'get_snapshots',
                            description: `📊 [TIER 1: GLOBAL MARKET DASHBOARD] PRIMARY TOOL for ALL market questions. ALWAYS use this FIRST.

This is the ONLY tool that returns news + chart + research COMBINED in one call.
Prefer this over calling get_news + get_chart separately - much more efficient!

ALWAYS use when user asks:
- "How's the market today?"
- "Market summary"
- "What's hot today?"
- "Daily briefing"
- "S&P 500 status"

Supports: 
- Markets: US (NYSE/Nasdaq), KR (Korea), UK (LSE), JP (Tokyo), Crypto, Futures
- Auto-routes based on tag_code prefix (STK, USTK, LSE, JPIX, CRY, =F, ^)

Returns per asset: 
- News stats (count, avg_sentiment, bullish/bearish ratio)
- Chart data (score, zone, price)
- Research reports (count, outlook)

TIP: If research_count > 0, use 'get_research' for full report details.`,
                            inputSchema: zodToJsonSchema(SnapshotsParamsSchema as any) as any
                        },
                        {
                            name: 'get_news_scored',
                            description: `📰 [TIER 2: NEWS DETAIL] Get global news articles with AI sentiment scores (-10 to +10).

Use for detailed news lookup when get_snapshots shows significant news activity.
Filter by: tag_code, verdict (bullish/bearish/neutral), score range

Supports: All global markets (US, KR, UK, JP, Crypto)
Response includes tag_codes for cross-referencing with charts.

TIP: Use get_snapshots first for overview, then this for detailed news on specific tags.`,
                            inputSchema: zodToJsonSchema(NewsScoredParamsSchema as any) as any
                        },
                        {
                            name: 'get_news',
                            description: `📰 [RAW NEWS - NO SCORES] Basic news without sentiment analysis. Use only when sentiment scores are not needed.

Prefer get_news_scored over this for most use cases.`,
                            inputSchema: zodToJsonSchema(NewsParamsSchema as any) as any
                        },
                        {
                            name: 'get_chart_stock',
                            description: `📈 [TIER 2: STOCK CHART DETAIL] Get detailed technical analysis with V4 scoring.

Use for: "which stocks are rising?", momentum screening, detailed chart analysis
Filter by: zone (STRONG_UP/UP_ZONE/NEUTRAL/DOWN_ZONE/STRONG_DOWN), market (US/KR/JP/UK)

Supports: US, KR, JP, UK markets
Response includes tag_code for cross-referencing with news.

TIP: Use get_snapshots first for quick overview, then this for detailed technical analysis.`,
                            inputSchema: zodToJsonSchema(ChartStockParamsSchema as any) as any
                        },
                        {
                            name: 'get_chart_coin',
                            description: `🪙 [TIER 2: CRYPTO CHART DETAIL] Get detailed crypto technical analysis with V4 scoring.

Use for: "how's Bitcoin?", crypto momentum screening, detailed chart analysis
Filter by: zone (STRONG_UP/UP_ZONE/NEUTRAL/DOWN_ZONE/STRONG_DOWN)

Supports: All major cryptocurrencies (KRW pairs)
Response includes tag_code for cross-referencing.`,
                            inputSchema: zodToJsonSchema(ChartCoinParamsSchema as any) as any
                        },
                        {
                            name: 'get_research',
                            description: `📑 [TIER 2: RESEARCH DETAIL] Get professional analyst reports and key insights.

Use when: 
- get_snapshots shows 'research_count > 0'
- User asks for: "market outlook", "sector analysis", "future trends", "investment insights"
- Questions about: "AI Industry outlook", "Semiconductor Cycle"

Filter by: tag_code, source (mckinsey, goldman, etc.)

Returns:
- Full AI Summary
- Key Investment Insights
- Market Outlook (Bullish/Bearish)
- Tag codes for related assets

TIP: This tool provides *LONG-TERM* sector trends and professional analysis. Combine with news/charts for comprehensive view.`,
                            inputSchema: zodToJsonSchema(ResearchParamsSchema as any) as any
                        },
                        {
                            name: 'get_financials',
                            description: `💰 [STOCK FUNDAMENTALS] Get quarterly financial statements.

Use for: "Samsung financials", "low PER stocks", "high ROE companies", "undervalued stocks"

Returns: PER, PBR, ROE, ROA, revenue, operating_income, net_income, debt_ratio, dividend_yield

Note: Currently supports KOREAN stocks only.`,
                            inputSchema: zodToJsonSchema(FinancialsParamsSchema as any) as any
                        },
                        {
                            name: 'match_tags',
                            description: `🏷️ [AUTO-TAG EXTRACTION] Extract stock/crypto/theme tags from any text.

Use for: Analyzing what topics a news title mentions, auto-categorizing text content, finding related tags from a sentence.

Input: any text (e.g., "Nvidia HBM chip breakthrough news")
Returns: matched tags with confidence scores`,
                            inputSchema: zodToJsonSchema(MatchTagsParamsSchema as any) as any
                        },

                        {
                            name: 'get_trends',
                            description: `📉 [SENTIMENT TRENDS] Get historical sentiment trend for a specific asset over time.

Use for: "Samsung news trend last week", "Bitcoin sentiment this month", "recent 7-day news trend"

REQUIRES tag_code - use search_tags first!
Returns: daily news_count and avg_sentiment over N days`,
                            inputSchema: zodToJsonSchema(TrendsParamsSchema as any) as any
                        },
                        {
                            name: 'get_available_rooms',
                            description: `📺 [REALTIME] Get active WebSocket subscription rooms for real-time data streaming.

Returns: Available room IDs for market_snapshot, global_news, and tag-specific streams.`,
                            inputSchema: zodToJsonSchema(GetAvailableRoomsSchema as any) as any
                        },
                    ],
                };
            });

            server.setRequestHandler(CallToolRequestSchema, async (request) => {
                const { name, arguments: args } = request.params;
                try {
                    let result: unknown;
                    switch (name) {
                        case 'get_news': result = await getNews(NewsParamsSchema.parse(args)); break;
                        case 'get_news_scored': result = await getNewsScored(NewsScoredParamsSchema.parse(args)); break;
                        case 'get_chart_stock': result = await getChartStock(ChartStockParamsSchema.parse(args)); break;
                        case 'get_chart_coin': result = await getChartCoin(ChartCoinParamsSchema.parse(args)); break;
                        case 'get_research': result = await getResearch(ResearchParamsSchema.parse(args)); break;
                        case 'get_financials': result = await getFinancials(FinancialsParamsSchema.parse(args)); break;
                        case 'get_snapshots': result = await getSnapshots(SnapshotsParamsSchema.parse(args)); break;
                        case 'search_tags': result = await searchTags(SearchTagsParamsSchema.parse(args)); break;
                        case 'match_tags': result = await matchTags(MatchTagsParamsSchema.parse(args)); break;
                        case 'get_trends': result = await getTrends(TrendsParamsSchema.parse(args)); break;
                        case 'get_available_rooms': result = await getAvailableRooms(GetAvailableRoomsSchema.parse(args)); break;
                        default: throw new Error(`Unknown tool: ${name}`);
                    }
                    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : String(error);
                    return { content: [{ type: 'text', text: `Error: ${errorMessage}` }], isError: true };
                }
            });

            return server;
        };

        if (isStdio) {
            const server = createServer();
            const transport = new StdioServerTransport();
            await server.connect(transport);
            console.error('RagAlgo MCP Server started (Stdio Mode)');
        } else {
            console.error('Starting in HTTP/SSE Mode');
            const port = process.env.PORT || 8080;
            const app = express();

            app.use(cors());
            app.use(express.json());

            app.use((req, res, next) => {
                console.log(`[${req.method}] ${req.originalUrl} `);
                next();
            });

            // ------------------------------------------------------------------------------------------------
            // 🚀 SMITHERY FIX: Explicit Health & Server Card Endpoints
            // ------------------------------------------------------------------------------------------------
            app.get('/', (req, res) => res.status(200).send('RagAlgo MCP Server Running'));
            app.get('/health', (req, res) => res.status(200).send('OK'));

            app.get("/.well-known/mcp-server-card", (req, res) => {
                res.json({
                    mcp_id: "ragalgo-mcp-server",
                    name: "RagAlgo MCP Server",
                    description: "Your API key for the RagAlgo service",
                    capabilities: {
                        tools: true
                    }
                });
            });
            // ------------------------------------------------------------------------------------------------

            // SSE IMPLEMENTATION: Multi-Session Support (Map-based)
            const server = createServer();
            const transports = new Map<string, SSEServerTransport>();

            app.get('/sse', async (req, res) => {
                // FIX: Disable buffering for Railway/Nginx proxies to allow real-time SSE
                res.setHeader('X-Accel-Buffering', 'no');

                console.log('New SSE connection initiated');
                const sessionId = uuidv4();
                const transport = new SSEServerTransport(`/messages?sessionId=${sessionId}`, res);

                transports.set(sessionId, transport);
                console.error(`Transport created for session: ${sessionId}`); // Log to stderr for Smithery visibility

                try {
                    await server.connect(transport);
                    console.error(`Server connected to transport: ${sessionId}`);

                    // ------------------------------------------------------------------------------------------------
                    // 💓 KEEPALIVE FIX: Send explicit heartbeats for Railway/Glama
                    // MOVED AFTER connect() to avoid ERR_HTTP_HEADERS_SENT (SDK needs to write headers first)
                    // ------------------------------------------------------------------------------------------------
                    // Send immediate "ready" packet to flush buffers
                    res.write(':\n\n');

                    // Send heartbeat every 15 seconds to prevent load balancer timeouts
                    const keepAliveInterval = setInterval(() => {
                        if (res.writable) {
                            res.write(':\n\n');
                        }
                    }, 15000);
                    // ------------------------------------------------------------------------------------------------

                    // Cleanup on close (moved inside/near the interval creation scope for clarity, though logic remains same)
                    req.on('close', () => {
                        console.log(`SSE connection closed for session: ${sessionId}`);
                        clearInterval(keepAliveInterval); // Stop heartbeats
                        transports.delete(sessionId);
                    });

                } catch (error) {
                    console.error(`Error connecting server to transport ${sessionId}:`, error);
                }
            });

            app.post('/messages', async (req, res) => {
                const sessionId = req.query.sessionId as string;
                console.log(`Received message for session: ${sessionId}`);

                const transport = transports.get(sessionId);

                if (!transport) {
                    console.error(`Session not found: ${sessionId}`);
                    res.status(404).json({ error: 'Session not found or inactive' });
                    return;
                }

                try {
                    await transport.handlePostMessage(req, res);
                } catch (error) {
                    console.error(`Error handling post message for session ${sessionId}:`, error);
                    res.status(500).json({ error: 'Internal Server Error' });
                }
            });

            // ------------------------------------------------------------------------------------------------
            // 🛠️ SMITHERY FIX: Handle POST /mcp for stateless scanners
            // ------------------------------------------------------------------------------------------------
            app.post('/mcp', async (req, res) => {
                // 1. TIMEOUT SAFEGUARD: Prevent hanging requests
                const timeout = setTimeout(() => {
                    if (!res.headersSent) res.status(504).send('Gateway Timeout: MCP Server processing took too long');
                }, 10000);

                try {
                    console.log('Received POST /mcp probe. Body:', JSON.stringify(req.body));
                    const isBatch = Array.isArray(req.body);
                    const messages = isBatch ? (req.body as JSONRPCMessage[]) : [req.body as JSONRPCMessage];

                    // 2. CHECK IF INITIALIZATION IS NEEDED
                    // If any message in the batch is 'initialize', we let the client handle it.
                    // If NO message is 'initialize', we must shim it.
                    const hasInit = messages.some(m => (m as any).method === 'initialize');

                    const transport = new HttpPostTransport(res, isBatch);
                    const server = createServer();
                    await server.connect(transport);

                    // 3. INJECT SHIM IF NEEDED
                    if (!hasInit) {
                        console.log('[Stateless Shim] Injecting auto-initialization...');
                        const shimId = '__auto_init__';
                        transport.ignoreId(shimId);

                        // Inject 'initialize'
                        await transport.handleMessage({
                            jsonrpc: '2.0',
                            id: shimId,
                            method: 'initialize',
                            params: {
                                protocolVersion: '2024-11-05',
                                capabilities: {},
                                clientInfo: { name: 'stateless-shim', version: '1.0.0' }
                            }
                        } as any);

                        // Inject 'notifications/initialized'
                        await transport.handleMessage({
                            jsonrpc: '2.0',
                            method: 'notifications/initialized'
                        } as any);
                    }

                    // 4. PROCESS ACTUAL MESSAGES
                    for (const msg of messages) {
                        // Mark requests as PENDING so flush() waits for them
                        if ((msg as any).id !== undefined) {
                            transport.markRequestPending((msg as any).id);
                        }
                        await transport.handleMessage(msg);
                    }

                    // 5. FLUSH RESPONSES
                    await transport.flush();

                } catch (error) {
                    console.error('Error in POST /mcp:', error);
                    if (!res.headersSent) res.status(500).json({ error: 'Internal Server Error', details: String(error) });
                } finally {
                    clearTimeout(timeout);
                }
            });
            // ------------------------------------------------------------------------------------------------

            app.listen(Number(port), '0.0.0.0', () => {
                console.error(`RagAlgo MCP Server listening on port ${port} `);
            });
        }

    } catch (error) {
        console.error('FATAL STARTUP ERROR:', error);
        process.exit(1);
    }
}

main();

