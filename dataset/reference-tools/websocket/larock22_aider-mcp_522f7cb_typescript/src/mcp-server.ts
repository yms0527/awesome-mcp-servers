// Real MCP Server for Aider
import { WebSocketServer, WebSocket } from "ws";
import { spawn, ChildProcessWithoutNullStreams } from "child_process";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";
import pino from "pino";

dotenv.config();

const log = pino({ level: process.env.LOG_LEVEL ?? "info" });

// MCP Protocol Types
interface JsonRpcRequest {
  jsonrpc: "2.0";
  method: string;
  params?: any;
  id: string | number;
}

interface JsonRpcResponse {
  jsonrpc: "2.0";
  result?: any;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
  id: string | number;
}

interface MCPInitializeParams {
  protocolVersion: string;
  capabilities: {
    roots?: {
      listChanged?: boolean;
    };
    sampling?: {};
  };
  clientInfo: {
    name: string;
    version?: string;
  };
}

interface MCPTool {
  name: string;
  description?: string;
  inputSchema: {
    type: "object";
    properties?: Record<string, any>;
    required?: string[];
  };
}

// MCP Session Handler
class MCPSession {
  private aiderProcess?: ChildProcessWithoutNullStreams;
  private workspaceDir: string;

  constructor(
    private ws: WebSocket,
    workspace: string
  ) {
    this.workspaceDir = path.resolve(process.env.WORKSPACES_DIR ?? "./workspaces", workspace);
    fs.mkdirSync(this.workspaceDir, { recursive: true });
    this.setupHandlers();
  }

  private setupHandlers() {
    this.ws.on("message", (data) => {
      try {
        const request = JSON.parse(data.toString()) as JsonRpcRequest;
        this.handleRequest(request);
      } catch (err) {
        log.error({ err }, "Failed to parse message");
      }
    });

    this.ws.on("close", () => {
      if (this.aiderProcess) {
        this.aiderProcess.kill();
      }
    });
  }

  private async handleRequest(request: JsonRpcRequest) {
    log.debug({ request }, "Handling MCP request");

    switch (request.method) {
      case "initialize":
        await this.handleInitialize(request);
        break;
      case "tools/list":
        await this.handleToolsList(request);
        break;
      case "tools/call":
        await this.handleToolCall(request);
        break;
      default:
        this.sendError(request.id, -32601, `Method not found: ${request.method}`);
    }
  }

  private async handleInitialize(request: JsonRpcRequest) {
    // const params = request.params as MCPInitializeParams;
    
    this.sendResponse(request.id, {
      protocolVersion: "0.1.0",
      capabilities: {
        tools: {},
        prompts: {}
      },
      serverInfo: {
        name: "aider-mcp-server",
        version: "1.0.0"
      }
    });

    // Send initialized notification
    this.ws.send(JSON.stringify({
      jsonrpc: "2.0",
      method: "notifications/initialized"
    }));
  }

  private async handleToolsList(request: JsonRpcRequest) {
    const tools: MCPTool[] = [
      {
        name: "aider_command",
        description: "Execute an Aider command in the workspace",
        inputSchema: {
          type: "object",
          properties: {
            command: {
              type: "string",
              description: "The command to send to Aider (e.g., 'create a hello.py file')"
            }
          },
          required: ["command"]
        }
      },
      {
        name: "aider_add_file",
        description: "Add a file to Aider's context",
        inputSchema: {
          type: "object",
          properties: {
            filename: {
              type: "string",
              description: "The file to add to Aider's context"
            }
          },
          required: ["filename"]
        }
      },
      {
        name: "aider_run_command",
        description: "Run a shell command via Aider",
        inputSchema: {
          type: "object",
          properties: {
            command: {
              type: "string",
              description: "The shell command to run"
            }
          },
          required: ["command"]
        }
      }
    ];

    this.sendResponse(request.id, { tools });
  }

  private async handleToolCall(request: JsonRpcRequest) {
    const { name, arguments: args } = request.params;

    switch (name) {
      case "aider_command":
        await this.executeAiderCommand(request.id, args.command);
        break;
      case "aider_add_file":
        await this.executeAiderCommand(request.id, `/add ${args.filename}`);
        break;
      case "aider_run_command":
        await this.executeAiderCommand(request.id, `/run ${args.command}`);
        break;
      default:
        this.sendError(request.id, -32602, `Unknown tool: ${name}`);
    }
  }

