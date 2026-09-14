#!/usr/bin/env node

const { EnhancedDocumentationFetcher } = require('../dist/utils/enhanced-documentation-fetcher');

async function demoEnhancedDocumentation() {
  console.log('=== Enhanced Documentation Parser Demo ===\n');
  console.log('This demo shows how the enhanced DocumentationFetcher extracts rich content from n8n documentation.\n');

  const fetcher = new EnhancedDocumentationFetcher();

  try {
    // Demo 1: Slack node (complex app node with many operations)
    console.log('1. SLACK NODE DOCUMENTATION');
    console.log('=' .repeat(50));
    const slackDoc = await fetcher.getEnhancedNodeDocumentation('n8n-nodes-base.slack');
    
    if (slackDoc) {
      console.log('\n📄 Basic Information:');
      console.log(`  • Title: ${slackDoc.title}`);
      console.log(`  • Description: ${slackDoc.description}`);
      console.log(`  • URL: ${slackDoc.url}`);
      
      console.log('\n📊 Content Statistics:');
      console.log(`  • Operations: ${slackDoc.operations?.length || 0} operations across multiple resources`);
      console.log(`  • API Methods: ${slackDoc.apiMethods?.length || 0} mapped to Slack API endpoints`);
      console.log(`  • Examples: ${slackDoc.examples?.length || 0} code examples`);
      console.log(`  • Resources: ${slackDoc.relatedResources?.length || 0} related documentation links`);
      console.log(`  • Scopes: ${slackDoc.requiredScopes?.length || 0} OAuth scopes`);
      
      // Show operations breakdown
      if (slackDoc.operations && slackDoc.operations.length > 0) {
        console.log('\n🔧 Operations by Resource:');
        const resourceMap = new Map();
        slackDoc.operations.forEach(op => {
          if (!resourceMap.has(op.resource)) {
            resourceMap.set(op.resource, []);
          }
          resourceMap.get(op.resource).push(op);
        });
        
        for (const [resource, ops] of resourceMap) {
          console.log(`\n  ${resource} (${ops.length} operations):`);
          ops.slice(0, 5).forEach(op => {
            console.log(`    • ${op.operation}: ${op.description}`);
          });
          if (ops.length > 5) {
            console.log(`    ... and ${ops.length - 5} more`);
          }
        }
      }
      
      // Show API method mappings
      if (slackDoc.apiMethods && slackDoc.apiMethods.length > 0) {
        console.log('\n🔗 API Method Mappings (sample):');
        slackDoc.apiMethods.slice(0, 5).forEach(api => {
          console.log(`  • ${api.resource}.${api.operation} → ${api.apiMethod}`);
          console.log(`    URL: ${api.apiUrl}`);
        });
        if (slackDoc.apiMethods.length > 5) {
          console.log(`  ... and ${slackDoc.apiMethods.length - 5} more mappings`);
        }
      }
    }

    // Demo 2: If node (core node with conditions)
    console.log('\n\n2. IF NODE DOCUMENTATION');
    console.log('=' .repeat(50));
    const ifDoc = await fetcher.getEnhancedNodeDocumentation('n8n-nodes-base.if');
    
    if (ifDoc) {
      console.log('\n📄 Basic Information:');
      console.log(`  • Title: ${ifDoc.title}`);
      console.log(`  • Description: ${ifDoc.description}`);
      console.log(`  • URL: ${ifDoc.url}`);
      
      if (ifDoc.relatedResources && ifDoc.relatedResources.length > 0) {
        console.log('\n📚 Related Resources:');
        ifDoc.relatedResources.forEach(res => {
          console.log(`  • ${res.title} (${res.type})`);
          console.log(`    ${res.url}`);
        });
      }
    }

    // Demo 3: Summary of enhanced parsing capabilities
    console.log('\n\n3. ENHANCED PARSING CAPABILITIES');
    console.log('=' .repeat(50));
    console.log('\nThe enhanced DocumentationFetcher can extract:');
    console.log('  ✓ Markdown frontmatter (metadata, tags, priority)');
    console.log('  ✓ Operations with resource grouping and descriptions');
    console.log('  ✓ API method mappings from markdown tables');
    console.log('  ✓ Code examples (JSON, JavaScript, YAML)');
    console.log('  ✓ Template references');
    console.log('  ✓ Related resources and documentation links');
    console.log('  ✓ Required OAuth scopes');
    console.log('\nThis rich content enables AI agents to:');
    console.log('  • Understand node capabilities in detail');
    console.log('  • Map operations to actual API endpoints');
    console.log('  • Provide accurate examples and usage patterns');
    console.log('  • Navigate related documentation');
    console.log('  • Understand authentication requirements');

  } catch (error) {
    console.error('\nError:', error);
  } finally {
    await fetcher.cleanup();
    console.log('\n\n✓ Demo completed');
  }
}

// Run the demo
demoEnhancedDocumentation().catch(console.error);