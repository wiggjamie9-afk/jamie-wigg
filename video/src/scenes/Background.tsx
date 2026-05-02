import {
  AbsoluteFill,
  interpolate,
  interpolateColors,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const STOPS_T   = [0,         4,         36,        48,        62,        90,        116,       144,       185       ];
const STOPS_TOP = ["#000000", "#0a1037", "#2a1a5e", "#3d1f6e", "#ff7a59", "#f4e5ff", "#ffb27a", "#ffd479", "#ffffff"];
const STOPS_BOT = ["#000000", "#1a1f5e", "#4a2a8e", "#6d3fae", "#ffb27a", "#ffd479", "#ffd479", "#ffffff", "#ffffff"];

const LIGHT_LEAK_TIMES = [36, 48, 76, 116];

export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;

  const skyTop = interpolateColors(t, STOPS_T, STOPS_TOP);
  const skyBot = interpolateColors(t, STOPS_T, STOPS_BOT);

  const kenBurnsScale = interpolate(t, [0, 116, 200], [1.0, 1.08, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const kenBurnsX = interpolate(t, [76, 116], [0, -40], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const sunY = interpolate(
    t,
    [38, 48, 76, 116, 175, 195],
    [height + 200, height * 0.78, height * 0.55, height * 0.42, height * 0.32, height * 0.45],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const sunOpacity = interpolate(t, [38, 48, 185, 200], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const beat = Math.sin(t * Math.PI * 4);
  const sunScale = 1 + beat * 0.012 * Math.min(1, sunOpacity);

  const starsOpacity = interpolate(t, [0, 4, 33, 48], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const verseShapesOpacity = interpolate(t, [74, 81, 114, 119], [0, 0.55, 0.55, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const godRaysOpacity = interpolate(t, [144, 158, 188, 200], [0, 0.65, 0.65, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const lensFlareOpacity = interpolate(t, [48, 60, 156, 175], [0, 0.7, 0.7, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const whiteoutOpacity = interpolate(t, [188, 200], [0, 0.95], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  let lightLeakOpacity = 0;
  for (const leakT of LIGHT_LEAK_TIMES) {
    const local = t - leakT;
    if (local >= -0.2 && local <= 0.7) {
      const v = interpolate(local, [-0.2, 0, 0.4, 0.7], [0, 0.85, 0.4, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      if (v > lightLeakOpacity) lightLeakOpacity = v;
    }
  }

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          transform: `scale(${kenBurnsScale}) translateX(${kenBurnsX}px)`,
          background: `linear-gradient(180deg, ${skyTop} 0%, ${skyBot} 100%)`,
        }}
      />

      {starsOpacity > 0 && (
        <svg
          style={{
            position: "absolute",
            inset: 0,
            opacity: starsOpacity,
            transform: `scale(${kenBurnsScale})`,
          }}
          width={width}
          height={height}
        >
          {Array.from({ length: 80 }, (_, i) => {
            const x = (i * 173) % width;
            const baseY = (i * 97) % (height + 200);
            const y = ((baseY + frame * 0.5) % (height + 200)) - 100;
            const r = ((i * 7) % 3) + 1;
            const twinkle = 0.55 + Math.sin((frame + i * 30) / 25) * 0.4;
            return <circle key={i} cx={x} cy={y} r={r} fill="#ffffff" opacity={twinkle} />;
          })}
        </svg>
      )}

      {godRaysOpacity > 0 && (
        <svg
          style={{
            position: "absolute",
            inset: 0,
            opacity: godRaysOpacity,
            mixBlendMode: "screen",
          }}
          width={width}
          height={height}
        >
          {Array.from({ length: 14 }, (_, i) => {
            const angle = (i / 14) * Math.PI * 2 + t * 0.04;
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
                strokeWidth={3}
                opacity={0.3}
              />
            );
          })}
        </svg>
      )}

      {verseShapesOpacity > 0 &&
        Array.from({ length: 6 }, (_, i) => {
          const x = ((i * 263 + frame * 0.6) % (width + 400)) - 200;
          const y = ((i * 117) % height) + Math.sin((frame + i * 50) / 60) * 20;
          const size = 220 + (i % 3) * 80;
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
                background:
                  i % 2 === 0
                    ? "radial-gradient(circle, rgba(255,178,122,0.55) 0%, transparent 70%)"
                    : "radial-gradient(circle, rgba(244,229,255,0.55) 0%, transparent 70%)",
                opacity: verseShapesOpacity,
                filter: "blur(24px)",
              }}
            />
          );
        })}

      {sunOpacity > 0 && (
        <>
          {lensFlareOpacity > 0 && (
            <div
              style={{
                position: "absolute",
                left: 0,
                top: sunY,
                width: width,
                height: 24,
                transform: "translateY(-50%)",
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(255,244,229,0) 30%, rgba(255,244,229,0.85) 50%, rgba(255,244,229,0) 70%, transparent 100%)",
                opacity: lensFlareOpacity * sunOpacity,
                filter: "blur(2px)",
                mixBlendMode: "screen",
              }}
            />
          )}
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
              boxShadow: "0 0 260px 110px rgba(255,212,121,0.6)",
            }}
          />
        </>
      )}

      {lightLeakOpacity > 0 && (
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(circle at 25% 50%, rgba(255,200,140,0.85) 0%, rgba(255,140,90,0.45) 25%, transparent 60%)",
            opacity: lightLeakOpacity,
            mixBlendMode: "screen",
          }}
        />
      )}

      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.55) 100%)",
          pointerEvents: "none",
        }}
      />

      {whiteoutOpacity > 0 && (
        <AbsoluteFill style={{ background: "#ffffff", opacity: whiteoutOpacity }} />
      )}
    </AbsoluteFill>
  );
};
