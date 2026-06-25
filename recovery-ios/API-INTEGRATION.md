# Recovery iOS API Client Integration Guide

This guide walks through integrating the API client into the Recovery iOS app (React Native + Capacitor).

## Directory Structure

```
recovery-ios/
├── src/
│   ├── api/
│   │   ├── auth.ts              # Authentication endpoints
│   │   ├── injuries.ts          # Injury CRUD + protocol fetching
│   │   ├── checkins.ts          # Daily check-ins + offline queue
│   │   ├── protocols.ts         # Rehab protocols + progress tracking
│   │   ├── alerts.ts            # Alerts + push notifications
│   │   ├── client.ts            # Main API client factory
│   │   ├── example.ts           # Usage examples
│   │   └── README.md            # API documentation
│   ├── lib/
│   │   ├── http-client.ts       # HTTP layer with JWT + retry logic
│   │   ├── schemas.ts           # Zod validation schemas
│   │   └── offline-storage.ts   # Offline storage abstraction
│   └── types/
│       └── index.ts             # Shared type definitions
└── API-INTEGRATION.md           # This file
```

## Step 1: Install Dependencies

```bash
cd recovery-ios
npm install
```

This installs:
- `zod` — Schema validation
- `@capacitor/network` — Online/offline detection
- TypeScript dependencies

## Step 2: Initialize API Client in App Root

### For React Native (expo-router or React Navigation)

**File: `src/screens/RootLayout.tsx`**

```typescript
import { useEffect, useState } from 'react';
import { initializeApiClient, getApiClient } from '../api/client';

export default function RootLayout() {
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function setupApp() {
      try {
        // Initialize API client once on app launch
        await initializeApiClient({
          baseUrl: __DEV__
            ? 'http://localhost:3000'
            : 'https://api.rhythmix.app',
          timeout: 30000,
          maxRetries: 3,
          useNativeStorage: !__DEV__, // Use native storage in production
          storageDbName: 'recovery-ios',
        });

        console.log('[RootLayout] API client initialized');
        setInitialized(true);
      } catch (err) {
        console.error('[RootLayout] API init failed:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
      }
    }

    setupApp();
  }, []);

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Failed to initialize app: {error.message}</Text>
      </View>
    );
  }

  if (!initialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Continue with normal app layout
  return <Stack screenOptions={{ headerShown: false }} />;
}
```

### For Capacitor (Ionic React / Vue)

**File: `src/App.tsx` or `src/main.tsx`**

```typescript
import { useEffect, useState } from 'react';
import { initializeApiClient } from './api/client';
import { Loader } from './components/Loader';

export function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        await initializeApiClient({
          baseUrl: import.meta.env.VITE_API_URL || 'https://api.rhythmix.app',
          useNativeStorage: true,
        });
        setReady(true);
      } catch (error) {
        console.error('Failed to initialize API:', error);
        // Handle gracefully or show error screen
      }
    }

    init();
  }, []);

  if (!ready) return <Loader />;

  return <RouterComponent />;
}
```

## Step 3: Authentication Screen Integration

### Sign Up Screen

**File: `src/screens/SignUpScreen.tsx`**

```typescript
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { getApiClient } from '../api/client';

export function SignUpScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sport, setSport] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async () => {
    if (!email || !password || !sport) {
      setError('All fields are required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const client = getApiClient();
      const auth = await client.auth.register({
        email,
        password,
        sport,
      });

      console.log('Signup successful:', auth.user_id);

      // Navigate to onboarding
      navigation.navigate('Onboarding', { userId: auth.user_id });
    } catch (err: any) {
      setError(err.message || 'Sign up failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        Create Account
      </Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        editable={!loading}
        style={{ marginBottom: 10, padding: 10, borderWidth: 1 }}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!loading}
        style={{ marginBottom: 10, padding: 10, borderWidth: 1 }}
      />

      <TextInput
        placeholder="Sport (e.g., Basketball)"
        value={sport}
        onChangeText={setSport}
        editable={!loading}
        style={{ marginBottom: 20, padding: 10, borderWidth: 1 }}
      />

      {error && <Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text>}

      <TouchableOpacity
        onPress={handleSignUp}
        disabled={loading}
        style={{ padding: 15, backgroundColor: '#007AFF', borderRadius: 8 }}
      >
        <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
          {loading ? 'Creating Account...' : 'Sign Up'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
```

