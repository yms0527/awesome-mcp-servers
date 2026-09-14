#!/usr/bin/env node

/**
 * Demo Completo: Agent & Tool Suggestion Workflow
 *
 * Questo script dimostra:
 * 1. Sync agenti Claude Code → Database
 * 2. Inizializzazione MCP tools
 * 3. Decomposizione task con AI suggestions
 * 4. Enrichment del prompt con agenti e tools suggeriti
 */

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const transport = new StdioClientTransport({
  command: 'node',
  args: ['dist/server.js'],
});

const client = new Client(
  { name: 'demo-client', version: '1.0.0' },
  { capabilities: {} }
);

async function main() {
  try {
    await client.connect(transport);
    console.log('🎭 Connesso a Orchestro MCP Server\n');

    // ============================================
    // STEP 1: Get Project Info
    // ============================================
    console.log('📋 STEP 1: Recupero informazioni progetto...');
    const projectInfo = await client.callTool({
      name: 'get_project_info',
      arguments: {},
    });
    const project = JSON.parse(projectInfo.content[0].text);
    const projectId = project.id;
    console.log(`   ✅ Project: ${project.name} (${projectId})\n`);

    // ============================================
    // STEP 2: Sync Claude Code Agents
    // ============================================
    console.log('🔄 STEP 2: Sincronizzazione Claude Code agents...');
    const syncResult = await client.callTool({
      name: 'sync_claude_code_agents',
      arguments: { projectId },
    });
    const syncData = JSON.parse(syncResult.content[0].text);

    if (syncData.success) {
      console.log(`   ✅ Sincronizzati ${syncData.syncedCount} agenti:`);
      for (const agent of syncData.agents) {
        console.log(`      - ${agent.name} (${agent.agentType})`);
      }
    } else {
      console.log(`   ❌ Errore sync: ${syncData.error}`);
    }
    console.log('');

    // ============================================
    // STEP 3: Initialize Project Configuration
    // ============================================
    console.log('⚙️  STEP 3: Inizializzazione configurazione progetto...');
    const initResult = await client.callTool({
      name: 'initialize_project_configuration',
      arguments: { projectId },
    });
    const initData = JSON.parse(initResult.content[0].text);

    if (initData.success) {
      console.log(`   ✅ Configurazione inizializzata:`);
      console.log(`      - Tech Stack: ${initData.techStack?.length || 0} framework`);
      console.log(`      - Sub Agents: ${initData.subAgents?.length || 0} agenti`);
      console.log(`      - MCP Tools: ${initData.mcpTools?.length || 0} tools`);
      console.log(`      - Guidelines: ${initData.guidelines?.length || 0} regole`);
    }
    console.log('');

    // ============================================
    // STEP 4: Decompose User Story con Suggestions
    // ============================================
    console.log('🎯 STEP 4: Decomposizione user story con AI suggestions...\n');

    const userStory = 'Come sviluppatore, voglio implementare un sistema di autenticazione JWT con refresh token e rate limiting per proteggere le API';

    console.log(`📝 User Story:\n   "${userStory}"\n`);

    const decomposeResult = await client.callTool({
      name: 'decompose_story',
      arguments: { userStory },
    });
    const decomposition = JSON.parse(decomposeResult.content[0].text);

    if (!decomposition.success) {
      console.error(`   ❌ Decomposition failed: ${decomposition.error}`);
      process.exit(1);
    }

    console.log(`✅ Creati ${decomposition.tasks.length} tasks con suggestions:\n`);

    // ============================================
    // STEP 5: Mostra Tasks con Agent e Tool Suggestions
    // ============================================
    console.log('📊 STEP 5: Tasks decomposed con AI suggestions:\n');
    console.log('═'.repeat(80));

    for (let i = 0; i < decomposition.tasks.length; i++) {
      const taskInfo = decomposition.tasks[i];
      const task = taskInfo.task;
      const metadata = task.storyMetadata || {};

      console.log(`\n📌 Task ${i + 1}: ${task.title}`);
      console.log('─'.repeat(80));
      console.log(`   📝 Description: ${task.description.substring(0, 100)}...`);
      console.log(`   ⏱️  Complexity: ${metadata.complexity || 'N/A'} (${metadata.estimatedHours || '?'} hours)`);
      console.log(`   🏷️  Tags: ${(metadata.tags || []).join(', ') || 'None'}`);

      // Agent Suggestion
      if (metadata.suggestedAgent) {
        const agent = metadata.suggestedAgent;
        console.log(`\n   🤖 SUGGESTED AGENT:`);
        console.log(`      Name: ${agent.agentName}`);
        console.log(`      Type: ${agent.agentType}`);
        console.log(`      Confidence: ${(agent.confidence * 100).toFixed(0)}%`);
        console.log(`      Reason: ${agent.reason}`);
      } else {
        console.log(`\n   🤖 SUGGESTED AGENT: None`);
      }

      // Tool Suggestions
      if (metadata.suggestedTools && metadata.suggestedTools.length > 0) {
        console.log(`\n   🔧 SUGGESTED MCP TOOLS (${metadata.suggestedTools.length}):`);
        metadata.suggestedTools.forEach((tool, idx) => {
          console.log(`      ${idx + 1}. ${tool.toolName} (${tool.category})`);
          console.log(`         Confidence: ${(tool.confidence * 100).toFixed(0)}%`);
          console.log(`         Reason: ${tool.reason}`);
        });
      } else {
        console.log(`\n   🔧 SUGGESTED MCP TOOLS: None`);
      }
    }

    console.log('\n' + '═'.repeat(80));

    // ============================================
    // STEP 6: Esempio Enrichment Prompt per Execution
    // ============================================
    console.log('\n\n💡 STEP 6: Esempio di prompt enrichment per task execution:\n');

    const firstTask = decomposition.tasks[0];
    const enrichedPrompt = buildEnrichedPrompt(firstTask, project);

    console.log('─'.repeat(80));
    console.log(enrichedPrompt);
    console.log('─'.repeat(80));

    // ============================================
    // STEP 7: Configuration Summary
    // ============================================
    console.log('\n\n📊 STEP 7: Configuration Summary:\n');

    const configResult = await client.callTool({
      name: 'get_project_configuration',
      arguments: { projectId },
    });
    const config = JSON.parse(configResult.content[0].text);

    if (config.success && config.configuration) {
      console.log('✅ Active Configuration:');

      if (config.configuration.sub_agents?.length > 0) {
        console.log(`\n🤖 Sub-Agents (${config.configuration.sub_agents.length}):`);
        config.configuration.sub_agents.forEach(agent => {
          console.log(`   - ${agent.name} (${agent.agent_type})`);
          console.log(`     Enabled: ${agent.enabled}, Priority: ${agent.priority}`);
          if (agent.triggers?.length > 0) {
            console.log(`     Triggers: ${agent.triggers.join(', ')}`);
          }
        });
      }

      if (config.configuration.mcp_tools?.length > 0) {
        console.log(`\n🔧 MCP Tools (${config.configuration.mcp_tools.length}):`);
        config.configuration.mcp_tools.forEach(tool => {
          console.log(`   - ${tool.name} (${tool.tool_type})`);
          console.log(`     Command: ${tool.command}`);
          console.log(`     When to use: ${(tool.when_to_use || []).join(', ')}`);
        });
      }
    }

    console.log('\n\n✅ Demo completata con successo!\n');

  } catch (error) {
    console.error('❌ Errore:', error.message);
  } finally {
    await client.close();
    process.exit(0);
  }
}

