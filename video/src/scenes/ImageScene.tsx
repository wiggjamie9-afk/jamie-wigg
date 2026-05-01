import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import type { ImageScene as ImageSceneType } from "../types";

type Props = ImageSceneType & {
  theme?: {
    text?: string;
    background?: string;
  };
};

const resolveSrc = (src: string) => {
  if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("data:")) {
    return src;
  }
  return staticFile(src);
};

export const ImageScene: React.FC<Props> = ({ src, caption, kenBurns, theme }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const bg = theme?.background ?? "#000000";
  const textColor = theme?.text ?? "#ffffff";

  const scale = kenBurns
    ? interpolate(frame, [0, durationInFrames], [1.0, 1.12])
    : 1;
  const opacity = interpolate(frame, [0, fps * 0.3], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: bg }}>
      <Img
        src={resolveSrc(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale})`,
          opacity,
        }}
      />
      {caption && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "60px 80px",
            background: "linear-gradient(to top, rgba(0,0,0,0.85), transparent)",
            color: textColor,
            fontSize: 44,
            fontWeight: 600,
            opacity,
          }}
        >
          {caption}
        </div>
      )}
    </AbsoluteFill>
  );
};
