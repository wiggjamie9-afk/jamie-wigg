# Recovery iOS API Client

A type-safe, offline-first React Native / Capacitor API client for the Recovery iOS app. Features JWT authentication, Zod validation, offline sync queue, and automatic retry logic.

## Architecture

```
RecoveryApiClient (main entry point)
├── AuthClient          (registration, sign-in, token management)
├── InjuryClient        (injury CRUD, protocol fetching)
├── CheckInClient       (daily check-in submissions, offline queue)
├── ProtocolClient      (rehab protocol management, progress tracking)
└── AlertClient         (alerts, FCM registration, notification preferences)

HTTP Layer:
├── HttpClient          (JWT auth, retry logic, error handling)
└── validateResponse()  (Zod schema validation)

Storage Layer:
├── IOfflineStorage     (abstract interface)
├── InMemoryStorage     (development: in-memory, no persistence)
├── NativeOfflineStorage (production: SQLite/Realm/AsyncStorage stub)
└── SyncEngine          (offline queue processing, auto-retry)
```

## Installation

### Dependencies

```bash
npm install zod  # For schema validation
```

### Optional: Native Storage Setup

For production, implement native storage (SQLite/Realm/AsyncStorage):

```bash
# React Native (AsyncStorage):
npm install @react-native-async-storage/async-storage

# React Native (Realm):
npm install realm

# Capacitor Network (for online status):
npm install @capacitor/network
```

## Quick Start

### Initialize Client

```typescript
import { initializeApiClient } from './api/client';

async function setupApp() {
  const apiClient = await initializeApiClient({
    baseUrl: 'https://api.rhythmix.app', // or http://localhost:3000
    timeout: 30000,
    maxRetries: 3,
    useNativeStorage: false, // true for production
  });

  return apiClient;
}
```

### Authentication

```typescript
import { getApiClient } from './api/client';

const client = getApiClient();

// Register
try {
  const auth = await client.auth.register({
    email: 'athlete@example.com',
    password: 'SecurePassword123',
    sport: 'Basketball',
  });
  console.log('Registered:', auth.user_id, auth.token);
} catch (error) {
  console.error('Registration failed:', error);
}

// Sign in
try {
  const auth = await client.auth.signIn({
    email: 'athlete@example.com',
    password: 'SecurePassword123',
  });
  console.log('Signed in:', auth.user_id);
} catch (error) {
  console.error('Sign in failed:', error);
}

// Check authentication
const isAuth = await client.auth.isAuthenticated();
console.log('Authenticated:', isAuth);

// Sign out
await client.auth.signOut();
```

### Create Injury

```typescript
// After registration, create athlete profile
const profile = await client.auth.getCachedUser();
const athleteId = profile?.user_id; // In real app, fetch athlete ID

// Register injury
try {
  const injury = await client.injuries.createInjury({
    athlete_id: athleteId,
    icd10_code: 'S73.0', // Hip dislocation (example ICD-10)
    diagnosis: 'Anterior hip dislocation',
    onset_date: '2024-06-20',
    severity: 3, // 1-5 scale
    location: 'Hip',
    baseline_pain: 5,
    baseline_rom: 45,
  });
  console.log('Injury created:', injury.id);
} catch (error) {
  console.error('Failed to create injury:', error);
}
```

### Daily Check-in (with Offline Support)

```typescript
// Submit daily check-in
try {
  const today = new Date().toISOString().split('T')[0];
  
  const checkIn = await client.checkins.submitCheckIn(injuryId, {
    injury_id: injuryId,
    date: today,
    pain_scale: 3,        // 0-10
    rom_percentage: 65,   // 0-100%
    exercises_completed: 4,
    exercises_total: 5,
    notes: 'Feeling better, slight stiffness',
  });
  
  console.log('Check-in submitted:', checkIn.id);
  console.log('Synced:', checkIn.synced); // false if offline
} catch (error) {
  console.error('Failed to submit check-in:', error);
}

// Get today's check-in (if exists)
const todayCheckIn = await client.checkins.getTodayCheckIn(injuryId);
if (todayCheckIn) {
  console.log('Already checked in today:', todayCheckIn.pain_scale);
}

// Check if pending check-in exists
const hasPending = await client.checkins.hasCheckInPending(injuryId);
console.log('Pending check-in:', hasPending);

// List check-ins with date range
const checkIns = await client.checkins.getCheckIns(injuryId, {
  startDate: '2024-06-01',
  endDate: '2024-06-30',
  limit: 100,
});
console.log('Check-ins:', checkIns.length);

// Manually sync pending check-ins
await client.checkins.syncPending();
```