/**
 * Build enriched prompt with agent and tool suggestions
 */
function buildEnrichedPrompt(taskInfo, project) {
  const task = taskInfo.task;
  const metadata = task.storyMetadata || {};

  let prompt = `
🎯 TASK EXECUTION PROMPT (Enriched with AI Suggestions)
═══════════════════════════════════════════════════════════════════════════

📋 PROJECT: ${project.name}
📌 TASK: ${task.title}

📝 DESCRIPTION:
${task.description}

⏱️  METADATA:
   - Complexity: ${metadata.complexity || 'medium'}
   - Estimated Hours: ${metadata.estimatedHours || 'unknown'}
   - Tags: ${(metadata.tags || []).join(', ') || 'None'}
`;

  // Add suggested agent
  if (metadata.suggestedAgent) {
    const agent = metadata.suggestedAgent;
    prompt += `
🤖 RECOMMENDED AGENT:
   Name: ${agent.agentName}
   Type: ${agent.agentType}
   Confidence: ${(agent.confidence * 100).toFixed(0)}%

   WHY THIS AGENT?
   ${agent.reason}

   ACTION: Claude Code should invoke this agent via:
   /task "Use ${agent.agentName} to: ${task.title}"
`;
  }

  // Add suggested tools
  if (metadata.suggestedTools && metadata.suggestedTools.length > 0) {
    prompt += `
🔧 RECOMMENDED MCP TOOLS:
`;
    metadata.suggestedTools.forEach((tool, idx) => {
      prompt += `
   ${idx + 1}. ${tool.toolName} (${tool.category}) - ${(tool.confidence * 100).toFixed(0)}% confidence
      → ${tool.reason}
`;
    });

    prompt += `
   ACTION: Use these tools during implementation for optimal results.
`;
  }

  // Add execution steps
  prompt += `
📋 SUGGESTED EXECUTION STEPS:

1. 🔍 ANALYSIS PHASE (use claude-context or sequential-thinking)
   - Review existing codebase for similar patterns
   - Identify affected files and dependencies
   - Check architectural constraints

2. 🛠️  IMPLEMENTATION PHASE (use suggested agent: ${metadata.suggestedAgent?.agentName || 'general-purpose'})
   - Follow project guidelines
   - Implement according to task description
   - Ensure code quality and testing

3. ✅ VALIDATION PHASE (use architecture-guardian, test-maintainer)
   - Run guardian validations
   - Execute tests
   - Verify implementation against requirements

4. 📝 DOCUMENTATION
   - Update relevant documentation
   - Add code comments
   - Record decisions made
`;

  return prompt;
}

main().catch(console.error);
