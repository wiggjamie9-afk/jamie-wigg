/**
 * Recovery iOS API Client — Usage Examples
 * Demonstrates common workflows for app developers
 */

import {
  initializeApiClient,
  getApiClient,
} from './client';

/**
 * Example 1: Initialize app and authenticate
 */
export async function exampleAppSetup() {
  // Initialize API client once on app launch
  const apiClient = await initializeApiClient({
    baseUrl: 'https://api.rhythmix.app', // or http://localhost:3000 for dev
    timeout: 30000,
    maxRetries: 3,
    useNativeStorage: false, // Set to true for production
  });

  // Try to restore session from cache
  const isAuthenticated = await apiClient.auth.restoreAuth();
  console.log('User authenticated:', isAuthenticated);

  return apiClient;
}

/**
 * Example 2: User registration flow
 */
export async function exampleRegisterUser() {
  const client = getApiClient();

  try {
    const auth = await client.auth.register({
      email: 'new_athlete@example.com',
      password: 'SecurePassword123!',
      sport: 'Soccer',
    });

    console.log('Registration successful!');
    console.log('User ID:', auth.user_id);
    console.log('Token:', auth.token.slice(0, 20) + '...');

    return auth;
  } catch (error) {
    console.error('Registration failed:', error);
    throw error;
  }
}

/**
 * Example 3: User sign-in flow
 */
export async function exampleSignIn() {
  const client = getApiClient();

  try {
    const auth = await client.auth.signIn({
      email: 'athlete@example.com',
      password: 'SecurePassword123!',
    });

    console.log('Sign in successful!');
    console.log('User ID:', auth.user_id);
    console.log('Token expires at:', auth.expires_at);

    return auth;
  } catch (error) {
    console.error('Sign in failed:', error);
    throw error;
  }
}

/**
 * Example 4: Complete onboarding flow
 * (register → create injury → get protocol)
 */
export async function exampleOnboarding() {
  const client = getApiClient();

  // Step 1: Register (or use existing auth)
  const auth = await exampleRegisterUser();

  // Step 2: Get athlete profile (in real app, fetch from /api/athletes/:id)
  // For now, use user_id from auth response
  const athleteId = auth.user_id;

  // Step 3: Register injury
  console.log('Creating injury record...');
  const today = new Date().toISOString().split('T')[0];

  const injury = await client.injuries.createInjury({
    athlete_id: athleteId,
    icd10_code: 'S73.001', // ICD-10 code for hip dislocation
    diagnosis: 'Anterior hip dislocation, initial encounter',
    onset_date: today,
    severity: 3, // 1-5 scale
    location: 'Right Hip',
    baseline_pain: 6,
    baseline_rom: 45,
  });

  console.log('Injury created:', injury.id);
  console.log('Severity:', injury.severity);

  // Step 4: Fetch protocol (if available)
  const protocol = await client.protocols.getProtocol(injury.id);
  if (protocol) {
    console.log('Protocol assigned:', protocol.name);
    console.log('Duration:', protocol.estimated_duration_days, 'days');
    console.log('Exercises:', protocol.exercises.length);
  } else {
    console.log('No protocol assigned yet. Coach will assign one.');
  }

  // Step 5: Register for push notifications
  try {
    await client.alerts.registerPushToken({
      fcm_token: 'fake-fcm-token-from-firebase', // Replace with real token
      device_info: {
        os: 'iOS',
        os_version: '17.0',
        device_model: 'iPhone 15 Pro',
      },
    });
    console.log('Push notifications registered');
  } catch (error) {
    console.warn('Failed to register push:', error);
  }

  // Step 6: Set notification preferences
  await client.alerts.setReminderTime('08:00'); // Daily check-in at 8 AM
  await client.alerts.setQuietHours('22:00', '07:00'); // No notifications 10 PM - 7 AM

  return { auth, injury, protocol };
}

/**
 * Example 5: Daily check-in flow (with offline support)
 */
export async function exampleDailyCheckIn(injuryId: string) {
  const client = getApiClient();

  // Step 1: Check if already checked in today
  const todayCheckIn = await client.checkins.getTodayCheckIn(injuryId);
  if (todayCheckIn) {
    console.log('Already checked in today at', todayCheckIn.created_at);
    return todayCheckIn;
  }

  // Step 2: Get today's protocol exercises
  const protocol = await client.protocols.getProtocol(injuryId);
  const dayNumber = protocol
    ? client.protocols.getDayNumber(protocol)
    : 1;
  const todaysExercises = protocol
    ? await client.protocols.getExercisesForDay(protocol, dayNumber)
    : [];

  console.log(`Day ${dayNumber} exercises:`);
  todaysExercises.forEach((ex, i) => {
    console.log(`${i + 1}. ${ex.name}: ${ex.sets} x ${ex.reps}`);
  });

  // Step 3: Submit check-in (works offline!)
  const today = new Date().toISOString().split('T')[0];

  const checkIn = await client.checkins.submitCheckIn(injuryId, {
    injury_id: injuryId,
    date: today,
    pain_scale: 3, // 0-10
    rom_percentage: 70, // 0-100%
    exercises_completed: todaysExercises.length,
    exercises_total: todaysExercises.length,
    notes: 'Great session, pain reduced from yesterday',
  });

  console.log('Check-in submitted!');
  console.log('ID:', checkIn.id);
  console.log('Synced:', checkIn.synced); // false if offline, true if online

  // Step 4: Check for alerts (pain spike, ROM regression, etc.)
  const alerts = await client.alerts.getInjuryAlerts(injuryId);
  if (alerts.length > 0) {
    console.log('⚠️  Alerts detected:');
    alerts.forEach(alert => {
      console.log(
        `  [${alert.severity}] ${alert.alert_type}: ${alert.message}`
      );
    });
  } else {
    console.log('✅ No alerts');
  }

  return checkIn;
}

