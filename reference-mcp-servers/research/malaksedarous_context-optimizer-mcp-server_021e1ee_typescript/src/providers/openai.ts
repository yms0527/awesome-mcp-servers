/**
 * OpenAI provider implementation
 */

import OpenAI from 'openai';
import { BaseLLMProvider, LLMResponse } from './base';

export class OpenAIProvider extends BaseLLMProvider {
  readonly name = 'OpenAI';
  readonly defaultModel = 'gpt-4o-mini';
  readonly apiKeyUrl = 'https://platform.openai.com/api-keys';
  readonly apiKeyPrefix = 'sk-';

  async processRequest(prompt: string, model?: string, apiKey?: string): Promise<LLMResponse> {
    try {
      if (!apiKey) {
        return this.createErrorResponse('OpenAI API key not configured');
      }

      const openai = new OpenAI({
        apiKey: apiKey,
      });

      const completion = await openai.chat.completions.create({
        model: model || this.defaultModel,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.1,
        max_tokens: 4000
      });

      const content = completion.choices[0]?.message?.content;
      if (!content) {
        return this.createErrorResponse('No response from OpenAI');
      }

      return this.createSuccessResponse(content);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return this.createErrorResponse(`OpenAI processing failed: ${errorMessage}`);
    }
  }
}
