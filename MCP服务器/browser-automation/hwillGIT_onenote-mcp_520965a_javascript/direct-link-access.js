/**
 * Direct Link OneNote Access Script
 * 
 * This script accesses a shared OneNote notebook using a direct link.
 * It uses a simpler approach that doesn't require complex authentication.
 */

import axios from 'axios';
import open from 'open';

// Configuration for the shared notebook
const config = {
  // The direct link to the shared notebook
  notebookLink: 'https://1drv.ms/o/c/8255fc51ed471d07/EgcdR-1R_FUggIKOAAAAAAABG7lbVxX_BAJcuuZRXKhUdg?e=XSDLoz',
  
  // The resource ID extracted from the URL
  resourceId: '8255fc51ed471d07',
  
  // OneNote web app base URL for constructing API endpoints
  oneNoteWebApp: 'https://www.onenote.com/api/v1.0/me/notes'
};

/**
 * Opens the shared notebook in the default browser
 */
async function openNotebookInBrowser() {
  console.log('Opening shared notebook in your browser...');
  await open(config.notebookLink);
  console.log('Notebook opened in browser.');
}

/**
 * Main function to demonstrate direct link access
 */
async function main() {
  try {
    console.log('OneNote Direct Link Access');
    console.log('=========================');
    console.log('This script demonstrates accessing a shared OneNote notebook.');
    console.log('Shared link:', config.notebookLink);
    
    // Ask if the user wants to open the notebook in the browser
    console.log('\nWould you like to open the notebook in your browser? (Y/n)');
    process.stdout.write('> ');
    
    // For demonstration, we'll automatically open it
    // In a real application, we'd wait for user input
    console.log('Y');
    await openNotebookInBrowser();
    
    console.log('\nInformation about shared notebooks:');
    console.log('--------------------------------------');
    console.log('1. When a notebook is shared with an "all access" link, anyone with');
    console.log('   the link can view and edit the notebook in a web browser.');
    console.log('2. To programmatically read/write to this notebook, you would need to:');
    console.log('   - Use a combination of web scraping or browser automation');
    console.log('   - Or use Microsoft Graph API with proper authentication');
    console.log('3. For simplicty, using the web interface might be the easiest way to');
    console.log('   access and edit your shared notebook.');
    
    console.log('\nModel Context Protocol (MCP) Integration Options:');
    console.log('--------------------------------------');
    console.log('1. Browser Extension: Create a browser extension that connects your');
    console.log('   MCP to the OneNote web interface');
    console.log('2. Local Server: Run a local web server that opens the shared notebook');
    console.log('   and provides a REST API for your MCP');
    console.log('3. Webhook Integration: Set up a webhook system that listens for changes');
    console.log('   in your MCP and updates the notebook accordingly');
    
    console.log('\nOperation completed successfully!');
    
  } catch (error) {
    console.error('\nError:', error.message);
  }
}

// Run the main function
main().catch(console.error);
