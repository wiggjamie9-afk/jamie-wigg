import { Redirect, Stack } from 'expo-router';

import { useSession } from '@/lib/session';

export default function AppLayout() {
  const { session, loading } = useSession();

  if (loading) return null;
  if (!session) return <Redirect href="/(auth)/sign-in" />;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#0a0a0c' },
      }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="player" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
      <Stack.Screen name="checkout" options={{ presentation: 'modal' }} />
      <Stack.Screen name="track/[id]" options={{ animation: 'fade' }} />
    </Stack>
  );
}