### Sign In Screen

```typescript
export function SignInScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    setLoading(true);
    setError(null);

    try {
      const client = getApiClient();
      const auth = await client.auth.signIn({ email, password });

      console.log('Signed in:', auth.user_id);
      navigation.navigate('Home');
    } catch (err: any) {
      setError(err.message || 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    // Similar to SignUpScreen...
  );
}
```

## Step 4: Onboarding Flow (Injury Intake)

**File: `src/screens/OnboardingScreen.tsx`**

```typescript
import React, { useState } from 'react';
import { getApiClient } from '../api/client';

export function OnboardingScreen({ route, navigation }: any) {
  const { userId } = route.params;
  const [step, setStep] = useState(1);

  // Step 2: Injury intake
  const [icd10Code, setIcd10Code] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [severity, setSeverity] = useState(3);
  const [location, setLocation] = useState('');
  const [baselinePain, setBaselinePain] = useState(5);
  const [baselineROM, setBaselineROM] = useState(50);

  const handleCreateInjury = async () => {
    try {
      const client = getApiClient();

      const today = new Date().toISOString().split('T')[0];
      const injury = await client.injuries.createInjury({
        athlete_id: userId,
        icd10_code: icd10Code,
        diagnosis,
        onset_date: today,
        severity,
        location,
        baseline_pain: baselinePain,
        baseline_rom: baselineROM,
      });

      console.log('Injury created:', injury.id);

      // Step 3: Request notification permissions
      setStep(3);
    } catch (error) {
      console.error('Failed to create injury:', error);
    }
  };

  const handleComplete = async () => {
    try {
      const client = getApiClient();

      // Register for push notifications
      // (This is a stub—implement with real FCM token)
      await client.alerts.registerPushToken({
        fcm_token: 'device-token-here',
        device_info: {
          os: 'iOS',
          os_version: '17.0',
          device_model: 'iPhone',
        },
      });

      // Navigate to home
      navigation.navigate('Home');
    } catch (error) {
      console.error('Failed to register push:', error);
      // Continue anyway
      navigation.navigate('Home');
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      {step === 1 && (
        <>
          <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
            Welcome to Recovery
          </Text>
          <Text style={{ marginBottom: 20 }}>Let's set up your rehab plan</Text>
          <TouchableOpacity
            onPress={() => setStep(2)}
            style={{ padding: 15, backgroundColor: '#007AFF', borderRadius: 8 }}
          >
            <Text style={{ color: 'white', textAlign: 'center' }}>Continue</Text>
          </TouchableOpacity>
        </>
      )}

      {step === 2 && (
        <>
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>
            Injury Details
          </Text>
          {/* ICD-10 Picker, severity, location, ROM fields */}
          <TouchableOpacity
            onPress={handleCreateInjury}
            style={{ padding: 15, backgroundColor: '#007AFF', borderRadius: 8 }}
          >
            <Text style={{ color: 'white', textAlign: 'center' }}>
              Create Injury Record
            </Text>
          </TouchableOpacity>
        </>
      )}

      {step === 3 && (
        <>
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>
            Enable Notifications
          </Text>
          <Text style={{ marginBottom: 20 }}>
            Get reminders for daily check-ins and alerts
          </Text>
          <TouchableOpacity
            onPress={handleComplete}
            style={{ padding: 15, backgroundColor: '#34C759', borderRadius: 8 }}
          >
            <Text style={{ color: 'white', textAlign: 'center' }}>
              Get Started
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}
```

## Step 5: Daily Check-in Screen

**File: `src/screens/CheckInScreen.tsx`**

