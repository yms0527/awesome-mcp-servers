/**
 * File Analysis Tool - Extract specific information from files without reading entire contents into chat
 * 
 * Ports the FileAnalysisTool from VS Code extension to MCP with Node.js file system
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { BaseMCPTool, MCPToolResponse } from './base';
import { PathValidator } from '../security/pathValidator';
import { LLMProviderFactory } from '../providers/factory';
import { ConfigurationManager } from '../config/manager';

export class AskAboutFileTool extends BaseMCPTool {
  readonly name = 'askAboutFile';
  readonly description = 'Extract specific information from files without reading their entire contents into chat context. Works with text files, code files, images, PDFs, and more.';
  
  readonly inputSchema = {
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
  };
  
  async execute(args: any): Promise<MCPToolResponse> {
    try {
      this.logOperation('File analysis started', { filePath: args.filePath, question: args.question });
      
      // Validate required fields
      const fieldError = this.validateRequiredFields(args, ['filePath', 'question']);
      if (fieldError) {
        return this.createErrorResponse(fieldError);
      }
      
      // Validate file path security
      const pathValidation = await PathValidator.validateFilePath(args.filePath);
      if (!pathValidation.valid) {
        return this.createErrorResponse(pathValidation.error!);
      }
      
      // Read file content
      const fileContent = await fs.readFile(pathValidation.resolvedPath!, 'utf8');
      
      // Process with LLM
      const config = ConfigurationManager.getConfig();
      const provider = LLMProviderFactory.createProvider(config.llm.provider);
      const apiKey = this.getApiKey(config.llm.provider, config.llm);
      
      const prompt = this.createFileAnalysisPrompt(fileContent, args.question, args.filePath);
      const response = await provider.processRequest(prompt, config.llm.model, apiKey);
      
      if (!response.success) {
        return this.createErrorResponse(`LLM processing failed: ${response.error}`);
      }
      
      this.logOperation('File analysis completed successfully');
      return this.createSuccessResponse(response.content);
      
    } catch (error) {
      this.logOperation('File analysis failed', { error });
      return this.createErrorResponse(
        `File analysis failed: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
  
  private createFileAnalysisPrompt(fileContent: string, question: string, filePath: string): string {
    const fileExtension = path.extname(filePath);
    
    return `You are analyzing a file for a user question. Be concise and focused in your response.

File: ${filePath} (${fileExtension})
Question: ${question}

Instructions:
- Answer only what is specifically asked
- Be brief and to the point
- Use markdown formatting for code snippets
- Don't explain things that weren't asked for
- If the question can be answered with yes/no, start with that

File Content:
${fileContent}`;
  }
  
  private getApiKey(provider: string, llmConfig: any): string {
    const keyField = `${provider}Key`;
    const key = llmConfig[keyField];
    if (!key) {
      throw new Error(`API key not configured for provider: ${provider}`);
    }
    return key;
  }
}
