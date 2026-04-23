/**
 * Script to update package.json with playwright dependency
 */
import fs from 'fs';

// Read the current package.json
const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

// Add playwright dependency if it doesn't exist
if (!packageJson.dependencies.playwright) {
  packageJson.dependencies.playwright = "^1.39.0";
  
  // Write the updated package.json
  fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2));
  
  console.log('Added playwright dependency to package.json');
} else {
  console.log('playwright dependency already exists in package.json');
}
