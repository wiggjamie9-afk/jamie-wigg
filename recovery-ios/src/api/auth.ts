/**
 * Recovery iOS — Authentication API Client
 * Handles user registration, sign-in, and token management
 */

import { HttpClient, validateResponse } from '../lib/http-client';
import {
  RegisterRequestSchema,
  SignInRequestSchema,
  AuthResponseSchema,
  type RegisterRequest,
  type SignInRequest,
  type AuthResponse,
} from '../lib/schemas';
import { IOfflineStorage } from '../lib/offline-storage';

const AUTH_TOKEN_KEY = 'auth:token';
const AUTH_USER_KEY = 'auth:user';

export class AuthClient {
  constructor(
    private httpClient: HttpClient,
    private storage: IOfflineStorage
  ) {}

  /**
   * Register a new athlete account
   * POST /api/auth/register
   */
  async register(request: RegisterRequest): Promise<AuthResponse> {
    // Validate input
    const validated = RegisterRequestSchema.parse(request);

    const response = await this.httpClient.post<AuthResponse>(
      '/api/auth/register',
      validated
    );

    // Validate and cache response
    const auth = validateResponse(AuthResponseSchema, response.data);
    await this.cacheAuth(auth);

    return auth;
  }

  /**
   * Sign in with email and password
   * POST /api/auth/signin
   */
  async signIn(request: SignInRequest): Promise<AuthResponse> {
    // Validate input
    const validated = SignInRequestSchema.parse(request);

    const response = await this.httpClient.post<AuthResponse>(
      '/api/auth/signin',
      validated
    );

    // Validate and cache response
    const auth = validateResponse(AuthResponseSchema, response.data);
    await this.cacheAuth(auth);

    return auth;
  }

  /**
   * Sign out (clear local auth state)
   * This is local-only; backend session ends on token expiry
   */
  async signOut(): Promise<void> {
    await this.storage.delete(AUTH_TOKEN_KEY);
    await this.storage.delete(AUTH_USER_KEY);
    this.httpClient.setToken(null);
  }

  /**
   * Get cached auth token
   */
  async getToken(): Promise<string | null> {
    const cached = await this.storage.get<AuthResponse>(AUTH_USER_KEY);
    return cached?.token ?? null;
  }

  /**
   * Get cached user info
   */
  async getCachedUser(): Promise<AuthResponse | null> {
    return this.storage.get<AuthResponse>(AUTH_USER_KEY);
  }

  /**
   * Restore auth from cache (on app launch)
   * Returns true if valid cached token found
   */
  async restoreAuth(): Promise<boolean> {
    try {
      const cached = await this.getCachedUser();
      if (!cached) return false;

      // Check if token is expired
      const expiresAt = new Date(cached.expires_at);
      if (expiresAt < new Date()) {
        // Token expired
        await this.signOut();
        return false;
      }

      // Restore token
      this.httpClient.setToken(cached.token);
      return true;
    } catch (error) {
      console.error('[Auth] Restore auth failed:', error);
      return false;
    }
  }

  /**
   * Refresh JWT token
   * POST /api/auth/refresh
   * Stub implementation for token refresh flow
   */
  async refreshToken(): Promise<AuthResponse> {
    const response = await this.httpClient.post<AuthResponse>('/api/auth/refresh');
    const auth = validateResponse(AuthResponseSchema, response.data);
    await this.cacheAuth(auth);
    return auth;
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const token = this.httpClient.getToken();
    if (!token) return false;

    try {
      const cached = await this.getCachedUser();
      if (!cached) return false;

      const expiresAt = new Date(cached.expires_at);
      return expiresAt > new Date();
    } catch {
      return false;
    }
  }

  /**
   * Cache auth response locally
   */
  private async cacheAuth(auth: AuthResponse): Promise<void> {
    await this.storage.set(AUTH_USER_KEY, auth);
    this.httpClient.setToken(auth.token);
  }
}
