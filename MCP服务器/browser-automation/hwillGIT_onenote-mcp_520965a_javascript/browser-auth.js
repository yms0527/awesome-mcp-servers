/**
 * Browser-based Authentication for OneNote MCP
 * 
 * This script uses an alternative authentication approach that opens a browser window.
 */

import { PublicClientApplication } from '@azure/msal-node';
import open from 'open';
import http from 'http';
import url from 'url';
import config from './config.js';

// Configuration
const SERVER_PORT = 3000;
const REDIRECT_URI = `http://localhost:${SERVER_PORT}`;

// Create MSAL application object
const msalConfig = {
  auth: {
    clientId: config.clientId,
    authority: 'https://login.microsoftonline.com/common',
    redirectUri: REDIRECT_URI,
  }
};

const pca = new PublicClientApplication(msalConfig);

/**
 * Authentication with browser flow
 */
async function authenticate() {
  return new Promise((resolve, reject) => {
    console.log('Starting browser-based authentication...');
    
    // Create a server to handle the redirect
    const server = http.createServer(async (req, res) => {
      try {
        const parsedUrl = url.parse(req.url, true);
        const { code } = parsedUrl.query;
        
        if (code) {
          console.log('Authorization code received from browser redirect');
          
          // Close response with a simple page
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(`
            <h1>Authentication successful!</h1>
            <p>You can close this window and return to the application.</p>
            <script>window.close();</script>
          `);
          
          try {
            // Exchange code for token
            const tokenResponse = await pca.acquireTokenByCode({
              code,
              scopes: config.scopes,
              redirectUri: REDIRECT_URI
            });
            
            // Close server and resolve promise
            server.close();
            resolve(tokenResponse);
          } catch (error) {
            console.error('Error exchanging code for token:', error);
            reject(error);
          }
        } else {
          // No code in the URL, return error
          res.writeHead(400, { 'Content-Type': 'text/html' });
          res.end('<h1>Authentication failed</h1><p>No authorization code was received.</p>');
        }
      } catch (error) {
        console.error('Server error:', error);
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end('<h1>Server Error</h1>');
        reject(error);
      }
    });
    
    // Start server
    server.listen(SERVER_PORT, async () => {
      try {
        console.log(`Server listening on port ${SERVER_PORT}`);
        
        // Generate authorization URL
        const authCodeUrlParameters = {
          scopes: config.scopes,
          redirectUri: REDIRECT_URI,
          prompt: 'consent', // Force consent prompt even if previously granted
        };
        
        const authUrl = await pca.getAuthCodeUrl(authCodeUrlParameters);
        console.log('Opening browser to URL:', authUrl);
        
        // Open browser to the authorization URL
        await open(authUrl);
        console.log('Browser opened. Please complete the authentication process in your browser.');
      } catch (error) {
        console.error('Error generating auth URL:', error);
        server.close();
        reject(error);
      }
    });
    
    // Handle server errors
    server.on('error', (error) => {
      console.error('Server error:', error);
      reject(error);
    });
  });
}

/**
 * Main function
 */
async function main() {
  console.log('OneNote MCP Browser Authentication');
  console.log('==================================');
  console.log('This will open a browser window for you to authenticate.');
  console.log('Client ID:', config.clientId);
  console.log('Scopes:', config.scopes.join(', '));
  
  try {
    console.log('\nStarting authentication process...');
    const authResult = await authenticate();
    
    console.log('\nAuthentication successful!');
    console.log('Access token received (first 10 chars):', authResult.accessToken.substring(0, 10) + '...');
    console.log('Token expires:', new Date(authResult.expiresOn).toLocaleString());
    console.log('Account:', authResult.account.username);
    
    console.log('\nYou can now use the OneNote MCP tool with this authenticated account.');
    console.log('Try running "node access-notebook.js" to access your notebooks.\n');
    
    // Return auth result so it can be used if this module is imported
    return authResult;
  } catch (error) {
    console.error('\nAuthentication failed:');
    console.error(error);
    throw error;
  }
}

// Run if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

// Export for use in other modules
export { authenticate };
