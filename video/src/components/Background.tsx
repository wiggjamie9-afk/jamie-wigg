import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS } from "../theme";

/**
 * The RHYTHMIX canvas: near-black with a violet bias plus two localized radial
 * glows that breathe slowly. Per DESIGN.md we avoid full-frame linear
 * gradients (they band); glows are radial and localized.
 */
export const Background: React.FC<{ tint?: string }> = ({
  tint = COLORS.purple,
}) => {
  const frame = useCurrentFrame();
  // Slow, non-repeating breathe so the frame is never dead-still.
  const breathe = 0.5 + 0.5 * Math.sin(frame / 40);
  const drift = 6 * Math.sin(frame / 55);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.canvas }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(60% 60% at ${30 + drift}% 30%, ${tint}33, transparent 70%)`,
          opacity: 0.7 + 0.3 * breathe,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(55% 55% at ${72 - drift}% 78%, ${COLORS.magenta}22, transparent 70%)`,
          opacity: 0.6 + 0.4 * (1 - breathe),
        }}
      />
    </AbsoluteFill>
  );
};
