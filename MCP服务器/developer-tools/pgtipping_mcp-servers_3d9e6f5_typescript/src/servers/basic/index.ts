import * as mc from 'minecraft-protocol';
import { createLogger } from '../../shared/logger';
import { ServerConfig } from '../../shared/types';

const logger = createLogger('basic-server');

const config: ServerConfig = {
  host: '0.0.0.0',
  port: 25565,
  'online-mode': true,
  version: '1.20.4',
  maxPlayers: 20,
  motd: '§6Basic MCP Server'
};

const server = mc.createServer(config);

server.on('login', (client) => {
  logger.info(`Player ${client.username} logged in`);

  // Broadcast join message
  broadcast(`§e${client.username} joined the game`);

  // Handle chat messages
  client.on('chat', (data) => {
    broadcast(`<${client.username}> ${data.message}`);
  });

  // Handle player leaving
  client.on('end', () => {
    broadcast(`§e${client.username} left the game`);
    logger.info(`Player ${client.username} disconnected`);
  });
});

function broadcast(message: string) {
  server.broadcast(JSON.stringify({
    translate: 'chat.type.announcement',
    with: [message]
  }));
}

server.on('error', (error) => {
  logger.error(`Server error: ${error.message}`);
});

server.on('listening', () => {
  logger.info(`Server listening on ${config.host}:${config.port}`);
});
