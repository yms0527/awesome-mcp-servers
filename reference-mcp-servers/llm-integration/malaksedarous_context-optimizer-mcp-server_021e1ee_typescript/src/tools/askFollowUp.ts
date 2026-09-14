import { BaseMCPTool, MCPToolResponse } from './base';
import { SessionManager } from '../session/manager';
import { LLMProviderFactory } from '../providers/factory';
import { ConfigurationManager } from '../config/manager';

export class AskFollowUpTool extends BaseMCPTool {
  readonly name = 'askFollowUp';
  readonly description = 'Ask follow-up questions about the previous terminal command execution without re-running the command. Only available after using runAndExtract tool.';
  
  readonly inputSchema = {
    type: 'object',
    properties: {
      question: {
        type: 'string',
        description: 'Follow-up question about the previous terminal command execution and its output'
      }
    },
    required: ['question']
  };
  
  async execute(args: any): Promise<MCPToolResponse> {
    try {
      this.logOperation('Follow-up question started', { question: args.question });
      
      // Validate required fields
      const fieldError = this.validateRequiredFields(args, ['question']);
      if (fieldError) {
        return this.createErrorResponse(fieldError);
      }
      
      // Load previous terminal session
      const session = await SessionManager.loadTerminalSession();
      if (!session) {
        return this.createErrorResponse(
          'No recent terminal execution found. Please use the runAndExtract tool first to execute a command, then you can ask follow-up questions about its output.'
        );
      }
      
      // Process follow-up question with LLM
      const answer = await this.processFollowUpQuestion(session, args.question);
      
      this.logOperation('Follow-up question completed successfully');
      return this.createSuccessResponse(answer);
      
    } catch (error) {
      this.logOperation('Follow-up question failed', { error });
      return this.createErrorResponse(
        `Follow-up question failed: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
  
  private async processFollowUpQuestion(
    session: any,
    question: string
  ): Promise<string> {
    const config = ConfigurationManager.getConfig();
    const provider = LLMProviderFactory.createProvider(config.llm.provider);
    const apiKey = this.getApiKey(config.llm.provider, config.llm);
    
    const prompt = this.createFollowUpPrompt(session, question);
    const response = await provider.processRequest(prompt, config.llm.model, apiKey);
    
    if (!response.success) {
      throw new Error(`LLM processing failed: ${response.error}`);
    }
    
    return response.content;
  }
  
  private createFollowUpPrompt(session: any, question: string): string {
    return `You are answering a follow-up question about a previous terminal command execution.

Previous command: ${session.command}
Working directory: ${session.workingDirectory}
Exit code: ${session.exitCode}
Original extraction request: ${session.extractionPrompt}
Previously extracted information: ${session.extractedInfo}

Follow-up question: ${question}

Context - Original command output:
${session.output}

Instructions:
- Answer the follow-up question based on the command output and context
- Reference the original output when needed
- Be specific and helpful
- If the question cannot be answered from the available information, say so clearly
- Use markdown formatting for better readability
- Be concise but thorough in your response`;
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
