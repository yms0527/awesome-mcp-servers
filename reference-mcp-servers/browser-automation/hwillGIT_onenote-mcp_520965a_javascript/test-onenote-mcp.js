/**
 * Test Script for OneNote MCP Implementation
 * 
 * This script demonstrates how to use the OneNote MCP implementation
 * with a few example operations.
 */

import OneNoteMCP from './onenote-mcp-impl.js';
import fs from 'fs';
import path from 'path';

// Create screenshots directory if it doesn't exist
const screenshotsDir = './screenshots';
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

/**
 * Test function for OneNote MCP
 */
async function testOneNoteMCP() {
  console.log('⭐ Starting OneNote MCP Test ⭐');
  console.log('================================');
  
  // Create an instance of the MCP
  const mcp = new OneNoteMCP();
  
  try {
    // Initialize the MCP
    console.log('\n🔹 Initializing MCP...');
    await mcp.initialize();
    
    // Test entity creation
    console.log('\n🔹 Testing entity creation...');
    await mcp.storeEntity(
      'TestDocument', 
      'Document', 
      [
        'This is a test document created by the MCP tool.',
        'It contains multiple observations.',
        'Created on ' + new Date().toLocaleString()
      ]
    );
    console.log('✅ Entity created successfully');
    
    // Test entity retrieval
    console.log('\n🔹 Testing entity retrieval...');
    const entity = await mcp.retrieveEntity('TestDocument', 'Document');
    console.log('Retrieved entity:', entity);
    console.log('✅ Entity retrieved successfully');
    
    // Test relationship creation
    console.log('\n🔹 Testing relationship creation...');
    await mcp.storeRelationship(
      'TestDocument',
      'references',
      'OneNote'
    );
    console.log('✅ Relationship created successfully');
    
    // Test context creation
    console.log('\n🔹 Testing context creation...');
    const contextContent = `# Test Context
    
This is a sample context created by the MCP tool.

## Key Points
- OneNote MCP integration uses browser automation
- It provides a structured way to store and retrieve information
- The implementation uses a local cache for better performance

Created on ${new Date().toLocaleString()}`;
    
    await mcp.storeContext('TestContext', contextContent);
    console.log('✅ Context created successfully');
    
    // Test context retrieval
    console.log('\n🔹 Testing context retrieval...');
    const context = await mcp.retrieveContext('TestContext');
    console.log('Retrieved context:', context);
    console.log('✅ Context retrieved successfully');
    
    // Test MCP API methods
    console.log('\n🔹 Testing MCP API methods...');
    
    // Create multiple entities
    console.log('\n  Creating multiple entities...');
    await mcp.createEntities([
      {
        name: 'PythonDoc',
        entityType: 'Document',
        observations: ['A document about Python programming language']
      },
      {
        name: 'JavaScriptDoc',
        entityType: 'Document',
        observations: ['A document about JavaScript programming language']
      }
    ]);
    console.log('  ✅ Multiple entities created');
    
    // Create relations between entities
    console.log('\n  Creating relations between entities...');
    await mcp.createRelations([
      {
        from: 'PythonDoc',
        relationType: 'related_to',
        to: 'JavaScriptDoc'
      },
      {
        from: 'JavaScriptDoc',
        relationType: 'mentions',
        to: 'TestDocument'
      }
    ]);
    console.log('  ✅ Relations created');
    
    // Add observations to entities
    console.log('\n  Adding observations to entities...');
    await mcp.addObservations([
      {
        entityName: 'Entity-Document-PythonDoc',
        contents: ['Python is a popular language for machine learning']
      }
    ]);
    console.log('  ✅ Observations added');
    
    // Search for nodes
    console.log('\n  Searching for nodes...');
    const searchResults = await mcp.searchNodes('Python');
    console.log(`  Found ${searchResults.length} results`);
    
    // Read the entire graph
    console.log('\n  Reading the entire graph...');
    const graph = await mcp.readGraph();
    console.log(`  Graph contains ${graph.entities.length} entities and ${graph.relations.length} relations`);
    
    console.log('\n🎉 All tests completed successfully! 🎉');
    
  } catch (error) {
    console.error('\n❌ Error during testing:', error.message);
    console.error(error.stack);
  } finally {
    // Close the MCP
    console.log('\n🔹 Closing MCP...');
    await mcp.close();
    console.log('MCP closed.');
    
    console.log('\n================================');
    console.log('⭐ OneNote MCP Test Complete ⭐');
  }
}

// Run the test function
testOneNoteMCP().catch(console.error);
