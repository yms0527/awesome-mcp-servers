#!/usr/bin/env node
import { PostmanAPIServer } from './server.js';

const server = new PostmanAPIServer();
server.run().catch(console.error);
