export interface ServerConfig {
  baseUrl: string;
  appKey: string;
  clientKey?: string;
  timeout?: number;
  maxRequestsPerMinute?: number;
  allowInsecure?: boolean;
}
