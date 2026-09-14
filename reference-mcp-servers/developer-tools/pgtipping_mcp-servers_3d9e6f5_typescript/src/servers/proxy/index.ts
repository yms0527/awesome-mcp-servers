import * as mc from 'minecraft-protocol';
import { createLogger } from '../../shared/logger';
import { ServerConfig } from '../../shared/types';

const logger = createLogger('proxy-server');

interface ProxyConfig extends ServerConfig {
  targetHost: string;
  targetPort: number;
  targetVersion: string;
}

const config: ProxyConfig = {
  host: '0.0.0.0',
  port: 25567, // Different port from other servers
  'online-mode': true,
  version: '1.20.4',
  maxPlayers: 100,
  motd: '\u00a73Proxy Server',
  targetHost: 'localhost',
  targetPort: 25565, // Default Minecraft server port
  targetVersion: '1.20.4'
};

const server = mc.createServer(config);

server.on('login', (client) => {
  logger.info(`Player ${client.username} connected to proxy`);

  // Connect to target server
  const targetClient = mc.createClient({
    host: config.targetHost,
    port: config.targetPort,
    username: client.username,
    version: config.targetVersion,
    auth: 'microsoft' // Use Microsoft authentication
  });

  let ended = false;

  // Forward packets from client to target server
  client.on('packet', (data, meta) => {
    if (ended) return;
    if (targetClient.state === mc.states.PLAY && meta.state === mc.states.PLAY) {
      if (!meta.name.includes('keep_alive')) {
        logger.debug(`C -> S: ${meta.name}`);
      }
      targetClient.write(meta.name, data);
    }
  });

  // Forward packets from target server to client
  targetClient.on('packet', (data, meta) => {
    if (ended) return;
    if (client.state === mc.states.PLAY && meta.state === mc.states.PLAY) {
      if (!meta.name.includes('keep_alive')) {
        logger.debug(`S -> C: ${meta.name}`);
      }
      client.write(meta.name, data);
    }
  });

  // Handle client disconnect
  client.on('end', () => {
    ended = true;
    targetClient.end('Client disconnected');
    logger.info(`Player ${client.username} disconnected from proxy`);
  });

  // Handle target server disconnect
  targetClient.on('end', () => {
    ended = true;
    client.end('Lost connection to server');
    logger.info(`Lost connection to target server for ${client.username}`);
  });

  // Handle client errors
  client.on('error', (error) => {
    ended = true;
    logger.error(`Client error for ${client.username}: ${error.message}`);
    targetClient.end('Client error');
  });

  // Handle target server errors
  targetClient.on('error', (error) => {
    ended = true;
    logger.error(`Target server error for ${client.username}: ${error.message}`);
    client.end('Lost connection to server');
  });
});

// Handle proxy server errors
server.on('error', (error) => {
  logger.error(`Proxy server error: ${error.message}`);
});

server.on('listening', () => {
  logger.info(`Proxy server listening on ${config.host}:${config.port}`);
  logger.info(`Forwarding to ${config.targetHost}:${config.targetPort}`);
});