```typescript
import React, { useState, useEffect } from 'react';
import { View, TextInput, Slider, TouchableOpacity, Text } from 'react-native';
import { getApiClient } from '../api/client';

export function CheckInScreen({ route }: any) {
  const { injuryId } = route.params;
  const [painScale, setPainScale] = useState(5);
  const [rom, setROM] = useState(50);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [protocol, setProtocol] = useState<any>(null);

  useEffect(() => {
    loadProtocol();
  }, []);

  const loadProtocol = async () => {
    try {
      const client = getApiClient();
      const proto = await client.protocols.getProtocol(injuryId);
      setProtocol(proto);
    } catch (err) {
      console.warn('Failed to load protocol:', err);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const client = getApiClient();
      const today = new Date().toISOString().split('T')[0];

      // Get today's exercise count from protocol
      const exercisesTotal = protocol
        ? await client.protocols.getExercisesForDay(
            protocol,
            client.protocols.getDayNumber(protocol)
          ).then(ex => ex.length)
        : 0;

      const checkIn = await client.checkins.submitCheckIn(injuryId, {
        injury_id: injuryId,
        date: today,
        pain_scale: Math.round(painScale),
        rom_percentage: Math.round(rom),
        exercises_completed: exercisesTotal, // TODO: let user select
        exercises_total: exercisesTotal,
        notes,
      });

      console.log('Check-in submitted:', checkIn.id);
      console.log('Synced:', checkIn.synced);

      // Show success message
      alert(
        checkIn.synced
          ? '✓ Check-in submitted'
          : '✓ Check-in saved (will sync when online)'
      );

      // Navigate back
    } catch (err: any) {
      setError(err.message || 'Failed to submit check-in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        Daily Check-in
      </Text>

      <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>
        Pain Level: {Math.round(painScale)}/10
      </Text>
      <Slider
        style={{ height: 40, marginBottom: 20 }}
        minimumValue={0}
        maximumValue={10}
        value={painScale}
        onValueChange={setPainScale}
      />

      <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>
        Range of Motion: {Math.round(rom)}%
      </Text>
      <Slider
        style={{ height: 40, marginBottom: 20 }}
        minimumValue={0}
        maximumValue={100}
        value={rom}
        onValueChange={setROM}
      />

      <TextInput
        placeholder="Notes (optional)"
        value={notes}
        onChangeText={setNotes}
        multiline
        numberOfLines={4}
        editable={!loading}
        style={{
          marginBottom: 20,
          padding: 10,
          borderWidth: 1,
          borderRadius: 8,
        }}
      />

      {error && <Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text>}

      <TouchableOpacity
        onPress={handleSubmit}
        disabled={loading}
        style={{
          padding: 15,
          backgroundColor: '#007AFF',
          borderRadius: 8,
          opacity: loading ? 0.5 : 1,
        }}
      >
        <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
          {loading ? 'Submitting...' : 'Submit Check-in'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
```

## Step 6: Home Screen with Alerts & Protocol Progress

**File: `src/screens/HomeScreen.tsx`**

