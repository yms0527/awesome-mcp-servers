#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { BitbucketClient } from './bitbucket-client.js';

const BITBUCKET_TOOLS: Tool[] = [
  {
    name: 'bitbucket_list_repositories',
    description: 'List repositories for a workspace',
    inputSchema: {
      type: 'object',
      properties: {
        workspace: {
          type: 'string',
          description: 'Bitbucket workspace name',
        },
        page: {
          type: 'number',
          description: 'Page number (default: 1)',
          default: 1,
        },
      },
      required: ['workspace'],
    },
  },
  {
    name: 'bitbucket_get_repository',
    description: 'Get details of a specific repository',
    inputSchema: {
      type: 'object',
      properties: {
        workspace: {
          type: 'string',
          description: 'Bitbucket workspace name',
        },
        repo_slug: {
          type: 'string',
          description: 'Repository slug',
        },
      },
      required: ['workspace', 'repo_slug'],
    },
  },
  {
    name: 'bitbucket_list_pull_requests',
    description: 'List pull requests for a repository',
    inputSchema: {
      type: 'object',
      properties: {
        workspace: {
          type: 'string',
          description: 'Bitbucket workspace name',
        },
        repo_slug: {
          type: 'string',
          description: 'Repository slug',
        },
        state: {
          type: 'string',
          enum: ['OPEN', 'MERGED', 'DECLINED'],
          description: 'Pull request state',
          default: 'OPEN',
        },
      },
      required: ['workspace', 'repo_slug'],
    },
  },
  {
    name: 'bitbucket_get_pull_request',
    description: 'Get details of a specific pull request',
    inputSchema: {
      type: 'object',
      properties: {
        workspace: {
          type: 'string',
          description: 'Bitbucket workspace name',
        },
        repo_slug: {
          type: 'string',
          description: 'Repository slug',
        },
        pull_request_id: {
          type: 'number',
          description: 'Pull request ID',
        },
      },
      required: ['workspace', 'repo_slug', 'pull_request_id'],
    },
  },
  {
    name: 'bitbucket_list_issues',
    description: 'List issues for a repository',
    inputSchema: {
      type: 'object',
      properties: {
        workspace: {
          type: 'string',
          description: 'Bitbucket workspace name',
        },
        repo_slug: {
          type: 'string',
          description: 'Repository slug',
        },
        state: {
          type: 'string',
          enum: ['new', 'open', 'resolved', 'on hold', 'invalid', 'duplicate', 'wontfix', 'closed'],
          description: 'Issue state',
        },
      },
      required: ['workspace', 'repo_slug'],
    },
  },
  {
    name: 'bitbucket_create_pull_request',
    description: 'Create a new pull request',
    inputSchema: {
      type: 'object',
      properties: {
        workspace: {
          type: 'string',
          description: 'Bitbucket workspace name',
        },
        repo_slug: {
          type: 'string',
          description: 'Repository slug',
        },
        title: {
          type: 'string',
          description: 'Pull request title',
        },
        description: {
          type: 'string',
          description: 'Pull request description',
        },
        source_branch: {
          type: 'string',
          description: 'Source branch name',
        },
        destination_branch: {
          type: 'string',
          description: 'Destination branch name',
          default: 'main',
        },
      },
      required: ['workspace', 'repo_slug', 'title', 'source_branch'],
    },
  },
];

class BitbucketMCPServer {
  private server: Server;
  private bitbucketClient: BitbucketClient;

  constructor() {
    this.server = new Server(
      {
        name: 'bitbucket-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.bitbucketClient = new BitbucketClient();
    this.setupToolHandlers();
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: BITBUCKET_TOOLS,
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'bitbucket_list_repositories':
            return await this.handleListRepositories(args);
          case 'bitbucket_get_repository':
            return await this.handleGetRepository(args);
          case 'bitbucket_list_pull_requests':
            return await this.handleListPullRequests(args);
          case 'bitbucket_get_pull_request':
            return await this.handleGetPullRequest(args);
          case 'bitbucket_list_issues':
            return await this.handleListIssues(args);
          case 'bitbucket_create_pull_request':
            return await this.handleCreatePullRequest(args);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    });
  }

  private async handleListRepositories(args: any) {
    const repos = await this.bitbucketClient.listRepositories(args.workspace, args.page);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(repos, null, 2),
        },
      ],
    };
  }

  private async handleGetRepository(args: any) {
    const repo = await this.bitbucketClient.getRepository(args.workspace, args.repo_slug);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(repo, null, 2),
        },
      ],
    };
  }

  private async handleListPullRequests(args: any) {
    const prs = await this.bitbucketClient.listPullRequests(
      args.workspace,
      args.repo_slug,
      args.state
    );
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(prs, null, 2),
        },
      ],
    };
  }

  private async handleGetPullRequest(args: any) {
    const pr = await this.bitbucketClient.getPullRequest(
      args.workspace,
      args.repo_slug,
      args.pull_request_id
    );
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(pr, null, 2),
        },
      ],
    };
  }

  private async handleListIssues(args: any) {
    const issues = await this.bitbucketClient.listIssues(
      args.workspace,
      args.repo_slug,
      args.state
    );
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(issues, null, 2),
        },
      ],
    };
  }

  private async handleCreatePullRequest(args: any) {
    const pr = await this.bitbucketClient.createPullRequest(
      args.workspace,
      args.repo_slug,
      {
        title: args.title,
        description: args.description,
        source_branch: args.source_branch,
        destination_branch: args.destination_branch || 'main',
      }
    );
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(pr, null, 2),
        },
      ],
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
  }
}

const server = new BitbucketMCPServer();
server.run().catch(console.error);