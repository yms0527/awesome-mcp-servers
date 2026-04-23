/**
 * Integration test for askAboutFile tool
 * 
 * This test creates a real file and tests the actual tool functionality
 */

import { AskAboutFileTool } from '../src/tools/askAboutFile';
import { ConfigurationManager } from '../src/config/manager';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';

describe('AskAboutFileTool Integration', () => {
  let tool: AskAboutFileTool;
  let testDir: string;
  let testFile: string;
  
  // Check if we have real API keys before setting up mocks
  const hasApiKeys = process.env.CONTEXT_OPT_GEMINI_KEY || process.env.CONTEXT_OPT_CLAUDE_KEY || process.env.CONTEXT_OPT_OPENAI_KEY;
  
  beforeAll(async () => {
    // Create a temporary directory for tests
    testDir = await fs.mkdtemp(path.join(os.tmpdir(), 'mcp-test-'));
    testFile = path.join(testDir, 'test.ts');
    
    // Create a test file
    await fs.writeFile(testFile, `
/**
 * Test TypeScript file for integration testing
 */

export interface User {
  id: number;
  name: string;
  email: string;
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  return emailRegex.test(email);
}

export function createUser(name: string, email: string): User {
  return {
    id: Math.floor(Math.random() * 1000),
    name,
    email
  };
}
`, 'utf8');
    
    // Initialize tool
    tool = new AskAboutFileTool();
  });
  
  afterAll(async () => {
    // Clean up test files
    try {
      await fs.unlink(testFile);
      await fs.rmdir(testDir);
    } catch (error) {
      console.warn('Failed to clean up test files:', error);
    }
  });
  
  beforeEach(() => {
    // Mock configuration with test directory allowed
    // For LLM integration tests, use real API keys if available, otherwise use test keys
    const llmConfig = hasApiKeys ? {
      provider: process.env.CONTEXT_OPT_GEMINI_KEY ? 'gemini' : process.env.CONTEXT_OPT_CLAUDE_KEY ? 'claude' : 'openai',
      geminiKey: process.env.CONTEXT_OPT_GEMINI_KEY,
      claudeKey: process.env.CONTEXT_OPT_CLAUDE_KEY,
      openaiKey: process.env.CONTEXT_OPT_OPENAI_KEY
    } : {
      provider: 'gemini',
      geminiKey: 'test-api-key'
    };
    
    jest.spyOn(ConfigurationManager, 'getConfig').mockReturnValue({
      security: {
        allowedBasePaths: [testDir],
        maxFileSize: 1024 * 1024,
        commandTimeout: 30000,
        sessionTimeout: 1800000
      },
      llm: llmConfig,
      research: {
        exaKey: process.env.CONTEXT_OPT_EXA_KEY || 'test-exa-key'
      },
      server: {
        logLevel: 'info'
      }
    } as any);
  });

  test('should have correct tool metadata', () => {
    const mcpTool = tool.toMCPTool();
    
    expect(mcpTool.name).toBe('askAboutFile');
    expect(mcpTool.description).toContain('Extract specific information from files');
    expect(mcpTool.inputSchema).toHaveProperty('required');
    expect((mcpTool.inputSchema as any).required).toEqual(['filePath', 'question']);
  });
  
  test('should validate required fields', async () => {
    const result = await tool.execute({
      filePath: testFile
      // Missing question
    });
    
    expect(result.isError).toBe(true);
    expect(result.content?.[0]?.text).toContain('Missing required field: question');
  });
  
  test('should handle file outside allowed paths', async () => {
    const result = await tool.execute({
      filePath: '/unauthorized/path/file.ts',
      question: 'What is this?'
    });
    
    expect(result.isError).toBe(true);
    expect(result.content?.[0]?.text).toContain('outside allowed directories');
  });
  
  test('should handle non-existent file', async () => {
    const nonExistentFile = path.join(testDir, 'nonexistent.ts');
    
    const result = await tool.execute({
      filePath: nonExistentFile,
      question: 'What is this?'
    });
    
    expect(result.isError).toBe(true);
    expect(result.content?.[0]?.text).toContain('does not exist');
  });
  
  // Conditional test for LLM integration - skip if no API keys
  if (hasApiKeys) {
    it('should analyze file with real LLM (requires API key)', async () => {
      const result = await tool.execute({
        filePath: testFile,
        question: 'What functions are exported from this file?'
      });
      
      // Success responses don't include isError property, only error responses do
      expect(result).toBeDefined();
      expect(result.isError).toBeUndefined(); // Success responses don't have isError
      expect(result.content).toBeDefined();
      expect(result.content).toHaveLength(1);
      expect(result.content?.[0]?.text).toContain('validateEmail');
      expect(result.content?.[0]?.text).toContain('createUser');
    }, 30000); // 30 second timeout for LLM API calls
  } else {
    it('should skip LLM integration test (no API keys)', () => {
      console.log('⏭️ Skipping LLM integration test - no API keys provided');
      expect(true).toBe(true); // placeholder assertion
    });
  }
});
