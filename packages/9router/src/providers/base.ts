import { Message, ProviderError } from '../types.js';

export abstract class BaseProvider {
  abstract name: string;
  protected apiKey?: string;

  abstract call(
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
  }>;

  protected parseError(error: any): ProviderError {
    const message = error.message || String(error);
    const statusCode = error.status || error.statusCode;

    const retryable =
      statusCode === 429 ||
      statusCode === 500 ||
      statusCode === 502 ||
      statusCode === 503 ||
      message.includes('timeout') ||
      message.includes('ECONNRESET');

    return {
      provider: this.name as any,
      error: message,
      retryable,
      statusCode,
    };
  }
}