  private async executeAiderCommand(requestId: string | number, command: string): Promise<void> {
    return new Promise((resolve) => {
      log.info({ command }, "Executing Aider command");
      
      if (!this.aiderProcess || this.aiderProcess.killed) {
        log.info("Starting new Aider process");
        this.startAider();
      }

      let output = "";
      let lastDataTime = Date.now();
      let checkInterval: NodeJS.Timeout;

      const handleData = (data: Buffer) => {
        const chunk = data.toString();
        output += chunk;
        lastDataTime = Date.now();
        
        // Log what we're receiving for debugging
        log.debug({ chunk: chunk.slice(0, 100) }, "Received data from Aider");
      };

      // Check periodically if Aider has stopped outputting
      checkInterval = setInterval(() => {
        const timeSinceLastData = Date.now() - lastDataTime;
        
        // If we haven't received data for 3 seconds and we have output, assume done
        if (timeSinceLastData > 3000 && output.length > 0) {
          clearInterval(checkInterval);
          
          // Look for the last line that starts with ">" (Aider's prompt)
          const lines = output.split('\n');
          let lastPromptIndex = -1;
          for (let i = lines.length - 1; i >= 0; i--) {
            if (lines[i].trim().startsWith('>')) {
              lastPromptIndex = i;
              break;
            }
          }
          
          // Extract everything before the final prompt
          let cleaned = output;
          if (lastPromptIndex > 0) {
            cleaned = lines.slice(0, lastPromptIndex).join('\n');
          }
          
          // Clean up the output
          cleaned = cleaned
            .replace(/─+/g, "")
            .replace(/^\s*\n/gm, "") // Remove empty lines
            .trim();

          this.sendResponse(requestId, {
            content: [
              {
                type: "text",
                text: cleaned
              }
            ]
          });

          this.aiderProcess?.stdout.removeListener("data", handleData);
          resolve();
        }
      }, 500);

      this.aiderProcess!.stdout.on("data", handleData);
      this.aiderProcess!.stdin.write(command + "\n");
    });
  }

  private startAider() {
    const args = [
      "--yes",
      "--no-git", 
      "--model", process.env.AIDER_MODEL ?? "gpt-4o-mini"
    ];

    log.info({ args, cwd: this.workspaceDir }, "Starting Aider process");

    this.aiderProcess = spawn("aider", args, {
      cwd: this.workspaceDir,
      stdio: ["pipe", "pipe", "pipe"],
      env: { ...process.env }
    });

    this.aiderProcess.on("error", (err) => {
      log.error({ err }, "Failed to start Aider process");
    });

    this.aiderProcess.on("exit", (code, signal) => {
      log.info({ code, signal }, "Aider process exited");
    });

    this.aiderProcess.stderr.on("data", (d) => {
      log.warn({ stderr: d.toString() }, "Aider stderr");
    });

    // Wait for Aider to start
    this.aiderProcess.stdout.once("data", () => {
      log.info("Aider process started");
    });
  }

  private sendResponse(id: string | number, result: any) {
    const response: JsonRpcResponse = {
      jsonrpc: "2.0",
      result,
      id
    };
    this.ws.send(JSON.stringify(response));
  }

  private sendError(id: string | number, code: number, message: string) {
    const response: JsonRpcResponse = {
      jsonrpc: "2.0",
      error: { code, message },
      id
    };
    this.ws.send(JSON.stringify(response));
  }
}

// WebSocket Server
const port = Number(process.env.PORT ?? 8080);
const wss = new WebSocketServer({ port });

wss.on("connection", (ws) => {
  log.info("Client connected");
  
  // For MCP, we start the session immediately
  // Create a more descriptive workspace name with timestamp
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const workspaceName = `demo-factorial-${timestamp}`;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const session = new MCPSession(ws, workspaceName);
  log.info(`Created workspace: ${workspaceName}`);
  
  ws.on("close", () => {
    log.info("Client disconnected");
  });
});

log.info(`MCP server listening on port ${port}`);

process.on("SIGINT", () => {
  log.info("Shutting down...");
  wss.close(() => process.exit(0));
});