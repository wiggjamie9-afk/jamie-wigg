import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { CROSSFADE } from "../theme";

/**
 * Wraps a scene so it fades in over its first `fade` frames and out over its
 * last `fade` frames. Adjacent scenes are placed in overlapping <Sequence>s so
 * these fades produce the DESIGN.md crossfade — the crossfade IS the exit, so
 * scenes never animate their contents out.
 */
export const CrossfadeScene: React.FC<{
  durationInFrames: number;
  fade?: number;
  children: React.ReactNode;
}> = ({ durationInFrames, fade = CROSSFADE, children }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(
    frame,
    [0, fade, durationInFrames - fade, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};
