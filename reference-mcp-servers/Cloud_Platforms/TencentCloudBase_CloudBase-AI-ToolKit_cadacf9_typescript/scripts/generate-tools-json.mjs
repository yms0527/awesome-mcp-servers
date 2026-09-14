#!/usr/bin/env node

import { spawn } from 'child_process';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateToolsJson() {
  console.log('🔧 正在启动 CloudBase MCP Server...');

  // 构建 MCP 服务器路径
  const mcpPath = path.join(__dirname, '../mcp');
  const cliPath = path.join(mcpPath, 'dist/cli.cjs');

  // 检查 cli.js 是否存在，如果不存在则先构建
  if (!fs.existsSync(cliPath)) {
    console.log('📦 正在构建 MCP Server...');
    await new Promise((resolve, reject) => {
      const buildProcess = spawn('npm', ['run', 'build'], {
        cwd: mcpPath,
        stdio: 'inherit'
      });

      buildProcess.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`构建失败，退出码: ${code}`));
        }
      });
    });
  }

  // 创建客户端和传输
  const transport = new StdioClientTransport({
    command: 'node',
    args: [cliPath],
    cwd: mcpPath
  });

  const client = new Client({
    name: "tools-generator",
    version: "1.0.0"
  }, {
    capabilities: {}
  });

  try {
    console.log('🔌 正在连接到 MCP Server...');
    await client.connect(transport);

    console.log('📋 正在获取工具列表...');
    const response = await client.listTools();

    if (!response.tools || response.tools.length === 0) {
      throw new Error('未获取到任何工具');
    }

    console.log(`✅ 成功获取到 ${response.tools.length} 个工具`);

    // 格式化工具信息
    const toolsJson = {
      name: "cloudbase-mcp",
      version: "1.8.1",
      description: "腾讯云开发 MCP Server，支持静态托管/环境查询/云函数/云数据库等功能",
      tools: response.tools.map(tool => ({
        name: tool.name,
        description: tool.description,
        inputSchema: tool.inputSchema
      }))
    };

    // 写入 tools.json 文件
    const outputPath = path.join(__dirname, 'tools.json');
    fs.writeFileSync(outputPath, JSON.stringify(toolsJson, null, 2), 'utf8');

    console.log(`📄 tools.json 已生成: ${outputPath}`);
    console.log(`🎯 工具数量: ${toolsJson.tools.length}`);

    // 打印工具名称列表
    console.log('\n📌 包含的工具:');
    toolsJson.tools.forEach((tool, index) => {
      console.log(`${index + 1}. ${tool.name} - ${tool.description}`);
    });

  } catch (error) {
    console.error('❌ 生成 tools.json 失败:', error.message);
    process.exit(1);
  } finally {
    // 清理资源
    try {
      await client.close();
    } catch (e) {
      // 忽略关闭错误
    }
  }
}

// 运行脚本
generateToolsJson().catch(error => {
  console.error('❌ 脚本执行失败:', error);
  process.exit(1);
}); 