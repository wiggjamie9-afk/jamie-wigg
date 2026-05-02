import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Section, SECTION_THEME, fontFamily } from "../theme";

export const LyricLine: React.FC<{ text: string; section: Section }> = ({ text, section }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const theme = SECTION_THEME[section];

  if (!text) return null;

  const fadeIn = interpolate(frame, [0, 14], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 12, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp" },
  );
  const opacity = Math.min(fadeIn, fadeOut);

  const rise = spring({
    frame,
    fps,
    from: 36,
    to: 0,
    config: { damping: 14, mass: 0.8 },
  });

  const isCenter = theme.lyricPosition === "center";

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: isCenter ? undefined : "18%",
        top: isCenter ? "50%" : undefined,
        transform: `translateY(${(isCenter ? -50 : 0)}%) translateY(${rise}px)`,
        textAlign: "center",
        fontFamily,
        fontSize: theme.lyricSize,
        fontWeight: theme.lyricWeight,
        color: theme.lyricColor,
        opacity,
        letterSpacing: "0.01em",
        lineHeight: 1.2,
        padding: "0 120px",
        textShadow:
          theme.lyricColor.startsWith("#3a") || theme.lyricColor.startsWith("#fff")
            ? "0 4px 28px rgba(0,0,0,0.35)"
            : "none",
      }}
    >
      {text}
    </div>
  );
};
