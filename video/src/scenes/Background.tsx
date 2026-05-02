import {
  AbsoluteFill,
  interpolate,
  interpolateColors,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const STOPS_T   = [0,         4,         38,        50,        65,        95,        122,       154,       195       ];
const STOPS_TOP = ["#000000", "#0a1037", "#2a1a5e", "#3d1f6e", "#ff7a59", "#f4e5ff", "#ffb27a", "#ffd479", "#ffffff"];
const STOPS_BOT = ["#000000", "#1a1f5e", "#4a2a8e", "#6d3fae", "#ffb27a", "#ffd479", "#ffd479", "#ffffff", "#ffffff"];

export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;

  const skyTop = interpolateColors(t, STOPS_T, STOPS_TOP);
  const skyBot = interpolateColors(t, STOPS_T, STOPS_BOT);

  const sunY = interpolate(
    t,
    [40, 50, 80, 122, 185, 200],
    [height + 200, height * 0.78, height * 0.55, height * 0.42, height * 0.35, height * 0.5],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const sunOpacity = interpolate(
    t,
    [40, 50, 195, 210],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const beat = Math.sin(t * Math.PI * 4);
  const sunScale = 1 + beat * 0.012 * Math.min(1, sunOpacity);

  const starsOpacity = interpolate(t, [0, 4, 35, 50], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const verseShapesOpacity = interpolate(t, [78, 85, 120, 125], [0, 0.5, 0.5, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const godRaysOpacity = interpolate(t, [150, 165, 200, 210], [0, 0.6, 0.6, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const whiteoutOpacity = interpolate(t, [200, 210], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{ background: `linear-gradient(180deg, ${skyTop} 0%, ${skyBot} 100%)` }}
      />

      {starsOpacity > 0 && (
        <svg
          style={{ position: "absolute", inset: 0, opacity: starsOpacity }}
          width={width}
          height={height}
        >
          {Array.from({ length: 60 }, (_, i) => {
            const x = (i * 173) % width;
            const baseY = (i * 97) % (height + 200);
            const y = ((baseY + frame * 0.5) % (height + 200)) - 100;
            const r = ((i * 7) % 3) + 1;
            const twinkle = 0.5 + Math.sin((frame + i * 30) / 25) * 0.4;
            return <circle key={i} cx={x} cy={y} r={r} fill="#ffffff" opacity={twinkle} />;
          })}
        </svg>
      )}

      {godRaysOpacity > 0 && (
        <svg
          style={{ position: "absolute", inset: 0, opacity: godRaysOpacity, mixBlendMode: "screen" }}
          width={width}
          height={height}
        >
          {Array.from({ length: 12 }, (_, i) => {
            const angle = (i / 12) * Math.PI * 2 + t * 0.05;
            const x2 = width / 2 + Math.cos(angle) * width;
            const y2 = sunY + Math.sin(angle) * width;
            return (
              <line
                key={i}
                x1={width / 2}
                y1={sunY}
                x2={x2}
                y2={y2}
                stroke="#ffffff"
                strokeWidth={2}
                opacity={0.25}
              />
            );
          })}
        </svg>
      )}

      {verseShapesOpacity > 0 &&
        Array.from({ length: 6 }, (_, i) => {
          const x = ((i * 263 + frame * 0.6) % (width + 400)) - 200;
          const y = ((i * 117) % height) + Math.sin((frame + i * 50) / 60) * 20;
          const size = 180 + (i % 3) * 80;
          return (
            <div
              key={`shape-${i}`}
              style={{
                position: "absolute",
                left: x,
                top: y,
                width: size,
                height: size,
                borderRadius: "50%",
                background: i % 2 === 0
                  ? "radial-gradient(circle, rgba(255,178,122,0.5) 0%, transparent 70%)"
                  : "radial-gradient(circle, rgba(244,229,255,0.55) 0%, transparent 70%)",
                opacity: verseShapesOpacity,
                filter: "blur(20px)",
              }}
            />
          );
        })}

      {sunOpacity > 0 && (
        <div
          style={{
            position: "absolute",
            left: width / 2,
            top: sunY,
            transform: `translate(-50%, -50%) scale(${sunScale})`,
            opacity: sunOpacity,
            width: 380,
            height: 380,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, #fff4e5 0%, #ffe1a8 30%, #ffd479 55%, transparent 75%)",
            boxShadow: "0 0 240px 100px rgba(255,212,121,0.55)",
          }}
        />
      )}

      {whiteoutOpacity > 0 && (
        <AbsoluteFill style={{ background: "#ffffff", opacity: whiteoutOpacity }} />
      )}
    </AbsoluteFill>
  );
};
