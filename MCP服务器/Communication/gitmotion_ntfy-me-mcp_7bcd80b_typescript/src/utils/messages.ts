import fetch from 'node-fetch';

/**
 * Interface for fetch options when retrieving messages from ntfy
 */
export interface NtfyFetchOptions {
  /**
   * The ntfy server URL
   */
  ntfyUrl: string;
  
  /**
   * The topic to fetch messages from
   */
  topic: string;
  
  /**
   * Optional access token for authenticated topics
   */
  token?: string;
  
  /**
   * Return cached messages since a specific point
   * Can be:
   * - A duration (e.g., "10m", "30s")
   * - A Unix timestamp (e.g., 1635528757)
   * - A message ID (e.g., "nFS3knfcQ1xe")
   * - "all" to get all cached messages
   */
  since?: string | number;

  /**
   * Filter: Only return messages that match this exact message ID
   */
  messageId?: string;

  /**
   * Filter: Only return messages that match this exact message string
   */
  messageText?: string;

  /**
   * Filter: Only return messages that match this exact title string
   */
  messageTitle?: string;

  /**
   * Filter: Only return messages that match any priority listed (comma-separated string or array)
   */
  priorities?: string | string[];

  /**
   * Filter: Only return messages that match all listed tags (comma-separated string or array)
   */
  tags?: string | string[];
}

/**
 * Interface for message data returned from the ntfy API
 */
export interface MessageData {
  id: string;
  time: number;
  event: string;
  topic: string;
  message?: string;
  title?: string;
  priority?: number;
  tags?: string[];
  click?: string;
  attachment?: {
    name: string;
    type: string;
    size: number;
    expires: number;
    url: string;
  };
  expires?: number;
  [key: string]: any; // Allow for additional properties
}

/**
 * Fetches cached messages from an ntfy server
 * 
 * @param options Configuration options for the fetch operation
 * @returns A record of message arrays organized by topic
 */
export async function fetchMessages(options: NtfyFetchOptions): Promise<Record<string, MessageData[]> | null> {
  try {
    // Prepare the URL with proper handling of trailing slashes
    const baseUrl = options.ntfyUrl.endsWith("/") ? options.ntfyUrl.slice(0, -1) : options.ntfyUrl;
    
    // Start with the basic endpoint
    let endpoint = `${baseUrl}/${options.topic}/json?poll=1`;
    
    // Add the since parameter if provided
    if (options.since !== undefined && options.since !== null) {
      endpoint += `&since=${options.since}`;
    }

    // Prepare headers
    const headers: Record<string, string> = {};
    
    // Add authorization if token is provided
    if (options.token) {
      headers.Authorization = `Bearer ${options.token}`;
    }

    // Add filter headers if provided
    if (options.messageId) {
      headers['X-ID'] = options.messageId;
    }

    if (options.messageText) {
      headers['X-Message'] = options.messageText;
    }

    if (options.messageTitle) {
      headers['X-Title'] = options.messageTitle;
    }

    if (options.priorities) {
      // Handle both string and string[] formats
      const priorityValue = Array.isArray(options.priorities) 
        ? options.priorities.join(',') 
        : options.priorities;
      headers['X-Priority'] = priorityValue;
    }

    if (options.tags) {
      // Handle both string and string[] formats
      const tagsValue = Array.isArray(options.tags) 
        ? options.tags.join(',') 
        : options.tags;
      headers['X-Tags'] = tagsValue;
    }

    // Log helpful message with filter information
    let filterInfo = '';
    if (options.messageId) filterInfo += ` [ID: ${options.messageId}]`;
    if (options.messageTitle) filterInfo += ` [Title: ${options.messageTitle}]`;
    if (options.messageText) filterInfo += ` [Message: ${options.messageText}]`;
    if (options.priorities) filterInfo += ` [Priorities: ${Array.isArray(options.priorities) ? options.priorities.join(',') : options.priorities}]`;
    if (options.tags) filterInfo += ` [Tags: ${Array.isArray(options.tags) ? options.tags.join(',') : options.tags}]`;
    
    console.log(`Fetching messages from ${endpoint}${filterInfo ? ' with filters:' + filterInfo : ''}`);
    
    // Make the API call
    const response = await fetch(endpoint, { headers });

    if (!response.ok) {
      // Handle authentication errors
      if (response.status === 401 || response.status === 403) {
        throw new Error(
          `Authentication failed when fetching messages from ${options.topic}. ` +
          `This ntfy topic requires an access token.`
        );
      }
      
      // Handle other errors
      throw new Error(
        `Failed to fetch ntfy messages. Status code: ${response.status}, Message: ${await response.text()}`
      );
    }

    // Get the raw response data
    const rawResponse = await response.text();
    if (!rawResponse) return null;
    
    // Process the response as line-delimited JSON
    const messageData: MessageData[] = rawResponse
      .split('\n') // Split by newlines
      .filter((line: string) => line.trim().length > 0) // Remove empty lines
      .map((line: string) => {
        try {
          return JSON.parse(line); // Parse each line as JSON
        } catch (error) {
          console.error('Error parsing line:', line, error);
          return null; // Skip invalid JSON lines
        }
      })
      .filter((msg: MessageData | null) => msg !== null) as MessageData[]; // Filter out invalid messages

    // Organize messages by topic
    const messageRecords: Record<string, MessageData[]> = {};
    messageData.forEach((data) => {
      const topic = data.topic;
      if (!messageRecords[topic]) messageRecords[topic] = [];
      messageRecords[topic].push(data);
    });

    return messageRecords;
  } catch (error: any) {
    console.error('Error fetching messages:', error);
    throw error;
  }
}