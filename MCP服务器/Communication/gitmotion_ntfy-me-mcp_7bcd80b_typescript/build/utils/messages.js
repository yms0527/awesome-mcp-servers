import fetch from 'node-fetch';
/**
 * Fetches cached messages from an ntfy server
 *
 * @param options Configuration options for the fetch operation
 * @returns A record of message arrays organized by topic
 */
export async function fetchMessages(options) {
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
        const headers = {};
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
        if (options.messageId)
            filterInfo += ` [ID: ${options.messageId}]`;
        if (options.messageTitle)
            filterInfo += ` [Title: ${options.messageTitle}]`;
        if (options.messageText)
            filterInfo += ` [Message: ${options.messageText}]`;
        if (options.priorities)
            filterInfo += ` [Priorities: ${Array.isArray(options.priorities) ? options.priorities.join(',') : options.priorities}]`;
        if (options.tags)
            filterInfo += ` [Tags: ${Array.isArray(options.tags) ? options.tags.join(',') : options.tags}]`;
        console.log(`Fetching messages from ${endpoint}${filterInfo ? ' with filters:' + filterInfo : ''}`);
        // Make the API call
        const response = await fetch(endpoint, { headers });
        if (!response.ok) {
            // Handle authentication errors
            if (response.status === 401 || response.status === 403) {
                throw new Error(`Authentication failed when fetching messages from ${options.topic}. ` +
                    `This ntfy topic requires an access token.`);
            }
            // Handle other errors
            throw new Error(`Failed to fetch ntfy messages. Status code: ${response.status}, Message: ${await response.text()}`);
        }
        // Get the raw response data
        const rawResponse = await response.text();
        if (!rawResponse)
            return null;
        // Process the response as line-delimited JSON
        const messageData = rawResponse
            .split('\n') // Split by newlines
            .filter((line) => line.trim().length > 0) // Remove empty lines
            .map((line) => {
            try {
                return JSON.parse(line); // Parse each line as JSON
            }
            catch (error) {
                console.error('Error parsing line:', line, error);
                return null; // Skip invalid JSON lines
            }
        })
            .filter((msg) => msg !== null); // Filter out invalid messages
        // Organize messages by topic
        const messageRecords = {};
        messageData.forEach((data) => {
            const topic = data.topic;
            if (!messageRecords[topic])
                messageRecords[topic] = [];
            messageRecords[topic].push(data);
        });
        return messageRecords;
    }
    catch (error) {
        console.error('Error fetching messages:', error);
        throw error;
    }
}
