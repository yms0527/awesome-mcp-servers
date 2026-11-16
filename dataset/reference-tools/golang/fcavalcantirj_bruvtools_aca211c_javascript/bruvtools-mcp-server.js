#!/usr/bin/env node

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { CallToolRequestSchema, ListToolsRequestSchema } = require('@modelcontextprotocol/sdk/types.js');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * bruvtools MCP Server
 * Exposes bruvtools deployment functionality to Cursor
 */
class BruvtoolsMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'bruvtools-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    // Get CapRover configuration from environment
    this.caproverMachine = process.env.CAPROVER_MACHINE;
    this.caproverDomain = process.env.CAPROVER_DOMAIN;
    this.caproverPassword = process.env.CAPROVER_PASSWORD;

    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  setupErrorHandling() {
    this.server.onerror = (error) => {
      console.error('[MCP Error]', error);
    };

    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'bruvtools_init',
            description: 'Initialize bruvtools configuration in the current project',
            inputSchema: {
              type: 'object',
              properties: {
                provider: {
                  type: 'string',
                  description: 'Cloud provider (caprover, aws, gcp)',
                  default: 'caprover'
                },
                machine: {
                  type: 'string',
                  description: 'CapRover machine name (uses CAPROVER_MACHINE env var if not provided)'
                },
                domain: {
                  type: 'string',
                  description: 'Domain name (uses CAPROVER_DOMAIN env var if not provided)'
                },
                projectName: {
                  type: 'string',
                  description: 'Project name (defaults to current directory name)'
                },
                port: {
                  type: 'number',
                  description: 'Application port (default: 80)',
                  default: 80
                }
              },
              required: []
            }
          },
          {
            name: 'bruvtools_deploy',
            description: 'Deploy application using bruvtools',
            inputSchema: {
              type: 'object',
              properties: {
                appName: {
                  type: 'string',
                  description: 'Application name to deploy'
                },
                directory: {
                  type: 'string',
                  description: 'Directory to deploy (defaults to current directory)',
                  default: '.'
                },
                port: {
                  type: 'number',
                  description: 'Application port'
                },
                scale: {
                  type: 'number',
                  description: 'Number of replicas',
                  default: 1
                }
              },
              required: ['appName']
            }
          },
          {
            name: 'bruvtools_create',
            description: 'Create a new application on the cloud provider',
            inputSchema: {
              type: 'object',
              properties: {
                appName: {
                  type: 'string',
                  description: 'Application name to create'
                },
                persistent: {
                  type: 'boolean',
                  description: 'Enable persistent data storage',
                  default: false
                }
              },
              required: ['appName']
            }
          },
          {
            name: 'bruvtools_status',
            description: 'Check the status of a deployed application',
            inputSchema: {
              type: 'object',
              properties: {
                appName: {
                  type: 'string',
                  description: 'Application name to check'
                }
              },
              required: ['appName']
            }
          },
          {
            name: 'bruvtools_logs',
            description: 'View application logs',
            inputSchema: {
              type: 'object',
              properties: {
                appName: {
                  type: 'string',
                  description: 'Application name'
                },
                follow: {
                  type: 'boolean',
                  description: 'Follow logs in real-time',
                  default: false
                }
              },
              required: ['appName']
            }
          },
          {
            name: 'bruvtools_services',
            description: 'Show all deployed apps/services with URLs and status (use this for: "show deployed apps", "list services", "view dashboard", "what apps are running")',
            inputSchema: {
              type: 'object',
              properties: {},
              additionalProperties: false
            }
          },
          {
            name: 'bruvtools_scale',
            description: 'Scale an application to specified number of replicas',
            inputSchema: {
              type: 'object',
              properties: {
                appName: {
                  type: 'string',
                  description: 'Application name to scale'
                },
                replicas: {
                  type: 'number',
                  description: 'Number of replicas',
                  minimum: 0
                }
              },
              required: ['appName', 'replicas']
            }
          },
          {
            name: 'bruvtools_test',
            description: 'Test if an application is responding correctly',
            inputSchema: {
              type: 'object',
              properties: {
                appName: {
                  type: 'string',
                  description: 'Application name to test'
                },
                url: {
                  type: 'string',
                  description: 'Custom URL to test (optional)'
                },
                https: {
                  type: 'boolean',
                  description: 'Use HTTPS for testing',
                  default: false
                }
              },
              required: ['appName']
            }
          }
        ]
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'bruvtools_init':
            return await this.handleInit(args);
          case 'bruvtools_deploy':
            return await this.handleDeploy(args);
          case 'bruvtools_create':
            return await this.handleCreate(args);
          case 'bruvtools_status':
            return await this.handleStatus(args);
          case 'bruvtools_logs':
            return await this.handleLogs(args);
          case 'bruvtools_services':
            return await this.handleServices(args);
          case 'bruvtools_scale':
            return await this.handleScale(args);
          case 'bruvtools_test':
            return await this.handleTest(args);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error executing ${name}: ${error.message}`
            }
          ],
          isError: true
        };
      }
    });
  }

  async runBruvtoolsCommand(args) {
    return new Promise((resolve, reject) => {
      const proc = spawn('bruvtools', args, {
        stdio: ['pipe', 'pipe', 'pipe'],
        shell: true
      });

      let stdout = '';
      let stderr = '';

      proc.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      proc.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      proc.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(`Command failed with code ${code}: ${stderr}`));
          return;
        }
        resolve(stdout);
      });

      proc.on('error', (err) => {
        reject(new Error(`Failed to start process: ${err.message}`));
      });
    });
  }

  async handleInit(args) {
    const { 
      provider = 'caprover', 
      machine = this.caproverMachine, 
      domain = this.caproverDomain, 
      projectName, 
      port = 80 
    } = args;
    
    // Validate required parameters
    if (!machine) {
      throw new Error('CapRover machine name is required. Set CAPROVER_MACHINE environment variable or provide machine parameter.');
    }
    if (!domain) {
      throw new Error('CapRover domain is required. Set CAPROVER_DOMAIN environment variable or provide domain parameter.');
    }
    
    // Create bruvtools.yml
    const config = {
      default_provider: provider,
      providers: {
        [provider]: {
          machine,
          domain
        }
      },
      projects: {
        [projectName || path.basename(process.cwd())]: {
          provider,
          port
        }
      }
    };

    const YAML = require('yaml');
    const configPath = path.join(process.cwd(), 'bruvtools.yml');
    
    try {
      fs.writeFileSync(configPath, YAML.stringify(config));
      
      return {
        content: [
          {
            type: 'text',
            text: `✅ bruvtools initialized successfully!\n\nConfiguration saved to: ${configPath}\n\nProvider: ${provider}\nMachine: ${machine}\nDomain: ${domain}\nPort: ${port}\n\nNext steps:\n1. Ensure CAPROVER_PASSWORD environment variable is set\n2. Run 'bruvtools create <app-name>' to create your app\n3. Run 'bruvtools deploy <app-name>' to deploy`
          }
        ]
      };
    } catch (error) {
      throw new Error(`Failed to create configuration: ${error.message}`);
    }
  }

  async handleDeploy(args) {
    const { appName, directory = '.', port, scale } = args;
    const deployArgs = ['deploy', appName];
    
    if (directory !== '.') {
      deployArgs.push('--dir', directory);
    }
    if (port) {
      deployArgs.push('--port', port.toString());
    }
    if (scale && scale !== 1) {
      deployArgs.push('--scale', scale.toString());
    }

    const output = await this.runBruvtoolsCommand(deployArgs);
    
    return {
      content: [
        {
          type: 'text',
          text: `🚀 Deployment completed!\n\n${output}`
        }
      ]
    };
  }

  async handleCreate(args) {
    const { appName, persistent } = args;
    const createArgs = ['create', appName];
    
    if (persistent) {
      createArgs.push('--persistent');
    }

    const output = await this.runBruvtoolsCommand(createArgs);
    
    return {
      content: [
        {
          type: 'text',
          text: `✅ Application created successfully!\n\n${output}`
        }
      ]
    };
  }

  async handleStatus(args) {
    const { appName } = args;
    const output = await this.runBruvtoolsCommand(['status', appName]);
    
    return {
      content: [
        {
          type: 'text',
          text: `📊 Application Status:\n\n${output}`
        }
      ]
    };
  }

  async handleLogs(args) {
    const { appName, follow } = args;
    const logsArgs = ['logs', appName];
    
    if (follow) {
      logsArgs.push('--follow');
    }

    const output = await this.runBruvtoolsCommand(logsArgs);
    
    return {
      content: [
        {
          type: 'text',
          text: `📝 Application Logs:\n\n${output}`
        }
      ]
    };
  }

  async handleServices(args) {
    const output = await this.runBruvtoolsCommand(['services']);
    
    return {
      content: [
        {
          type: 'text',
          text: `📦 Deployed Services:\n\n${output}`
        }
      ]
    };
  }

  async handleScale(args) {
    const { appName, replicas } = args;
    const output = await this.runBruvtoolsCommand(['scale', appName, replicas.toString()]);
    
    return {
      content: [
        {
          type: 'text',
          text: `⚖️ Scaling completed!\n\n${output}`
        }
      ]
    };
  }

  async handleTest(args) {
    const { appName, url, https } = args;
    const testArgs = ['test', appName];
    
    if (url) {
      testArgs.push('--url', url);
    }
    if (https) {
      testArgs.push('--https');
    }

    const output = await this.runBruvtoolsCommand(testArgs);
    
    return {
      content: [
        {
          type: 'text',
          text: `🧪 Test Results:\n\n${output}`
        }
      ]
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('bruvtools MCP server running on stdio');
  }
}

// Start the server
const server = new BruvtoolsMCPServer();
server.run().catch(console.error); 