import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Background } from "../components/Background";
import { COLORS, FONTS } from "../theme";

/** Closing beat: wordmark lockup + domain, with a pulsing CTA pill. */
export const CallToAction: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [6, 26], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (x) => 1 - Math.pow(2, -10 * x),
  });
  const pulse = 0.5 + 0.5 * Math.sin(frame / 8);

  return (
    <AbsoluteFill>
      <Background tint={COLORS.magenta} />
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 40,
          opacity: enter,
          transform: `translateY(${(1 - enter) * 40}px)`,
        }}
      >
        <div
          style={{
            fontFamily: FONTS.display,
            fontWeight: 700,
            fontSize: 130,
            letterSpacing: 6,
            color: COLORS.white,
            textShadow: `0 0 60px ${COLORS.magenta}88`,
          }}
        >
          RHYTHMIX
        </div>
        <div
          style={{
            fontFamily: FONTS.mono,
            fontSize: 44,
            letterSpacing: 6,
            padding: "22px 56px",
            borderRadius: 999,
            color: COLORS.white,
            background: `linear-gradient(90deg, ${COLORS.magenta}, ${COLORS.purple})`,
            boxShadow: `0 0 ${40 + pulse * 40}px ${COLORS.magenta}${pulse > 0.5 ? "aa" : "66"}`,
          }}
        >
          rhythmixapp.com.au
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
