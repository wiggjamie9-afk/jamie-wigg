import { useState } from 'react';
import { Alert, Platform, Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuroraBackdrop } from '@/components/cinematic/AuroraBackdrop';
import { CinematicButton } from '@/components/cinematic/CinematicButton';
import { purchaseLifetime } from '@/lib/payments';

const FEATURES = [
  'Unlimited track generation',
  'Stem export · WAV + MIDI',
  'Commercial license',
  'Priority queue',
  'Early access to new models',
];

export default function Checkout() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const buy = async () => {
    setBusy(true);
    const result = await purchaseLifetime();
    setBusy(false);
    if (result.status === 'completed') {
      Alert.alert('Welcome to lifetime', 'Your unlock is active.');
      router.back();
    } else if (result.status === 'error') {
      Alert.alert('Checkout', result.message);
    }
  };

  return (
    <View className="flex-1 bg-ink-50">
      <AuroraBackdrop intensity={0.9} />
      <SafeAreaView style={{ flex: 1 }}>
        <View className="flex-row items-center justify-between px-5">
          <Pressable onPress={() => router.back()} hitSlop={16}>
            <Ionicons name="close" size={28} color="white" />
          </Pressable>
          <Text className="font-mono text-xs uppercase tracking-[3px] text-ink-700">
            Lifetime unlock
          </Text>
          <View style={{ width: 28 }} />
        </View>

        <View className="flex-1 justify-end px-6 pb-12">
          <Text className="font-mono text-xs uppercase tracking-[4px] text-signal-cyan">
            One time. Forever.
          </Text>
          <Text className="mt-2 font-display text-5xl font-bold text-white">$149</Text>
          <Text className="mt-1 text-ink-700">
            Pay once. Make tracks for as long as RHYTHMIX exists.
          </Text>

          <View className="mt-8 gap-3">
            {FEATURES.map((f) => (
              <View key={f} className="flex-row items-center gap-3">
                <Ionicons name="checkmark-circle" size={22} color="#5cf2ff" />
                <Text className="text-base text-white">{f}</Text>
              </View>
            ))}
          </View>

          <View className="mt-10 gap-3">
            <CinematicButton
              label={busy ? 'Processing…' : 'Unlock for $149'}
              onPress={buy}
              loading={busy}
            />
            {Platform.OS === 'ios' && (
              <Text className="text-center text-xs text-ink-600">
                On iOS this routes through Apple StoreKit (wire RevenueCat to enable).
              </Text>
            )}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
