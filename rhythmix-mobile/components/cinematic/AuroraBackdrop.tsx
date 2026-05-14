import React, { useEffect } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import {
  Canvas,
  Group,
  Rect,
  Circle,
  LinearGradient,
  vec,
  Blur,
  ColorMatrix,
  Turbulence,
  Fill,
  RadialGradient,
} from '@shopify/react-native-skia';
import {
  Easing,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { palette } from '@/lib/theme';

/**
 * AuroraBackdrop — Skia-based animated gradient + film-grain backdrop.
 * Cheap on the GPU (single canvas, no offscreen passes), runs at 60+ fps on the New Architecture.
 *
 * Usage:
 *   <AuroraBackdrop intensity={0.8} />
 *   <YourContent />  // absolutely positioned above
 */
export function AuroraBackdrop({ intensity = 0.7 }: { intensity?: number }) {
  const { width, height } = useWindowDimensions();
  const t = useSharedValue(0);

  useEffect(() => {
    t.value = withRepeat(
      withTiming(1, { duration: 18000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
  }, [t]);

  const cx1 = useDerivedValue(() => width * (0.25 + 0.5 * t.value));
  const cy1 = useDerivedValue(() => height * (0.35 + 0.15 * t.value));
  const cx2 = useDerivedValue(() => width * (0.85 - 0.4 * t.value));
  const cy2 = useDerivedValue(() => height * (0.7 - 0.2 * t.value));

  return (
    <Canvas style={[StyleSheet.absoluteFill]} pointerEvents="none">
      {/* Deep base */}
      <Rect x={0} y={0} width={width} height={height}>
        <LinearGradient
          start={vec(0, 0)}
          end={vec(0, height)}
          colors={[palette.ink[50], palette.ink[100], palette.ink[200]]}
        />
      </Rect>

      {/* Two soft, slowly orbiting colour wells, heavily blurred */}
      <Group>
        <Circle cx={cx1} cy={cy1} r={width * 0.6}>
          <RadialGradient
            c={vec(width * 0.5, height * 0.5)}
            r={width * 0.6}
            colors={[palette.accent.base + 'cc', palette.accent.deep + '00']}
          />
        </Circle>
        <Circle cx={cx2} cy={cy2} r={width * 0.55}>
          <RadialGradient
            c={vec(width * 0.5, height * 0.5)}
            r={width * 0.55}
            colors={[palette.signal.violet + 'aa', palette.signal.cyan + '00']}
          />
        </Circle>
        <Blur blur={80 * intensity} />
      </Group>

      {/* Subtle film grain via turbulence noise */}
      <Group opacity={0.08 * intensity}>
        <Fill color="white">
          <Turbulence freqX={0.9} freqY={0.9} octaves={2} seed={3} />
          <ColorMatrix
            matrix={[
              0, 0, 0, 0, 1,
              0, 0, 0, 0, 1,
              0, 0, 0, 0, 1,
              0, 0, 0, 1, 0,
            ]}
          />
        </Fill>
      </Group>
    </Canvas>
  );
}
