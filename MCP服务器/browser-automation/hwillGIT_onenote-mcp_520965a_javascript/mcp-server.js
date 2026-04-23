/**
 * OneNote MCP Server
 * 
 * Focused REST API for OneNote automation
 */

import express from 'express';
import cors from 'cors';
import OneNoteAutomation from './onenote-browser-automation.js';
import fs from 'fs';
import path from 'path';

const app = express();
const port = 3030;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Automation instance
let automation = null;
let initialized = false;

// Logging utility
function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  console.log(message);
  
  // Create logs directory if it doesn't exist
  const logsDir = './logs';
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }
  
  // Append to log file
  fs.appendFileSync(path.join(logsDir, 'onenote-mcp.log'), logMessage);
}

// Notebook Connection
app.post('/notebook/connect', async (req, res) => {
  try {
    const { notebookLink } = req.body;
    
    // Close existing automation if active
    if (automation) {
      await automation.close();
    }
    
    // Create new automation instance
    automation = new OneNoteAutomation(notebookLink);
    await automation.initialize();
    await automation.navigateToNotebook();
    
    initialized = true;
    log(`Connected to notebook: ${notebookLink}`);
    
    res.json({ 
      success: true, 
      message: 'Successfully connected to notebook' 
    });
  } catch (error) {
    log(`Notebook connection error: ${error.message}`);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Get Notebook Structure
app.get('/notebook/structure', async (req, res) => {
  try {
    if (!automation) {
      throw new Error('Not connected to a notebook');
    }
    
    const structure = await automation.extractNotebookStructure();
    
    log('Retrieved notebook structure');
    res.json({ 
      success: true, 
      structure 
    });
  } catch (error) {
    log(`Structure retrieval error: ${error.message}`);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Read Section
app.post('/section/read', async (req, res) => {
  try {
    const { path: sectionPath } = req.body;
    
    if (!automation) {
      throw new Error('Not connected to a notebook');
    }
    
    await automation.navigateToPath(sectionPath);
    const content = await automation.readCurrentPage();
    
    log(`Read section: ${sectionPath.join(' > ')}`);
    res.json({ 
      success: true, 
      content 
    });
  } catch (error) {
    log(`Section read error: ${error.message}`);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Health Check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    initialized, 
    timestamp: new Date().toISOString() 
  });
});

// Shutdown
app.post('/shutdown', async (req, res) => {
  try {
    if (automation) {
      await automation.close();
      automation = null;
    }
    
    log('MCP server shutting down');
    res.json({ 
      success: true, 
      message: 'MCP server shut down' 
    });
    
    // Graceful server shutdown
    setTimeout(() => process.exit(0), 1000);
  } catch (error) {
    log(`Shutdown error: ${error.message}`);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Start the server
app.listen(port, () => {
  log(`OneNote MCP server running at http://localhost:${port}`);
});
