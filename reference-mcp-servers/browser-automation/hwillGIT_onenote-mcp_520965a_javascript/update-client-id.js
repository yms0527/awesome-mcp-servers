/**
 * Update Client ID Utility
 * 
 * This script updates the client ID in all configuration files.
 */

import fs from 'fs';
import readline from 'readline';

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Files that need to be updated
const configFiles = [
  {
    path: './config.js',
    pattern: /(clientId:\s*['"])(.+?)(['"])/,
    replacement: '$1{{CLIENT_ID}}$3'
  },
  {
    path: './minimal-access.js',
    pattern: /(clientId:\s*['"])(.+?)(['"])/,
    replacement: '$1{{CLIENT_ID}}$3'
  }
];

/**
 * Update client ID in a file
 * @param {string} filePath - Path to the file
 * @param {RegExp} pattern - Pattern to match
 * @param {string} replacement - Replacement string with placeholder
 * @param {string} clientId - Actual client ID
 */
function updateFile(filePath, pattern, replacement, clientId) {
  try {
    // Read the file
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Replace the client ID
    const updatedContent = content.replace(pattern, replacement.replace('{{CLIENT_ID}}', clientId));
    
    // Write back to the file
    fs.writeFileSync(filePath, updatedContent, 'utf8');
    
    console.log(`✓ Updated ${filePath}`);
  } catch (error) {
    console.error(`Error updating ${filePath}:`, error.message);
  }
}

// Main function
function updateClientId() {
  console.log('Update Client ID Utility');
  console.log('=======================');
  console.log('This utility will update the client ID in all configuration files.');
  console.log('Please enter your Application (client) ID from Azure portal:');
  
  rl.question('> ', (clientId) => {
    // Validate client ID format (basic validation for UUID format)
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    
    if (!uuidPattern.test(clientId)) {
      console.log('\nWarning: The client ID you entered does not match the expected format.');
      console.log('A valid client ID looks like: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
      console.log('Do you want to continue anyway? (y/n)');
      
      rl.question('> ', (answer) => {
        if (answer.toLowerCase() !== 'y') {
          console.log('Operation cancelled. No files were modified.');
          rl.close();
          return;
        }
        
        // Proceed with update
        updateFiles(clientId);
      });
    } else {
      // Valid client ID, proceed with update
      updateFiles(clientId);
    }
  });
}

// Update all files
function updateFiles(clientId) {
  console.log('\nUpdating configuration files...');
  
  configFiles.forEach(file => {
    updateFile(file.path, file.pattern, file.replacement, clientId);
  });
  
  console.log('\nClient ID updated successfully in all configuration files!');
  console.log('You can now run the OneNote MCP tool with your credentials.');
  
  rl.close();
}

// Run the utility
updateClientId();
