#!/usr/bin/env node
import OneNoteAutomation from './onenote-browser-automation.js';

async function testBrowser() {
  const notebookLink = 'https://onedrive.live.com/edit.aspx?resid=8255FC51ED471D07!142&migratedtospo=true&redeem=aHR0cHM6Ly8xZHJ2Lm1zL28vYy84MjU1ZmM1MWVkNDcxZDA3L0VnY2RSLTFSX0ZVZ2dJS09BQUFBQUFBQk53REdfc0c4aEFFV01idzVIdlh5MEE_ZT1ibHNkRHE&wd=target%28Family.one%7Cc3aa35e6-f2d2-4322-862c-eea856fe824b%2FAunt%20W%20birthday%7C37a0a4f8-773e-4454-bf71-4e160a5a01a6%2F%29&wdorigin=NavigationUrl';
  const automation = new OneNoteAutomation(notebookLink);

  try {
    console.log('Initializing browser...');
    await automation.initialize();
    
    console.log('Navigating to notebook...');
    await automation.navigateToNotebook();
    
    console.log('Extracting structure...');
    const structure = await automation.extractNotebookStructure();
    console.log('Notebook structure:', JSON.stringify(structure, null, 2));

    // Example: Navigate to a page that might have diagrams
    // Using CMM > Board Questions since it might have diagrams
    const path = ['CMM', 'Board Questions'];
    console.log(`\nNavigating to path: ${path.join(' > ')}`);
    await automation.navigateToPath(path);
    
    // Read the content and capture any images
    const content = await automation.readCurrentPage();
    console.log('Content:', JSON.stringify({
      title: content.title,
      content: content.content,
      level: content.level
    }, null, 2));
    
    // Log any captured images
    if (content.images && content.images.length > 0) {
      console.log('\nCaptured images:');
      content.images.forEach((image, index) => {
        console.log(`${index + 1}. ${image.type} saved to: ${image.path}`);
      });
    } else {
      console.log('\nNo images found on this page');
    }
    
    // Keep browser open for inspection
    console.log('\nBrowser will stay open for 5 minutes for inspection...');
    await new Promise(resolve => setTimeout(resolve, 300000));
    
    await automation.close();
  } catch (error) {
    console.error('Error:', error);
    if (automation) {
      await automation.close();
    }
  }
}

testBrowser().catch(console.error);