/**
 * Example 6: View protocol progress
 */
export async function exampleViewProgress(injuryId: string) {
  const client = getApiClient();

  const protocol = await client.protocols.getProtocol(injuryId);
  if (!protocol) {
    console.log('No protocol assigned');
    return;
  }

  // Get progress metrics
  const dayNumber = client.protocols.getDayNumber(protocol);
  const progress = client.protocols.getProgressPercentage(protocol);
  const daysRemaining = client.protocols.getDaysRemaining(protocol);
  const isCompleted = client.protocols.isCompleted(protocol);

  console.log(`Protocol: ${protocol.name}`);
  console.log(`Current day: ${dayNumber} / ${protocol.estimated_duration_days}`);
  console.log(`Progress: ${progress}%`);
  console.log(`Days remaining: ${daysRemaining}`);
  console.log(`Completed: ${isCompleted}`);

  // Get check-in history
  const checkIns = await client.checkins.getCheckIns(injuryId);
  console.log(`Total check-ins: ${checkIns.length}`);

  if (checkIns.length > 0) {
    const avgPain =
      checkIns.reduce((sum, c) => sum + c.pain_scale, 0) / checkIns.length;
    const avgROM =
      checkIns.reduce((sum, c) => sum + c.rom_percentage, 0) / checkIns.length;

    console.log(`Average pain: ${avgPain.toFixed(1)} / 10`);
    console.log(`Average ROM: ${avgROM.toFixed(1)}%`);

    // Check adherence (exercises completed)
    const adheredDays = checkIns.filter(
      c => c.exercises_completed === c.exercises_total
    ).length;
    const adherence = (adheredDays / checkIns.length) * 100;
    console.log(`Exercise adherence: ${adherence.toFixed(1)}%`);
  }
}

/**
 * Example 7: View alerts and acknowledgment
 */
export async function exampleViewAlerts(injuryId: string) {
  const client = getApiClient();

  // Get unacknowledged alerts
  const alerts = await client.alerts.getInjuryAlerts(injuryId);

  if (alerts.length === 0) {
    console.log('✅ No alerts');
    return;
  }

  console.log(`⚠️  ${alerts.length} alert(s):`);

  for (const alert of alerts) {
    console.log('');
    console.log(`ID: ${alert.id}`);
    console.log(`Type: ${alert.alert_type}`);
    console.log(`Severity: ${alert.severity}`);
    console.log(`Message: ${alert.message}`);
    console.log(`Created: ${alert.created_at}`);
    console.log(`Coach notified: ${alert.coach_notified}`);

    if (!alert.acknowledged_at) {
      // Acknowledge the alert
      try {
        await client.alerts.acknowledgeAlert(alert.id);
        console.log('✓ Alert acknowledged');
      } catch (error) {
        console.error('Failed to acknowledge:', error);
      }
    }
  }
}

/**
 * Example 8: Notification preferences
 */
export async function exampleNotificationPreferences() {
  const client = getApiClient();

  // Get current preferences
  const prefs = await client.alerts.getPreferences();
  console.log('Current preferences:');
  console.log('  Reminder time:', prefs.reminder_time);
  console.log('  Quiet hours:', prefs.quiet_hours_start, '-', prefs.quiet_hours_end);
  console.log('  Alert frequency:', prefs.alert_frequency);

  // Check if current time is in quiet hours
  const inQuietHours = client.alerts.isInQuietHours(prefs);
  console.log('  Currently in quiet hours:', inQuietHours);

  // Update preferences
  await client.alerts.updatePreferences({
    reminder_time: '09:00', // Change reminder to 9 AM
    alert_frequency: 'immediate', // Receive alerts immediately
  });
  console.log('✓ Preferences updated');
}

/**
 * Example 9: Sign out
 */
export async function exampleSignOut() {
  const client = getApiClient();

  console.log('Signing out...');
  await client.auth.signOut();
  console.log('✓ Signed out');

  const isAuth = await client.auth.isAuthenticated();
  console.log('Authenticated:', isAuth);
}

/**
 * Example 10: Manual sync of offline queue
 */
export async function exampleManualSync() {
  const client = getApiClient();

  console.log('Checking for pending sync items...');

  // Get pending items from storage
  const pending = await client.getStorage().getPendingSyncItems();
  console.log(`Found ${pending.length} pending items`);

  if (pending.length > 0) {
    pending.forEach(item => {
      console.log(`  - ${item.method} ${item.endpoint}`);
      console.log(`    Retries: ${item.retries}/${item.max_retries}`);
    });

    // Manually trigger sync
    console.log('Triggering sync...');
    await client.checkins.syncPending();
    console.log('✓ Sync complete');
  }
}
