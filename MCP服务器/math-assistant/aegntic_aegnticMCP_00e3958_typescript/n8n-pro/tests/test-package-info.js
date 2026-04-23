#!/usr/bin/env node

const { NodeSourceExtractor } = require('../dist/utils/node-source-extractor');

async function testPackageInfo() {
  console.log('🧪 Testing Package Info Extraction\n');
  
  const extractor = new NodeSourceExtractor();
  
  const testNodes = [
    'n8n-nodes-base.Slack',
    'n8n-nodes-base.HttpRequest',
    'n8n-nodes-base.Function'
  ];
  
  for (const nodeType of testNodes) {
    console.log(`\n📦 Testing ${nodeType}:`);
    try {
      const result = await extractor.extractNodeSource(nodeType);
      console.log(`  - Source Code: ${result.sourceCode ? '✅' : '❌'} (${result.sourceCode?.length || 0} bytes)`);
      console.log(`  - Credential Code: ${result.credentialCode ? '✅' : '❌'} (${result.credentialCode?.length || 0} bytes)`);
      console.log(`  - Package Name: ${result.packageInfo?.name || '❌ undefined'}`);
      console.log(`  - Package Version: ${result.packageInfo?.version || '❌ undefined'}`);
    } catch (error) {
      console.log(`  ❌ Error: ${error.message}`);
    }
  }
}

testPackageInfo().catch(console.error);