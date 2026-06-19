import { GoogleGenerativeAI } from '@google/generative-ai';
import { BaseProvider } from './base.js';
import { Message } from '../types.js';

export class GeminiProvider extends BaseProvider {
  name = 'gemini';
  private client: GoogleGenerativeAI;

  constructor(apiKey: string) {
    super();
    this.apiKey = apiKey;
    this.client = new GoogleGenerativeAI(apiKey);
  }

  async call(
    messages: Message[],
    modelId: string,
    options?: {
      maxTokens?: number;
      temperature?: number;
      timeout?: number;
    },
  ): Promise<{
    text: string;
    inputTokens: number;
    outputTokens: number;
  }> {
    try {
      const model = this.client.getGenerativeModel({ model: modelId });

      const systemMessages = messages.filter((m) => m.role === 'system').map((m) => m.content);
      const otherMessages = messages.filter((m) => m.role !== 'system');

      const response = await model.generateContent({
        contents: otherMessages.map((m) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        })),
        generationConfig: {
          maxOutputTokens: options?.maxTokens || 4096,
          temperature: options?.temperature || 0.7,
        },
        systemInstruction: systemMessages.length > 0 ? systemMessages.join('\n\n') : undefined,
      });

      const textContent = response.response.text();
      if (!textContent) {
        throw new Error('No text content in response');
      }

      const usageMetadata = response.response.usageMetadata;

      return {
        text: textContent,
        inputTokens: usageMetadata?.promptTokenCount || 0,
        outputTokens: usageMetadata?.candidatesTokenCount || 0,
      };
    } catch (error) {
      throw this.parseError(error);
    }
  }
}
