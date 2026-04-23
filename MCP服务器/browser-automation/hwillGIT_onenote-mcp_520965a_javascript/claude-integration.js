/**
 * Claude Desktop Integration Library for OneNote MCP
 * 
 * This library helps Claude use the OneNote MCP through simple function calls.
 * It encapsulates the API communication details for easier usage within Claude Desktop.
 */

// Base URL for the MCP server
const MCP_SERVER = 'http://localhost:3030';

/**
 * Make a request to the MCP server
 * @param {string} endpoint - API endpoint
 * @param {string} method - HTTP method (GET, POST, etc.)
 * @param {object} body - Request body for POST requests
 * @returns {Promise<object>} - Response data
 */
async function mcpRequest(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' }
  };
  
  if (body && method !== 'GET') {
    options.body = JSON.stringify(body);
  }
  
  const url = new URL(endpoint, MCP_SERVER);
  
  if (body && method === 'GET') {
    // Add query parameters for GET requests
    Object.keys(body).forEach(key => {
      url.searchParams.append(key, body[key]);
    });
  }
  
  try {
    const response = await fetch(url.toString(), options);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error in MCP request to ${endpoint}: ${error.message}`);
    throw error;
  }
}

/**
 * Check if the MCP server is running
 * @returns {Promise<boolean>} - True if the server is healthy
 */
async function checkServerHealth() {
  try {
    const response = await mcpRequest('/health');
    return response.status === 'ok';
  } catch (error) {
    console.error('MCP server health check failed:', error.message);
    return false;
  }
}

/**
 * Initialize the MCP
 * @returns {Promise<object>} - Response data
 */
async function initializeMCP() {
  return await mcpRequest('/initialize', 'POST');
}

/**
 * Store an entity in OneNote
 * @param {string} entityName - Name of the entity
 * @param {string} entityType - Type of the entity
 * @param {Array} observations - Array of observations
 * @returns {Promise<object>} - Response data
 */
async function storeEntity(entityName, entityType, observations) {
  return await mcpRequest('/entity', 'POST', { 
    entityName, 
    entityType, 
    observations 
  });
}

/**
 * Retrieve an entity from OneNote
 * @param {string} entityName - Name of the entity
 * @param {string} entityType - Type of the entity
 * @returns {Promise<object>} - Response data
 */
async function retrieveEntity(entityName, entityType) {
  return await mcpRequest('/entity', 'GET', { 
    entityName, 
    entityType 
  });
}

/**
 * Store a context in OneNote
 * @param {string} contextName - Name of the context
 * @param {string} contextContent - Content of the context
 * @returns {Promise<object>} - Response data
 */
async function storeContext(contextName, contextContent) {
  return await mcpRequest('/context', 'POST', { 
    contextName, 
    contextContent 
  });
}

/**
 * Retrieve a context from OneNote
 * @param {string} contextName - Name of the context
 * @returns {Promise<object>} - Response data
 */
async function retrieveContext(contextName) {
  return await mcpRequest('/context', 'GET', { 
    contextName 
  });
}

/**
 * Store a relationship between entities
 * @param {string} fromEntity - Source entity
 * @param {string} relationType - Type of relationship
 * @param {string} toEntity - Target entity
 * @returns {Promise<object>} - Response data
 */
async function storeRelationship(fromEntity, relationType, toEntity) {
  return await mcpRequest('/relation', 'POST', { 
    fromEntity, 
    relationType, 
    toEntity 
  });
}

/**
 * Search for content in OneNote
 * @param {string} query - Search query
 * @param {string} type - Type of content to search (optional)
 * @returns {Promise<object>} - Response data
 */
async function search(query, type = 'all') {
  return await mcpRequest('/search', 'GET', { 
    query, 
    type 
  });
}

/**
 * Shutdown the MCP server
 * @returns {Promise<object>} - Response data
 */
async function shutdownMCP() {
  return await mcpRequest('/shutdown', 'POST');
}

// Export all functions
export {
  checkServerHealth,
  initializeMCP,
  storeEntity,
  retrieveEntity,
  storeContext,
  retrieveContext,
  storeRelationship,
  search,
  shutdownMCP
};
