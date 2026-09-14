/**
 * Tests for askAboutFile tool
 */

import { AskAboutFileTool } from '../src/tools/askAboutFile';
import { ConfigurationManager } from '../src/config/manager';
import { PathValidator } from '../src/security/pathValidator';
import { LLMProviderFactory } from '../src/providers/factory';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';

// Mock dependencies
jest.mock('../src/config/manager');
jest.mock('../src/security/pathValidator');
jest.mock('../src/providers/factory');
jest.mock('fs/promises');

const mockConfigManager = ConfigurationManager as jest.Mocked<typeof ConfigurationManager>;
const mockPathValidator = PathValidator as jest.Mocked<typeof PathValidator>;
const mockLLMProviderFactory = LLMProviderFactory as jest.Mocked<typeof LLMProviderFactory>;
const mockFs = fs as jest.Mocked<typeof fs>;

describe('AskAboutFileTool', () => {
  let tool: AskAboutFileTool;
  
  beforeEach(() => {
    tool = new AskAboutFileTool();
    jest.clearAllMocks();
    
    // Default configuration mock
    mockConfigManager.getConfig.mockReturnValue({
      security: {
        allowedBasePaths: ['/test/path'],
        maxFileSize: 1024 * 1024,
        commandTimeout: 30000,
        sessionTimeout: 1800000
      },
      llm: {
        provider: 'gemini',
        geminiKey: 'test-api-key'
      },
      research: {
        exaKey: 'test-exa-key'
      },
      server: {
        logLevel: 'info'
      }
    });
  });

  describe('execute', () => {
    it('should successfully analyze a file and return LLM response', async () => {
      const testFilePath = '/test/path/file.ts';
      const testFileContent = 'export function hello() { return "world"; }';
      const testQuestion = 'What function is exported?';
      
      // Mock path validation
      mockPathValidator.validateFilePath.mockResolvedValue({
        valid: true,
        resolvedPath: testFilePath
      });
      
      // Mock file reading
      mockFs.readFile.mockResolvedValue(testFileContent);
      
      // Mock LLM provider
      const mockProvider = {
        processRequest: jest.fn().mockResolvedValue({
          success: true,
          content: 'The exported function is `hello()`'
        })
      };
      mockLLMProviderFactory.createProvider.mockReturnValue(mockProvider);
      
      const result = await tool.execute({
        filePath: 'file.ts',
        question: testQuestion
      });
      
      expect(result.isError).toBeFalsy();
      expect(result.content).toHaveLength(1);
      expect(result.content[0]?.text).toBe('The exported function is `hello()`');
      expect(mockPathValidator.validateFilePath).toHaveBeenCalledWith('file.ts');
      expect(mockFs.readFile).toHaveBeenCalledWith(testFilePath, 'utf8');
      expect(mockProvider.processRequest).toHaveBeenCalledWith(
        expect.stringContaining(testQuestion),
        undefined,
        'test-api-key'
      );
    });
    
    it('should return error for missing required fields', async () => {
      const result = await tool.execute({
        filePath: 'test.ts'
        // Missing question
      });
      
      expect(result.isError).toBe(true);
      expect(result.content).toHaveLength(1);
      expect(result.content[0]?.text).toContain('Missing required field: question');
    });
    
    it('should return error for invalid file path', async () => {
      mockPathValidator.validateFilePath.mockResolvedValue({
        valid: false,
        error: 'Path outside allowed directories'
      });
      
      const result = await tool.execute({
        filePath: '/unauthorized/path/file.ts',
        question: 'What is this?'
      });
      
      expect(result.isError).toBe(true);
      expect(result.content).toHaveLength(1);
      expect(result.content[0]?.text).toContain('Path outside allowed directories');
    });
    
    it('should return error when LLM processing fails', async () => {
      const testFilePath = '/test/path/file.ts';
      
      mockPathValidator.validateFilePath.mockResolvedValue({
        valid: true,
        resolvedPath: testFilePath
      });
      
      mockFs.readFile.mockResolvedValue('test content');
      
      const mockProvider = {
        processRequest: jest.fn().mockResolvedValue({
          success: false,
          error: 'API quota exceeded'
        })
      };
      mockLLMProviderFactory.createProvider.mockReturnValue(mockProvider);
      
      const result = await tool.execute({
        filePath: 'file.ts',
        question: 'What is this?'
      });
      
      expect(result.isError).toBe(true);
      expect(result.content).toHaveLength(1);
      expect(result.content[0]?.text).toContain('LLM processing failed: API quota exceeded');
    });
    
    it('should handle file reading errors', async () => {
      const testFilePath = '/test/path/file.ts';
      
      mockPathValidator.validateFilePath.mockResolvedValue({
        valid: true,
        resolvedPath: testFilePath
      });
      
      mockFs.readFile.mockRejectedValue(new Error('File not found'));
      
      const result = await tool.execute({
        filePath: 'file.ts',
        question: 'What is this?'
      });
      
      expect(result.isError).toBe(true);
      expect(result.content).toHaveLength(1);
      expect(result.content[0]?.text).toContain('File analysis failed: File not found');
    });
  });
  
  describe('toMCPTool', () => {
    it('should return correct MCP tool definition', () => {
      const mcpTool = tool.toMCPTool();
      
      expect(mcpTool.name).toBe('askAboutFile');
      expect(mcpTool.description).toBe('Extract specific information from files without reading their entire contents into chat context. Works with text files, code files, images, PDFs, and more.');
      expect(mcpTool.inputSchema).toEqual({
        type: 'object',
        properties: {
          filePath: {
            type: 'string',
            description: 'Full absolute path to the file to analyze (e.g., "C:\\Users\\username\\project\\src\\file.ts", "/home/user/project/docs/README.md")'
          },
          question: {
            type: 'string',
            description: 'Specific question about the file content (e.g., "Does this file export a validateEmail function?", "What is the main purpose described in this spec?", "Extract all import statements")'
          }
        },
        required: ['filePath', 'question']
      });
    });
  });
});
