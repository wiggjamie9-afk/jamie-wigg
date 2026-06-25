/**
 * Recovery iOS — Offline Storage Interface
 * Abstracts storage layer for IndexedDB / SQLite / AsyncStorage
 * Stub implementation with interface for mobile integration
 */

import { SyncQueueItem } from '../types/index';

export interface IOfflineStorage {
  /**
   * Initialize storage (create indexes, etc.)
   */
  init(): Promise<void>;

  /**
   * Store data in local cache
   */
  set(key: string, value: any, ttl?: number): Promise<void>;

  /**
   * Retrieve data from local cache
   */
  get<T = any>(key: string): Promise<T | null>;

  /**
   * Delete data from cache
   */
  delete(key: string): Promise<void>;

  /**
   * Clear all cache
   */
  clear(): Promise<void>;

  // ========================================================================
  // SYNC QUEUE METHODS
  // ========================================================================

  /**
   * Enqueue a failed request for later retry
   */
  enqueueSyncItem(item: Omit<SyncQueueItem, 'id' | 'timestamp'>): Promise<string>;

  /**
   * Dequeue sync items (for batch processing)
   */
  dequeueSyncItems(limit: number): Promise<SyncQueueItem[]>;

  /**
   * Mark sync item as processed
   */
  removeSyncItem(id: string): Promise<void>;

  /**
   * Get all pending sync items
   */
  getPendingSyncItems(): Promise<SyncQueueItem[]>;

  /**
   * Update sync item (e.g., increment retry count)
   */
  updateSyncItem(id: string, updates: Partial<SyncQueueItem>): Promise<void>;
}

/**
 * In-memory stub implementation for development
 */
export class InMemoryStorage implements IOfflineStorage {
  private data = new Map<string, { value: any; expires?: number }>();
  private syncQueue = new Map<string, SyncQueueItem>();

  async init(): Promise<void> {
    // No-op for in-memory
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    const expires = ttl ? Date.now() + ttl : undefined;
    this.data.set(key, { value, expires });
  }

  async get<T = any>(key: string): Promise<T | null> {
    const item = this.data.get(key);
    if (!item) return null;

    if (item.expires && item.expires < Date.now()) {
      this.data.delete(key);
      return null;
    }

    return item.value as T;
  }

  async delete(key: string): Promise<void> {
    this.data.delete(key);
  }

  async clear(): Promise<void> {
    this.data.clear();
    this.syncQueue.clear();
  }

  async enqueueSyncItem(
    item: Omit<SyncQueueItem, 'id' | 'timestamp'>
  ): Promise<string> {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const syncItem: SyncQueueItem = {
      ...item,
      id,
      timestamp: Date.now(),
    };
    this.syncQueue.set(id, syncItem);
    return id;
  }

  async dequeueSyncItems(limit: number): Promise<SyncQueueItem[]> {
    const items = Array.from(this.syncQueue.values()).slice(0, limit);
    return items.sort((a, b) => a.timestamp - b.timestamp);
  }

  async removeSyncItem(id: string): Promise<void> {
    this.syncQueue.delete(id);
  }

  async getPendingSyncItems(): Promise<SyncQueueItem[]> {
    return Array.from(this.syncQueue.values()).sort(
      (a, b) => a.timestamp - b.timestamp
    );
  }

  async updateSyncItem(
    id: string,
    updates: Partial<SyncQueueItem>
  ): Promise<void> {
    const item = this.syncQueue.get(id);
    if (item) {
      this.syncQueue.set(id, { ...item, ...updates });
    }
  }
}

/**
 * Stub for native storage layer (SQLite / Realm / AsyncStorage)
 * To be implemented with actual mobile storage:
 * - iOS: Realm or SQLite
 * - Android: Realm or SQLite
 * - Both: @react-native-async-storage/async-storage for simple key-value
 */
export class NativeOfflineStorage implements IOfflineStorage {
  constructor(private dbName: string = 'recovery-ios') {}

  async init(): Promise<void> {
    // TODO: Initialize native database connection
    // Example (Realm):
    // - import Realm from 'realm';
    // - Create schema definitions
    // - Initialize Realm instance
    console.log(`[Offline Storage] Initializing ${this.dbName}`);
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    // TODO: Store in native DB
    // Example: db.write(() => { db.create('CacheEntry', { key, value, ttl }); });
    console.log(`[Offline Storage] Set ${key}`);
  }

