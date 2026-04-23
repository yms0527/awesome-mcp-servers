import * as mc from 'minecraft-protocol';
import { createLogger } from '../../shared/logger';
import { ServerConfig } from '../../shared/types';
import crypto from 'crypto';

const logger = createLogger('auth-server');

interface Session {
  username: string;
  uuid: string;
  accessToken: string;
  expiresAt: Date;
}

const sessions = new Map<string, Session>();

const config: ServerConfig = {
  host: '0.0.0.0',
  port: 25566, // Different port from basic server
  'online-mode': true,
  version: '1.20.4',
  maxPlayers: 100,
  motd: '\u00a72Auth Server'
};

const server = mc.createServer(config);

server.on('login', (client) => {
  const session = createSession(client.username);
  sessions.set(client.username, session);
  
  logger.info(`Player ${client.username} authenticated`);
  
  // Send session info to client
  client.write('custom_payload', {
    channel: 'auth:session',
    data: Buffer.from(JSON.stringify(session))
  });

  // Handle session refresh
  client.on('custom_payload', (data) => {
    if (data.channel === 'auth:refresh') {
      const session = sessions.get(client.username);
      if (session && isSessionValid(session)) {
        session.accessToken = generateToken();
        session.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
        sessions.set(client.username, session);
        
        client.write('custom_payload', {
          channel: 'auth:session',
          data: Buffer.from(JSON.stringify(session))
        });
        
        logger.info(`Refreshed session for ${client.username}`);
      }
    }
  });

  // Handle client disconnect
  client.on('end', () => {
    logger.info(`Player ${client.username} disconnected`);
  });
});

function createSession(username: string): Session {
  return {
    username,
    uuid: crypto.randomUUID(),
    accessToken: generateToken(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
  };
}

function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

function isSessionValid(session: Session): boolean {
  return new Date() < session.expiresAt;
}

// Clean up expired sessions periodically
setInterval(() => {
  const now = new Date();
  for (const [username, session] of sessions.entries()) {
    if (!isSessionValid(session)) {
      sessions.delete(username);
      logger.info(`Removed expired session for ${username}`);
    }
  }
}, 60 * 60 * 1000); // Check every hour

server.on('error', (error) => {
  logger.error(`Server error: ${error.message}`);
});

server.on('listening', () => {
  logger.info(`Auth server listening on ${config.host}:${config.port}`);
});