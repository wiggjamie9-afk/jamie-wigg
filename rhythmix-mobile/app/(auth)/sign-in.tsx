import { useState } from 'react';
import { Alert, Platform, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import * as AppleAuthentication from 'expo-apple-authentication';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { AuroraBackdrop } from '@/components/cinematic/AuroraBackdrop';
import { CinematicButton } from '@/components/cinematic/CinematicButton';
import { signInWithApple } from '@/lib/auth-apple';
import { signInWithGoogle } from '@/lib/auth-google';

export default function SignIn() {
  const router = useRouter();
  const [busy, setBusy] = useState<'apple' | 'google' | null>(null);

  const handleApple = async () => {
    setBusy('apple');
    try {
      await signInWithApple();
      router.replace('/(app)/(tabs)');
    } catch (e: any) {
      if (e?.code !== 'ERR_REQUEST_CANCELED') Alert.alert('Sign in failed', e?.message ?? '');
    } finally {
      setBusy(null);
    }
  };

  const handleGoogle = async () => {
    setBusy('google');
    try {
      await signInWithGoogle();
      router.replace('/(app)/(tabs)');
    } catch (e: any) {
      if (e?.code !== '-5') Alert.alert('Sign in failed', e?.message ?? '');
    } finally {
      setBusy(null);
    }
  };

  return (
    <View className="flex-1 bg-ink-50">
      <AuroraBackdrop intensity={0.6} />
      <SafeAreaView style={{ flex: 1 }}>
        <View className="flex-1 justify-end px-6 pb-12">
          <Animated.View entering={FadeInDown.duration(700)}>
            <Text className="mb-2 font-mono text-xs uppercase tracking-[3px] text-signal-cyan">
              Welcome back
            </Text>
            <Text className="font-display text-4xl font-bold text-white">Step into RHYTHMIX</Text>
            <Text className="mt-3 text-ink-700">One tap and you&apos;re in. We don&apos;t do passwords.</Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(150).duration(700)} className="mt-10 gap-3">
            {Platform.OS === 'ios' && (
              <AppleAuthentication.AppleAuthenticationButton
                buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
                buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.WHITE}
                cornerRadius={16}
                style={{ height: 54 }}
                onPress={handleApple}
              />
            )}
            <CinematicButton
              label="Continue with Google"
              variant="ghost"
              loading={busy === 'google'}
              onPress={handleGoogle}
            />
          </Animated.View>

          <Text className="mt-8 text-center text-xs text-ink-600">
            By continuing you agree to our Terms and Privacy.
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
}
