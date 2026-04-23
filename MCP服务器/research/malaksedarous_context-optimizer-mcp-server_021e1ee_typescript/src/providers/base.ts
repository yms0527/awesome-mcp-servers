/**
 * Abstract base class for LLM providers
 * 
 * Provides common functionality for all LLM provider implementations
 */

export interface LLMResponse {
  success: boolean;
  content: string;
  error?: string;
}

export abstract class BaseLLMProvider {
  abstract readonly name: string;
  abstract readonly defaultModel: string;
  abstract readonly apiKeyUrl: string;
  abstract readonly apiKeyPrefix: string | undefined;

  abstract processRequest(prompt: string, model?: string, apiKey?: string): Promise<LLMResponse>;
  
  protected createStandardRequest(prompt: string, model: string) {
    return {
      model,
      temperature: 0.1,
      max_tokens: 4000,
      messages: [{ role: 'user' as const, content: prompt }]
    };
  }

  protected createSuccessResponse(content: string): LLMResponse {
    return {
      content,
      success: true
    };
  }

  protected createErrorResponse(error: string): LLMResponse {
    return {
      content: '',
      success: false,
      error
    };
  }
}