```typescript
import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, Text, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getApiClient } from '../api/client';

export function HomeScreen({ navigation }: any) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    try {
      const client = getApiClient();

      // Get current injuries (in real app, fetch athlete profile first)
      // For now, use stored injury from onboarding
      const injuryId = await client.getStorage().get('current_injury_id');

      if (!injuryId) {
        setData({ needsOnboarding: true });
        return;
      }

      // Get protocol
      const protocol = await client.protocols.getProtocol(injuryId);

      // Get today's check-in
      const todayCheckIn = await client.checkins.getTodayCheckIn(injuryId);

      // Get recent alerts
      const alerts = await client.alerts.getInjuryAlerts(injuryId);

      setData({
        injuryId,
        protocol,
        todayCheckIn,
        alerts: alerts.slice(0, 3), // Show last 3
      });
    } catch (error) {
      console.error('Failed to load home data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (data?.needsOnboarding) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Complete onboarding to begin</Text>
      </View>
    );
  }

  return (
    <FlatList
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
      data={[
        { type: 'header' },
        data.protocol ? { type: 'protocol', data: data.protocol } : null,
        data.todayCheckIn ? { type: 'today', data: data.todayCheckIn } : null,
        ...data.alerts.map((a: any) => ({ type: 'alert', data: a })),
      ].filter(Boolean)}
      renderItem={({ item }) => {
        if (item.type === 'header') {
          return (
            <View style={{ padding: 20 }}>
              <Text style={{ fontSize: 28, fontWeight: 'bold' }}>Recovery</Text>
              <Text style={{ color: '#666', marginTop: 5 }}>
                Track your progress daily
              </Text>
            </View>
          );
        }

        if (item.type === 'protocol') {
          const progress = Math.round(
            (getApiClient().protocols.getDayNumber(item.data) /
              item.data.estimated_duration_days) *
              100
          );

          return (
            <View style={{ padding: 15, marginHorizontal: 20, marginBottom: 15 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                {item.data.name}
              </Text>
              <View
                style={{
                  height: 10,
                  backgroundColor: '#ddd',
                  borderRadius: 5,
                  marginTop: 10,
                  overflow: 'hidden',
                }}
              >
                <View
                  style={{
                    height: '100%',
                    backgroundColor: '#34C759',
                    width: `${progress}%`,
                  }}
                />
              </View>
              <Text style={{ color: '#666', marginTop: 5 }}>
                {progress}% Complete • Day{' '}
                {getApiClient().protocols.getDayNumber(item.data)} of{' '}
                {item.data.estimated_duration_days}
              </Text>
            </View>
          );
        }

        if (item.type === 'alert') {
          return (
            <View
              style={{
                padding: 15,
                marginHorizontal: 20,
                marginBottom: 10,
                backgroundColor: '#FFF3CD',
                borderRadius: 8,
                borderLeftWidth: 4,
                borderLeftColor: '#FFC107',
              }}
            >
              <Text style={{ fontWeight: 'bold' }}>{item.data.alert_type}</Text>
              <Text style={{ marginTop: 5, color: '#333' }}>
                {item.data.message}
              </Text>
            </View>
          );
        }

        return null;
      }}
    />
  );
}
```

## Step 7: Settings for Notifications

**File: `src/screens/SettingsScreen.tsx`**

```typescript
import React, { useState, useEffect } from 'react';
import { View, Text, Switch, TouchableOpacity } from 'react-native';
import { getApiClient } from '../api/client';

export function SettingsScreen({ navigation }: any) {
  const [prefs, setPrefs] = useState<any>(null);
  const [reminderTime, setReminderTime] = useState('08:00');
  const [quietHoursEnabled, setQuietHoursEnabled] = useState(false);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const client = getApiClient();
      const p = await client.alerts.getPreferences();
      setPrefs(p);
      setReminderTime(p.reminder_time);
      setQuietHoursEnabled(!!p.quiet_hours_start);
    } catch (error) {
      console.error('Failed to load preferences:', error);
    }
  };

  const updateReminderTime = async (time: string) => {
    try {
      const client = getApiClient();
      await client.alerts.setReminderTime(time);
      setReminderTime(time);
    } catch (error) {
      console.error('Failed to update reminder time:', error);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        Settings
      </Text>

      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>
          Daily Check-in Reminder
        </Text>
        <Text style={{ color: '#666', marginBottom: 10 }}>{reminderTime}</Text>
        {/* TODO: Time picker component */}
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <Text style={{ fontWeight: 'bold' }}>Quiet Hours</Text>
        <Switch
          value={quietHoursEnabled}
          onValueChange={setQuietHoursEnabled}
        />
      </View>

      {quietHoursEnabled && (
        <View style={{ marginBottom: 20, paddingLeft: 20 }}>
          <Text style={{ color: '#666' }}>10:00 PM - 7:00 AM</Text>
        </View>
      )}

      <TouchableOpacity
        style={{ padding: 15, backgroundColor: '#FF3B30', borderRadius: 8 }}
        onPress={async () => {
          const client = getApiClient();
          await client.auth.signOut();
          navigation.navigate('SignIn');
        }}
      >
        <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
          Sign Out
        </Text>
      </TouchableOpacity>
    </View>
  );
}
```

## Step 8: Implement Native Storage (Production)

Replace the stub `NativeOfflineStorage` with actual implementation:

### Option A: AsyncStorage (simplest)

**File: `src/lib/offline-storage.ts`** (replace NativeOfflineStorage)

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

export class NativeOfflineStorage implements IOfflineStorage {
  async init(): Promise<void> {
    // No special init needed for AsyncStorage
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    const data = {
      value,
      expires: ttl ? Date.now() + ttl : null,
    };
    await AsyncStorage.setItem(key, JSON.stringify(data));
  }

