import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { IncomingMessage, ServerResponse } from 'http';
import { Socket } from 'net';

// Mock objects to satisfy the constructor
const req = new IncomingMessage(new Socket());
const res = new ServerResponse(req);

const transport = new SSEServerTransport('/messages', res);

console.log('Has sessionId:', 'sessionId' in transport);
// @ts-ignore
console.log('SessionId value:', transport.sessionId);
