/**
 * Claude Desktop OneNote MCP Example
 * 
 * This file demonstrates how Claude Desktop can use the OneNote MCP integration.
 * These examples can be copied into Claude Desktop prompts or used as plugins.
 */

import {
  initializeMCP,
  storeEntity,
  retrieveEntity,
  storeContext,
  retrieveContext,
  storeRelationship,
  search
} from './claude-integration.js';

/**
 * Example: Storing a document in OneNote
 */
async function storeDocumentExample() {
  console.log('Example: Storing a document in OneNote');
  
  // Initialize the MCP
  await initializeMCP();
  
  // Store a document entity
  const documentName = 'ClaudeDesktopGuide';
  const documentType = 'TechnicalDocument';
  const observations = [
    'Claude Desktop is an AI assistant application.',
    'Claude Desktop supports plugins for extended functionality.',
    'OneNote integration allows storing and retrieving knowledge.',
    'Created on ' + new Date().toLocaleString()
  ];
  
  const result = await storeEntity(documentName, documentType, observations);
  
  console.log(`Document stored: ${result.success ? 'Success' : 'Failed'}`);
  console.log('------------------------------------');
}

/**
 * Example: Retrieving a document from OneNote
 */
async function retrieveDocumentExample() {
  console.log('Example: Retrieving a document from OneNote');
  
  // Initialize the MCP
  await initializeMCP();
  
  // Retrieve a document entity
  const documentName = 'ClaudeDesktopGuide';
  const documentType = 'TechnicalDocument';
  
  const result = await retrieveEntity(documentName, documentType);
  
  if (result.success && result.entity) {
    console.log('Document retrieved successfully:');
    console.log(`Name: ${result.entity.entityName}`);
    console.log(`Type: ${result.entity.entityType}`);
    console.log('Observations:');
    result.entity.observations.forEach((obs, index) => {
      console.log(`  ${index + 1}. ${obs}`);
    });
  } else {
    console.log('Failed to retrieve document');
  }
  
  console.log('------------------------------------');
}

/**
 * Example: Storing context in OneNote
 */
async function storeContextExample() {
  console.log('Example: Storing context in OneNote');
  
  // Initialize the MCP
  await initializeMCP();
  
  // Store a context
  const contextName = 'ClaudeDesktopIntegration';
  const contextContent = `# Claude Desktop OneNote Integration

This context describes the integration between Claude Desktop and OneNote.

## Key Components

- OneNote MCP Server: Provides API access to OneNote
- Browser Automation: Uses Playwright to interact with OneNote
- Claude Desktop Plugin: Connects Claude to the MCP server

## Example Commands

- "Read from OneNote context [contextName]"
- "Store this information in OneNote as entity [entityName]"
- "Search OneNote for [query]"

Created on ${new Date().toLocaleString()}`;
  
  const result = await storeContext(contextName, contextContent);
  
  console.log(`Context stored: ${result.success ? 'Success' : 'Failed'}`);
  console.log('------------------------------------');
}

/**
 * Example: Retrieving context from OneNote
 */
async function retrieveContextExample() {
  console.log('Example: Retrieving context from OneNote');
  
  // Initialize the MCP
  await initializeMCP();
  
  // Retrieve a context
  const contextName = 'ClaudeDesktopIntegration';
  
  const result = await retrieveContext(contextName);
  
  if (result.success && result.context) {
    console.log('Context retrieved successfully:');
    console.log(`Name: ${result.context.contextName}`);
    console.log(`Last Updated: ${result.context.lastUpdated}`);
    console.log('Content:');
    console.log(result.context.content);
  } else {
    console.log('Failed to retrieve context');
  }
  
  console.log('------------------------------------');
}

/**
 * Example: Creating relationships in OneNote
 */
async function createRelationshipsExample() {
  console.log('Example: Creating relationships in OneNote');
  
  // Initialize the MCP
  await initializeMCP();
  
  // Create a relationship
  const result = await storeRelationship(
    'ClaudeDesktopGuide',
    'related_to',
    'ClaudeDesktopIntegration'
  );
  
  console.log(`Relationship created: ${result.success ? 'Success' : 'Failed'}`);
  console.log('------------------------------------');
}

/**
 * Example: Searching in OneNote
 */
async function searchExample() {
  console.log('Example: Searching in OneNote');
  
  // Initialize the MCP
  await initializeMCP();
  
  // Search for content
  const query = 'Claude';
  
  const result = await search(query);
  
  if (result.success) {
    console.log(`Search for "${query}" returned ${result.results.length} results:`);
    
    result.results.forEach((item, index) => {
      console.log(`\nResult ${index + 1}:`);
      console.log(`Type: ${item.type}`);
      console.log(`Name: ${item.name}`);
      console.log('Data:', JSON.stringify(item.data, null, 2));
    });
  } else {
    console.log('Search failed');
  }
  
  console.log('------------------------------------');
}

/**
 * Run all examples
 */
async function runAllExamples() {
  try {
    console.log('Running Claude Desktop OneNote MCP Examples');
    console.log('===========================================');
    
    await storeDocumentExample();
    await retrieveDocumentExample();
    await storeContextExample();
    await retrieveContextExample();
    await createRelationshipsExample();
    await searchExample();
    
    console.log('All examples completed successfully!');
  } catch (error) {
    console.error('Error running examples:', error.message);
  }
}

// Run the examples
runAllExamples();
