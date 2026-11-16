#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import fetch from "node-fetch";
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import {
  GetMergeRequestSchema,
  GitLabGetMergeRequestSchema,
  GetMergeRequestLatestVersionSchema,
  GitLabGetMergeRequestLatestVersionSchema,
  CreateDiscussionSchema,
  GitLabCreateDiscussionSchema,
  type GitLabGetMergeRequest,
  type GitLabGetMergeRequestVersion,
  type GitLabCreateDiscussion,
} from './schemas.js';

const server = new Server({
  name: "gitlab-review-mcp-server",
  version: "0.1.0",
}, {
  capabilities: {
    tools: {}
  }
});

const GITLAB_PERSONAL_ACCESS_TOKEN = process.env.GITLAB_PERSONAL_ACCESS_TOKEN;
const GITLAB_API_URL = process.env.GITLAB_API_URL || 'https://gitlab.com/api/v4';

if (!GITLAB_PERSONAL_ACCESS_TOKEN) {
  console.error("GITLAB_PERSONAL_ACCESS_TOKEN environment variable is not set");
  process.exit(1);
}

async function getMergeRequest(
  projectId: string,
  merge_request_iid: number,
): Promise<GitLabGetMergeRequest> {
  const url = `${GITLAB_API_URL}/projects/${encodeURIComponent(projectId)}/merge_requests/${merge_request_iid}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${GITLAB_PERSONAL_ACCESS_TOKEN}`,
      "Content-Type": "application/json"
    }
  });
  if (!response.ok) {
    throw new Error(`GitLab API error: ${response.statusText}`);
  }

  return GitLabGetMergeRequestSchema.parse(await response.json());
}

async function getMergeRequestLatestVersion(
  projectId: string,
  merge_request_iid: number,
): Promise<GitLabGetMergeRequestVersion> {
  const url = `${GITLAB_API_URL}/projects/${encodeURIComponent(projectId)}/merge_requests/${merge_request_iid}/versions`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${GITLAB_PERSONAL_ACCESS_TOKEN}`,
      "Content-Type": "application/json"
    }
  });
  if (!response.ok) {
    throw new Error(`GitLab API error: ${response.statusText}`);
  }

  const versions = GitLabGetMergeRequestLatestVersionSchema.array().parse(await response.json());
  return versions[0];
}

async function postDiscussionComments(
  projectId: string,
  mergeRequestIid: number,
  options: z.infer<typeof CreateDiscussionSchema>
): Promise<GitLabCreateDiscussion> {
  const response = await fetch(
    `${GITLAB_API_URL}/projects/${encodeURIComponent(projectId)}/merge_requests/${mergeRequestIid}/discussions`,
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GITLAB_PERSONAL_ACCESS_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        body: options.body,
        id: encodeURIComponent(projectId),
        merge_request_iid: mergeRequestIid,
        position: options.position,
      })
    }
  );

  if (!response.ok) {
    throw new Error(`GitLab API error: ${response.statusText}`);
  }

  

  return GitLabCreateDiscussionSchema.parse(await response.json());
}


server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get_merge_request",
        description: "Get merge request details",
        inputSchema: zodToJsonSchema(GetMergeRequestSchema)
      },
      {
        name: "get_merge_request_latest_version",
        description: "Get the latest version of a merge request",
        inputSchema: zodToJsonSchema(GetMergeRequestLatestVersionSchema)
      },
      {
        name: "post_discussion_comment",
        description: "Post a comment to a merge request discussion",
        inputSchema: zodToJsonSchema(CreateDiscussionSchema)
      }
    ]
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    if (!request.params.arguments) {
      throw new Error("Arguments are required");
    }

    switch (request.params.name) {
      case "get_merge_request": {
        const args = GetMergeRequestSchema.parse(request.params.arguments);
        const mergeRequest = await getMergeRequest(args.project_id, args.merge_request_iid);
        return { content: [{ type: "text", text: JSON.stringify(mergeRequest, null, 2) }] };
      }
      case "get_merge_request_latest_version": {
        const args = GetMergeRequestLatestVersionSchema.parse(request.params.arguments);
        const mergeRequest = await getMergeRequestLatestVersion(args.project_id, args.merge_request_iid);
        return { content: [{ type: "text", text: JSON.stringify(mergeRequest, null, 2) }] };
      }
      case "post_discussion_comment": {
        const args = CreateDiscussionSchema.parse(request.params.arguments);
        const discussion = await postDiscussionComments(args.project_id, args.merge_request_iid, args);
        return { content: [{ type: "text", text: JSON.stringify(discussion, null, 2) }] };
      }
      default:
        throw new Error(`Unknown tool: ${request.params.name}`);
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Invalid arguments: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`);
    }
    throw error;
  }
});

async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("GitLab Review MCP Server running on stdio");
}

runServer().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});