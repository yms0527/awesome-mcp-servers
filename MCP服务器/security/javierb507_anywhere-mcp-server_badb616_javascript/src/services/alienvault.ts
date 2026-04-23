import axios, { AxiosInstance } from 'axios';
import { 
  OAuthToken,
  OAuthTokenSchema,
  Alarm,
  Event,
  AlarmsResponse,
  EventsResponse,
  AlarmsResponseSchema,
  EventsResponseSchema,
  AlarmSchema,
  EventSchema,
  // Investigation types
  Investigation,
  InvestigationsResponse,
  CreateInvestigation,
  UpdateInvestigation,
  InvestigationSchema,
  InvestigationsResponseSchema,
  CreateInvestigationSchema,
  UpdateInvestigationSchema,
  // Advanced Query types
  AdvancedQueryRequest,
  AdvancedQueryResponse,
  AdvancedQueryResponseSchema,
  AdvancedQueryPerformance,
  QueryValidationResponse,
  // Legacy OTX types
  Pulse, 
  Indicator, 
  DomainInfo, 
  IPInfo,
  PulseSchema,
  IndicatorSchema,
  DomainInfoSchema,
  IPInfoSchema
} from '../types/index.js';

export class AlienVaultService {
  private client: AxiosInstance;
  private clientId: string;
  private clientSecret: string;
  private subdomain: string;
  private baseURL: string;
  private otxBaseURL = 'https://otx.alienvault.com/api/v1';
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor(clientId: string, clientSecret: string, subdomain: string) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    
    // Clean subdomain to remove any protocol or suffix (if provided)
    if (subdomain) {
      this.subdomain = subdomain.replace(/^https?:\/\//, '').replace(/\.alienvault\.cloud.*$/, '');
      this.baseURL = `https://${this.subdomain}.alienvault.cloud/api/2.0`;
    } else {
      this.subdomain = '';
      this.baseURL = '';
    }
    
    this.client = axios.create({
      timeout: 30000,
      maxRedirects: 3,
      validateStatus: (status) => status < 500, // Don't throw on 4xx errors
    });

    // Add request interceptor for better error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 429) {
          console.warn('Rate limit exceeded, consider adding delays between requests');
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Authenticate using OAuth 2.0 client credentials flow
   */
  private async authenticate(): Promise<void> {
    try {
      // Use Basic authentication as required by USM Anywhere API
      const credentials = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
      
      const response = await this.client.post(`${this.baseURL}/oauth/token`, 'grant_type=client_credentials', {
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const tokenData = OAuthTokenSchema.parse(response.data);
      this.accessToken = tokenData.access_token;
      this.tokenExpiry = Date.now() + (tokenData.expire_in * 1000) - 60000; // Refresh 1 minute before expiry
      
      console.error('✓ Successfully authenticated with USM Anywhere API');
    } catch (error) {
      console.error('OAuth authentication failed:', error);
      throw new Error(`Failed to authenticate: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Ensure we have a valid access token
   */
  private async ensureAuthenticated(): Promise<void> {
    if (!this.accessToken || Date.now() >= this.tokenExpiry) {
      await this.authenticate();
    }
  }

  /**
   * Make an authenticated request to the USM Anywhere API
   */
  private async makeAuthenticatedRequest(
    endpoint: string, 
    params?: any, 
    method: string = 'GET', 
    data?: any
  ): Promise<any> {
    await this.ensureAuthenticated();
    
    const config = {
      method: method.toUpperCase(),
      url: `${this.baseURL}${endpoint}`,
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      params: method.toUpperCase() === 'GET' ? params : undefined,
      data: method.toUpperCase() !== 'GET' ? data : undefined,
    };

    const response = await this.client.request(config);
    return response.data;
  }

  /**
   * Get alarms from USM Anywhere
   */
  async getAlarms(
    accountName: string,
    page: number = 0,
    size: number = 20,
    sort?: string,
    suppressed?: boolean,
    priority?: string,
    status?: string,
    timestampOccuredGte?: number,
    timestampOccuredLte?: number
  ): Promise<AlarmsResponse> {
    try {
      // Validate required parameters
      if (!accountName?.trim()) {
        throw new Error('Account name is required');
      }

      // Validate pagination parameters
      if (page < 0) {
        throw new Error('Page number must be non-negative');
      }
      
      if (size < 1 || size > 100) {
        throw new Error('Page size must be between 1 and 100');
      }

      const params: any = {
        account_name: accountName.trim(),
        page,
        size,
      };

      if (sort) params.sort = sort;
      if (suppressed !== undefined) params.suppressed = suppressed;
      if (priority) params.priority = priority;
      if (status) params.status = status;
      if (timestampOccuredGte) params.timestamp_occured_gte = timestampOccuredGte;
      if (timestampOccuredLte) params.timestamp_occured_lte = timestampOccuredLte;

      const data = await this.makeAuthenticatedRequest('/alarms', params);
      return AlarmsResponseSchema.parse(data);
    } catch (error) {
      console.error('Error getting alarms:', error);
      throw new Error(`Failed to get alarms: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get events from USM Anywhere
   */
  async getEvents(
    accountName: string,
    page: number = 0,
    size: number = 20,
    sort?: string,
    suppressed?: boolean,
    plugin?: string,
    eventName?: string,
    sourceName?: string,
    sensorUuid?: string,
    sourceUsername?: string,
    timestampOccuredGte?: number,
    timestampOccuredLte?: number
  ): Promise<EventsResponse> {
    try {
      // Validate required parameters
      if (!accountName?.trim()) {
        throw new Error('Account name is required');
      }

      // Validate pagination parameters
      if (page < 0) {
        throw new Error('Page number must be non-negative');
      }
      
      if (size < 1 || size > 100) {
        throw new Error('Page size must be between 1 and 100');
      }

      const params: any = {
        account_name: accountName.trim(),
        page,
        size,
      };

      if (sort) params.sort = sort;
      if (suppressed !== undefined) params.suppressed = suppressed;
      if (plugin) params.plugin = plugin;
      if (eventName) params.event_name = eventName;
      if (sourceName) params.source_name = sourceName;
      if (sensorUuid) params.sensor_uuid = sensorUuid;
      if (sourceUsername) params.source_username = sourceUsername;
      if (timestampOccuredGte) params.timestamp_occured_gte = timestampOccuredGte;
      if (timestampOccuredLte) params.timestamp_occured_lte = timestampOccuredLte;

      const data = await this.makeAuthenticatedRequest('/events', params);
      return EventsResponseSchema.parse(data);
    } catch (error) {
      console.error('Error getting events:', error);
      throw new Error(`Failed to get events: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get alarm details by ID
   */
  async getAlarmDetails(alarmId: string): Promise<Alarm | null> {
    try {
      const data = await this.makeAuthenticatedRequest(`/alarms/${alarmId}`);
      return AlarmSchema.parse(data);
    } catch (error) {
      console.error('Error getting alarm details:', error);
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw new Error(`Failed to get alarm details: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get event details by ID
   */
  async getEventDetails(eventId: string): Promise<Event | null> {
    try {
      const data = await this.makeAuthenticatedRequest(`/events/${eventId}`);
      return EventSchema.parse(data);
    } catch (error) {
      console.error('Error getting event details:', error);
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw new Error(`Failed to get event details: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Investigation Management Methods (USM Anywhere API v2.0)

  /**
   * Get investigations from USM Anywhere
   */
  async getInvestigations(
    accountName: string,
    page: number = 0,
    size: number = 20,
    sort?: string,
    status?: 'open' | 'closed' | 'in_progress' | 'resolved',
    priority?: 'low' | 'medium' | 'high' | 'critical',
    assignee?: string,
    createdAfter?: number,
    createdBefore?: number
  ): Promise<InvestigationsResponse> {
    try {
      // Validate required parameters
      if (!accountName?.trim()) {
        throw new Error('Account name is required');
      }

      // Validate pagination parameters
      if (page < 0) {
        throw new Error('Page number must be non-negative');
      }
      
      if (size < 1 || size > 100) {
        throw new Error('Page size must be between 1 and 100');
      }

      const params: any = {
        account_name: accountName.trim(),
        page,
        size,
      };

      if (sort) params.sort = sort;
      if (status) params.status = status;
      if (priority) params.priority = priority;
      if (assignee) params.assignee = assignee;
      if (createdAfter) params.created_after = createdAfter;
      if (createdBefore) params.created_before = createdBefore;

      const data = await this.makeAuthenticatedRequest('/investigations', params);
      return InvestigationsResponseSchema.parse(data);
    } catch (error) {
      console.error('Error getting investigations:', error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new Error('Investigations endpoint not found. This feature may not be available in your USM Anywhere instance.');
        }
        if (error.response?.status === 403) {
          throw new Error('Access denied. Ensure your API client has permission to access investigations.');
        }
        if (error.response?.status === 400) {
          throw new Error(`Invalid request parameters: ${error.response?.data?.message || 'Check account name and filters'}`);
        }
      }
      throw new Error(`Failed to get investigations: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get investigation details by ID
   */
  async getInvestigationDetails(investigationId: string): Promise<Investigation | null> {
    try {
      if (!investigationId?.trim()) {
        throw new Error('Investigation ID is required');
      }

      const data = await this.makeAuthenticatedRequest(`/investigations/${investigationId}`);
      return InvestigationSchema.parse(data);
    } catch (error) {
      console.error('Error getting investigation details:', error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          return null; // Investigation not found is a valid case
        }
        if (error.response?.status === 403) {
          throw new Error('Access denied. You may not have permission to view this investigation.');
        }
      }
      throw new Error(`Failed to get investigation details: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Create a new investigation
   */
  async createInvestigation(
    accountName: string,
    investigationData: CreateInvestigation
  ): Promise<Investigation> {
    try {
      // Validate required parameters
      if (!accountName?.trim()) {
        throw new Error('Account name is required');
      }

      // Validate investigation data
      const validatedData = CreateInvestigationSchema.parse(investigationData);

      const requestBody = {
        account_name: accountName.trim(),
        ...validatedData,
      };

      const data = await this.makeAuthenticatedRequest('/investigations', {}, 'POST', requestBody);
      return InvestigationSchema.parse(data);
    } catch (error) {
      console.error('Error creating investigation:', error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new Error('Investigations endpoint not found. This feature may not be available in your USM Anywhere instance.');
        }
        if (error.response?.status === 403) {
          throw new Error('Access denied. Ensure your API client has permission to create investigations.');
        }
        if (error.response?.status === 400) {
          const message = error.response?.data?.message || error.response?.data?.error || 'Invalid investigation data';
          throw new Error(`Failed to create investigation: ${message}`);
        }
        if (error.response?.status === 409) {
          throw new Error('Investigation with this name may already exist.');
        }
      }
      throw new Error(`Failed to create investigation: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Update an existing investigation
   */
  async updateInvestigation(
    investigationId: string,
    updateData: UpdateInvestigation
  ): Promise<Investigation> {
    try {
      if (!investigationId?.trim()) {
        throw new Error('Investigation ID is required');
      }

      // Validate update data
      const validatedData = UpdateInvestigationSchema.parse(updateData);

      const data = await this.makeAuthenticatedRequest(
        `/investigations/${investigationId}`, 
        {}, 
        'PUT', 
        validatedData
      );
      return InvestigationSchema.parse(data);
    } catch (error) {
      console.error('Error updating investigation:', error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new Error('Investigation not found. It may have been deleted.');
        }
        if (error.response?.status === 403) {
          throw new Error('Access denied. You may not have permission to update this investigation.');
        }
        if (error.response?.status === 400) {
          const message = error.response?.data?.message || 'Invalid update data';
          throw new Error(`Failed to update investigation: ${message}`);
        }
        if (error.response?.status === 409) {
          throw new Error('Investigation status transition not allowed. Check current status and workflow rules.');
        }
      }
      throw new Error(`Failed to update investigation: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Delete an investigation
   */
  async deleteInvestigation(investigationId: string): Promise<boolean> {
    try {
      if (!investigationId?.trim()) {
        throw new Error('Investigation ID is required');
      }

      await this.makeAuthenticatedRequest(`/investigations/${investigationId}`, {}, 'DELETE');
      return true;
    } catch (error) {
      console.error('Error deleting investigation:', error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new Error('Investigation not found. It may have already been deleted.');
        }
        if (error.response?.status === 403) {
          throw new Error('Access denied. You may not have permission to delete this investigation.');
        }
        if (error.response?.status === 409) {
          throw new Error('Investigation cannot be deleted. It may be locked or have active dependencies.');
        }
      }
      throw new Error(`Failed to delete investigation: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Add a note to an investigation
   */
  async addInvestigationNote(investigationId: string, content: string): Promise<Investigation> {
    try {
      if (!investigationId?.trim()) {
        throw new Error('Investigation ID is required');
      }

      if (!content?.trim()) {
        throw new Error('Note content is required');
      }

      const requestBody = {
        content: content.trim(),
      };

      const data = await this.makeAuthenticatedRequest(
        `/investigations/${investigationId}/notes`, 
        {}, 
        'POST', 
        requestBody
      );
      return InvestigationSchema.parse(data);
    } catch (error) {
      console.error('Error adding investigation note:', error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new Error('Investigation not found. It may have been deleted.');
        }
        if (error.response?.status === 403) {
          throw new Error('Access denied. You may not have permission to add notes to this investigation.');
        }
        if (error.response?.status === 400) {
          throw new Error('Invalid note content. Notes must contain meaningful text.');
        }
      }
      throw new Error(`Failed to add investigation note: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Add alarms to an investigation
   */
  async addAlarmsToInvestigation(investigationId: string, alarmIds: string[]): Promise<Investigation> {
    try {
      if (!investigationId?.trim()) {
        throw new Error('Investigation ID is required');
      }

      if (!alarmIds || alarmIds.length === 0) {
        throw new Error('At least one alarm ID is required');
      }

      const requestBody = {
        alarm_ids: alarmIds.filter(id => id?.trim()),
      };

      const data = await this.makeAuthenticatedRequest(
        `/investigations/${investigationId}/alarms`, 
        {}, 
        'POST', 
        requestBody
      );
      return InvestigationSchema.parse(data);
    } catch (error) {
      console.error('Error adding alarms to investigation:', error);
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        throw new Error('Investigation not found');
      }
      throw new Error(`Failed to add alarms to investigation: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Add events to an investigation
   */
  async addEventsToInvestigation(investigationId: string, eventIds: string[]): Promise<Investigation> {
    try {
      if (!investigationId?.trim()) {
        throw new Error('Investigation ID is required');
      }

      if (!eventIds || eventIds.length === 0) {
        throw new Error('At least one event ID is required');
      }

      const requestBody = {
        event_ids: eventIds.filter(id => id?.trim()),
      };

      const data = await this.makeAuthenticatedRequest(
        `/investigations/${investigationId}/events`, 
        {}, 
        'POST', 
        requestBody
      );
      return InvestigationSchema.parse(data);
    } catch (error) {
      console.error('Error adding events to investigation:', error);
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        throw new Error('Investigation not found');
      }
      throw new Error(`Failed to add events to investigation: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Legacy OTX API methods (keeping for backward compatibility)
  // These methods use API key authentication with the OTX API

  /**
   * Initialize OTX client with API key (for legacy support)
   */
  initializeOTX(apiKey: string): void {
    this.client.defaults.headers['X-OTX-API-KEY'] = apiKey;
  }

  /**
   * Search for threat intelligence pulses (OTX API)
   */
  async searchPulses(query: string, limit: number = 10): Promise<Pulse[]> {
    try {
      const response = await this.client.get(`${this.otxBaseURL}/pulses/subscribed`, {
        params: {
          q: query,
          limit,
        },
      });

      if (!response.data || !response.data.results) {
        return [];
      }

      const pulses = response.data.results.map((pulse: any) => {
        try {
          return PulseSchema.parse(pulse);
        } catch (error) {
          console.warn('Failed to parse pulse:', error);
          return null;
        }
      }).filter(Boolean);

      return pulses;
    } catch (error) {
      console.error('Error searching pulses:', error);
      throw new Error(`Failed to search pulses: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get detailed information about a specific pulse (OTX API)
   */
  async getPulse(pulseId: string): Promise<Pulse | null> {
    try {
      const response = await this.client.get(`${this.otxBaseURL}/pulses/${pulseId}`);
      
      if (!response.data) {
        return null;
      }

      return PulseSchema.parse(response.data);
    } catch (error) {
      console.error('Error getting pulse:', error);
      throw new Error(`Failed to get pulse: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get general information about an indicator (OTX API)
   */
  async getIndicator(indicator: string, section?: string): Promise<Indicator | DomainInfo | IPInfo | null> {
    try {
      const encodedIndicator = encodeURIComponent(indicator);
      const endpoint = section 
        ? `${this.otxBaseURL}/indicators/${this.getIndicatorType(indicator)}/${encodedIndicator}/${section}`
        : `${this.otxBaseURL}/indicators/${this.getIndicatorType(indicator)}/${encodedIndicator}/general`;

      const response = await this.client.get(endpoint);
      
      if (!response.data) {
        return null;
      }

      const indicatorType = this.getIndicatorType(indicator);
      
      if (indicatorType === 'domain') {
        return DomainInfoSchema.parse(response.data);
      } else if (indicatorType === 'IPv4') {
        return IPInfoSchema.parse(response.data);
      } else {
        return IndicatorSchema.parse(response.data);
      }
    } catch (error) {
      console.error('Error getting indicator:', error);
      throw new Error(`Failed to get indicator: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get reputation information for an IP address
   */
  async getIPReputation(ip: string): Promise<any> {
    try {
      const response = await this.client.get(`${this.otxBaseURL}/indicators/IPv4/${encodeURIComponent(ip)}/reputation`);
      return response.data;
    } catch (error) {
      console.error('Error getting IP reputation:', error);
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw new Error(`Failed to get IP reputation: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get geographical information for an IP address
   */
  async getIPGeo(ip: string): Promise<any> {
    try {
      const response = await this.client.get(`${this.otxBaseURL}/indicators/IPv4/${encodeURIComponent(ip)}/geo`);
      return response.data;
    } catch (error) {
      console.error('Error getting IP geo:', error);
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw new Error(`Failed to get IP geo: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get malware information for an indicator
   */
  async getMalwareInfo(indicator: string): Promise<any> {
    try {
      const indicatorType = this.getIndicatorType(indicator);
      const response = await this.client.get(`${this.otxBaseURL}/indicators/${indicatorType}/${encodeURIComponent(indicator)}/malware`);
      return response.data;
    } catch (error) {
      console.error('Error getting malware info:', error);
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw new Error(`Failed to get malware info: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get WHOIS information for a domain
   */
  async getDomainWhois(domain: string): Promise<any> {
    try {
      const response = await this.client.get(`${this.otxBaseURL}/indicators/domain/${encodeURIComponent(domain)}/whois`);
      return response.data;
    } catch (error) {
      console.error('Error getting domain WHOIS:', error);
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw new Error(`Failed to get domain WHOIS: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get URL analysis information
   */
  async getURLAnalysis(url: string): Promise<any> {
    try {
      const response = await this.client.get(`${this.otxBaseURL}/indicators/url/${encodeURIComponent(url)}/url_list`);
      return response.data;
    } catch (error) {
      console.error('Error getting URL analysis:', error);
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw new Error(`Failed to get URL analysis: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Helper method to convert date strings to timestamps
   */
  public parseTimestamp(dateInput: string | number | Date): number {
    if (typeof dateInput === 'number') {
      return dateInput;
    }
    
    if (typeof dateInput === 'string') {
      // Handle relative time strings like "24h", "7d", "30m"
      const relativeMatch = dateInput.match(/^(\d+)([hdwmy])$/i);
      if (relativeMatch) {
        const value = parseInt(relativeMatch[1]);
        const unit = relativeMatch[2].toLowerCase();
        const now = Date.now();
        
        switch (unit) {
          case 'm': return now - (value * 60 * 1000);
          case 'h': return now - (value * 60 * 60 * 1000);
          case 'd': return now - (value * 24 * 60 * 60 * 1000);
          case 'w': return now - (value * 7 * 24 * 60 * 60 * 1000);
          case 'y': return now - (value * 365 * 24 * 60 * 60 * 1000);
          default: throw new Error(`Invalid relative time unit: ${unit}`);
        }
      }
      
      // Try to parse as ISO date string
      const parsed = Date.parse(dateInput);
      if (isNaN(parsed)) {
        throw new Error(`Invalid date format: ${dateInput}`);
      }
      return parsed;
    }
    
    if (dateInput instanceof Date) {
      return dateInput.getTime();
    }
    
    throw new Error('Invalid date format');
  }

  /**
   * Determine the indicator type based on the indicator value
   */
  private getIndicatorType(indicator: string): string {
    const ipv4Pattern = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    const ipv6Pattern = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
    const md5Pattern = /^[a-fA-F0-9]{32}$/;
    const sha1Pattern = /^[a-fA-F0-9]{40}$/;
    const sha256Pattern = /^[a-fA-F0-9]{64}$/;
    const domainPattern = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    const urlPattern = /^https?:\/\//;

    if (ipv4Pattern.test(indicator)) {
      return 'IPv4';
    } else if (ipv6Pattern.test(indicator)) {
      return 'IPv6';
    } else if (md5Pattern.test(indicator)) {
      return 'file';
    } else if (sha1Pattern.test(indicator)) {
      return 'file';
    } else if (sha256Pattern.test(indicator)) {
      return 'file';
    } else if (urlPattern.test(indicator)) {
      return 'url';
    } else if (domainPattern.test(indicator)) {
      return 'domain';
    } else {
      return 'hostname';
    }
  }

  /**
   * Execute advanced query (SQL or PPL) against USM Anywhere
   */
  async executeAdvancedQuery(params: {
    tenantId: string;
    queryString: string;
    queryLanguage: 'SQL' | 'PPL';
    timeRangeStart?: number;
    timeRangeEnd?: number;
    page?: number;
    pageSize?: number;
    includePerformance?: boolean;
  }): Promise<AdvancedQueryResponse & { performance?: AdvancedQueryPerformance }> {
    try {
      // Validate required parameters
      if (!params.tenantId?.trim()) {
        throw new Error('Tenant ID is required');
      }
      if (!params.queryString?.trim()) {
        throw new Error('Query string is required');
      }

      // Determine the correct advanced query endpoint
      // Based on the AdvSQL.raw example, we need to use a different endpoint
      const region = this.subdomain.includes('us-east-1') ? 'us-east-1' : 'us-east-1'; // Default to us-east-1
      const advancedQueryURL = `https://advanced-query.${region}.prod.alienvault.cloud/advanced-query/search`;

      const startTime = Date.now();
      
      await this.ensureAuthenticated();

      // Default time ranges if not provided (last 24 hours)
      const now = Date.now();
      const oneDayAgo = now - (24 * 60 * 60 * 1000);
      
      const requestBody: AdvancedQueryRequest = {
        tenant_id: params.tenantId,
        query_string: params.queryString.trim(),
        query_language: params.queryLanguage,
        time_range_start: params.timeRangeStart || oneDayAgo,
        time_range_end: params.timeRangeEnd || now,
        page: params.page || 1,
        page_size: params.pageSize || 20,
      };

      const config = {
        method: 'POST',
        url: advancedQueryURL,
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
          'X-ATT-TENANT-URI': `/usma:${params.tenantId}`,
        },
        data: requestBody,
      };

      console.error(`Executing ${params.queryLanguage} query: ${params.queryString.substring(0, 100)}...`);
      
      const response = await this.client.request(config);
      const endTime = Date.now();
      
      // Log raw response for debugging
      console.error('Raw API response:', JSON.stringify(response.data, null, 2));
      
      // Handle different response structures
      let queryResult;
      try {
        // Try to parse as expected response structure
        queryResult = AdvancedQueryResponseSchema.parse(response.data);
      } catch (parseError) {
        // If parsing fails, check if it's an error response
        if (response.data && typeof response.data === 'object') {
          if (response.data.error || response.data.message) {
            throw new Error(`API Error: ${response.data.error || response.data.message}`);
          }
          // If response has different structure, create compatible response
          queryResult = {
            schema: response.data.schema || [],
            total: response.data.total || 0,
            datarows: response.data.datarows || response.data.rows || [],
            size: response.data.size || response.data.count || 0,
            error: response.data.error || {},
            status: response.data.status || response.status || 200,
            results_id: response.data.results_id || response.data.id || 'unknown'
          };
        } else {
          throw new Error(`Invalid response format: ${JSON.stringify(response.data)}`);
        }
      }
      
      // Add performance metrics if requested
      if (params.includePerformance) {
        const performance: AdvancedQueryPerformance = {
          execution_time_ms: endTime - startTime,
          rows_returned: queryResult.size,
          query_complexity: this.assessQueryComplexity(params.queryString),
        };
        
        return { ...queryResult, performance };
      }

      console.error(`✓ Query executed successfully: ${queryResult.total} total results, ${queryResult.size} returned`);
      return queryResult;
    } catch (error) {
      console.error('Error executing advanced query:', error);
      if (error instanceof Error) {
        // Check for common error patterns
        if (error.message.includes('401')) {
          throw new Error('Authentication failed - please check your credentials and tenant ID');
        } else if (error.message.includes('403')) {
          throw new Error('Access denied - insufficient permissions for advanced queries');
        } else if (error.message.includes('400')) {
          throw new Error(`Query syntax error: ${error.message}`);
        } else if (error.message.includes('429')) {
          throw new Error('Rate limit exceeded - please wait before making more queries');
        }
      }
      throw new Error(`Failed to execute advanced query: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Validate query syntax without executing it
   */
  async validateQuerySyntax(queryString: string, queryLanguage: 'SQL' | 'PPL'): Promise<QueryValidationResponse> {
    try {
      // Basic syntax validation
      const errors: Array<{
        line?: number;
        column?: number;
        message: string;
        type: 'syntax' | 'semantic' | 'security' | 'performance';
      }> = [];
      
      const warnings: Array<{
        line?: number;
        column?: number;
        message: string;
        type: 'performance' | 'best_practice' | 'security';
      }> = [];

      const trimmedQuery = queryString.trim();
      
      if (!trimmedQuery) {
        errors.push({
          message: 'Query string cannot be empty',
          type: 'syntax'
        });
      }

      // Language-specific validation
      if (queryLanguage === 'SQL') {
        this.validateSQLQuery(trimmedQuery, errors, warnings);
      } else if (queryLanguage === 'PPL') {
        this.validatePPLQuery(trimmedQuery, errors, warnings);
      }

      const isValid = errors.length === 0;
      const complexity = this.assessQueryComplexity(trimmedQuery);

      return {
        is_valid: isValid,
        errors,
        warnings,
        estimated_complexity: complexity,
        suggested_optimizations: this.getSuggestedOptimizations(trimmedQuery, queryLanguage),
      };
    } catch (error) {
      console.error('Error validating query syntax:', error);
      return {
        is_valid: false,
        errors: [{
          message: `Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          type: 'syntax'
        }],
        warnings: [],
      };
    }
  }

  /**
   * Get tenant ID from subdomain (helper method)
   */
  getTenantIdFromSubdomain(): string {
    // This would normally be extracted from the user's authentication or configuration
    // For now, we'll need to get it from the environment or configuration
    // The tenant ID format is typically a UUID
    const tenantUri = process.env.ALIENVAULT_TENANT_URI || process.env.TENANT_ID;
    if (tenantUri) {
      // Extract UUID from tenant URI like "/usma:3f4969b6-5e20-4704-af4e-8977ffe110a7"
      const match = tenantUri.match(/([a-f0-9-]{36})/i);
      if (match) {
        return match[1];
      }
    }
    throw new Error('Tenant ID not found - please set ALIENVAULT_TENANT_URI or TENANT_ID environment variable');
  }

  /**
   * Assess query complexity
   */
  private assessQueryComplexity(queryString: string): 'low' | 'medium' | 'high' {
    const query = queryString.toLowerCase();
    let complexityScore = 0;

    // Check for complexity indicators
    if (query.includes('join')) complexityScore += 2;
    if (query.includes('subquery') || query.includes('select') && query.split('select').length > 2) complexityScore += 3;
    if (query.includes('group by')) complexityScore += 1;
    if (query.includes('having')) complexityScore += 1;
    if (query.includes('order by')) complexityScore += 1;
    if (query.includes('union')) complexityScore += 2;
    if (query.includes('case when')) complexityScore += 1;
    if (query.includes('*')) complexityScore += 1;
    if (query.length > 500) complexityScore += 1;
    if (query.length > 1000) complexityScore += 2;

    if (complexityScore <= 2) return 'low';
    if (complexityScore <= 5) return 'medium';
    return 'high';
  }

  /**
   * Validate SQL query syntax
   */
  private validateSQLQuery(query: string, errors: any[], warnings: any[]): void {
    const lowerQuery = query.toLowerCase().trim();
    
    // Basic SQL syntax checks
    if (!lowerQuery.startsWith('select')) {
      errors.push({
        message: 'SQL queries must start with SELECT',
        type: 'syntax'
      });
    }

    if (!lowerQuery.includes('from')) {
      errors.push({
        message: 'SQL queries must include a FROM clause',
        type: 'syntax'
      });
    }

    // Security checks
    if (lowerQuery.includes('drop') || lowerQuery.includes('delete') || lowerQuery.includes('truncate')) {
      errors.push({
        message: 'DDL/DML operations are not allowed in queries',
        type: 'security'
      });
    }

    // Performance warnings
    if (lowerQuery.includes('select *')) {
      warnings.push({
        message: 'Using SELECT * may impact performance - specify columns explicitly',
        type: 'performance'
      });
    }

    if (!lowerQuery.includes('limit') && !lowerQuery.includes('top')) {
      warnings.push({
        message: 'Consider adding LIMIT clause to prevent large result sets',
        type: 'performance'
      });
    }
  }

  /**
   * Validate PPL query syntax
   */
  private validatePPLQuery(query: string, errors: any[], warnings: any[]): void {
    const lowerQuery = query.toLowerCase().trim();
    
    // Basic PPL syntax checks
    if (!lowerQuery.startsWith('search')) {
      errors.push({
        message: 'PPL queries must start with search command',
        type: 'syntax'
      });
    }

    if (!lowerQuery.includes('source=')) {
      errors.push({
        message: 'PPL queries must include a source parameter',
        type: 'syntax'
      });
    }

    // Check for proper pipe usage
    const pipes = query.split('|');
    if (pipes.length > 1) {
      for (let i = 1; i < pipes.length; i++) {
        const command = pipes[i].trim().toLowerCase();
        if (!command) {
          errors.push({
            message: `Empty pipe command at position ${i}`,
            type: 'syntax'
          });
        }
      }
    }
  }

  /**
   * Get suggested optimizations for queries
   */
  private getSuggestedOptimizations(query: string, language: 'SQL' | 'PPL'): string[] {
    const suggestions: string[] = [];
    const lowerQuery = query.toLowerCase();

    if (language === 'SQL') {
      if (lowerQuery.includes('select *')) {
        suggestions.push('Replace SELECT * with specific column names to reduce data transfer');
      }
      if (!lowerQuery.includes('limit') && !lowerQuery.includes('top')) {
        suggestions.push('Add LIMIT clause to control result set size');
      }
      if (lowerQuery.includes('like \'%') && lowerQuery.includes('%\'')) {
        suggestions.push('Avoid leading wildcards in LIKE patterns for better performance');
      }
      if (lowerQuery.includes('order by') && !lowerQuery.includes('limit')) {
        suggestions.push('ORDER BY without LIMIT can be expensive - consider adding LIMIT');
      }
    } else if (language === 'PPL') {
      if (!lowerQuery.includes('head') && !lowerQuery.includes('tail')) {
        suggestions.push('Consider using head or tail commands to limit result size');
      }
      if (lowerQuery.includes('search source=*')) {
        suggestions.push('Specify exact source indexes instead of using wildcards');
      }
    }

    return suggestions;
  }

  /**
   * Test the API connection
   */
  async testConnection(): Promise<boolean> {
    try {
      if (!this.clientId || !this.clientSecret || !this.subdomain) {
        console.error('Missing USM Anywhere credentials');
        return false;
      }
      await this.ensureAuthenticated();
      return true;
    } catch (error) {
      console.error('API connection test failed:', error);
      return false;
    }
  }

  /**
   * Test OTX API connection (legacy)
   */
  async testOTXConnection(): Promise<boolean> {
    try {
      const response = await this.client.get(`${this.otxBaseURL}/user/me`);
      return response.status === 200;
    } catch (error) {
      console.error('OTX API connection test failed:', error);
      return false;
    }
  }
} 