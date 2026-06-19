import { ToolRegistryEntry } from './schema.js';
import { ToolResolver } from './resolver.js';
import fetch, { Response as FetchResponse } from 'node-fetch';

export class ToolError extends Error {
  constructor(
    message: string,
    public code: string,
    public toolId: string,
  ) {
    super(message);
    this.name = 'ToolError';
  }
}

export class RateLimitError extends ToolError {
  constructor(toolId: string, public retryAfter?: number) {
    super(`Rate limited: ${toolId}`, 'RATE_LIMIT', toolId);
    this.name = 'RateLimitError';
  }
}

export class TimeoutError extends ToolError {
  constructor(toolId: string) {
    super(`Timeout: ${toolId}`, 'TIMEOUT', toolId);
    this.name = 'TimeoutError';
  }
}

export interface ExecutionOptions {
  timeout?: number;
  retryCount?: number;
  retryDelay?: number;
}

export interface ExecutionResult {
  success: boolean;
  data?: any;
  error?: string;
  toolId: string;
  duration: number;
}

export class ToolExecutor {
  private resolver: ToolResolver;
  private apiKeys: Map<string, string>;

  constructor(resolver: ToolResolver, apiKeys?: Record<string, string>) {
    this.resolver = resolver;
    this.apiKeys = new Map(Object.entries(apiKeys || {}));
  }

  /**
   * Execute a tool by category with automatic fallback
   */
  async executeTool(
    category: string,
    params: Record<string, any>,
    options: ExecutionOptions = {},
  ): Promise<ExecutionResult> {
    const chain = this.resolver.resolveToolChain(category);
    if (chain.length === 0) {
      return {
        success: false,
        error: `No tools available in category: ${category}`,
        toolId: 'none',
        duration: 0,
      };
    }

    // Try each tool in the chain
    for (let i = 0; i < chain.length; i++) {
      const tool = chain[i];
      const startTime = Date.now();

      try {
        const data = await this.call(tool, params, options);
        return {
          success: true,
          data,
          toolId: tool.id,
          duration: Date.now() - startTime,
        };
      } catch (err: any) {
        const duration = Date.now() - startTime;

        // Rate limit: try next tool
        if (err instanceof RateLimitError) {
          if (i < chain.length - 1) {
            console.warn(`⚠️ Tool ${tool.id} rate limited, trying fallback...`);
            continue;
          }
        }

        // Timeout: try next tool
        if (err instanceof TimeoutError) {
          if (i < chain.length - 1) {
            console.warn(`⚠️ Tool ${tool.id} timeout, trying fallback...`);
            continue;
          }
        }

        // Last tool failed
        if (i === chain.length - 1) {
          return {
            success: false,
            error: err.message || String(err),
            toolId: tool.id,
            duration,
          };
        }
      }
    }

    return {
      success: false,
      error: 'All tools failed',
      toolId: 'none',
      duration: 0,
    };
  }

  /**
   * Execute a single tool call
   */
  private async call(
    tool: ToolRegistryEntry,
    params: Record<string, any>,
    options: ExecutionOptions,
  ): Promise<any> {
    const timeout = options.timeout || 5000;
    const retryCount = options.retryCount || 1;

    for (let attempt = 0; attempt < retryCount; attempt++) {
      try {
        const response = await this.fetch(tool, params, timeout);

        if (!response.ok) {
          if (response.status === 429) {
            const retryAfter = parseInt(response.headers.get('Retry-After') || '60', 10);
            throw new RateLimitError(tool.id, retryAfter);
          }
          if (response.status >= 500) {
            throw new ToolError(`Server error: ${response.status}`, 'SERVER_ERROR', tool.id);
          }
          if (response.status === 401 || response.status === 403) {
            throw new ToolError('Authentication required', 'AUTH_REQUIRED', tool.id);
          }
          throw new ToolError(`HTTP ${response.status}`, 'HTTP_ERROR', tool.id);
        }

        return await response.json();
      } catch (err: any) {
        if (err instanceof ToolError) {
          throw err;
        }

        if (err.name === 'AbortError') {
          throw new TimeoutError(tool.id);
        }

        // Retry on network errors
        if (attempt < retryCount - 1 && options.retryDelay) {
          await new Promise((resolve) => setTimeout(resolve, options.retryDelay));
          continue;
        }

        throw new ToolError(err.message || String(err), 'EXECUTION_ERROR', tool.id);
      }
    }

    throw new ToolError('Execution failed', 'EXECUTION_ERROR', tool.id);
  }

  /**
   * Fetch from API with timeout and auth
   */
  private async fetch(
    tool: ToolRegistryEntry,
    params: Record<string, any>,
    timeout: number,
  ): Promise<FetchResponse> {
    const url = new URL(tool.endpoint);

    // Add parameters to query string
    for (const [key, value] of Object.entries(params)) {
      if (value !== null && value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    }

    // Build headers
    const headers: Record<string, string> = {
      'User-Agent': 'Aria-Tool-Executor/1.0',
    };

    // Add authentication
    if (tool.authType === 'apiKey' && tool.authHeader) {
      const apiKey = this.apiKeys.get(tool.id);
      if (apiKey) {
        headers[tool.authHeader] = apiKey;
      }
    } else if (tool.authType === 'bearer' && tool.authHeader) {
      const token = this.apiKeys.get(tool.id);
      if (token) {
        headers[tool.authHeader] = `Bearer ${token}`;
      }
    }

    // Execute with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url.toString(), {
        method: tool.method,
        headers,
        signal: controller.signal as any,
      });

      clearTimeout(timeoutId);
      return response;
    } catch (err) {
      clearTimeout(timeoutId);
      throw err;
    }
  }

  /**
   * Set or update API key for a tool
   */
  setApiKey(toolId: string, apiKey: string) {
    this.apiKeys.set(toolId, apiKey);
  }

  /**
   * Get resolver for direct access
   */
  getResolver(): ToolResolver {
    return this.resolver;
  }
}
