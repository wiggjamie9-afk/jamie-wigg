import { useEffect } from 'react';
import { View, Text, useWindowDimensions } from 'react-native';
import { Redirect, useRouter } from 'expo-router';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuroraBackdrop } from '@/components/cinematic/AuroraBackdrop';
import { CinematicButton } from '@/components/cinematic/CinematicButton';
import { useSession } from '@/lib/session';
import { motion } from '@/lib/theme';

export default function Landing() {
  const router = useRouter();
  const { session, loading } = useSession();
  const { height } = useWindowDimensions();

  const eyebrow = useSharedValue(0);
  const title = useSharedValue(0);
  const sub = useSharedValue(0);
  const cta = useSharedValue(0);

  useEffect(() => {
    const cfg = { duration: motion.duration.cinematic, easing: Easing.bezier(...motion.ease.cinematic) };
    eyebrow.value = withDelay(120, withTiming(1, cfg));
    title.value = withDelay(280, withTiming(1, cfg));
    sub.value = withDelay(520, withTiming(1, cfg));
    cta.value = withDelay(800, withTiming(1, cfg));
  }, [cta, eyebrow, sub, title]);

  const eyebrowStyle = useAnimatedStyle(() => ({
    opacity: eyebrow.value,
    transform: [{ translateY: (1 - eyebrow.value) * 24 }],
  }));
  const titleStyle = useAnimatedStyle(() => ({
    opacity: title.value,
    transform: [{ translateY: (1 - title.value) * 32 }],
  }));
  const subStyle = useAnimatedStyle(() => ({
    opacity: sub.value,
    transform: [{ translateY: (1 - sub.value) * 28 }],
  }));
  const ctaStyle = useAnimatedStyle(() => ({
    opacity: cta.value,
    transform: [{ translateY: (1 - cta.value) * 36 }],
  }));

  if (loading) return null;
  if (session) return <Redirect href="/(app)/(tabs)" />;

  return (
    <View className="flex-1 bg-ink-50">
      <AuroraBackdrop intensity={0.85} />
      <SafeAreaView style={{ flex: 1 }}>
        <View className="flex-1 justify-end px-6 pb-12" style={{ minHeight: height * 0.6 }}>
          <Animated.Text
            style={eyebrowStyle}
            className="mb-3 font-mono text-xs uppercase tracking-[4px] text-signal-cyan">
            AI music, in seconds
          </Animated.Text>

          <Animated.Text
            style={titleStyle}
            className="font-display text-6xl font-bold leading-[1.05] text-white">
            Make tracks that
            {'\n'}
            <Text className="text-accent">sound like you.</Text>
          </Animated.Text>

          <Animated.Text
            style={subStyle}
            className="mt-5 max-w-[90%] text-base leading-relaxed text-ink-700">
            Prompt a beat, hum a melody, ship a release. Built for creators who would rather make
            music than fight a DAW.
          </Animated.Text>

          <Animated.View style={ctaStyle} className="mt-10 gap-3">
            <CinematicButton label="Get started" onPress={() => router.push('/(auth)/sign-in')} />
            <CinematicButton
              label="I already have an account"
              variant="ghost"
              onPress={() => router.push('/(auth)/sign-in')}
            />
          </Animated.View>
        </View>
      </SafeAreaView>
    </View>
  );
}
