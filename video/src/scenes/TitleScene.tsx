import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { TitleScene as TitleSceneType } from "../types";

type Props = TitleSceneType & {
  theme?: {
    primary?: string;
    accent?: string;
    text?: string;
    background?: string;
  };
};

export const TitleScene: React.FC<Props> = ({ title, subtitle, background, theme }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleScale = spring({ frame, fps, config: { damping: 12 } });
  const subtitleOpacity = interpolate(frame, [fps * 0.4, fps * 0.9], [0, 1], {
    extrapolateRight: "clamp",
  });

  const bg = background ?? theme?.background ?? "#0b0b12";
  const textColor = theme?.text ?? "#ffffff";
  const accent = theme?.accent ?? "#7c5cff";

  return (
    <AbsoluteFill
      style={{
        backgroundColor: bg,
        backgroundImage: `radial-gradient(circle at 30% 20%, ${accent}33, transparent 50%)`,
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: 80,
      }}
    >
      <h1
        style={{
          fontSize: 96,
          fontWeight: 800,
          color: textColor,
          margin: 0,
          transform: `scale(${titleScale})`,
          letterSpacing: -2,
        }}
      >
        {title}
      </h1>
      {subtitle && (
        <p
          style={{
            fontSize: 36,
            color: textColor,
            opacity: subtitleOpacity * 0.8,
            marginTop: 24,
            fontWeight: 400,
          }}
        >
          {subtitle}
        </p>
      )}
    </AbsoluteFill>
  );
};
