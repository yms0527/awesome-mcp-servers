#!/usr/bin/env node

/**
 * Automated demo recording script
 * Records a complete demonstration of all Aegntic MCP servers
 */

const AegnticMCPDemo = require('./demo');
const chalk = require('chalk');
const path = require('path');

async function recordDemo() {
  console.log(chalk.blue('🎬 Starting Automated Aegntic MCP Demo Recording...'));
  
  const demo = new AegnticMCPDemo();
  const outputPath = path.join(__dirname, 'aegntic-mcp-demo-recording.mp4');
  
  try {
    // Start the demo
    console.log(chalk.yellow('📱 Starting demo interface...'));
    await demo.startDemo();
    
    // Wait a moment for the interface to load
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Start recording
    console.log(chalk.red('🎥 Starting screen recording...'));
    await demo.startRecording(outputPath);
    
    console.log(chalk.green('✅ Demo recording completed successfully!'));
    console.log(chalk.blue(`📹 Recording saved to: ${outputPath}`));
    
  } catch (error) {
    console.error(chalk.red('❌ Recording failed:'), error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  recordDemo();
}

module.exports = recordDemo;