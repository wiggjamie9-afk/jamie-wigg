import { useEffect } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';

import { supabase } from '@/lib/supabase';
import { useAudioStore, type Track } from '@/lib/audio-store';

/**
 * Resolves a track from a deep link (rhythmix://track/:id or https://rhythmix.app/track/:id),
 * loads it into the audio store, then opens the modal player.
 */
export default function TrackDeepLink() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const setCurrent = useAudioStore((s) => s.setCurrent);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!id) return;
      const { data, error } = await supabase
        .from('tracks')
        .select('id, title, artist, audio_url, artwork_url, duration_sec')
        .eq('id', id)
        .single();
      if (cancelled || error || !data) {
        router.replace('/(app)/(tabs)');
        return;
      }
      const track: Track = {
        id: data.id,
        title: data.title,
        artist: data.artist,
        audioUrl: data.audio_url,
        artworkUrl: data.artwork_url ?? undefined,
        durationSec: data.duration_sec ?? undefined,
      };
      setCurrent(track);
      router.replace('/(app)/player');
    })();
    return () => {
      cancelled = true;
    };
  }, [id, router, setCurrent]);

  if (!id) return <Redirect href="/(app)/(tabs)" />;

  return (
    <View className="flex-1 items-center justify-center bg-ink-0">
      <ActivityIndicator color="#ff3d7f" />
      <Text className="mt-3 font-mono text-xs uppercase tracking-[3px] text-ink-700">
        Loading track…
      </Text>
    </View>
  );
}
