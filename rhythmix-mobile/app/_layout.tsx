import '../global.css';

import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StripeProvider } from '@stripe/stripe-react-native';
import * as SplashScreen from 'expo-splash-screen';

import { configurePurchases } from '@/lib/purchases';
import { registerForPushNotifications } from '@/lib/notifications';
import { checkForUpdates } from '@/lib/updates';
import { useSession } from '@/lib/session';

SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({ duration: 800, fade: true });

export default function RootLayout() {
  const { session } = useSession();

  useEffect(() => {
    SplashScreen.hideAsync();
    checkForUpdates();
  }, []);

  useEffect(() => {
    // Link the platform user to the backend user so push + IAP can find them.
    configurePurchases(session?.user.id);
    if (session) registerForPushNotifications();
  }, [session]);

  return (
    <StripeProvider
      publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ''}
      merchantIdentifier="merchant.com.rhythmix.app"
      urlScheme="rhythmix">
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerShown: false,
              animation: 'fade',
              contentStyle: { backgroundColor: '#0a0a0c' },
            }}
          />
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </StripeProvider>
  );
}
