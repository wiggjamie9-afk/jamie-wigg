import { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAudioPlayer, useAudioPlayerStatus, setAudioModeAsync } from 'expo-audio';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

import { AuroraBackdrop } from '@/components/cinematic/AuroraBackdrop';
import { Waveform } from '@/components/cinematic/Waveform';
import { useAudioStore } from '@/lib/audio-store';

export default function Player() {
  const router = useRouter();
  const current = useAudioStore((s) => s.current);
  const setPlayingStore = useAudioStore((s) => s.setPlaying);

  const player = useAudioPlayer(current?.audioUrl ?? null);
  const status = useAudioPlayerStatus(player);

  useEffect(() => {
    setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: true,
      interruptionMode: 'mixWithOthers',
    });
  }, []);

  useEffect(() => {
    setPlayingStore(status.playing);
  }, [setPlayingStore, status.playing]);

  const togglePlay = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (status.playing) player.pause();
    else player.play();
  };

  if (!current) {
    return (
      <View className="flex-1 items-center justify-center bg-ink-50">
        <Text className="text-ink-700">No track selected</Text>
      </View>
    );
  }

  const progress =
    status.duration && status.duration > 0
      ? Math.min(1, status.currentTime / status.duration)
      : 0;

  return (
    <View className="flex-1 bg-ink-0">
      <AuroraBackdrop intensity={1} />
      <SafeAreaView style={{ flex: 1 }}>
        <View className="flex-row items-center justify-between px-5 pb-2">
          <Pressable onPress={() => router.back()} hitSlop={16}>
            <Ionicons name="chevron-down" size={28} color="white" />
          </Pressable>
          <Text className="font-mono text-xs uppercase tracking-[3px] text-ink-700">
            Now playing
          </Text>
          <View style={{ width: 28 }} />
        </View>

        <View className="flex-1 justify-end px-6 pb-12">
          <View className="aspect-square w-full overflow-hidden rounded-3xl bg-ink-300 shadow-2xl" />

          <View className="mt-8">
            <Text className="font-display text-3xl font-bold text-white">{current.title}</Text>
            <Text className="mt-1 text-ink-700">{current.artist}</Text>
          </View>

          <View className="mt-6">
            <Waveform height={80} isPlaying={status.playing} />
            <View className="mt-2 h-1 w-full overflow-hidden rounded-full bg-ink-300">
              <View
                className="h-full bg-accent"
                style={{ width: `${progress * 100}%` }}
              />
            </View>
            <View className="mt-1 flex-row justify-between">
              <Text className="font-mono text-xs text-ink-600">
                {fmt(status.currentTime ?? 0)}
              </Text>
              <Text className="font-mono text-xs text-ink-600">
                {fmt(status.duration ?? 0)}
              </Text>
            </View>
          </View>

          <View className="mt-8 flex-row items-center justify-center gap-12">
            <Pressable onPress={() => player.seekTo(Math.max(0, (status.currentTime ?? 0) - 15))}>
              <Ionicons name="play-back" size={32} color="white" />
            </Pressable>
            <Pressable
              onPress={togglePlay}
              className="h-20 w-20 items-center justify-center rounded-full bg-accent">
              <Ionicons name={status.playing ? 'pause' : 'play'} size={36} color="white" />
            </Pressable>
            <Pressable
              onPress={() =>
                player.seekTo(Math.min(status.duration ?? 0, (status.currentTime ?? 0) + 15))
              }>
              <Ionicons name="play-forward" size={32} color="white" />
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

function fmt(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}
