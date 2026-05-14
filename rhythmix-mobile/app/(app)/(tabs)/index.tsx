import { FlatList, Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { AuroraBackdrop } from '@/components/cinematic/AuroraBackdrop';
import { Waveform } from '@/components/cinematic/Waveform';
import { useAudioStore, type Track } from '@/lib/audio-store';

const DEMO_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Midnight Synth',
    artist: 'AI Producer',
    audioUrl: 'https://example.com/track1.mp3',
    durationSec: 184,
  },
  {
    id: '2',
    title: 'Neon Drift',
    artist: 'You',
    audioUrl: 'https://example.com/track2.mp3',
    durationSec: 142,
  },
  {
    id: '3',
    title: 'Aurora Bass',
    artist: 'You',
    audioUrl: 'https://example.com/track3.mp3',
    durationSec: 217,
  },
];

export default function Feed() {
  const router = useRouter();
  const setCurrent = useAudioStore((s) => s.setCurrent);

  const openPlayer = (track: Track) => {
    setCurrent(track);
    router.push('/(app)/player');
  };

  return (
    <View className="flex-1 bg-ink-50">
      <AuroraBackdrop intensity={0.5} />
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <View className="px-5 pb-2 pt-2">
          <Text className="font-mono text-xs uppercase tracking-[3px] text-signal-cyan">
            For you · today
          </Text>
          <Text className="mt-1 font-display text-3xl font-bold text-white">Fresh from the lab</Text>
        </View>

        <FlatList
          data={DEMO_TRACKS}
          keyExtractor={(t) => t.id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 140, gap: 14 }}
          renderItem={({ item, index }) => (
            <Animated.View entering={FadeInUp.delay(index * 80).duration(500)}>
              <Pressable
                onPress={() => openPlayer(item)}
                className="overflow-hidden rounded-3xl bg-ink-200/60 p-4 backdrop-blur">
                <View className="flex-row items-center gap-4">
                  <View className="h-16 w-16 overflow-hidden rounded-2xl bg-ink-300">
                    {item.artworkUrl ? (
                      <Image source={item.artworkUrl} style={{ width: '100%', height: '100%' }} />
                    ) : (
                      <View className="h-full w-full items-center justify-center">
                        <Text className="font-display text-2xl text-accent">♪</Text>
                      </View>
                    )}
                  </View>
                  <View className="flex-1">
                    <Text numberOfLines={1} className="font-display text-lg text-white">
                      {item.title}
                    </Text>
                    <Text className="mt-0.5 text-xs text-ink-600">{item.artist}</Text>
                  </View>
                  <Text className="font-mono text-xs text-ink-600">
                    {formatDuration(item.durationSec ?? 0)}
                  </Text>
                </View>
                <View className="mt-3 opacity-70">
                  <Waveform height={48} isPlaying={false} />
                </View>
              </Pressable>
            </Animated.View>
          )}
        />
      </SafeAreaView>
    </View>
  );
}

function formatDuration(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}
