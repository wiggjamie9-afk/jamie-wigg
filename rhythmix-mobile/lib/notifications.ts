import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

import { supabase } from './supabase';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function registerForPushNotifications() {
  if (!Device.isDevice) {
    console.log('[push] skipping — not a physical device');
    return null;
  }

  const { status: existing } = await Notifications.getPermissionsAsync();
  let status = existing;
  if (status !== 'granted') {
    const req = await Notifications.requestPermissionsAsync();
    status = req.status;
  }
  if (status !== 'granted') {
    console.log('[push] permission denied');
    return null;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Default',
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#ff3d7f',
    });
    await Notifications.setNotificationChannelAsync('generation', {
      name: 'Track generation',
      description: 'We let you know when your generated tracks are ready.',
      importance: Notifications.AndroidImportance.HIGH,
      lightColor: '#5cf2ff',
    });
  }

  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
  if (!projectId) {
    console.warn('[push] no EAS projectId in app.json — cannot mint Expo push token');
    return null;
  }

  const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;

  // Persist on the user's row so the backend can target them.
  const { data: sess } = await supabase.auth.getSession();
  if (sess.session) {
    await supabase
      .from('profiles')
      .upsert(
        { id: sess.session.user.id, expo_push_token: token, platform: Platform.OS },
        { onConflict: 'id' },
      );
  }

  return token;
}

export function addNotificationReceivedListener(
  handler: (n: Notifications.Notification) => void,
) {
  return Notifications.addNotificationReceivedListener(handler);
}

export function addNotificationResponseListener(
  handler: (r: Notifications.NotificationResponse) => void,
) {
  return Notifications.addNotificationResponseReceivedListener(handler);
}
