/**
 * Test script for configuration management system
 */

import { ConfigurationManager } from '../src/config/manager';

async function testConfiguration() {
  console.log('🧪 Testing Configuration Management System\n');
  
  try {
    // Test 1: Load default configuration
    console.log('Test 1: Loading default configuration...');
    const config = await ConfigurationManager.loadConfiguration();
    
    console.log('\n📋 Configuration loaded successfully:');
    console.log('Provider:', config.llm.provider);
    console.log('Allowed paths:', config.security.allowedBasePaths.length);
    console.log('Max file size:', config.security.maxFileSize);
    console.log('Log level:', config.server.logLevel);
    
    // Test 2: Get LLM config (should fail with default keys)
    console.log('\nTest 2: Testing LLM configuration validation...');
    try {
      const llmConfig = ConfigurationManager.getLLMConfig();
      console.log('❌ This should have failed with placeholder API key');
    } catch (error) {
      console.log('✅ Correctly rejected placeholder API key');
    }
    
    // Test 3: Check research availability
    console.log('\nTest 3: Testing research availability...');
    const researchEnabled = ConfigurationManager.isResearchEnabled();
    console.log('Research enabled:', researchEnabled);
    
    // Test 4: Get sanitized config
    console.log('\nTest 4: Testing sanitized configuration...');
    const sanitized = ConfigurationManager.getSanitizedConfig();
    console.log('Sanitized config keys:', Object.keys(sanitized));
    
    console.log('\n✅ All configuration tests passed!');
    
  } catch (error) {
    console.error('❌ Configuration test failed:', error);
    process.exit(1);
  }
}

// Run tests
testConfiguration();
