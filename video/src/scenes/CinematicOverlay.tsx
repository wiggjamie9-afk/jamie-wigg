import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

const ASPECT_RATIO = 2.35;

export const CinematicOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const targetHeight = width / ASPECT_RATIO;
  const barHeight = Math.max(0, (height - targetHeight) / 2);

  const grainSeed = frame % 12;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: barHeight,
          background: "#000",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: barHeight,
          background: "#000",
        }}
      />

      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: 0.07,
          mixBlendMode: "overlay",
        }}
      >
        <filter id={`grain-${grainSeed}`}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="2"
            seed={grainSeed}
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#grain-${grainSeed})`} />
      </svg>
    </AbsoluteFill>
  );
};
