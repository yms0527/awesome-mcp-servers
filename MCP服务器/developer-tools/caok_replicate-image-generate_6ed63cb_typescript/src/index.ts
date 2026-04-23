#!/usr/bin/env node
import axios, { AxiosError } from 'axios';
import { createServer, IncomingMessage, ServerResponse } from 'http';

interface GenerateImageArgs {
  prompt: string;
  output_dir?: string;
}

interface GenerateImageResponse {
  success: boolean;
  data?: any;
  error?: string;
}

interface ReplicateErrorResponse {
  error?: string;
}

class FluxImageServer {
  private axiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: 'https://api.replicate.com/v1',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.REPLICATE_API_TOKEN}`,
      },
    });
  }

  async generateImage(args: GenerateImageArgs): Promise<GenerateImageResponse> {
    try {
      const response = await this.axiosInstance.post('/models/black-forest-labs/flux-schnell/predictions', {
        input: {
          prompt: args.prompt,
        },
      }, {
        headers: {
          'Prefer': 'wait',
        },
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ReplicateErrorResponse>;
        return {
          success: false,
          error: axiosError.response?.data?.error || axiosError.message,
        };
      }
      return {
        success: false,
        error: 'An unexpected error occurred',
      };
    }
  }

  start(port: number = 3000): void {
    const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
      if (req.method === 'POST' && req.url === '/generate') {
        let body = '';
        req.on('data', (chunk: Buffer) => {
          body += chunk.toString();
        });

        req.on('end', async () => {
          try {
            const data = JSON.parse(body) as GenerateImageArgs;
            const result = await this.generateImage(data);
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result));
          } catch (error) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
              success: false, 
              error: 'Invalid request body' 
            }));
          }
        });
      } else {
        res.writeHead(404);
        res.end();
      }
    });

    server.listen(port, () => {
      console.log(`Flux Image Generation server running on port ${port}`);
    });

    process.on('SIGINT', () => {
      server.close(() => {
        console.log('Server shut down');
        process.exit(0);
      });
    });
  }
}

// 启动服务器
const server = new FluxImageServer();
server.start();