import React from 'react';
import { Pressable, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

import { motion, palette } from '@/lib/theme';

const AnimatedView = Animated.createAnimatedComponent(View);

interface Props {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'ghost';
  loading?: boolean;
  disabled?: boolean;
}

export function CinematicButton({
  label,
  onPress,
  variant = 'primary',
  loading,
  disabled,
}: Props) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    scale.value = withSpring(0.96, motion.spring.snappy);
  };
  const handlePressOut = () => {
    scale.value = withSpring(1, motion.spring.soft);
  };
  const handlePress = () => {
    if (disabled || loading) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onPress();
  };

  if (variant === 'ghost') {
    return (
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        disabled={disabled || loading}>
        <AnimatedView
          style={animatedStyle}
          className="overflow-hidden rounded-2xl border-hairline border-white/20">
          <BlurView intensity={40} tint="dark" className="px-6 py-4">
            <Text className="text-center font-display text-base text-white">
              {loading ? 'Loading…' : label}
            </Text>
          </BlurView>
        </AnimatedView>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      disabled={disabled || loading}>
      <AnimatedView
        style={animatedStyle}
        className="overflow-hidden rounded-2xl"
        accessibilityRole="button">
        <LinearGradient
          colors={[palette.accent.glow, palette.accent.base, palette.accent.deep]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ paddingHorizontal: 28, paddingVertical: 18 }}>
          <Text className="text-center font-display text-base font-semibold text-white">
            {loading ? 'Working…' : label}
          </Text>
        </LinearGradient>
      </AnimatedView>
    </Pressable>
  );
}
