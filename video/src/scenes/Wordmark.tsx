import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Background } from "../components/Background";
import { COLORS, FONTS, SPECTRUM } from "../theme";

const WORD = "RHYTHMIX";

/**
 * Wordmark reveal: letters rise per-letter with a fast, confident ease (no
 * bounce), each tinted from the spectrum, over a magenta underline that wipes
 * in. Tagline follows in mono.
 */
export const Wordmark: React.FC = () => {
  const frame = useCurrentFrame();
  const underline = interpolate(frame, [26, 46], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const tagline = interpolate(frame, [42, 62], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <Background tint={COLORS.purple} />
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 28,
        }}
      >
        <div style={{ display: "flex", gap: 4 }}>
          {WORD.split("").map((ch, i) => {
            const start = i * 3;
            // expo.out-style ease: fast rise, decisive hold.
            const t = interpolate(frame, [start, start + 16], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: (x) => 1 - Math.pow(2, -10 * x),
            });
            return (
              <span
                key={i}
                style={{
                  fontFamily: FONTS.display,
                  fontWeight: 700,
                  fontSize: 190,
                  lineHeight: 1,
                  color: COLORS.white,
                  textShadow: `0 0 60px ${SPECTRUM[i % SPECTRUM.length]}88`,
                  opacity: t,
                  transform: `translateY(${(1 - t) * 120}px)`,
                  display: "inline-block",
                }}
              >
                {ch}
              </span>
            );
          })}
        </div>
        <div
          style={{
            width: 780,
            height: 6,
            borderRadius: 3,
            background: `linear-gradient(90deg, ${COLORS.magenta}, ${COLORS.cyan})`,
            transform: `scaleX(${underline})`,
            transformOrigin: "left center",
          }}
        />
        <div
          style={{
            fontFamily: FONTS.mono,
            fontSize: 32,
            letterSpacing: 8,
            color: COLORS.muted,
            opacity: tagline,
            transform: `translateY(${(1 - tagline) * 12}px)`,
          }}
        >
          Your track. Your video. Your voice.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