### Protocols & Exercise Tracking

```typescript
// Get protocol for injury
const protocol = await client.protocols.getProtocol(injuryId);

if (protocol) {
  console.log('Protocol:', protocol.name);
  console.log('Duration:', protocol.estimated_duration_days, 'days');
  console.log('Exercises:', protocol.exercises.length);
  
  // Get today's exercises
  const dayNumber = client.protocols.getDayNumber(protocol);
  const todaysExercises = await client.protocols.getExercisesForDay(
    protocol,
    dayNumber
  );
  
  console.log('Day', dayNumber, 'Exercises:');
  todaysExercises.forEach(ex => {
    console.log(`- ${ex.name}: ${ex.sets} x ${ex.reps}`);
  });
  
  // Get progress
  console.log('Progress:', client.protocols.getProgressPercentage(protocol), '%');
  console.log('Days remaining:', client.protocols.getDaysRemaining(protocol));
  console.log('Completed:', client.protocols.isCompleted(protocol));
}
```

### Alerts & Notifications

```typescript
// Get alerts for injury
const alerts = await client.alerts.getInjuryAlerts(injuryId);
console.log('Alerts:', alerts.length);

alerts.forEach(alert => {
  console.log(`[${alert.severity}]`, alert.alert_type, ':', alert.message);
});

// Acknowledge an alert
await client.alerts.acknowledgeAlert(alertId);

// Register FCM token (call on app launch)
await client.alerts.registerPushToken({
  fcm_token: 'device-token-from-firebase',
  device_info: {
    os: 'iOS',
    os_version: '17.0',
    device_model: 'iPhone 15 Pro',
  },
});

// Get notification preferences
const prefs = await client.alerts.getPreferences();
console.log('Reminder time:', prefs.reminder_time); // "08:00"

// Update reminder time
await client.alerts.setReminderTime('09:00');

// Set quiet hours (no notifications 10 PM to 7 AM)
await client.alerts.setQuietHours('22:00', '07:00');

// Set alert frequency
await client.alerts.setAlertFrequency('daily_digest');

// Check if current time is in quiet hours
const inQuietHours = client.alerts.isInQuietHours(prefs);
console.log('In quiet hours:', inQuietHours);
```

## Offline Support

The client automatically queues failed requests for later sync:

### How It Works

1. **Check-in submitted offline** → Stored locally, marked `synced: false`
2. **Request enqueued** → Added to sync queue with retry metadata
3. **Connection regained** → Auto-sync triggers (default: every 5 seconds)
4. **Retry logic** → Exponential backoff (1s, 2s, 4s), max 3 retries
5. **Sync status** → UI can display pending/synced badge

### Manual Sync

```typescript
// Manually trigger sync (if auto-sync not running)
await client.checkins.syncPending();
```

### Disable Auto-sync

```typescript
client.checkins.stopAutoSync();
```

## Error Handling

```typescript
import { HttpClientError } from './lib/http-client';

try {
  await client.injuries.createInjury(data);
} catch (error) {
  if (error instanceof HttpClientError) {
    console.log('Status:', error.status);
    console.log('Message:', error.statusText);
    
    if (error.isClientError()) {
      console.error('Validation error:', error.data);
    } else if (error.isServerError()) {
      console.error('Server error, queued for retry');
    } else if (error.isNetworkError()) {
      console.error('No internet connection');
    }
  }
}
```

## Type Safety

All API responses are validated with Zod schemas:

```typescript
import { CheckInSchema, type CheckIn } from './lib/schemas';

// Type-safe return values
const checkIn: CheckIn = await client.checkins.submitCheckIn(...);

// IDE autocomplete:
// checkIn.id
// checkIn.pain_scale
// checkIn.synced
```

