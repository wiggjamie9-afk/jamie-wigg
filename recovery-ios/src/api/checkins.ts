/**
 * Recovery iOS — Check-ins API Client
 * Handles daily check-in submissions, syncing, and offline support
 */

import { HttpClient, validateResponse } from '../lib/http-client';
import { IOfflineStorage, SyncEngine } from '../lib/offline-storage';
import {
  CheckInSchema,
  CreateCheckInRequestSchema,
  UpdateCheckInRequestSchema,
  type CheckIn,
  type CreateCheckInRequest,
  type UpdateCheckInRequest,
} from '../lib/schemas';

const CHECKIN_CACHE_PREFIX = 'checkin:';
const CHECKINS_CACHE_KEY = 'checkins:';
const SYNC_QUEUE_PREFIX = 'sync:checkin:';
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

export class CheckInClient {
  private syncEngine?: SyncEngine;

  constructor(
    private httpClient: HttpClient,
    private storage: IOfflineStorage
  ) {
    // Initialize sync engine for offline queue
    this.syncEngine = new SyncEngine(httpClient, storage);
  }

  /**
   * Start automatic sync of pending check-ins
   */
  startAutoSync(): void {
    this.syncEngine?.startAutoSync();
  }

  /**
   * Stop automatic sync
   */
  stopAutoSync(): void {
    this.syncEngine?.stopAutoSync();
  }

  /**
   * Submit a daily check-in
   * POST /api/injuries/:id/checkin
   * Supports offline queue if connection unavailable
   */
  async submitCheckIn(
    injuryId: string,
    request: CreateCheckInRequest
  ): Promise<CheckIn> {
    // Validate input
    const validated = CreateCheckInRequestSchema.parse(request);

    const isOnline = await this.httpClient.isOnline();

    try {
      // Try to submit online
      const response = await this.httpClient.post<CheckIn>(
        `/api/injuries/${injuryId}/checkin`,
        validated
      );

      const checkIn = validateResponse(CheckInSchema, response.data);

      // Mark as synced
      checkIn.synced = true;

      // Cache result
      await this.storage.set(
        `${CHECKIN_CACHE_PREFIX}${checkIn.id}`,
        checkIn,
        CACHE_TTL
      );

      return checkIn;
    } catch (error: any) {
      if (!isOnline || error.status >= 500) {
        // Offline or server error: queue for later sync
        const checkIn: CheckIn = {
          id: `local-${Date.now()}`,
          injury_id: injuryId,
          ...validated,
          synced: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        // Store locally
        await this.storage.set(
          `${CHECKIN_CACHE_PREFIX}${checkIn.id}`,
          checkIn,
          undefined
        );

        // Enqueue for sync
        await this.storage.enqueueSyncItem({
          endpoint: `/api/injuries/${injuryId}/checkin`,
          method: 'POST',
          payload: validated,
          retries: 0,
          max_retries: 3,
        });

        console.log('[CheckInClient] Check-in queued for sync (offline)');
        return checkIn;
      }

      throw error;
    }
  }

  /**
   * Get check-ins for an injury (with optional date range)
   * GET /api/injuries/:id/checkins
   */
  async getCheckIns(
    injuryId: string,
    options?: {
      startDate?: string;
      endDate?: string;
      limit?: number;
    }
  ): Promise<CheckIn[]> {
    // Check cache
    const cacheKey = `${CHECKINS_CACHE_KEY}${injuryId}`;
    const cached = await this.storage.get<CheckIn[]>(cacheKey);
    if (cached) return cached;

    // Build query params
    const params = new URLSearchParams();
    if (options?.startDate) params.append('start_date', options.startDate);
    if (options?.endDate) params.append('end_date', options.endDate);
    if (options?.limit) params.append('limit', String(options.limit));

    const query = params.toString();
    const endpoint = `/api/injuries/${injuryId}/checkins${
      query ? `?${query}` : ''
    }`;

    try {
      const response = await this.httpClient.get<CheckIn[]>(endpoint);

      const checkIns = Array.isArray(response.data)
        ? response.data.map(c => validateResponse(CheckInSchema, c))
        : [];

      // Cache result
      await this.storage.set(cacheKey, checkIns, CACHE_TTL);

      return checkIns;
    } catch (error: any) {
      // On error, try to return cached data even if stale
      const cached = await this.storage.get<CheckIn[]>(cacheKey);
      if (cached) {
        console.warn('[CheckInClient] Using stale cache for check-ins');
        return cached;
      }
      throw error;
    }
  }

  /**
   * Update an existing check-in (if same day)
   * PATCH /api/injuries/:id/checkins/:cid
   */
  async updateCheckIn(
    injuryId: string,
    checkInId: string,
    request: UpdateCheckInRequest
  ): Promise<CheckIn> {
    // Validate input
    const validated = UpdateCheckInRequestSchema.parse(request);

    const response = await this.httpClient.patch<CheckIn>(
      `/api/injuries/${injuryId}/checkins/${checkInId}`,
      validated
    );

    const checkIn = validateResponse(CheckInSchema, response.data);
    checkIn.synced = true;

    // Update cache
    await this.storage.set(
      `${CHECKIN_CACHE_PREFIX}${checkIn.id}`,
      checkIn,
      CACHE_TTL
    );

    return checkIn;
  }

  /**
   * Delete a check-in
   * DELETE /api/injuries/:id/checkins/:cid
   */
  async deleteCheckIn(
    injuryId: string,
    checkInId: string
  ): Promise<void> {
    await this.httpClient.delete(
      `/api/injuries/${injuryId}/checkins/${checkInId}`
    );

    // Clear cache
    await this.storage.delete(`${CHECKIN_CACHE_PREFIX}${checkInId}`);
  }

  /**
   * Get today's check-in (if exists)
   */
  async getTodayCheckIn(injuryId: string): Promise<CheckIn | null> {
    const today = new Date().toISOString().split('T')[0];
    const checkIns = await this.getCheckIns(injuryId);
    return checkIns.find(c => c.date === today) || null;
  }

  /**
   * Check if check-in is pending (not yet submitted)
   */
  async hasCheckInPending(injuryId: string): Promise<boolean> {
    const today = new Date().toISOString().split('T')[0];
    const checkIns = await this.getCheckIns(injuryId);
    return !checkIns.some(c => c.date === today && c.synced);
  }

  /**
   * Manually trigger sync of pending check-ins
   */
  async syncPending(): Promise<void> {
    if (!this.syncEngine) return;
    await this.syncEngine.syncPendingItems();
  }

  /**
   * Clear cache
   */
  async clearCache(): Promise<void> {
    console.log('[CheckInClient] Cache cleared');
  }
}
