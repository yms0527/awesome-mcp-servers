/**
 * Anthropic Claude provider implementation
 */

import Anthropic from '@anthropic-ai/sdk';
import { BaseLLMProvider, LLMResponse } from './base';

export class ClaudeProvider extends BaseLLMProvider {
  readonly name = 'Anthropic Claude';
  readonly defaultModel = 'claude-3-5-sonnet-20241022';
  readonly apiKeyUrl = 'https://console.anthropic.com/account/keys';
  readonly apiKeyPrefix = 'sk-ant-';

  async processRequest(prompt: string, model?: string, apiKey?: string): Promise<LLMResponse> {
    try {
      if (!apiKey) {
        return this.createErrorResponse('Claude API key not configured');
      }

      const anthropic = new Anthropic({
        apiKey: apiKey,
      });

      const message = await anthropic.messages.create({
        model: model || this.defaultModel,
        max_tokens: 4000,
        temperature: 0.1,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      });

      const content = message.content[0];
      if (!content || content.type !== 'text') {
        return this.createErrorResponse('Unexpected response format from Claude');
      }

      return this.createSuccessResponse(content.text);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return this.createErrorResponse(`Claude processing failed: ${errorMessage}`);
    }
  }
}
