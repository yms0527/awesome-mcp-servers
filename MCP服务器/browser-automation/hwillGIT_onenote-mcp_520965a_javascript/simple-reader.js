/**
 * Simple OneNote Reader
 * 
 * A simplified tool to read content from your OneNote notebooks.
 */

import OneNoteMCP from './onenote-graph-api-mcp.js';
import config from './config.js';

/**
 * Display a menu and get user input
 * @param {Array} options - Menu options
 * @returns {Promise<number>} - Selected option index
 */
async function showMenu(options) {
  // In a real app, you'd implement user input
  // For this example, we'll just return the first option
  console.log('\nMenu Options:');
  options.forEach((option, index) => {
    console.log(`${index + 1}. ${option}`);
  });
  console.log('Automatically selecting option 1...');
  return 0; // Return the first option
}

/**
 * Run the simple reader
 */
async function runReader() {
  try {
    console.log('Initializing OneNote Simple Reader...');
    const oneNoteMCP = new OneNoteMCP(config);
    
    // Get all notebooks
    console.log('\nFetching your notebooks...');
    const notebooks = await oneNoteMCP.getNotebooks();
    
    if (notebooks.length === 0) {
      console.log('No notebooks found. Please make sure you have access to OneNote.');
      return;
    }
    
    console.log(`Found ${notebooks.length} notebooks:`);
    notebooks.forEach((notebook, index) => {
      console.log(`${index + 1}. ${notebook.displayName}`);
    });
    
    // Select a notebook
    const notebookIndex = await showMenu(notebooks.map(n => n.displayName));
    const selectedNotebook = notebooks[notebookIndex];
    console.log(`\nSelected notebook: ${selectedNotebook.displayName}`);
    
    // Get sections in the notebook
    console.log('\nFetching sections...');
    const sections = await oneNoteMCP.getSections(selectedNotebook.id);
    
    if (sections.length === 0) {
      console.log('No sections found in this notebook.');
      return;
    }
    
    console.log(`Found ${sections.length} sections:`);
    sections.forEach((section, index) => {
      console.log(`${index + 1}. ${section.displayName}`);
    });
    
    // Select a section
    const sectionIndex = await showMenu(sections.map(s => s.displayName));
    const selectedSection = sections[sectionIndex];
    console.log(`\nSelected section: ${selectedSection.displayName}`);
    
    // Get pages in the section
    console.log('\nFetching pages...');
    const pages = await oneNoteMCP.getPages(selectedSection.id);
    
    if (pages.length === 0) {
      console.log('No pages found in this section.');
      return;
    }
    
    console.log(`Found ${pages.length} pages:`);
    pages.forEach((page, index) => {
      console.log(`${index + 1}. ${page.title}`);
    });
    
    // Select a page
    const pageIndex = await showMenu(pages.map(p => p.title));
    const selectedPage = pages[pageIndex];
    console.log(`\nSelected page: ${selectedPage.title}`);
    
    // Get page content
    console.log('\nFetching page content...');
    const pageWithContent = await oneNoteMCP.getPageWithContent(selectedPage.id);
    
    // Display content summary
    console.log('\nContent Preview:');
    console.log('-----------------------------');
    console.log(pageWithContent.content.substring(0, 500) + '...');
    console.log('-----------------------------');
    console.log(`Created: ${pageWithContent.createdDateTime}`);
    console.log(`Last Modified: ${pageWithContent.lastModifiedDateTime}`);
    
    console.log('\nOperation completed successfully!');
    
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('API Error:', error.response.data);
    }
  }
}

// Run the reader
runReader().catch(console.error);
