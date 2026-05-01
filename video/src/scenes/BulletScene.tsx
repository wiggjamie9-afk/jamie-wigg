import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { BulletScene as BulletSceneType } from "../types";

type Props = BulletSceneType & {
  theme?: {
    primary?: string;
    accent?: string;
    text?: string;
    background?: string;
  };
};

export const BulletScene: React.FC<Props> = ({ heading, bullets, background, theme }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bg = background ?? theme?.background ?? "#0b0b12";
  const textColor = theme?.text ?? "#ffffff";
  const accent = theme?.accent ?? "#7c5cff";

  const headingScale = spring({ frame, fps, config: { damping: 14 } });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: bg,
        padding: 100,
        justifyContent: "center",
      }}
    >
      <h2
        style={{
          fontSize: 72,
          fontWeight: 800,
          color: textColor,
          margin: 0,
          marginBottom: 48,
          transform: `scale(${headingScale})`,
          letterSpacing: -1.5,
        }}
      >
        {heading}
      </h2>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {bullets.map((bullet, i) => {
          const start = fps * (0.4 + i * 0.35);
          const opacity = interpolate(frame, [start, start + fps * 0.4], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const x = interpolate(frame, [start, start + fps * 0.4], [-30, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <li
              key={i}
              style={{
                fontSize: 42,
                color: textColor,
                opacity,
                transform: `translateX(${x}px)`,
                marginBottom: 28,
                display: "flex",
                alignItems: "center",
                gap: 24,
              }}
            >
              <span
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 8,
                  backgroundColor: accent,
                  flexShrink: 0,
                }}
              />
              {bullet}
            </li>
          );
        })}
      </ul>
    </AbsoluteFill>
  );
};
