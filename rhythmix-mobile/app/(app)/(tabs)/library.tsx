import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuroraBackdrop } from '@/components/cinematic/AuroraBackdrop';

export default function Library() {
  return (
    <View className="flex-1 bg-ink-50">
      <AuroraBackdrop intensity={0.4} />
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <View className="px-6 pt-2">
          <Text className="font-mono text-xs uppercase tracking-[3px] text-signal-cyan">
            Library
          </Text>
          <Text className="mt-1 font-display text-3xl font-bold text-white">Your tracks</Text>
        </View>

        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-center text-ink-700">
            Generated tracks land here. Hook this up to Supabase Storage + the user&apos;s tracks
            table.
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
}
