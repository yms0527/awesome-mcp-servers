/**
 * OneNote MCP Configuration
 * 
 * This file contains configuration settings for the OneNote Model Context Protocol Tool.
 * Store sensitive values in environment variables or a secure vault in production.
 */

// Configuration for Microsoft Authentication
const config = {
  // Your registered oneNote application client ID
  clientId: '99dd8a64-47d7-4d13-a06f-abadc6997030',
  
  // For personal Microsoft accounts
  authority: 'https://login.live.com/',
  
  // The permissions (scopes) your app needs to access OneNote
  scopes: [
    'Notes.Read',
    'Notes.ReadWrite',
    'Notes.Create',
    'offline_access',
    'openid',
    'profile'
  ],
  
  // Redirect URI configured in your application registration
  redirectUri: 'http://localhost:3000',
  
  // Authentication options
  useDeviceCode: true,  // Use device code flow for headless environments
  useBrowserAuthFallback: true,  // If device code fails, try browser auth instead
  
  // Specific notebook resource ID from your URL
  // From: https://onedrive.live.com/edit.aspx?resid=8255FC51ED471D07!142
  notebookResourceId: '8255FC51ED471D07!142'
};

// Export the configuration
export default config;
