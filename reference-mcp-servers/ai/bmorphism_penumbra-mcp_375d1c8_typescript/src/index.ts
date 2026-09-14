#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import axios, { type Axios } from 'axios';

// Configuration from environment variables
const CONFIG = {
  node: {
    url: process.env.PENUMBRA_NODE_URL || 'http://localhost:8080',
    timeout: parseInt(process.env.PENUMBRA_REQUEST_TIMEOUT || '10000', 10),
    retries: parseInt(process.env.PENUMBRA_REQUEST_RETRIES || '3', 10)
  },
  chain: {
    network: process.env.PENUMBRA_NETWORK || 'testnet',
    chainId: process.env.PENUMBRA_CHAIN_ID || 'penumbra-testnet',
    blockTime: parseInt(process.env.PENUMBRA_BLOCK_TIME || '6000', 10), // ms
    epochDuration: parseInt(process.env.PENUMBRA_EPOCH_DURATION || '100', 10) // blocks
  },
  dex: {
    batchInterval: parseInt(process.env.PENUMBRA_DEX_BATCH_INTERVAL || '60000', 10), // ms
    minLiquidityAmount: process.env.PENUMBRA_DEX_MIN_LIQUIDITY || '1000',
    maxPriceImpact: parseFloat(process.env.PENUMBRA_DEX_MAX_PRICE_IMPACT || '0.05') // 5%
  },
  governance: {
    votingPeriod: parseInt(process.env.PENUMBRA_GOVERNANCE_VOTING_PERIOD || '604800000', 10), // 7 days in ms
    minDepositAmount: process.env.PENUMBRA_GOVERNANCE_MIN_DEPOSIT || '10000'
  }
};

type ErrorResponse = {
  content: Array<{
    type: 'text';
    text: string;
  }>;
  isError: true;
};

interface ValidatorInfo {
  address: string;
  votingPower: string;
  commission: string;
  status: string;
}

interface ChainStatus {
  height: string;
  chainId: string;
  timestamp: string;
  blockHash: string;
}

class PenumbraServer {
  private server: Server;
  private httpClient: Axios;

  constructor() {
    this.server = new Server(
      {
        name: 'penumbra-mcp',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.httpClient = axios.create({
      baseURL: CONFIG.node.url,
      timeout: CONFIG.node.timeout,
      // Add retry logic
      validateStatus: (status) => status < 500,
    });

    this.setupToolHandlers();
    
    // Error handling
    this.server.onerror = (error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'get_validator_set',
          description: 'Get the current validator set information',
          inputSchema: {
            type: 'object',
            properties: {},
            required: [],
          },
        },
        {
          name: 'get_chain_status',
          description: 'Get current chain status including block height and chain ID',
          inputSchema: {
            type: 'object',
            properties: {},
            required: [],
          },
        },
        {
          name: 'get_transaction',
          description: 'Get details of a specific transaction',
          inputSchema: {
            type: 'object',
            properties: {
              hash: {
                type: 'string',
                description: 'Transaction hash',
              },
            },
            required: ['hash'],
          },
        },
        {
          name: 'get_dex_state',
          description: 'Get current DEX state including latest batch auction results',
          inputSchema: {
            type: 'object',
            properties: {},
            required: [],
          },
        },
        {
          name: 'get_governance_proposals',
          description: 'Get active governance proposals',
          inputSchema: {
            type: 'object',
            properties: {
              status: {
                type: 'string',
                enum: ['active', 'completed', 'all'],
                description: 'Filter proposals by status',
                default: 'active'
              }
            },
            required: [],
          },
        }
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      switch (request.params.name) {
        case 'get_validator_set':
          return await this.getValidatorSet();
        case 'get_chain_status':
          return await this.getChainStatus();
        case 'get_transaction':
          if (!request.params.arguments?.hash || typeof request.params.arguments.hash !== 'string') {
            throw new McpError(
              ErrorCode.InvalidParams,
              'Transaction hash must be a string'
            );
          }
          return await this.getTransaction(request.params.arguments.hash);
        case 'get_dex_state':
          return await this.getDexState();
        case 'get_governance_proposals':
          return await this.getGovernanceProposals(
            (request.params.arguments?.status as string) || 'active'
          );
        default:
          throw new McpError(
            ErrorCode.MethodNotFound,
            `Unknown tool: ${request.params.name}`
          );
      }
    });
  }

  private async getValidatorSet() {
    try {
      // TODO: Implement actual validator set query using Penumbra client
      // For now returning mock data until we integrate the proper client
      const mockValidators: ValidatorInfo[] = [
        {
          address: "penumbrav1xyz...",
          votingPower: "1000000",
          commission: "0.05",
          status: "active"
        }
      ];

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ validators: mockValidators }, null, 2),
          },
        ],
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      return {
        content: [
          {
            type: 'text',
            text: `Error fetching validator set: ${errorMessage}`,
          },
        ],
        isError: true,
      };
    }
  }

  private async getChainStatus() {
    try {
      // TODO: Implement actual chain status query
      const mockStatus: ChainStatus = {
        height: "1000000",
        chainId: CONFIG.chain.chainId,
        timestamp: new Date().toISOString(),
        blockHash: "0x..."
      };

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(mockStatus, null, 2),
          },
        ],
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      return {
        content: [
          {
            type: 'text',
            text: `Error fetching chain status: ${errorMessage}`,
          },
        ],
        isError: true,
      };
    }
  }

  private async getTransaction(hash: string) {
    try {
      // TODO: Implement actual transaction query
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              hash,
              status: "success",
              height: "1000000",
              timestamp: new Date().toISOString(),
              gasUsed: "50000",
              fee: "0.001"
            }, null, 2),
          },
        ],
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      return {
        content: [
          {
            type: 'text',
            text: `Error fetching transaction: ${errorMessage}`,
          },
        ],
        isError: true,
      };
    }
  }

  private async getDexState() {
    try {
      // TODO: Implement actual DEX state query
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              currentBatchNumber: "12345",
              lastBatchTimestamp: new Date().toISOString(),
              batchInterval: CONFIG.dex.batchInterval,
              minLiquidityAmount: CONFIG.dex.minLiquidityAmount,
              maxPriceImpact: CONFIG.dex.maxPriceImpact,
              activePairs: [
                {
                  baseAsset: "penumbra/usdc",
                  quoteAsset: "penumbra/eth",
                  lastPrice: "1850.50",
                  volume24h: "1000000"
                }
              ]
            }, null, 2),
          },
        ],
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      return {
        content: [
          {
            type: 'text',
            text: `Error fetching DEX state: ${errorMessage}`,
          },
        ],
        isError: true,
      };
    }
  }

  private async getGovernanceProposals(status: string) {
    try {
      // TODO: Implement actual governance proposals query
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              proposals: [
                {
                  id: "1",
                  title: "Example Proposal",
                  status: "active",
                  votingEndTime: new Date(Date.now() + CONFIG.governance.votingPeriod).toISOString(),
                  minDeposit: CONFIG.governance.minDepositAmount,
                  yesVotes: "750000",
                  noVotes: "250000"
                }
              ]
            }, null, 2),
          },
        ],
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      return {
        content: [
          {
            type: 'text',
            text: `Error fetching governance proposals: ${errorMessage}`,
          },
        ],
        isError: true,
      };
    }
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Penumbra MCP server running on stdio');
  }
}

const server = new PenumbraServer();
server.run().catch(console.error);
