import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Background } from "../components/Background";
import { Equalizer } from "../components/Equalizer";
import { COLORS, FONTS } from "../theme";
import { beatPulse } from "../motion";

/** Opening beat: a blurred equalizer bed, a sharp foreground spectrum, and a
 * mono kicker that unmasks upward — all pulsing to the beat. */
export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const beat = beatPulse(frame, fps);

  const kickerReveal = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const scan = interpolate(frame % 60, [0, 60], [-20, 120]);

  return (
    <AbsoluteFill>
      <Background />

      {/* Depth: a large, soft, blurred equalizer sitting behind the sharp one. */}
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          filter: "blur(26px)",
          opacity: 0.5,
          transform: "scale(1.5)",
        }}
      >
        <Equalizer bars={20} width={1200} height={340} startAt={4} />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 30,
        }}
      >
        <Equalizer bars={36} width={1120} height={300} startAt={0} />

        <div style={{ position: "relative", overflow: "hidden", paddingBottom: 8 }}>
          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: 30,
              fontWeight: 500,
              letterSpacing: 16,
              color: COLORS.white,
              textTransform: "uppercase",
              transform: `translateY(${(1 - kickerReveal) * 60}px)`,
              opacity: kickerReveal,
              textShadow: `0 0 ${18 + beat * 22}px ${COLORS.cyan}`,
            }}
          >
            AI Music Platform
          </div>
        </div>
      </AbsoluteFill>

      {/* A thin light bar scanning across the frame. */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(90deg, transparent ${scan - 6}%, ${COLORS.cyan}44 ${scan}%, transparent ${scan + 6}%)`,
          mixBlendMode: "screen",
          opacity: 0.5,
        }}
      />
    </AbsoluteFill>
  );
};
