/**
 * Access Specific OneNote Notebook
 * 
 * This script demonstrates accessing a specific notebook in your OneDrive
 * using the resource ID from the URL.
 */

import OneNoteMCP from './onenote-graph-api-mcp.js';
import config from './config.js';

async function main() {
  try {
    console.log('Initializing OneNote MCP Tool...');
    const oneNoteMCP = new OneNoteMCP(config);
    
    // Step 1: List all available notebooks
    console.log('\nFetching all available notebooks...');
    const notebooks = await oneNoteMCP.getNotebooks();
    console.log(`Found ${notebooks.length} notebooks:`);
    
    // Display all notebooks and look for one that matches our resource ID
    let targetNotebook = null;
    
    notebooks.forEach((notebook, index) => {
      console.log(`${index + 1}. ${notebook.displayName} (${notebook.id})`);
      
      // Check if this notebook's ID contains our resource ID
      if (notebook.id.includes(config.notebookResourceId)) {
        console.log(`   ✓ This appears to be the target notebook!`);
        targetNotebook = notebook;
      }
    });
    
    // If we didn't find the notebook by ID, let the user select one
    if (!targetNotebook && notebooks.length > 0) {
      console.log('\nThe specific notebook with resource ID was not found by direct match.');
      console.log('Selecting the first notebook by default:');
      targetNotebook = notebooks[0];
      console.log(`Selected: ${targetNotebook.displayName}`);
    } else if (!targetNotebook) {
      throw new Error('No notebooks found in your account.');
    }
    
    // Step 2: Get all sections in the selected notebook
    console.log(`\nFetching sections in "${targetNotebook.displayName}"...`);
    const sections = await oneNoteMCP.getSections(targetNotebook.id);
    console.log(`Found ${sections.length} sections:`);
    
    sections.forEach((section, index) => {
      console.log(`${index + 1}. ${section.displayName} (${section.id})`);
    });
    
    // If there are sections, get pages from the first one
    if (sections.length > 0) {
      const firstSection = sections[0];
      
      // Step 3: Get all pages in the first section
      console.log(`\nFetching pages in "${firstSection.displayName}"...`);
      const pages = await oneNoteMCP.getPages(firstSection.id);
      console.log(`Found ${pages.length} pages:`);
      
      pages.forEach((page, index) => {
        console.log(`${index + 1}. ${page.title} (${page.id})`);
      });
      
      // Step 4: If there are pages, get content from the first one
      if (pages.length > 0) {
        const firstPage = pages[0];
        console.log(`\nFetching content for "${firstPage.title}"...`);
        
        const pageWithContent = await oneNoteMCP.getPageWithContent(firstPage.id);
        console.log('Page content preview (first 150 characters):');
        console.log(pageWithContent.content.substring(0, 150) + '...');
        
        // Step 5: Create a new page in the section
        console.log('\nCreating a new page...');
        const newPageTitle = `MCP Test Page - ${new Date().toLocaleString()}`;
        const newPageContent = `
          <h1>${newPageTitle}</h1>
          <p>This page was created using the OneNote Model Context Protocol tool.</p>
          <p>Created on: ${new Date().toLocaleString()}</p>
          <ul>
            <li>The tool accesses your OneNote notebooks through Microsoft Graph API</li>
            <li>It's designed to work with cloud-based notebooks in OneDrive</li>
            <li>You can read, create, and modify notebooks, sections, and pages</li>
          </ul>
        `;
        
        const newPage = await oneNoteMCP.createPage(firstSection.id, newPageTitle, newPageContent);
        console.log(`Created new page: ${newPage.title} (${newPage.id})`);
      }
    }
    
    console.log('\nOperation completed successfully!');
    
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('API Error:', error.response.data);
    }
  }
}

// Run the main function
main().catch(console.error);
