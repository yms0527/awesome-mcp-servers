/**
 * Minimal OneNote Access Script
 * 
 * This script uses minimal permissions to just read OneNote notebooks.
 */

import OneNoteMCP from './onenote-graph-api-mcp.js';
import { authenticate as browserAuthenticate } from './browser-auth.js';

// Minimal configuration with just the essential scopes
const minimalConfig = {
  clientId: 'b6830d6a-72b1-4672-9824-1020c7182f7f', // Update this with your actual client ID
  authority: 'https://login.microsoftonline.com/common',
  scopes: [
    'Notes.Read', // Only need read access
    'openid',
    'profile'
  ],
  redirectUri: 'http://localhost:3000',
  useBrowserAuthFallback: true
};

// Check if the client ID needs to be replaced
if (minimalConfig.clientId === 'YOUR_ONENOTE_CLIENT_ID_HERE') {
  console.log('\nYou need to update the client ID in minimal-access.js with your actual client ID.');
  console.log('Please enter your Application (client) ID from Azure portal:\n');
  
  // This is a simple way to get input in Node.js
  // In a real app, you might want to use a proper input library
  process.stdout.write('> ');
  
  // Simulating input for now - in a real scenario this would be user input
  // For this example, we'll just proceed with a warning
  console.log('\nWarning: Using placeholder client ID. Update the file for future use.\n');
}

async function main() {
  try {
    console.log('OneNote MCP - Minimal Access Script');
    console.log('===================================');
    console.log('This script only requires minimal read permissions.');
    
    // Use browser authentication
    console.log('\nStarting browser authentication...');
    const authResult = await browserAuthenticate();
    console.log('Authentication successful!');
    
    // Create MCP instance with the token
    const oneNoteMCP = new OneNoteMCP({
      ...minimalConfig,
      accessToken: authResult.accessToken
    });
    
    // List notebooks
    console.log('\nFetching notebooks...');
    const notebooks = await oneNoteMCP.getNotebooks();
    console.log(`Found ${notebooks.length} notebooks:`);
    
    notebooks.forEach((notebook, index) => {
      console.log(`${index + 1}. ${notebook.displayName} (${notebook.id})`);
    });
    
    // If no notebooks were found
    if (notebooks.length === 0) {
      console.log('No notebooks found. Make sure you have at least one notebook in your OneNote account.');
      return;
    }
    
    // Get sections from the first notebook
    const firstNotebook = notebooks[0];
    console.log(`\nFetching sections from "${firstNotebook.displayName}"...`);
    const sections = await oneNoteMCP.getSections(firstNotebook.id);
    console.log(`Found ${sections.length} sections:`);
    
    sections.forEach((section, index) => {
      console.log(`${index + 1}. ${section.displayName} (${section.id})`);
    });
    
    // If no sections were found
    if (sections.length === 0) {
      console.log('No sections found in this notebook.');
      return;
    }
    
    // Get pages from the first section
    const firstSection = sections[0];
    console.log(`\nFetching pages from "${firstSection.displayName}"...`);
    const pages = await oneNoteMCP.getPages(firstSection.id);
    console.log(`Found ${pages.length} pages:`);
    
    pages.forEach((page, index) => {
      console.log(`${index + 1}. ${page.title} (${page.id})`);
    });
    
    console.log('\nOperation completed successfully!');
    console.log('If you need to create or modify content, you will need additional permissions.');
    
  } catch (error) {
    console.error('\nError:', error.message);
    if (error.response) {
      console.error('API Error:', error.response.data);
    }
    
    console.log('\n---------------------------------------------------------');
    console.log('TROUBLESHOOTING TIPS:');
    console.log('---------------------------------------------------------');
    console.log('1. Make sure your client ID is correct in the configuration');
    console.log('2. Verify you have at least one OneNote notebook available');
    console.log('3. Try accessing your notebooks directly in the browser at:');
    console.log('   https://www.onenote.com/notebooks');
    console.log('---------------------------------------------------------');
  }
}

// Run the main function
main().catch(console.error);
