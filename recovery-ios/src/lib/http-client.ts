/**
 * Recovery iOS — HTTP Client Base
 * Handles JWT auth, retry logic, offline queue, and error handling
 */

import { z } from 'zod';

export interface HttpClientConfig {
  baseUrl: string;
  timeout?: number;
  maxRetries?: number;
  retryDelay?: number;
  offlineSyncEnabled?: boolean;
}

export interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, any>;
  timeout?: number;
  retries?: number;
}

export interface HttpResponse<T = any> {
  status: number;
  statusText: string;
  data: T;
  headers: Record<string, string>;
}

export class HttpClientError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public data?: any
  ) {
    super(`${status} ${statusText}`);
    this.name = 'HttpClientError';
  }

  isClientError(): boolean {
    return this.status >= 400 && this.status < 500;
  }

  isServerError(): boolean {
    return this.status >= 500;
  }

  isNetworkError(): boolean {
    return this.status === 0;
  }
}

/**
 * Base HTTP client with JWT auth, retry logic, and error handling
 * Stub implementation for Capacitor/React Native
 */
export class HttpClient {
  private config: Required<HttpClientConfig>;
  private token: string | null = null;
  private tokenRefreshPromise: Promise<string> | null = null;

  constructor(config: HttpClientConfig) {
    this.config = {
      timeout: 30000,
      maxRetries: 3,
      retryDelay: 1000,
      offlineSyncEnabled: true,
      ...config,
    };
  }

  /**
   * Set JWT token for authenticated requests
   */
  setToken(token: string | null): void {
    this.token = token;
  }

  /**
   * Get current JWT token
   */
  getToken(): string | null {
    return this.token;
  }

  /**
   * Check if device is online
   * Stub: implement with React Native NetInfo or Capacitor Network plugin
   */
  async isOnline(): Promise<boolean> {
    // TODO: Integrate with:
    // - @react-native-community/netinfo (React Native)
    // - @capacitor/network (Capacitor)
    return true;
  }

  /**
   * GET request
   */
  async get<T = any>(endpoint: string, options?: RequestOptions): Promise<HttpResponse<T>> {
    return this.request<T>('GET', endpoint, undefined, options);
  }

  /**
   * POST request
   */
  async post<T = any>(
    endpoint: string,
    data?: any,
    options?: RequestOptions
  ): Promise<HttpResponse<T>> {
    return this.request<T>('POST', endpoint, data, options);
  }

  /**
   * PATCH request
   */
  async patch<T = any>(
    endpoint: string,
    data?: any,
    options?: RequestOptions
  ): Promise<HttpResponse<T>> {
    return this.request<T>('PATCH', endpoint, data, options);
  }

  /**
   * DELETE request
   */
  async delete<T = any>(endpoint: string, options?: RequestOptions): Promise<HttpResponse<T>> {
    return this.request<T>('DELETE', endpoint, undefined, options);
  }

  /**
   * Generic request handler with retry logic
   */
  private async request<T = any>(
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
    endpoint: string,
    body?: any,
    options: RequestOptions = {}
  ): Promise<HttpResponse<T>> {
    const maxRetries = options.retries ?? this.config.maxRetries;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await this.performRequest<T>(method, endpoint, body, options);
      } catch (error) {
        lastError = error as Error;

        // Don't retry on client errors (4xx)
        if (error instanceof HttpClientError && error.isClientError()) {
          throw error;
        }

        // Retry on server errors (5xx) or network errors
        if (attempt < maxRetries) {
          const delay = this.config.retryDelay * Math.pow(2, attempt);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        throw error;
      }
    }

    throw lastError || new Error('Request failed after retries');
  }

  /**
   * Perform actual HTTP request
   * This is a stub implementation that should be replaced with:
   * - fetch() API for web
   * - Capacitor HTTP plugin for native
   * - React Native fetch for React Native
   */
  private async performRequest<T = any>(
    method: string,
    endpoint: string,
    body?: any,
    options: RequestOptions = {}
  ): Promise<HttpResponse<T>> {
    const url = `${this.config.baseUrl}${endpoint}`;
    const headers = this.buildHeaders(options.headers);

    const fetchOptions: RequestInit = {
      method,
      headers,
      timeout: options.timeout ?? this.config.timeout,
    };

    if (body) {
      fetchOptions.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, fetchOptions);

      const contentType = response.headers.get('content-type');
      let data: any;

      if (contentType?.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        throw new HttpClientError(response.status, response.statusText, data);
      }

      return {
        status: response.status,
        statusText: response.statusText,
        data,
        headers: Object.fromEntries(response.headers),
      };
    } catch (error) {
      if (error instanceof HttpClientError) {
        throw error;
      }

      // Network error
      throw new HttpClientError(0, 'Network Error', String(error));
    }
  }

  /**
   * Build request headers with auth token
   */
  private buildHeaders(customHeaders?: Record<string, string>): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...customHeaders,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }
}

/**
 * Validate and transform API response with Zod schema
 */
export function validateResponse<T>(schema: z.ZodSchema<T>, data: any): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Response validation failed: ${error.message}`);
    }
    throw error;
  }
}
