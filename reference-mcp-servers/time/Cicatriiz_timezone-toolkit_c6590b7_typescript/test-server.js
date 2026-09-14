#!/usr/bin/env node

/**
 * TimezoneToolkit MCP Server Test Script
 *
 * This script tests the TimezoneToolkit MCP server by sending various requests
 * and verifying the responses. It can be used to test both the local build and
 * the npm package.
 *
 * Usage:
 * 1. Test local build: node test-server.js
 * 2. Test npm package: node test-server.js --npm
 * 3. Test specific tool: node test-server.js --tool=get_current_time
 * 4. Test version flag: node test-server.js --test-version
 * 5. List available tools: node test-server.js --list
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Main function to run the tests
async function runTests() {
  // Parse command line arguments
  const args = process.argv.slice(2);
  const useNpm = args.includes('--npm');
  const testVersion = args.includes('--test-version');
  const listTools = args.includes('--list');
  let toolToTest = 'get_current_time';

  // Check if a specific tool was requested
  for (const arg of args) {
    if (arg.startsWith('--tool=')) {
      toolToTest = arg.split('=')[1];
      break;
    }
  }

  // Test the version flag
  if (testVersion) {
    console.log('Testing version flag...');
    const versionProcess = spawn('node', [join(__dirname, 'dist', 'index.js'), '--version']);

    return new Promise((resolve, reject) => {
      let hasResponse = false;

      versionProcess.stdout.on('data', (data) => {
        hasResponse = true;
        const version = data.toString().trim();
        console.log(`Version: ${version}`);
        console.log('✅ Version flag test passed');
        versionProcess.kill();
        resolve();
      });

      versionProcess.stderr.on('data', (data) => {
        hasResponse = true;
        console.error(`Error: ${data}`);
        console.error('❌ Version flag test failed');
        versionProcess.kill();
        reject(new Error('Version flag test failed'));
      });

      versionProcess.on('close', (code) => {
        if (!hasResponse) {
          console.error(`❌ Version flag test failed with exit code ${code}`);
          reject(new Error(`Version flag test failed with exit code ${code}`));
        }
      });

      // Exit if no response after 3 seconds
      setTimeout(() => {
        if (!hasResponse) {
          console.error('❌ Version flag test timed out');
          versionProcess.kill();
          reject(new Error('Version flag test timed out'));
        }
      }, 3000);
    });
  }

  // Determine the command to run
  let command = 'node';
  let commandArgs = [join(__dirname, 'dist', 'index.js')];

  if (useNpm) {
    console.log('Testing npm package...');
    command = 'npx';
    commandArgs = ['-y', '@cicatriz/timezone-toolkit@latest'];
    console.log(`Running: ${command} ${commandArgs.join(' ')}`);
  } else {
    console.log('Testing local build...');
    console.log(`Running: ${command} ${commandArgs.join(' ')}`);
  }

  // Spawn the MCP server process
  const server = spawn(command, commandArgs, {
    stdio: ['pipe', 'pipe', 'pipe']
  });

  // Track test success
  let testPassed = false;

  return new Promise((resolve, reject) => {
    // Handle server output
    server.stdout.on('data', (data) => {
      try {
        const responses = data.toString().trim().split('\n');
        for (const response of responses) {
          if (response) {
            const parsedResponse = JSON.parse(response);

            if (listTools && parsedResponse.result && parsedResponse.result.tools) {
              console.log('\n\u2705 Available Tools:');
              parsedResponse.result.tools.forEach(tool => {
                console.log(`- ${tool.name}: ${tool.description}`);
              });
              testPassed = true;
              setTimeout(() => {
                server.kill();
                resolve();
              }, 500);
              return;
            }

            console.log('\nResponse:', JSON.stringify(parsedResponse, null, 2));

            // Check if the response has the expected format
            if (parsedResponse.result && parsedResponse.result.content) {
              console.log('\u2705 Response format is correct (has content array)');

              // Parse the content to verify it's valid JSON
              try {
                const content = parsedResponse.result.content[0].text;
                const parsedContent = JSON.parse(content);
                console.log('\u2705 Content is valid JSON:', parsedContent);
                testPassed = true;
              } catch (e) {
                console.error('\u274c Content is not valid JSON:', e.message);
              }
            } else if (parsedResponse.error) {
              console.error('\u274c Server returned an error:', parsedResponse.error);
            } else {
              console.error('\u274c Response format is incorrect (missing content array)');
            }
          }
        }
      } catch (error) {
        console.error('\u274c Error parsing response:', error);
        console.error('Raw response:', data.toString());
      }
    });

    server.stderr.on('data', (data) => {
      console.error(`Server stderr: ${data}`);
    });

    server.on('close', (code) => {
      if (!testPassed) {
        console.error(`\u274c Server exited with code ${code} before completing the test`);
        reject(new Error(`Server exited with code ${code}`));
      }
    });

    // Prepare the request based on the command line arguments
    let request;
    if (listTools) {
      request = {
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/list',
        params: {}
      };
    } else {
      request = {
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/call',
        params: {
          name: toolToTest,
          arguments: getToolArguments(toolToTest)
        }
      };
    }

    // Write the request to the server's stdin
    console.log('\nSending request:', JSON.stringify(request, null, 2));
    server.stdin.write(JSON.stringify(request) + '\n');

    // Set a timeout to kill the server after 10 seconds
    setTimeout(() => {
      if (!testPassed) {
        console.error('\u274c Test timed out after 10 seconds');
        server.kill();
        reject(new Error('Test timed out'));
      } else {
        console.log('\n\u2705 Test completed successfully!');
        server.kill();
        resolve();
      }
    }, 10000);
  });
}

// Helper function to get appropriate arguments for each tool
function getToolArguments(toolName) {
  switch (toolName) {
    case 'get_current_time':
      return { timezone: 'America/New_York' };
    case 'convert_time':
      return {
        time: new Date().toISOString(),
        fromTimezone: 'America/New_York',
        toTimezone: 'Europe/London'
      };
    case 'calculate_sunrise_sunset':
      return { latitude: 40.7128, longitude: -74.0060 };
    case 'calculate_moon_phase':
      return { date: new Date().toISOString() };
    case 'calculate_timezone_difference':
      return { fromTimezone: 'America/New_York', toTimezone: 'Europe/London' };
    case 'list_timezones':
      return { region: 'America' };
    case 'calculate_countdown':
      return {
        targetDate: new Date(new Date().getFullYear() + 1, 0, 1).toISOString(),
        title: 'Next New Year'
      };
    case 'calculate_business_days':
      return {
        startDate: new Date().toISOString(),
        endDate: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000).toISOString()
      };
    case 'format_date':
      return {
        date: new Date().toISOString(),
        format: 'full'
      };
    default:
      return { timezone: 'America/New_York' };
  }
}

// Run the tests and handle errors
runTests().catch(error => {
  console.error('Test failed:', error.message);
  process.exit(1);
});
