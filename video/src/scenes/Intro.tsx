import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Background } from "../components/Background";
import { Equalizer } from "../components/Equalizer";
import { COLORS, FONTS } from "../theme";

/** Opening beat: the spectrum builds while a mono kicker types the category. */
export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const kicker = interpolate(frame, [10, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <Background tint={COLORS.cyan} />
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 48,
        }}
      >
        <Equalizer bars={28} width={1000} height={300} startAt={0} />
        <div
          style={{
            fontFamily: FONTS.mono,
            fontSize: 34,
            letterSpacing: 14,
            color: COLORS.muted,
            textTransform: "uppercase",
            opacity: kicker,
            transform: `translateY(${(1 - kicker) * 14}px)`,
          }}
        >
          AI Music Platform
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