  async get<T = any>(key: string): Promise<T | null> {
    const item = await AsyncStorage.getItem(key);
    if (!item) return null;

    const { value, expires } = JSON.parse(item);
    if (expires && expires < Date.now()) {
      await AsyncStorage.removeItem(key);
      return null;
    }

    return value as T;
  }

  // ... implement remaining methods
}
```

### Option B: Realm (better performance)

```bash
npm install realm
```

**File: `src/lib/offline-storage.ts`**

```typescript
import Realm from 'realm';

const CacheEntrySchema = {
  name: 'CacheEntry',
  properties: {
    key: 'string',
    value: 'string',
    expires: 'int?',
  },
  primaryKey: 'key',
};

export class NativeOfflineStorage implements IOfflineStorage {
  private realm?: Realm;

  async init(): Promise<void> {
    this.realm = await Realm.open({
      schema: [CacheEntrySchema, SyncQueueItemSchema],
    });
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    if (!this.realm) throw new Error('Storage not initialized');

    this.realm.write(() => {
      this.realm!.create(
        'CacheEntry',
        {
          key,
          value: JSON.stringify(value),
          expires: ttl ? Date.now() + ttl : null,
        },
        'modified'
      );
    });
  }

  // ... implement remaining methods
}
```

## Step 9: Integrate FCM for Push Notifications

### iOS Setup (Capacitor + Firebase)

```bash
npm install @capacitor/push-notifications
npx cap add ios
```

**File: `src/lib/notifications.ts`**

```typescript
import { PushNotifications } from '@capacitor/push-notifications';
import { getApiClient } from '../api/client';

export async function setupPushNotifications() {
  try {
    // Request permissions
    let permStatus = await PushNotifications.checkPermissions();
    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions();
    }

    if (permStatus.receive !== 'granted') {
      throw new Error('Push notification permission denied');
    }

    // Register with FCM
    await PushNotifications.register();

    // Listen for token
    PushNotifications.addListener('registration', async (token) => {
      console.log('[Notifications] FCM token received:', token.value.slice(0, 20));

      try {
        const client = getApiClient();
        await client.alerts.registerPushToken({
          fcm_token: token.value,
          device_info: {
            os: 'iOS',
            os_version: '17.0', // Get from device
            device_model: 'iPhone', // Get from device
          },
        });
      } catch (error) {
        console.error('[Notifications] Failed to register token:', error);
      }
    });

    // Listen for messages
    PushNotifications.addListener('pushNotificationReceived', (event) => {
      console.log('[Notifications] Received:', event);
    });

    console.log('[Notifications] Setup complete');
  } catch (error) {
    console.error('[Notifications] Setup failed:', error);
  }
}
```

Call in `RootLayout.tsx`:

```typescript
import { setupPushNotifications } from '../lib/notifications';

useEffect(() => {
  setupPushNotifications();
}, []);
```

## Testing Checklist

- [ ] Initialize client on app launch
- [ ] Register new user
- [ ] Sign in existing user
- [ ] Restore session from cache
- [ ] Create injury record
- [ ] Submit daily check-in (online)
- [ ] Submit daily check-in (offline)
- [ ] Verify check-in syncs when online
- [ ] View protocol and exercises
- [ ] Check and acknowledge alerts
- [ ] Register FCM token
- [ ] Receive push notification
- [ ] Update notification preferences
- [ ] Sign out

## Troubleshooting

### "API client not initialized"

Call `initializeApiClient()` in app root before using `getApiClient()`.

### Offline check-ins not syncing

1. Check `console.log` for sync engine messages
2. Verify internet connection
3. Call `client.checkins.syncPending()` manually
4. Check network activity in DevTools

### Type errors in IDE

Ensure `tsconfig.json` has `strict: true` and `noImplicitAny: false`.

## Next Steps

1. Implement native storage (SQLite / Realm)
2. Add FCM integration
3. Add error reporting (Sentry)
4. Add analytics
5. Implement biometric unlock
6. Add request logging/debugging UI
7. Add end-to-end tests

---

**Questions?** See `/src/api/README.md` for full API documentation.
