import axios, { AxiosInstance } from 'axios';
import { 
  Pulse, 
  Indicator, 
  DomainInfo, 
  IPInfo,
  Alarm,
  Event,
  AlarmsResponse,
  EventsResponse,
  OAuthToken
} from './types';

export class AlienVaultService {
  private otxClient?: AxiosInstance;
  private usmClient?: AxiosInstance;
  private otxApiKey?: string;
  private clientId?: string;
  private clientSecret?: string;
  private subdomain?: string;
  private accessToken?: string;
  private tokenExpiry?: number;

  constructor(config: {
    otxApiKey?: string;
    clientId?: string;
    clientSecret?: string;
    subdomain?: string;
  }) {
    this.otxApiKey = config.otxApiKey;
    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
    this.subdomain = config.subdomain;

    // Initialize OTX client if API key is provided
    if (this.otxApiKey) {
      this.otxClient = axios.create({
        baseURL: 'https://otx.alienvault.com/api/v1',
        headers: {
          'X-OTX-API-KEY': this.otxApiKey,
        },
      });
    }

    // Initialize USM client if OAuth credentials are provided
    if (this.clientId && this.clientSecret && this.subdomain) {
      this.usmClient = axios.create({
        baseURL: `https://${this.subdomain}.alienvault.cloud/api/2.0`,
      });
    }
  }

  private async getOAuthToken(): Promise<string> {
    if (!this.clientId || !this.clientSecret || !this.subdomain) {
      throw new Error('OAuth credentials not configured');
    }

    const now = Date.now();
    if (this.accessToken && this.tokenExpiry && now < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const tokenUrl = `https://${this.subdomain}.alienvault.cloud/api/2.0/oauth/token`;
      
      // Use Basic authentication as required by USM Anywhere API
      const credentials = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
      
      const response = await axios.post(
        tokenUrl,
        'grant_type=client_credentials',
        {
          headers: {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      const { access_token, expire_in } = response.data;
      this.accessToken = access_token;
      this.tokenExpiry = now + (expire_in * 1000) - 60000; // Refresh 1 minute before expiry

      return this.accessToken!; // Non-null assertion since we just set it
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`OAuth authentication failed: ${error.response?.status} ${error.response?.statusText}`);
      }
      throw error;
    }
  }

  private async makeUSMRequest<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    if (!this.usmClient) {
      throw new Error('USM Anywhere client not initialized');
    }

    const token = await this.getOAuthToken();
    const response = await this.usmClient.get(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    });

    return response.data;
  }

  // Test connection methods
  async testOTXConnection(): Promise<{ success: boolean; user?: string; error?: string }> {
    if (!this.otxClient) {
      return { success: false, error: 'OTX API key not configured' };
    }

    try {
      const response = await this.otxClient.get('/user/me');
      return { success: true, user: response.data.username };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return { success: false, error: `${error.response?.status}: ${error.response?.statusText}` };
      }
      return { success: false, error: String(error) };
    }
  }

  async testUSMConnection(): Promise<{ success: boolean; error?: string }> {
    if (!this.usmClient) {
      return { success: false, error: 'USM Anywhere credentials not configured' };
    }

    try {
      await this.getOAuthToken();
      return { success: true };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  }

  // OTX API methods
  async searchPulses(query: string, limit: number = 20): Promise<Pulse[]> {
    if (!this.otxClient) {
      throw new Error('OTX API not configured');
    }

    const response = await this.otxClient.get('/pulses/subscribed', {
      params: { q: query, limit },
    });

    return response.data.results;
  }

  async getPulse(pulseId: string): Promise<Pulse> {
    if (!this.otxClient) {
      throw new Error('OTX API not configured');
    }

    const response = await this.otxClient.get(`/pulses/${pulseId}`);
    return response.data;
  }

  async getIndicator(indicator: string, type?: string): Promise<Indicator> {
    if (!this.otxClient) {
      throw new Error('OTX API not configured');
    }

    const indicatorType = type || this.detectIndicatorType(indicator);
    const response = await this.otxClient.get(`/indicators/${indicatorType}/${indicator}/general`);
    return response.data;
  }

  private detectIndicatorType(indicator: string): string {
    // IP address
    if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(indicator)) {
      return 'IPv4';
    }
    
    // Domain
    if (/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/.test(indicator)) {
      return 'domain';
    }
    
    // URL
    if (indicator.startsWith('http://') || indicator.startsWith('https://')) {
      return 'url';
    }
    
    // Hash (MD5, SHA1, SHA256)
    if (/^[a-fA-F0-9]{32}$/.test(indicator)) {
      return 'file';
    }
    if (/^[a-fA-F0-9]{40}$/.test(indicator)) {
      return 'file';
    }
    if (/^[a-fA-F0-9]{64}$/.test(indicator)) {
      return 'file';
    }
    
    return 'general';
  }

  // USM Anywhere API methods
  async getAlarms(params: {
    page?: number;
    size?: number;
    sort?: string;
    account_name: string;
    status?: string;
    priority?: string;
    timestamp_received_gte?: number;
    timestamp_received_lte?: number;
  }): Promise<AlarmsResponse> {
    return this.makeUSMRequest('/alarms', params);
  }

  async getAlarmDetails(alarmId: string): Promise<Alarm> {
    return this.makeUSMRequest(`/alarms/${alarmId}`);
  }

  async getEvents(params: {
    page?: number;
    size?: number;
    sort?: string;
    account_name: string;
    suppressed?: boolean;
    plugin?: string;
    event_name?: string;
    source_name?: string;
    sensor_uuid?: string;
    source_username?: string;
    timestamp_occured_gte?: number;
    timestamp_occured_lte?: number;
  }): Promise<EventsResponse> {
    return this.makeUSMRequest('/events', params);
  }

  async getEventDetails(eventId: string): Promise<Event> {
    return this.makeUSMRequest(`/events/${eventId}`);
  }
} 