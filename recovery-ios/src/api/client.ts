/**
 * Recovery iOS — Unified API Client Factory
 * Single entry point for all API operations
 */

import { HttpClient, HttpClientConfig } from '../lib/http-client';
import { IOfflineStorage, InMemoryStorage, NativeOfflineStorage } from '../lib/offline-storage';
import { AuthClient } from './auth';
import { InjuryClient } from './injuries';
import { CheckInClient } from './checkins';
import { ProtocolClient } from './protocols';
import { AlertClient } from './alerts';

export interface RecoveryApiClientConfig extends HttpClientConfig {
  /**
   * Use native storage (SQLite/Realm) instead of in-memory
   * @default false (development: use in-memory)
   */
  useNativeStorage?: boolean;

  /**
   * Storage database name (if useNativeStorage=true)
   * @default 'recovery-ios'
   */
  storageDbName?: string;
}

/**
 * Main API client with all sub-clients
 */
export class RecoveryApiClient {
  private httpClient: HttpClient;
  private storage: IOfflineStorage;

  auth: AuthClient;
  injuries: InjuryClient;
  checkins: CheckInClient;
  protocols: ProtocolClient;
  alerts: AlertClient;

  constructor(config: RecoveryApiClientConfig) {
    // Initialize HTTP client
    this.httpClient = new HttpClient({
      baseUrl: config.baseUrl,
      timeout: config.timeout,
      maxRetries: config.maxRetries,
      retryDelay: config.retryDelay,
      offlineSyncEnabled: config.offlineSyncEnabled,
    });

    // Initialize storage
    this.storage = config.useNativeStorage
      ? new NativeOfflineStorage(config.storageDbName || 'recovery-ios')
      : new InMemoryStorage();

    // Initialize sub-clients
    this.auth = new AuthClient(this.httpClient, this.storage);
    this.injuries = new InjuryClient(this.httpClient, this.storage);
    this.checkins = new CheckInClient(this.httpClient, this.storage);
    this.protocols = new ProtocolClient(this.httpClient, this.storage);
    this.alerts = new AlertClient(this.httpClient, this.storage);
  }

  /**
   * Initialize the API client
   * Must be called before using the client
   */
  async init(): Promise<void> {
    try {
      // Initialize storage
      await this.storage.init();

      // Try to restore auth from cache
      const restored = await this.auth.restoreAuth();
      if (restored) {
        console.log('[RecoveryApiClient] Auth restored from cache');
      }

      // Start auto-sync for pending check-ins
      this.checkins.startAutoSync();

      console.log('[RecoveryApiClient] Initialized successfully');
    } catch (error) {
      console.error('[RecoveryApiClient] Initialization failed:', error);
      throw error;
    }
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    return this.auth.isAuthenticated();
  }

  /**
   * Get HTTP client instance (for advanced usage)
   */
  getHttpClient(): HttpClient {
    return this.httpClient;
  }

  /**
   * Get storage instance (for advanced usage)
   */
  getStorage(): IOfflineStorage {
    return this.storage;
  }

  /**
   * Cleanup on app shutdown
   */
  async cleanup(): Promise<void> {
    this.checkins.stopAutoSync();
    await this.auth.signOut();
    console.log('[RecoveryApiClient] Cleaned up');
  }
}

/**
 * Singleton instance
 */
let apiClient: RecoveryApiClient | null = null;

/**
 * Initialize and get API client
 */
export async function initializeApiClient(
  config: RecoveryApiClientConfig
): Promise<RecoveryApiClient> {
  if (apiClient) {
    console.warn('[initializeApiClient] Client already initialized');
    return apiClient;
  }

  apiClient = new RecoveryApiClient(config);
  await apiClient.init();

  return apiClient;
}

/**
 * Get initialized API client
 */
export function getApiClient(): RecoveryApiClient {
  if (!apiClient) {
    throw new Error(
      'API client not initialized. Call initializeApiClient() first.'
    );
  }
  return apiClient;
}

/**
 * Reset client (for testing)
 */
export function resetApiClient(): void {
  apiClient = null;
}
