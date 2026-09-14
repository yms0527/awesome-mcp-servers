import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
  listBuckets,
  listObjects,
  getObject,
  putObject,
  deleteObject,
  presignedUrl,
  bucketInfo,
  type ObjectInfo,
} from "./s3.js";

function formatBuckets(
  buckets: { name: string; creationDate?: Date }[],
): string {
  if (buckets.length === 0) return "No buckets found.";
  return buckets
    .map(
      (b) =>
        `  • ${b.name}${b.creationDate ? ` (created: ${b.creationDate.toISOString()})` : ""}`,
    )
    .join("\n");
}

function formatObjects(items: ObjectInfo[]): string {
  if (items.length === 0) return "No objects found.";
  return items
    .map((o) => {
      if (o.isPrefix) return `  📁 ${o.key}`;
      const size = o.size != null ? ` (${o.size} B)` : "";
      const modified =
        o.lastModified != null ? ` — ${o.lastModified.toISOString()}` : "";
      return `  📄 ${o.key}${size}${modified}`;
    })
    .join("\n");
}

const server = new McpServer({
  name: "mcp-server-s3",
  version: "1.0.0",
});

server.tool(
  "list_buckets",
  "List all S3 buckets in your AWS account.",
  {},
  async () => {
    try {
      const buckets = await listBuckets();
      const text = `Buckets (${buckets.length}):\n\n${formatBuckets(buckets)}`;
      return { content: [{ type: "text", text }] };
    } catch (err) {
      return {
        content: [
          {
            type: "text",
            text: `Error: ${err instanceof Error ? err.message : String(err)}`,
          },
        ],
        isError: true,
      };
    }
  },
);

server.tool(
  "list_objects",
  "List objects in an S3 bucket. Optionally filter by prefix and limit count.",
  {
    bucket: z.string().describe("Bucket name"),
    prefix: z.string().optional().describe("Key prefix (e.g. 'uploads/')"),
    maxKeys: z
      .number()
      .int()
      .min(1)
      .max(1000)
      .default(100)
      .describe("Max objects to return"),
  },
  async ({ bucket, prefix, maxKeys }) => {
    try {
      const items = await listObjects(bucket, prefix, maxKeys);
      const header = prefix
        ? `Objects in s3://${bucket}/${prefix} (max ${maxKeys}):\n\n`
        : `Objects in s3://${bucket}/ (max ${maxKeys}):\n\n`;
      const text = header + formatObjects(items);
      return { content: [{ type: "text", text }] };
    } catch (err) {
      return {
        content: [
          {
            type: "text",
            text: `Error: ${err instanceof Error ? err.message : String(err)}`,
          },
        ],
        isError: true,
      };
    }
  },
);

server.tool(
  "get_object",
  "Download and read the contents of an S3 object as text.",
  {
    bucket: z.string().describe("Bucket name"),
    key: z.string().describe("Object key"),
  },
  async ({ bucket, key }) => {
    try {
      const content = await getObject(bucket, key);
      return {
        content: [
          {
            type: "text",
            text: `Content of s3://${bucket}/${key}:\n\n${content}`,
          },
        ],
      };
    } catch (err) {
      return {
        content: [
          {
            type: "text",
            text: `Error: ${err instanceof Error ? err.message : String(err)}`,
          },
        ],
        isError: true,
      };
    }
  },
);

server.tool(
  "put_object",
  "Upload text content to an S3 object.",
  {
    bucket: z.string().describe("Bucket name"),
    key: z.string().describe("Object key"),
    content: z.string().describe("Content to upload"),
    contentType: z
      .string()
      .optional()
      .describe("Content-Type header (default: text/plain)"),
  },
  async ({ bucket, key, content, contentType }) => {
    try {
      await putObject(bucket, key, content, contentType);
      return {
        content: [
          {
            type: "text",
            text: `✅ Uploaded ${content.length} bytes to s3://${bucket}/${key}`,
          },
        ],
      };
    } catch (err) {
      return {
        content: [
          {
            type: "text",
            text: `Error: ${err instanceof Error ? err.message : String(err)}`,
          },
        ],
        isError: true,
      };
    }
  },
);

server.tool(
  "delete_object",
  "Delete an object from an S3 bucket.",
  {
    bucket: z.string().describe("Bucket name"),
    key: z.string().describe("Object key"),
  },
  async ({ bucket, key }) => {
    try {
      await deleteObject(bucket, key);
      return {
        content: [
          {
            type: "text",
            text: `✅ Deleted s3://${bucket}/${key}`,
          },
        ],
      };
    } catch (err) {
      return {
        content: [
          {
            type: "text",
            text: `Error: ${err instanceof Error ? err.message : String(err)}`,
          },
        ],
        isError: true,
      };
    }
  },
);

server.tool(
  "presigned_url",
  "Generate a presigned URL for temporary access to an S3 object.",
  {
    bucket: z.string().describe("Bucket name"),
    key: z.string().describe("Object key"),
    expiresIn: z
      .number()
      .int()
      .min(60)
      .max(604800)
      .default(3600)
      .describe("URL expiry in seconds (default: 1 hour)"),
  },
  async ({ bucket, key, expiresIn }) => {
    try {
      const url = await presignedUrl(bucket, key, expiresIn);
      const hrs = Math.round(expiresIn / 3600);
      const text = `Presigned URL for s3://${bucket}/${key} (valid ~${hrs}h):\n\n${url}`;
      return { content: [{ type: "text", text }] };
    } catch (err) {
      return {
        content: [
          {
            type: "text",
            text: `Error: ${err instanceof Error ? err.message : String(err)}`,
          },
        ],
        isError: true,
      };
    }
  },
);

server.tool(
  "bucket_info",
  "Check if a bucket exists and get basic info.",
  {
    bucket: z.string().describe("Bucket name"),
  },
  async ({ bucket }) => {
    try {
      const info = await bucketInfo(bucket);
      const status = info.exists ? "✅ Exists" : "❌ Not found / no access";
      const region = info.region ? `\nRegion: ${info.region}` : "";
      const text = `Bucket: ${bucket}\n${status}${region}`;
      return { content: [{ type: "text", text }] };
    } catch (err) {
      return {
        content: [
          {
            type: "text",
            text: `Error: ${err instanceof Error ? err.message : String(err)}`,
          },
        ],
        isError: true,
      };
    }
  },
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
