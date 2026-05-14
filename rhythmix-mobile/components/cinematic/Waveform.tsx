import React, { useEffect } from 'react';
import { useWindowDimensions } from 'react-native';
import {
  Canvas,
  Path,
  Skia,
  LinearGradient,
  vec,
  BlurMask,
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
 * Waveform — animated Skia waveform with a glow.
 * Bars are sampled from a sin/noise combo (replace with real FFT data when expo-audio
 * exposes audio analyser hooks).
 */
export function Waveform({
  height = 120,
  isPlaying = true,
  amplitudes,
}: {
  height?: number;
  isPlaying?: boolean;
  amplitudes?: number[];
}) {
  const { width } = useWindowDimensions();
  const t = useSharedValue(0);

  useEffect(() => {
    t.value = withRepeat(
      withTiming(1, { duration: 1600, easing: Easing.linear }),
      -1,
      false,
    );
  }, [t]);

  const path = useDerivedValue(() => {
    const p = Skia.Path.Make();
    const bars = 64;
    const barW = width / bars;
    const baseAmp = isPlaying ? 1 : 0.25;

    for (let i = 0; i < bars; i++) {
      const sample =
        amplitudes && amplitudes.length > 0
          ? amplitudes[i % amplitudes.length]
          : 0.5 +
            0.5 *
              Math.sin(i * 0.42 + t.value * Math.PI * 2) *
              Math.sin(i * 0.13 + t.value * Math.PI * 4);
      const h = sample * height * baseAmp;
      const x = i * barW + barW * 0.25;
      const y = (height - h) / 2;
      p.addRRect({
        rect: { x, y, width: barW * 0.5, height: h },
        rx: barW * 0.25,
        ry: barW * 0.25,
      });
    }
    return p;
  }, [width, height, isPlaying, amplitudes]);

  return (
    <Canvas style={{ width, height }}>
      <Path path={path} style="fill">
        <LinearGradient
          start={vec(0, 0)}
          end={vec(width, 0)}
          colors={[palette.signal.cyan, palette.accent.base, palette.signal.violet]}
        />
        <BlurMask blur={8} style="solid" />
      </Path>
    </Canvas>
  );
}
