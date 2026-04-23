import { createServer } from '@anthropic-ai/model-context-protocol';
import { fileModifier } from './fileModifier.js';

const port = process.env.PORT || 3000;

const server = createServer({
  tools: {
    fileModifier: fileModifier
  }
});

server.listen(port, () => {
  console.log(`File Modifier MCP Server running on port ${port}`);
});