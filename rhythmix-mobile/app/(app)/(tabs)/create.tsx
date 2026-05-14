import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn } from 'react-native-reanimated';

import { AuroraBackdrop } from '@/components/cinematic/AuroraBackdrop';
import { CinematicButton } from '@/components/cinematic/CinematicButton';

const GENRES = ['Lo-fi', 'House', 'Synthwave', 'Trap', 'Ambient', 'Drum & bass'];

export default function Create() {
  const [prompt, setPrompt] = useState('');
  const [genre, setGenre] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  const generate = async () => {
    if (!prompt.trim()) {
      Alert.alert('Add a prompt', 'Tell us what you want to hear.');
      return;
    }
    setGenerating(true);
    // TODO: call your generation endpoint, push generated track into audio-store.
    setTimeout(() => {
      setGenerating(false);
      Alert.alert('Demo only', 'Wire this to your generation API to actually produce a track.');
    }, 1200);
  };

  return (
    <View className="flex-1 bg-ink-50">
      <AuroraBackdrop intensity={0.6} />
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View className="flex-1 px-6 pt-2">
            <Text className="font-mono text-xs uppercase tracking-[3px] text-signal-cyan">
              New track
            </Text>
            <Text className="mt-1 font-display text-3xl font-bold text-white">
              Describe the vibe
            </Text>

            <Animated.View entering={FadeIn.duration(500)} className="mt-6">
              <TextInput
                value={prompt}
                onChangeText={setPrompt}
                placeholder="A late-night drive through neon-lit Tokyo, lofi drums, melancholy synths…"
                placeholderTextColor="#5a5a67"
                multiline
                className="min-h-[160px] rounded-3xl border-hairline border-white/15 bg-ink-200/70 p-5 text-base text-white"
                textAlignVertical="top"
              />
            </Animated.View>

            <View className="mt-6">
              <Text className="mb-3 text-xs uppercase tracking-widest text-ink-600">Genre</Text>
              <View className="flex-row flex-wrap gap-2">
                {GENRES.map((g) => {
                  const active = genre === g;
                  return (
                    <Pressable
                      key={g}
                      onPress={() => setGenre(active ? null : g)}
                      className={`rounded-full px-4 py-2 ${active ? 'bg-accent' : 'bg-ink-200/70'}`}>
                      <Text className={active ? 'text-white' : 'text-ink-700'}>{g}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View className="mt-auto pb-8">
              <CinematicButton
                label={generating ? 'Generating…' : 'Generate track'}
                onPress={generate}
                loading={generating}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
