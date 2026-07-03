import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { CROSSFADE } from "../theme";
import { kenBurns } from "../motion";

/**
 * Wraps a scene so it fades in over its first `fade` frames and out over its
 * last `fade` frames — adjacent scenes overlap, so these fades ARE the
 * DESIGN.md crossfade. Adds a slow Ken Burns zoom for camera life and a light
 * defocus at the cut edges so transitions read filmic rather than as a plain
 * opacity dip.
 */
export const CrossfadeScene: React.FC<{
  durationInFrames: number;
  fade?: number;
  zoom?: number;
  /** When true, the scene holds sharp at the end instead of fading/blurring
   * out — used for the final scene so the promo lands on a crisp frame. */
  holdEnd?: boolean;
  children: React.ReactNode;
}> = ({
  durationInFrames,
  fade = CROSSFADE,
  zoom = 1.06,
  holdEnd = false,
  children,
}) => {
  const frame = useCurrentFrame();

  const endOpacity = holdEnd ? 1 : 0;
  const endBlur = holdEnd ? 0 : 14;

  const opacity = interpolate(
    frame,
    [0, fade, durationInFrames - fade, durationInFrames],
    [0, 1, 1, endOpacity],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const blur = interpolate(
    frame,
    [0, fade, durationInFrames - fade, durationInFrames],
    [14, 0, 0, endBlur],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const scale = kenBurns(frame, durationInFrames, 1, zoom);

  return (
    <AbsoluteFill
      style={{
        opacity,
        transform: `scale(${scale})`,
        filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
