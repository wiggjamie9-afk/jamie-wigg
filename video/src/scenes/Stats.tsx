import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Background } from "../components/Background";
import { COLORS, FONTS } from "../theme";

type Stat = {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  color: string;
};

const STATS: Stat[] = [
  { value: 30, suffix: "+", label: "TTS voices", color: COLORS.cyan },
  { value: 3, prefix: "", suffix: "×", label: "aspect ratios", color: COLORS.green },
  { value: 60, suffix: "s", label: "to a finished cut", color: COLORS.gold },
];

/** Count-up numerals with a decisive ease, staggered card entrances. */
export const Stats: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill>
      <Background tint={COLORS.magenta} />
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          gap: 56,
        }}
      >
        {STATS.map((stat, i) => {
          const start = i * 8;
          const enter = interpolate(frame, [start, start + 18], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: (x) => 1 - Math.pow(2, -10 * x),
          });
          const count = interpolate(frame, [start, start + 40], [0, stat.value], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: (x) => 1 - Math.pow(1 - x, 3),
          });

          return (
            <div
              key={i}
              style={{
                width: 380,
                padding: "56px 40px",
                borderRadius: 28,
                background: COLORS.card,
                border: `1px solid ${stat.color}55`,
                boxShadow: `0 0 80px ${stat.color}22`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 18,
                opacity: enter,
                transform: `translateY(${(1 - enter) * 60}px)`,
              }}
            >
              <div
                style={{
                  fontFamily: FONTS.display,
                  fontWeight: 700,
                  fontSize: 150,
                  lineHeight: 1,
                  color: stat.color,
                  textShadow: `0 0 50px ${stat.color}66`,
                }}
              >
                {stat.prefix ?? ""}
                {Math.round(count)}
                {stat.suffix ?? ""}
              </div>
              <div
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 28,
                  letterSpacing: 4,
                  color: COLORS.muted,
                  textTransform: "uppercase",
                }}
              >
                {stat.label}
              </div>
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
