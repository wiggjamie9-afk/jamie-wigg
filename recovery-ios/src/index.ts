/**
 * Recovery iOS API Client — Main Exports
 * Import everything you need from here
 */

// Client factory & singleton
export {
  RecoveryApiClient,
  RecoveryApiClientConfig,
  initializeApiClient,
  getApiClient,
  resetApiClient,
} from './api/client';

// Domain clients
export { AuthClient } from './api/auth';
export { InjuryClient } from './api/injuries';
export { CheckInClient } from './api/checkins';
export { ProtocolClient } from './api/protocols';
export { AlertClient } from './api/alerts';

// HTTP client
export {
  HttpClient,
  HttpClientConfig,
  HttpResponse,
  HttpClientError,
  validateResponse,
} from './lib/http-client';

// Storage & sync
export {
  IOfflineStorage,
  InMemoryStorage,
  NativeOfflineStorage,
  SyncEngine,
} from './lib/offline-storage';

// Schemas (for validation)
export {
  // Auth
  RegisterRequestSchema,
  SignInRequestSchema,
  AuthResponseSchema,
  type RegisterRequest,
  type SignInRequest,
  type AuthResponse,
  // Athlete
  AthleteProfileSchema,
  CreateAthleteRequestSchema,
  UpdateAthleteRequestSchema,
  type AthleteProfile,
  type CreateAthleteRequest,
  type UpdateAthleteRequest,
  // Injury
  InjurySchema,
  CreateInjuryRequestSchema,
  UpdateInjuryRequestSchema,
  type Injury,
  type CreateInjuryRequest,
  type UpdateInjuryRequest,
  // Protocol
  ProtocolSchema,
  ExerciseSchema,
  CreateProtocolRequestSchema,
  type Protocol,
  type Exercise,
  type CreateProtocolRequest,
  // Check-in
  CheckInSchema,
  CreateCheckInRequestSchema,
  UpdateCheckInRequestSchema,
  type CheckIn,
  type CreateCheckInRequest,
  type UpdateCheckInRequest,
  // Alert
  AlertSchema,
  AlertTypeSchema,
  AlertSeveritySchema,
  type Alert,
  // Notifications
  PushSubscribeRequestSchema,
  NotificationPreferencesSchema,
  UpdateNotificationPreferencesSchema,
  type PushSubscribeRequest,
  type NotificationPreferences,
  type UpdateNotificationPreferences,
  // Pagination
  PaginationQuerySchema,
  type PaginationQuery,
} from './lib/schemas';

// Types
export {
  // User & Auth
  User,
  // Athlete
  AthleteProfile,
  // Injury & Protocol
  Injury,
  Exercise,
  RehabProtocol,
  // Check-in
  DailyCheckIn,
  // Alert
  Alert,
  AlertType,
  AlertSeverity,
  // Push
  PushSubscription,
  NotificationPreferences,
  // API
  ApiResponse,
  SyncQueueItem,
} from './types/index';

/**
 * Quick start example:
 *
 * import { initializeApiClient, getApiClient } from './index';
 *
 * // Initialize once on app launch
 * await initializeApiClient({
 *   baseUrl: 'https://api.rhythmix.app',
 * });
 *
 * // Use anywhere
 * const client = getApiClient();
 * const auth = await client.auth.signIn({ email, password });
 */
