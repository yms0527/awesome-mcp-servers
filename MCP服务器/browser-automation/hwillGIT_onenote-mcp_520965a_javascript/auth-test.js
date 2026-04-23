/**
 * Authentication Test Script
 * 
 * This script focuses just on testing the authentication with Microsoft Graph.
 */

import * as msal from '@azure/msal-node';
import config from './config.js';

async function testAuthentication(authorityOverride = null) {
  console.log('OneNote MCP Authentication Test');
  console.log('===============================');
  console.log('Using clientId:', config.clientId);
  const authority = authorityOverride || config.authority;
  console.log('Using authority:', authority);
  console.log('Requested scopes:', config.scopes.join(', '));
  console.log('\nInitializing MSAL client...');
  
  // Create MSAL client
  const msalClient = new msal.PublicClientApplication({
    auth: {
      clientId: config.clientId,
      authority: authority
    },
    system: {
      loggerOptions: {
        loggerCallback: (level, message, containsPii) => {
          if (!containsPii) {
            console.log(`MSAL [${level}] ${message}`);
          }
        },
        piiLoggingEnabled: false,
        logLevel: msal.LogLevel.Verbose
      }
    }
  });
  
  try {
    console.log('\nStarting device code flow...');
    
    // Initiate device code flow
    const deviceCodeRequest = {
      deviceCodeCallback: (response) => {
        console.log('\n---------------------------------------------------------');
        console.log('AUTHENTICATION REQUIRED');
        console.log('---------------------------------------------------------');
        console.log(response.message);
        console.log('\nPlease open the provided URL in your browser and enter the code.');
        console.log('You will need to login with your Microsoft account that has access to OneNote.');
        console.log('---------------------------------------------------------\n');
      },
      scopes: config.scopes
    };
    
    console.log('Requesting device code...');
    const authResponse = await msalClient.acquireTokenByDeviceCode(deviceCodeRequest);
    
    console.log('\nAuthentication successful!');
    console.log('Access token received:', authResponse.accessToken.substring(0, 10) + '...');
    
    // Check the token cache
    const accounts = await msalClient.getTokenCache().getAllAccounts();
    console.log(`\nAccounts in token cache: ${accounts.length}`);
    
    if (accounts.length > 0) {
      const firstAccount = accounts[0];
      console.log(`Authenticated account: ${firstAccount.username} (${firstAccount.name})`);
    }
    
    console.log('\nAuthentication test completed successfully!');
  } catch (error) {
    console.error('\nAuthentication failed:');
    console.error(error);
    
    if (error.errorCode === 'invalid_grant' || error.errorCode === 'post_request_failed') {
      console.log('\n---------------------------------------------------------');
      console.log('TROUBLESHOOTING TIPS:');
      console.log('---------------------------------------------------------');
      console.log('1. Make sure you completed the authentication in your browser');
      console.log('2. The current authority endpoint might not be working.');
      console.log('   Currently using: ' + authority);
      console.log('\nTrying alternative authority endpoints automatically...');
      console.log('---------------------------------------------------------');
      
      // Try alternative authorities if we're not already in a retry
      if (!authorityOverride) {
        const authOptions = [
          'https://login.microsoftonline.com/common',
          'https://login.microsoft.com/common',
          'https://login.microsoftonline.com/organizations'
        ];
        
        // Only try options that are different from what we just tried
        const alternativeOptions = authOptions.filter(opt => opt !== authority);
        
        if (alternativeOptions.length > 0) {
          console.log(`\nRetrying with different authority: ${alternativeOptions[0]}\n`);
          // Wait a moment before retrying
          await new Promise(resolve => setTimeout(resolve, 2000));
          return await testAuthentication(alternativeOptions[0]);
        }
      } else {
        // We already tried an alternative
        console.log('\n---------------------------------------------------------');
        console.log('All authentication endpoints failed. Please check:');
        console.log('1. Verify the client ID is correct: ' + config.clientId);
        console.log('2. Make sure the app is properly registered in Azure portal');
        console.log('3. Check that you have the right permissions requested');
        console.log('---------------------------------------------------------');
      }
    }
  }
}

// Run the test
testAuthentication().catch(console.error);
