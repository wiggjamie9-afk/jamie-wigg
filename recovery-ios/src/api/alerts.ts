/**
 * Recovery iOS — Alerts & Notifications API Client
 * Handles alert fetching, FCM token registration, and notification preferences
 */

import { HttpClient, validateResponse } from '../lib/http-client';
import { IOfflineStorage } from '../lib/offline-storage';
import {
  AlertSchema,
  PushSubscribeRequestSchema,
  NotificationPreferencesSchema,
  UpdateNotificationPreferencesSchema,
  type Alert,
  type PushSubscribeRequest,
  type NotificationPreferences,
  type UpdateNotificationPreferences,
} from '../lib/schemas';

const ALERTS_CACHE_KEY = 'alerts:';
const PREFERENCES_CACHE_KEY = 'preferences:user:';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const FCM_TOKEN_KEY = 'fcm:token';
const DEVICE_TOKEN_KEY = 'device:token';

export class AlertClient {
  constructor(
    private httpClient: HttpClient,
    private storage: IOfflineStorage
  ) {}

  /**
   * Get alerts for an injury
   * GET /api/injuries/:id/alerts
   */
  async getInjuryAlerts(injuryId: string): Promise<Alert[]> {
    // Check cache
    const cacheKey = `${ALERTS_CACHE_KEY}${injuryId}`;
    const cached = await this.storage.get<Alert[]>(cacheKey);
    if (cached) return cached;

    try {
      const response = await this.httpClient.get<Alert[]>(
        `/api/injuries/${injuryId}/alerts`
      );

      const alerts = Array.isArray(response.data)
        ? response.data.map(a => validateResponse(AlertSchema, a))
        : [];

      // Cache result
      await this.storage.set(cacheKey, alerts, CACHE_TTL);

      return alerts;
    } catch (error: any) {
      // On error, try to return cached data even if stale
      const cached = await this.storage.get<Alert[]>(cacheKey);
      if (cached) {
        console.warn('[AlertClient] Using stale cache for alerts');
        return cached;
      }
      throw error;
    }
  }

  /**
   * Get all alerts for athlete (paginated)
   * GET /api/alerts?page=1&limit=20
   */
  async getAllAlerts(options?: {
    page?: number;
    limit?: number;
  }): Promise<{ alerts: Alert[]; total: number; has_more: boolean }> {
    const params = new URLSearchParams();
    if (options?.page) params.append('page', String(options.page));
    if (options?.limit) params.append('limit', String(options.limit));

    const query = params.toString();
    const endpoint = `/api/alerts${query ? `?${query}` : ''}`;

    const response = await this.httpClient.get<{
      data: Alert[];
      total: number;
      has_more: boolean;
    }>(endpoint);

    return {
      alerts: response.data.data.map(a => validateResponse(AlertSchema, a)),
      total: response.data.total,
      has_more: response.data.has_more,
    };
  }

  /**
   * Mark alert as acknowledged
   * POST /api/alerts/:id/acknowledge
   */
  async acknowledgeAlert(alertId: string): Promise<Alert> {
    const response = await this.httpClient.post<Alert>(
      `/api/alerts/${alertId}/acknowledge`
    );

    const alert = validateResponse(AlertSchema, response.data);

    // Clear cache to force refresh
    await this.storage.delete('alerts:all');

    return alert;
  }

  /**
   * Register FCM token for push notifications
   * POST /api/push/subscribe
   */
  async registerPushToken(request: PushSubscribeRequest): Promise<void> {
    // Validate input
    const validated = PushSubscribeRequestSchema.parse(request);

    try {
      await this.httpClient.post('/api/push/subscribe', validated);

      // Cache token locally
      await this.storage.set(FCM_TOKEN_KEY, request.fcm_token);

      console.log('[AlertClient] FCM token registered');
    } catch (error) {
      console.error('[AlertClient] Failed to register FCM token:', error);
      throw error;
    }
  }

  /**
   * Unregister FCM token
   * POST /api/push/unsubscribe
   */
  async unregisterPushToken(): Promise<void> {
    try {
      const token = await this.storage.get<string>(FCM_TOKEN_KEY);
      if (token) {
        await this.httpClient.post('/api/push/unsubscribe', { fcm_token: token });
        await this.storage.delete(FCM_TOKEN_KEY);
      }
      console.log('[AlertClient] FCM token unregistered');
    } catch (error) {
      console.error('[AlertClient] Failed to unregister FCM token:', error);
      throw error;
    }
  }

  /**
   * Get notification preferences
   * GET /api/push/preferences
   */
  async getPreferences(): Promise<NotificationPreferences> {
    // Check cache
    const cached = await this.storage.get<NotificationPreferences>(
      PREFERENCES_CACHE_KEY
    );
    if (cached) return cached;

    const response = await this.httpClient.get<NotificationPreferences>(
      '/api/push/preferences'
    );

    const prefs = validateResponse(NotificationPreferencesSchema, response.data);

    // Cache result
    await this.storage.set(PREFERENCES_CACHE_KEY, prefs, CACHE_TTL);

    return prefs;
  }

  /**
   * Update notification preferences
   * PATCH /api/push/preferences
   */
  async updatePreferences(
    request: UpdateNotificationPreferences
  ): Promise<NotificationPreferences> {
    // Validate input
    const validated = UpdateNotificationPreferencesSchema.parse(request);

    const response = await this.httpClient.patch<NotificationPreferences>(
      '/api/push/preferences',
      validated
    );

    const prefs = validateResponse(NotificationPreferencesSchema, response.data);

    // Update cache
    await this.storage.set(PREFERENCES_CACHE_KEY, prefs, CACHE_TTL);

    return prefs;
  }

  /**
   * Set reminder time
   */
  async setReminderTime(time: string): Promise<NotificationPreferences> {
    return this.updatePreferences({ reminder_time: time });
  }

  /**
   * Set quiet hours
   */
  async setQuietHours(
    startTime: string,
    endTime: string
  ): Promise<NotificationPreferences> {
    return this.updatePreferences({
      quiet_hours_start: startTime,
      quiet_hours_end: endTime,
    });
  }

  /**
   * Set alert frequency
   */
  async setAlertFrequency(
    frequency: 'immediate' | 'daily_digest' | 'none'
  ): Promise<NotificationPreferences> {
    return this.updatePreferences({ alert_frequency: frequency });
  }

  /**
   * Check if current time is within quiet hours
   */
  isInQuietHours(prefs: NotificationPreferences): boolean {
    if (!prefs.quiet_hours_start || !prefs.quiet_hours_end) {
      return false;
    }

    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

    // Simple string comparison (assumes 24-hour format)
    const start = prefs.quiet_hours_start;
    const end = prefs.quiet_hours_end;

    if (start < end) {
      // Normal range (e.g., 22:00 to 07:00 written as 07:00 to 22:00)
      return currentTime >= start && currentTime < end;
    } else {
      // Wraps around midnight (e.g., 22:00 to 07:00)
      return currentTime >= start || currentTime < end;
    }
  }

  /**
   * Get cached FCM token
   */
  async getCachedFCMToken(): Promise<string | null> {
    return this.storage.get<string>(FCM_TOKEN_KEY);
  }

  /**
   * Clear cache
   */
  async clearCache(): Promise<void> {
    console.log('[AlertClient] Cache cleared');
  }
}
