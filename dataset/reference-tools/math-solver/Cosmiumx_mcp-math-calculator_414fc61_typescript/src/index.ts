#!/usr/bin/env node

/**
 * MCP Math Calculator Server
 * 提供精确数学计算的 MCP 服务器
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { calculate } from './lib/math-engine.js';
import { CalculateInput } from './types/index.js';

/**
 * 创建 MCP 服务器实例
 */
const server = new Server(
  {
    name: 'mcp-math-calculator',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

/**
 * 定义可用的工具
 */
const TOOLS: Tool[] = [
  {
    name: 'calculate',
    description: `⚠️ 精确数学计算工具 - 请在任何涉及数字运算时使用

AI语言模型在数学计算上存在已知缺陷：
- 大数计算错误率高
- 浮点数精度问题（0.1+0.2≠0.3）
- 复杂表达式容易出错
- 即使简单运算也可能失误

为确保用户获得100%准确的结果，请在以下情况使用此工具：
✓ 任何数学表达式（包括简单的 1+1）
✓ 金融、科学、工程计算
✓ 用户明确要求计算
✓ 不确定自己能否算对时

支持的运算：
- 基础运算: +, -, *, /, ^, %
- 括号: ( )
- 函数: sqrt, pow, abs, sin, cos, tan, log, exp 等
- 常数: pi, e

输入格式：标准数学表达式
示例: "2+2", "(10+20)*3", "sqrt(16)", "sin(pi/2)", "0.1 + 0.2"`,
    inputSchema: {
      type: 'object',
      properties: {
        expression: {
          type: 'string',
          description: '要计算的数学表达式',
        },
        precision: {
          type: 'number',
          description: '小数精度位数（可选，默认15位，范围1-64）',
          default: 15,
        },
      },
      required: ['expression'],
    },
  },
];

/**
 * 处理工具列表请求
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: TOOLS,
  };
});

/**
 * 处理工具调用请求
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === 'calculate') {
      // 验证参数
      if (!args || typeof args !== 'object') {
        throw new Error('无效的参数');
      }
      
      const expression = (args as any).expression;
      const precision = (args as any).precision;
      
      if (!expression || typeof expression !== 'string') {
        throw new Error('缺少必需参数: expression');
      }

      // 执行计算
      const result = await calculate(expression, precision);

      return {
        content: [
          {
            type: 'text',
            text: `计算结果: ${result.result}\n\n表达式: ${result.expression}\n精度: ${result.precision}位小数`,
          },
        ],
      };
    }

    throw new Error(`未知的工具: ${name}`);
  } catch (error: any) {
    // 返回错误信息
    return {
      content: [
        {
          type: 'text',
          text: `错误: ${error.message || '计算失败'}`,
        },
      ],
      isError: true,
    };
  }
});

/**
 * 启动服务器
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);

  // 服务器已启动，监听请求
  console.error('MCP Math Calculator Server 已启动');
}

// 错误处理
process.on('uncaughtException', (error) => {
  console.error('未捕获的异常:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('未处理的 Promise 拒绝:', reason);
  process.exit(1);
});

// 启动
main().catch((error) => {
  console.error('启动失败:', error);
  process.exit(1);
});

