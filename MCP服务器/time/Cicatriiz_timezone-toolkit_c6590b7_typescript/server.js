import express from 'express';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import bodyParser from 'body-parser';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create Express app
const app = express();

// Set up rate limiter: maximum of 100 requests per 15 minutes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

// Apply rate limiter to all requests
app.use(limiter);
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Path to the MCP server
const mcpServerPath = process.env.MCP_SERVER_PATH || join(__dirname, 'dist', 'index.js');

// Function to call the MCP server
async function callMcpServer(toolName, args) {
  return new Promise((resolve, reject) => {
    // Spawn the MCP server process
    const mcpProcess = spawn('node', [mcpServerPath], {
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let responseData = '';
    let errorData = '';

    // Handle stdout data
    mcpProcess.stdout.on('data', (data) => {
      responseData += data.toString();
    });

    // Handle stderr data
    mcpProcess.stderr.on('data', (data) => {
      errorData += data.toString();
      console.error(`MCP Server stderr: ${data}`);
    });

    // Handle process close
    mcpProcess.on('close', (code) => {
      if (code !== 0) {
        return reject(new Error(`MCP server exited with code ${code}: ${errorData}`));
      }

      try {
        // Parse the response
        const responses = responseData.trim().split('\n');
        for (const response of responses) {
          if (response) {
            const parsedResponse = JSON.parse(response);
            if (parsedResponse.result && parsedResponse.result.content) {
              // Extract the JSON string from the text content
              const contentText = parsedResponse.result.content[0].text;
              // Parse the JSON string to get the actual result object
              const resultObject = JSON.parse(contentText);
              return resolve(resultObject);
            } else if (parsedResponse.error) {
              return reject(new Error(parsedResponse.error.message));
            }
          }
        }
        reject(new Error('No valid response from MCP server'));
      } catch (error) {
        reject(new Error(`Error parsing MCP server response: ${error.message}`));
      }
    });

    // Create the MCP request
    const request = {
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/call',
      params: {
        name: toolName,
        arguments: args
      }
    };

    // Send the request to the MCP server
    mcpProcess.stdin.write(JSON.stringify(request) + '\n');
    mcpProcess.stdin.end();
  });
}

// API routes

// Get available tools
app.get('/api/tools', async (req, res) => {
  try {
    const mcpProcess = spawn('node', [mcpServerPath], {
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let responseData = '';
    let errorData = '';

    mcpProcess.stdout.on('data', (data) => {
      responseData += data.toString();
    });

    mcpProcess.stderr.on('data', (data) => {
      errorData += data.toString();
      console.error(`MCP Server stderr: ${data}`);
    });

    mcpProcess.on('close', (code) => {
      if (code !== 0) {
        return res.status(500).json({ error: `MCP server exited with code ${code}: ${errorData}` });
      }

      try {
        const responses = responseData.trim().split('\n');
        for (const response of responses) {
          if (response) {
            const parsedResponse = JSON.parse(response);
            if (parsedResponse.result && parsedResponse.result.tools) {
              return res.json({ tools: parsedResponse.result.tools });
            } else if (parsedResponse.error) {
              return res.status(500).json({ error: parsedResponse.error.message });
            }
          }
        }
        res.status(500).json({ error: 'No valid response from MCP server' });
      } catch (error) {
        res.status(500).json({ error: `Error parsing MCP server response: ${error.message}` });
      }
    });

    const request = {
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/list',
      params: {}
    };

    mcpProcess.stdin.write(JSON.stringify(request) + '\n');
    mcpProcess.stdin.end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Convert time
app.post('/api/convert-time', async (req, res) => {
  try {
    const result = await callMcpServer('convert_time', req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get current time
app.post('/api/current-time', async (req, res) => {
  try {
    const result = await callMcpServer('get_current_time', req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Calculate sunrise/sunset
app.post('/api/sunrise-sunset', async (req, res) => {
  try {
    const result = await callMcpServer('calculate_sunrise_sunset', req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Calculate moon phase
app.post('/api/moon-phase', async (req, res) => {
  try {
    const result = await callMcpServer('calculate_moon_phase', req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Calculate timezone difference
app.post('/api/timezone-difference', async (req, res) => {
  try {
    const result = await callMcpServer('calculate_timezone_difference', req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// List timezones
app.post('/api/list-timezones', async (req, res) => {
  try {
    const result = await callMcpServer('list_timezones', req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Calculate countdown
app.post('/api/countdown', async (req, res) => {
  try {
    const result = await callMcpServer('calculate_countdown', req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Calculate business days
app.post('/api/business-days', async (req, res) => {
  try {
    const result = await callMcpServer('calculate_business_days', req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Format date
app.post('/api/format-date', async (req, res) => {
  try {
    const result = await callMcpServer('format_date', req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Root route
app.get('/', (req, res) => {
  res.json({
    name: 'TimezoneToolkit API',
    version: '1.0.0',
    description: 'API wrapper for TimezoneToolkit MCP server',
    endpoints: [
      { method: 'GET', path: '/api/tools', description: 'Get available tools' },
      { method: 'POST', path: '/api/convert-time', description: 'Convert time between timezones' },
      { method: 'POST', path: '/api/current-time', description: 'Get current time in a timezone' },
      { method: 'POST', path: '/api/sunrise-sunset', description: 'Calculate sunrise/sunset times' },
      { method: 'POST', path: '/api/moon-phase', description: 'Calculate moon phase' },
      { method: 'POST', path: '/api/timezone-difference', description: 'Calculate timezone difference' },
      { method: 'POST', path: '/api/list-timezones', description: 'List available timezones' },
      { method: 'POST', path: '/api/countdown', description: 'Calculate countdown to a date' },
      { method: 'POST', path: '/api/business-days', description: 'Calculate business days between dates' },
      { method: 'POST', path: '/api/format-date', description: 'Format a date' }
    ]
  });
});

// Start the server
app.listen(port, () => {
  console.log(`TimezoneToolkit API server listening on port ${port}`);
});
