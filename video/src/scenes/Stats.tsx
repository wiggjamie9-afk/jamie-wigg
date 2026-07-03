import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Background } from "../components/Background";
import { LightSweep } from "../components/LightSweep";
import { COLORS, FONTS } from "../theme";
import { beatPulse } from "../motion";

type Stat = {
  value: number;
  suffix?: string;
  label: string;
  color: string;
};

const STATS: Stat[] = [
  { value: 30, suffix: "+", label: "TTS voices", color: COLORS.cyan },
  { value: 3, suffix: "×", label: "aspect ratios", color: COLORS.green },
  { value: 60, suffix: "s", label: "to a finished cut", color: COLORS.gold },
];

/** Count-up hero numbers on cards that tilt in from depth, sweep with light,
 * and pulse their borders on the beat. */
export const Stats: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const beat = beatPulse(frame, fps);

  return (
    <AbsoluteFill>
      <Background />
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          gap: 52,
          perspective: 1400,
        }}
      >
        {STATS.map((stat, i) => {
          const start = i * 7;
          const enter = spring({
            frame: frame - start,
            fps,
            config: { damping: 200, mass: 0.9 },
          });
          const countEnd = start + 42;
          const count = interpolate(frame, [start + 4, countEnd], [0, stat.value], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: (x) => 1 - Math.pow(1 - x, 3),
          });
          // A little pop as the count lands.
          const pop =
            1 + 0.08 * Math.max(0, 1 - Math.abs(frame - countEnd) / 6);

          return (
            <div
              key={i}
              style={{
                position: "relative",
                overflow: "hidden",
                width: 400,
                padding: "60px 40px",
                borderRadius: 30,
                background: `linear-gradient(160deg, ${COLORS.card}, #120c1c)`,
                border: `1px solid ${stat.color}${beat > 0.5 ? "aa" : "55"}`,
                boxShadow: `0 30px 80px rgba(0,0,0,0.5), 0 0 ${40 + beat * 50}px ${stat.color}33`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 18,
                opacity: enter,
                transform: `translateY(${(1 - enter) * 90}px) rotateX(${(1 - enter) * 35}deg)`,
                transformOrigin: "center bottom",
              }}
            >
              <div
                style={{
                  fontFamily: FONTS.display,
                  fontWeight: 700,
                  fontSize: 156,
                  lineHeight: 1,
                  color: stat.color,
                  textShadow: `0 0 ${34 + beat * 34}px ${stat.color}88`,
                  transform: `scale(${pop})`,
                }}
              >
                {Math.round(count)}
                {stat.suffix ?? ""}
              </div>
              <div
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 26,
                  fontWeight: 500,
                  letterSpacing: 4,
                  color: COLORS.muted,
                  textTransform: "uppercase",
                  textAlign: "center",
                }}
              >
                {stat.label}
              </div>
              <LightSweep start={start + 8} duration={28} />
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
