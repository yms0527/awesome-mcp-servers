export interface ServerConfig {
  host: string;
  port: number;
  'online-mode': boolean;
  version: string;
  maxPlayers: number;
  motd: string;
}

export interface Player {
  username: string;
  uuid: string;
  entity?: any; // Replace with proper entity type
}
