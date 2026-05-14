import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuroraBackdrop } from '@/components/cinematic/AuroraBackdrop';
import { CinematicButton } from '@/components/cinematic/CinematicButton';
import { signOut, useSession } from '@/lib/session';

export default function Profile() {
  const router = useRouter();
  const { session } = useSession();
  const email = session?.user?.email ?? 'anonymous';

  return (
    <View className="flex-1 bg-ink-50">
      <AuroraBackdrop intensity={0.45} />
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <View className="px-6 pt-2">
          <Text className="font-mono text-xs uppercase tracking-[3px] text-signal-cyan">You</Text>
          <Text className="mt-1 font-display text-3xl font-bold text-white">{email}</Text>
        </View>

        <View className="flex-1 justify-end gap-3 px-6 pb-12">
          <CinematicButton
            label="Upgrade · $149 lifetime"
            onPress={() => router.push('/(app)/checkout')}
          />
          <CinematicButton label="Sign out" variant="ghost" onPress={signOut} />
        </View>
      </SafeAreaView>
    </View>
  );
}
