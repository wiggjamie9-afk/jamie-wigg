import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import type { OutroScene as OutroSceneType } from "../types";

type Props = OutroSceneType & {
  theme?: {
    primary?: string;
    accent?: string;
    text?: string;
    background?: string;
  };
};

export const OutroScene: React.FC<Props> = ({ title, subtitle, background, theme }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bg = background ?? theme?.background ?? "#0b0b12";
  const textColor = theme?.text ?? "#ffffff";
  const accent = theme?.accent ?? "#7c5cff";

  const opacity = interpolate(frame, [0, fps * 0.6], [0, 1], { extrapolateRight: "clamp" });
  const y = interpolate(frame, [0, fps * 0.6], [20, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: bg,
        backgroundImage: `radial-gradient(circle at 70% 80%, ${accent}33, transparent 50%)`,
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: 80,
      }}
    >
      <div style={{ opacity, transform: `translateY(${y}px)` }}>
        <h1
          style={{
            fontSize: 88,
            fontWeight: 800,
            color: textColor,
            margin: 0,
            letterSpacing: -2,
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            style={{
              fontSize: 32,
              color: textColor,
              opacity: 0.7,
              marginTop: 24,
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </AbsoluteFill>
  );
};
