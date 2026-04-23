import { Server } from '@modelcontextprotocol/sdk/server/index.js';

const server = new Server({ name: 'test', version: '1.0' }, { capabilities: {} });

if (typeof server.close === 'function') {
    console.log('Server has close method');
} else {
    console.log('Server DOES NOT have close method');
}

// Check other properties
console.log('Server keys:', Object.keys(server));
console.log('Server proto keys:', Object.getOwnPropertyNames(Object.getPrototypeOf(server)));