## Caching

All GET endpoints cache results (5-15 min TTL):

```typescript
// First call: fetches from server, caches result
const injury = await client.injuries.getInjury(id);

// Second call: returns cached result (if <TTL)
const same = await client.injuries.getInjury(id); // instant

// Force refresh
await client.injuries.clearCache();
```

## Testing

### Mock HTTP Client

```typescript
class MockHttpClient extends HttpClient {
  async performRequest(method, endpoint, body, options) {
    // Return mock data
    return {
      status: 200,
      statusText: 'OK',
      data: { id: 'mock-id', ... },
      headers: {},
    };
  }
}
```

### Mock Storage

```typescript
import { InMemoryStorage } from './lib/offline-storage';

const storage = new InMemoryStorage();
const auth = new AuthClient(mockHttpClient, storage);
```

## API Reference

### AuthClient

- `register(request)` → `AuthResponse`
- `signIn(request)` → `AuthResponse`
- `signOut()` → `void`
- `getToken()` → `string | null`
- `getCachedUser()` → `AuthResponse | null`
- `restoreAuth()` → `boolean`
- `refreshToken()` → `AuthResponse`
- `isAuthenticated()` → `boolean`

### InjuryClient

- `createInjury(request)` → `Injury`
- `getInjury(id)` → `Injury`
- `getAthleteInjuries(athleteId)` → `Injury[]`
- `updateInjury(id, request)` → `Injury`
- `closeInjury(id)` → `Injury`
- `reopenInjury(id)` → `Injury`
- `getProtocol(injuryId)` → `Protocol | null`
- `clearCache()` → `void`

### CheckInClient

- `submitCheckIn(injuryId, request)` → `CheckIn`
- `getCheckIns(injuryId, options?)` → `CheckIn[]`
- `updateCheckIn(injuryId, checkInId, request)` → `CheckIn`
- `deleteCheckIn(injuryId, checkInId)` → `void`
- `getTodayCheckIn(injuryId)` → `CheckIn | null`
- `hasCheckInPending(injuryId)` → `boolean`
- `syncPending()` → `void`
- `startAutoSync()` → `void`
- `stopAutoSync()` → `void`
- `clearCache()` → `void`

### ProtocolClient

- `getProtocol(injuryId)` → `Protocol | null`
- `createProtocol(request)` → `Protocol`
- `getExercisesForDay(protocol, dayNumber)` → `Exercise[]`
- `getDayNumber(protocol)` → `number`
- `getProgressPercentage(protocol)` → `number`
- `isCompleted(protocol)` → `boolean`
- `getDaysRemaining(protocol)` → `number`
- `clearCache()` → `void`

### AlertClient

- `getInjuryAlerts(injuryId)` → `Alert[]`
- `getAllAlerts(options?)` → `{ alerts, total, has_more }`
- `acknowledgeAlert(alertId)` → `Alert`
- `registerPushToken(request)` → `void`
- `unregisterPushToken()` → `void`
- `getPreferences()` → `NotificationPreferences`
- `updatePreferences(request)` → `NotificationPreferences`
- `setReminderTime(time)` → `NotificationPreferences`
- `setQuietHours(start, end)` → `NotificationPreferences`
- `setAlertFrequency(freq)` → `NotificationPreferences`
- `isInQuietHours(prefs)` → `boolean`
- `getCachedFCMToken()` → `string | null`
- `clearCache()` → `void`

## TODO: Production Integration

- [ ] Replace `NativeOfflineStorage` stub with actual SQLite/Realm implementation
- [ ] Integrate Capacitor Network plugin for online status detection
- [ ] Add Firebase Cloud Messaging (FCM) integration
- [ ] Add Sentry/error reporting
- [ ] Add request/response logging middleware
- [ ] Add metrics/analytics
- [ ] Add request signing (if needed)
- [ ] Add biometric unlock for sensitive endpoints
- [ ] Add rate limiting / throttling per endpoint
- [ ] Add request deduplication
- [ ] Implement token refresh middleware
- [ ] Add offline queue persistence (currently in-memory)

## License

Private — RHYTHMIX Recovery iOS App
