/**
 * Recovery iOS — Rehab Protocols API Client
 * Handles protocol fetching, exercise management, and progress tracking
 */

import { HttpClient, validateResponse } from '../lib/http-client';
import { IOfflineStorage } from '../lib/offline-storage';
import {
  ProtocolSchema,
  CreateProtocolRequestSchema,
  type Protocol,
  type CreateProtocolRequest,
  type Exercise,
} from '../lib/schemas';

const PROTOCOL_CACHE_PREFIX = 'protocol:';
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

export class ProtocolClient {
  constructor(
    private httpClient: HttpClient,
    private storage: IOfflineStorage
  ) {}

  /**
   * Get rehab protocol for an injury
   * GET /api/injuries/:id/protocol
   */
  async getProtocol(injuryId: string): Promise<Protocol | null> {
    // Check cache
    const cacheKey = `${PROTOCOL_CACHE_PREFIX}${injuryId}`;
    const cached = await this.storage.get<Protocol>(cacheKey);
    if (cached) return cached;

    try {
      const response = await this.httpClient.get<Protocol>(
        `/api/injuries/${injuryId}/protocol`
      );

      const protocol = validateResponse(ProtocolSchema, response.data);

      // Cache result
      await this.storage.set(cacheKey, protocol, CACHE_TTL);

      return protocol;
    } catch (error: any) {
      // Protocol not yet assigned (404)
      if (error.status === 404) {
        return null;
      }

      // On error, try to return cached data even if stale
      const cached = await this.storage.get<Protocol>(cacheKey);
      if (cached) {
        console.warn('[ProtocolClient] Using stale cache for protocol');
        return cached;
      }

      throw error;
    }
  }

  /**
   * Create a new rehab protocol (provider/coach only)
   * POST /api/protocols
   */
  async createProtocol(request: CreateProtocolRequest): Promise<Protocol> {
    // Validate input
    const validated = CreateProtocolRequestSchema.parse(request);

    const response = await this.httpClient.post<Protocol>(
      '/api/protocols',
      validated
    );

    const protocol = validateResponse(ProtocolSchema, response.data);

    // Cache result
    await this.storage.set(
      `${PROTOCOL_CACHE_PREFIX}${protocol.injury_id}`,
      protocol,
      CACHE_TTL
    );

    return protocol;
  }

  /**
   * Get exercises for a specific day of protocol
   */
  async getExercisesForDay(
    protocol: Protocol,
    dayNumber: number
  ): Promise<Exercise[]> {
    if (!protocol || !protocol.exercises) return [];

    // Simple: divide exercises by days
    const exercisesPerDay = Math.ceil(
      protocol.exercises.length / protocol.estimated_duration_days
    );
    const startIdx = (dayNumber - 1) * exercisesPerDay;
    const endIdx = Math.min(dayNumber * exercisesPerDay, protocol.exercises.length);

    return protocol.exercises.slice(startIdx, endIdx);
  }

  /**
   * Get current day number (from protocol start date)
   */
  getDayNumber(protocol: Protocol): number {
    const startDate = new Date(protocol.start_date);
    const today = new Date();
    const diffMs = today.getTime() - startDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    return Math.max(1, diffDays + 1); // At least day 1
  }

  /**
   * Get protocol progress percentage
   */
  getProgressPercentage(protocol: Protocol): number {
    const dayNumber = this.getDayNumber(protocol);
    const progress = (dayNumber / protocol.estimated_duration_days) * 100;
    return Math.min(100, Math.round(progress));
  }

  /**
   * Check if protocol is completed
   */
  isCompleted(protocol: Protocol): boolean {
    const daysElapsed = this.getDayNumber(protocol);
    return daysElapsed >= protocol.estimated_duration_days;
  }

  /**
   * Get days remaining
   */
  getDaysRemaining(protocol: Protocol): number {
    const dayNumber = this.getDayNumber(protocol);
    const remaining = protocol.estimated_duration_days - dayNumber + 1;
    return Math.max(0, remaining);
  }

  /**
   * Clear cache
   */
  async clearCache(): Promise<void> {
    console.log('[ProtocolClient] Cache cleared');
  }
}
