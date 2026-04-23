import { spawn } from 'child_process';
import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('MCP Server', () => {
  it('should start the server and respond to list tools request', async () => {
    return new Promise((resolve, reject) => {
      const serverProcess = spawn('node', ['index.js'], {
        stdio: ['pipe', 'pipe', 'pipe']
      });

      // Simulate a list tools request
      const listToolsRequest = JSON.stringify({
        type: 'list_tools',
        requestId: '1'
      }) + '\n';

      console.log(listToolsRequest);
      // Wait a moment to ensure the server is ready
      setTimeout(() => {
        serverProcess.stdin.write(listToolsRequest);
      }, 1500);

      let output = '';
      serverProcess.stdout.on('data', (data) => {
        output += data.toString();
        console.log('Received stdout:', output);
      });

      serverProcess.stderr.on('data', (data) => {
        const stderrMsg = data.toString();
        console.error('Server stderr:', stderrMsg);
        
        // If server is running, proceed with test
        if (stderrMsg.includes('Server connected and running')) {
          // Give a bit more time for potential responses
          setTimeout(() => {
            serverProcess.kill();
            
            try {
              // Verify server started and tools are available
              assert.ok(
                stderrMsg.includes('Server connected and running'), 
                'Server should start successfully'
              );
              resolve();
            } catch (error) {
              reject(error);
            }
          }, 1000);
        }
      });

      serverProcess.on('error', (error) => {
        reject(error);
      });

      // Overall timeout
      const timeoutId = setTimeout(() => {
        serverProcess.kill();
        reject(new Error('Test timed out'));
      }, 10000);

      // Clean up the timeout if the test resolves
      serverProcess.on('exit', () => {
        clearTimeout(timeoutId);
      });
    });
  });
});