  async get<T = any>(key: string): Promise<T | null> {
    // TODO: Retrieve from native DB
    // Example: const entry = db.objects('CacheEntry').filtered('key == $0', key)[0];
    console.log(`[Offline Storage] Get ${key}`);
    return null;
  }

  async delete(key: string): Promise<void> {
    // TODO: Delete from native DB
    console.log(`[Offline Storage] Delete ${key}`);
  }

  async clear(): Promise<void> {
    // TODO: Clear all native DB
    console.log(`[Offline Storage] Clear all`);
  }

  async enqueueSyncItem(
    item: Omit<SyncQueueItem, 'id' | 'timestamp'>
  ): Promise<string> {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    // TODO: Store in native DB
    console.log(`[Offline Storage] Enqueue sync item: ${id}`);
    return id;
  }

  async dequeueSyncItems(limit: number): Promise<SyncQueueItem[]> {
    // TODO: Query native DB
    console.log(`[Offline Storage] Dequeue sync items (limit: ${limit})`);
    return [];
  }

  async removeSyncItem(id: string): Promise<void> {
    // TODO: Delete from sync queue
    console.log(`[Offline Storage] Remove sync item: ${id}`);
  }

  async getPendingSyncItems(): Promise<SyncQueueItem[]> {
    // TODO: Query native DB
    console.log(`[Offline Storage] Get pending sync items`);
    return [];
  }

  async updateSyncItem(
    id: string,
    updates: Partial<SyncQueueItem>
  ): Promise<void> {
    // TODO: Update in native DB
    console.log(`[Offline Storage] Update sync item: ${id}`, updates);
  }
}

/**
 * Sync engine for managing offline queue
 */
export class SyncEngine {
  private isSync = false;
  private syncIntervalId?: NodeJS.Timeout;

  constructor(
    private httpClient: any,
    private storage: IOfflineStorage,
    private syncIntervalMs: number = 5000
  ) {}

  /**
   * Start automatic sync polling
   */
  startAutoSync(): void {
    if (this.syncIntervalId) return;

    this.syncIntervalId = setInterval(() => {
      this.syncPendingItems().catch(err =>
        console.error('[SyncEngine] Auto-sync error:', err)
      );
    }, this.syncIntervalMs);
  }

  /**
   * Stop automatic sync
   */
  stopAutoSync(): void {
    if (this.syncIntervalId) {
      clearInterval(this.syncIntervalId);
      this.syncIntervalId = undefined;
    }
  }

  /**
   * Manually trigger sync of pending items
   */
  async syncPendingItems(): Promise<void> {
    if (this.isSync) return;
    this.isSync = true;

    try {
      const items = await this.storage.getPendingSyncItems();
      console.log(`[SyncEngine] Found ${items.length} pending items`);

      for (const item of items) {
        await this.syncItem(item);
      }
    } finally {
      this.isSync = false;
    }
  }

  /**
   * Sync a single item
   */
  private async syncItem(item: SyncQueueItem): Promise<void> {
    try {
      const result = await this.httpClient[item.method.toLowerCase()](
        item.endpoint,
        item.method !== 'GET' ? item.payload : undefined
      );

      // Success: remove from queue
      await this.storage.removeSyncItem(item.id);
      console.log(`[SyncEngine] Synced: ${item.endpoint}`);
    } catch (error: any) {
      // Increment retry count
      const newRetries = item.retries + 1;

      if (newRetries >= item.max_retries) {
        // Max retries exceeded: remove from queue
        await this.storage.removeSyncItem(item.id);
        console.error(
          `[SyncEngine] Max retries exceeded for ${item.endpoint}:`,
          error.message
        );
      } else {
        // Update retry count and error
        await this.storage.updateSyncItem(item.id, {
          retries: newRetries,
          last_error: error.message,
        });
        console.warn(
          `[SyncEngine] Retry ${newRetries}/${item.max_retries} for ${item.endpoint}`
        );
      }
    }
  }
}
