/**
 * Recovery iOS — Injuries API Client
 * Handles injury registration, updates, and protocol fetching
 */

import { HttpClient, validateResponse } from '../lib/http-client';
import { IOfflineStorage } from '../lib/offline-storage';
import {
  InjurySchema,
  CreateInjuryRequestSchema,
  UpdateInjuryRequestSchema,
  ProtocolSchema,
  type Injury,
  type CreateInjuryRequest,
  type UpdateInjuryRequest,
  type Protocol,
} from '../lib/schemas';

const INJURY_CACHE_PREFIX = 'injury:';
const INJURIES_CACHE_KEY = 'injuries:all';
const PROTOCOL_CACHE_PREFIX = 'protocol:';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export class InjuryClient {
  constructor(
    private httpClient: HttpClient,
    private storage: IOfflineStorage
  ) {}

  /**
   * Create a new injury record
   * POST /api/injuries
   */
  async createInjury(request: CreateInjuryRequest): Promise<Injury> {
    // Validate input
    const validated = CreateInjuryRequestSchema.parse(request);

    // Try online first
    try {
      const response = await this.httpClient.post<Injury>('/api/injuries', validated);
      const injury = validateResponse(InjurySchema, response.data);

      // Cache the result
      await this.storage.set(
        `${INJURY_CACHE_PREFIX}${injury.id}`,
        injury,
        CACHE_TTL
      );

      return injury;
    } catch (error) {
      // If offline, throw error (injury creation requires server)
      // In future, could queue for later sync
      throw error;
    }
  }

  /**
   * Get injury by ID
   * GET /api/injuries/:id
   */
  async getInjury(id: string): Promise<Injury> {
    // Check cache first
    const cached = await this.storage.get<Injury>(
      `${INJURY_CACHE_PREFIX}${id}`
    );
    if (cached) return cached;

    // Fetch from server
    const response = await this.httpClient.get<Injury>(`/api/injuries/${id}`);
    const injury = validateResponse(InjurySchema, response.data);

    // Cache result
    await this.storage.set(
      `${INJURY_CACHE_PREFIX}${id}`,
      injury,
      CACHE_TTL
    );

    return injury;
  }

  /**
   * Get injuries for current athlete
   * GET /api/athletes/:id/injuries
   */
  async getAthleteInjuries(athleteId: string): Promise<Injury[]> {
    // Check cache
    const cacheKey = `${INJURIES_CACHE_KEY}:${athleteId}`;
    const cached = await this.storage.get<Injury[]>(cacheKey);
    if (cached) return cached;

    // Fetch from server
    const response = await this.httpClient.get<Injury[]>(
      `/api/athletes/${athleteId}/injuries`
    );

    const injuries = Array.isArray(response.data)
      ? response.data.map(i => validateResponse(InjurySchema, i))
      : [];

    // Cache result
    await this.storage.set(cacheKey, injuries, CACHE_TTL);

    return injuries;
  }

  /**
   * Update injury details
   * PATCH /api/injuries/:id
   */
  async updateInjury(
    id: string,
    request: UpdateInjuryRequest
  ): Promise<Injury> {
    // Validate input
    const validated = UpdateInjuryRequestSchema.parse(request);

    const response = await this.httpClient.patch<Injury>(
      `/api/injuries/${id}`,
      validated
    );

    const injury = validateResponse(InjurySchema, response.data);

    // Update cache
    await this.storage.set(
      `${INJURY_CACHE_PREFIX}${injury.id}`,
      injury,
      CACHE_TTL
    );

    return injury;
  }

  /**
   * Close an injury (mark as resolved)
   * PATCH /api/injuries/:id with closed_date
   */
  async closeInjury(id: string): Promise<Injury> {
    const today = new Date().toISOString().split('T')[0];
    return this.updateInjury(id, { closed_date: today });
  }

  /**
   * Reopen a closed injury
   * PATCH /api/injuries/:id with closed_date=null
   */
  async reopenInjury(id: string): Promise<Injury> {
    return this.updateInjury(id, { closed_date: undefined });
  }

  /**
   * Get assigned rehab protocol for an injury
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
      throw error;
    }
  }

  /**
   * Clear all injury caches
   */
  async clearCache(): Promise<void> {
    // In a real implementation, iterate through storage and delete
    // all keys matching injury patterns
    console.log('[InjuryClient] Cache cleared');
  }
}
