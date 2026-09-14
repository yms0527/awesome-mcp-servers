/**
 * Google Gemini provider implementation
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { BaseLLMProvider, LLMResponse } from './base';

export class GeminiProvider extends BaseLLMProvider {
  readonly name = 'Google Gemini';
  readonly defaultModel = 'gemini-2.5-flash';
  readonly apiKeyUrl = 'https://makersuite.google.com/app/apikey';
  readonly apiKeyPrefix = undefined;

  async processRequest(prompt: string, model?: string, apiKey?: string): Promise<LLMResponse> {
    try {
      if (!apiKey) {
        return this.createErrorResponse('Gemini API key not configured');
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const geminiModel = genAI.getGenerativeModel({ 
        model: model || this.defaultModel
      });

      const result = await geminiModel.generateContent(prompt);
      const response = await result.response;
      const content = response.text();
      
      if (!content) {
        return this.createErrorResponse('No response from Gemini');
      }

      return this.createSuccessResponse(content);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return this.createErrorResponse(`Gemini processing failed: ${errorMessage}`);
    }
  }
}
