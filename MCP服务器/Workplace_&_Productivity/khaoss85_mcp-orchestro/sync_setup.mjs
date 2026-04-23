import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

async function setupOrchestro() {
  const transport = new StdioClientTransport({
    command: 'node',
    args: ['dist/server.js'],
  });

  const client = new Client(
    { name: 'setup-client', version: '1.0.0' },
    { capabilities: {} }
  );

  await client.connect(transport);

  console.log('🚀 ORCHESTRO SETUP COMPLETO\n');
  console.log('=' .repeat(50));

  // Step 1: Sync Claude Code agents
  console.log('\n📋 STEP 1: Syncing Claude Code agents...');
  const syncResult = await client.callTool({
    name: 'sync_claude_code_agents',
    arguments: { projectId: '7b189723-6695-4f56-80bd-ef242f293402' },
  });

  const syncData = JSON.parse(syncResult.content[0].text);
  console.log(`✅ Synced: ${syncData.synced ? syncData.synced.length : 0} agents`);
  console.log(`  - Created: ${syncData.created || 0}`);
  console.log(`  - Updated: ${syncData.updated || 0}`);

  if (syncData.agents && syncData.agents.length > 0) {
    console.log('\n  Agents:');
    syncData.agents.forEach(a => {
      console.log(`    - ${a.name} (${a.agentType})`);
    });
  }

  // Step 2: Initialize project configuration
  console.log('\n📋 STEP 2: Initializing project configuration...');
  const initResult = await client.callTool({
    name: 'initialize_project_configuration',
    arguments: { projectId: '7b189723-6695-4f56-80bd-ef242f293402' },
  });

  const initData = JSON.parse(initResult.content[0].text);
  console.log(`✅ Configuration initialized`);
  console.log(`  - Tech Stack: ${initData.techStack ? initData.techStack.length : 0} items`);
  console.log(`  - MCP Tools: ${initData.mcpTools ? initData.mcpTools.length : 0} tools`);
  console.log(`  - Guidelines: ${initData.guidelines ? initData.guidelines.length : 0} rules`);

  // Step 3: Get final configuration
  console.log('\n📋 STEP 3: Verifying configuration...');
  const configResult = await client.callTool({
    name: 'get_project_configuration',
    arguments: { projectId: '7b189723-6695-4f56-80bd-ef242f293402' },
  });

  const config = JSON.parse(configResult.content[0].text);

  console.log('\n' + '='.repeat(50));
  console.log('✅ SETUP COMPLETATO!\n');
  console.log('📊 RIEPILOGO FINALE:');
  console.log(`  🤖 Agenti sincronizzati: ${config.configuration.sub_agents ? config.configuration.sub_agents.length : 0}`);
  console.log(`  🔧 MCP Tools configurati: ${config.configuration.mcp_tools ? config.configuration.mcp_tools.length : 0}`);
  console.log(`  📚 Tech Stack: ${config.configuration.tech_stack ? config.configuration.tech_stack.length : 0} items`);
  console.log(`  📋 Guidelines: ${config.configuration.guidelines ? config.configuration.guidelines.length : 0} rules`);

  console.log('\n🎉 Orchestro è pronto per l\'uso!');
  console.log('🌐 Apri http://localhost:3000/config per vedere il banner di sync');

  await client.close();
}

setupOrchestro().catch(err => {
  console.error('❌ Setup failed:', err.message);
  console.error(err);
  process.exit(1);
});
