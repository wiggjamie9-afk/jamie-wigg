import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
  spring,
} from "remotion";

// === Helper components ===

const Particles: React.FC<{ count: number; color: string; speed?: number }> = ({
  count,
  color,
  speed = 1,
}) => {
  const frame = useCurrentFrame();
  const particles = Array.from({ length: count }).map((_, i) => {
    const seed = i * 9301 + 49297;
    const x = seed % 1920;
    const baseY = (seed * 7) % 1080;
    const drift = Math.sin((frame + i * 13) / (40 / speed)) * 30;
    const y = (baseY + frame * 0.4 * speed) % 1080;
    const size = 2 + ((seed * 3) % 6);
    const opacity = 0.3 + Math.abs(Math.sin((frame + i * 5) / 30)) * 0.7;
    return (
      <div
        key={i}
        style={{
          position: "absolute",
          left: x + drift,
          top: y,
          width: size,
          height: size,
          borderRadius: "50%",
          background: color,
          boxShadow: `0 0 ${size * 4}px ${color}`,
          opacity,
        }}
      />
    );
  });
  return <>{particles}</>;
};

const FairyLights: React.FC<{ y: number; color: string }> = ({ y, color }) => {
  const frame = useCurrentFrame();
  const bulbs = Array.from({ length: 24 }).map((_, i) => {
    const x = (i / 23) * 1920;
    const yOffset = Math.sin(i * 0.8) * 18 + Math.sin(frame / 60 + i) * 6;
    const flicker = 0.55 + Math.abs(Math.sin(frame / 12 + i * 1.7)) * 0.45;
    return (
      <div
        key={i}
        style={{
          position: "absolute",
          left: x,
          top: y + yOffset,
          width: 14,
          height: 14,
          borderRadius: "50%",
          background: color,
          boxShadow: `0 0 24px ${color}, 0 0 60px ${color}`,
          opacity: flicker,
        }}
      />
    );
  });
  return <>{bulbs}</>;
};

const CityScape: React.FC<{ tone: "blue" | "amber" | "magenta" | "gold" }> = ({
  tone,
}) => {
  const palette = {
    blue: { fg: "#0a1530", win: "#ffd27a" },
    amber: { fg: "#1a0f08", win: "#ffb066" },
    magenta: { fg: "#2a0a1f", win: "#ff8fa3" },
    gold: { fg: "#1f1405", win: "#ffe28a" },
  }[tone];
  const buildings = Array.from({ length: 14 }).map((_, i) => {
    const seed = i * 137;
    const w = 80 + (seed % 90);
    const h = 200 + ((seed * 3) % 380);
    const x = i * 140 - 30;
    const windows = Array.from({ length: Math.floor(h / 40) }).map((_, r) => {
      const lit = (seed * (r + 1)) % 5 > 1;
      return (
        <div
          key={r}
          style={{
            display: "flex",
            justifyContent: "space-around",
            padding: "6px 0",
          }}
        >
          {Array.from({ length: Math.max(2, Math.floor(w / 30)) }).map(
            (__, c) => (
              <div
                key={c}
                style={{
                  width: 8,
                  height: 12,
                  background:
                    lit && (c + r) % 2 === 0 ? palette.win : "transparent",
                  boxShadow:
                    lit && (c + r) % 2 === 0
                      ? `0 0 8px ${palette.win}`
                      : "none",
                  opacity: 0.85,
                }}
              />
            ),
          )}
        </div>
      );
    });
    return (
      <div
        key={i}
        style={{
          position: "absolute",
          left: x,
          bottom: 0,
          width: w,
          height: h,
          background: palette.fg,
          borderTop: `2px solid ${palette.fg}`,
        }}
      >
        {windows}
      </div>
    );
  });
  return <>{buildings}</>;
};

const Gradient: React.FC<{
  from: string;
  to: string;
  via?: string;
  pulse?: boolean;
}> = ({ from, to, via, pulse = false }) => {
  const frame = useCurrentFrame();
  const angle = pulse ? 135 + Math.sin(frame / 40) * 10 : 135;
  const stops = via ? `${from}, ${via} 50%, ${to}` : `${from}, ${to}`;
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${angle}deg, ${stops})`,
      }}
    />
  );
};

// === Scenes (one per storyboard section) ===

const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const lightSweep = interpolate(frame, [0, 540], [0, 1], {
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill>
      <Gradient from="#02050f" via="#0a1432" to="#1a2b5e" pulse />
      <Particles count={60} color="rgba(255, 220, 160, 0.6)" speed={0.3} />
      <CityScape tone="blue" />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at ${lightSweep * 100}% 70%, rgba(255,200,120,0.25), transparent 40%)`,
        }}
      />
      <FairyLights y={120} color="#ffcf6e" />
    </AbsoluteFill>
  );
};

const Verse1: React.FC = () => {
  return (
    <AbsoluteFill>
      <Gradient from="#0d0a1f" via="#2b1a3a" to="#5a2a3e" />
      <Particles count={80} color="rgba(255, 200, 130, 0.7)" speed={0.4} />
      <CityScape tone="amber" />
      <FairyLights y={180} color="#ffb14a" />
    </AbsoluteFill>
  );
};

const Bridge1: React.FC = () => {
  const frame = useCurrentFrame();
  const glow = interpolate(frame, [0, 360], [0.2, 1], {
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill>
      <Gradient from="#1a0f2e" via="#4a2566" to="#a8536b" pulse />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 50% 30%, rgba(255, 220, 140, ${glow * 0.7}), transparent 50%)`,
        }}
      />
      <Particles count={120} color="rgba(255, 230, 170, 0.85)" speed={0.6} />
      <FairyLights y={140} color="#ffe4a3" />
    </AbsoluteFill>
  );
};

const Chorus1: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Gradient from="#3a0d3e" via="#c0395e" to="#ff9a4d" pulse />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at 50% 80%, rgba(255, 240, 180, 0.35), transparent 60%)`,
          mixBlendMode: "screen",
        }}
      />
      <Particles count={150} color="rgba(255, 245, 200, 0.9)" speed={1.2} />
      <CityScape tone="magenta" />
      <FairyLights y={100} color="#fff1c2" />
      <FairyLights y={260} color="#ffb56b" />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: 6,
          background: "rgba(255, 240, 200, 0.4)",
          boxShadow: "0 0 40px rgba(255,240,200,0.8)",
          transform: `translateY(${(frame * 3) % 1080}px)`,
        }}
      />
    </AbsoluteFill>
  );
};

const Verse2: React.FC = () => {
  return (
    <AbsoluteFill>
      <Gradient from="#0e0a1a" via="#3a2a1a" to="#7a4a2a" />
      <Particles count={100} color="rgba(255, 190, 110, 0.85)" speed={0.5} />
      <FairyLights y={150} color="#ffb070" />
      <FairyLights y={240} color="#ffd089" />
      <FairyLights y={340} color="#ffa050" />
    </AbsoluteFill>
  );
};

const Bridge2: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Gradient from="#1a1030" via="#5a3066" to="#d0608a" pulse />
      <Particles count={160} color="rgba(255, 240, 190, 0.95)" speed={1.4} />
      <FairyLights y={120} color="#fff1c2" />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 50% 50%, rgba(255, 220, 150, ${0.2 + Math.abs(Math.sin(frame / 10)) * 0.4}), transparent 55%)`,
        }}
      />
    </AbsoluteFill>
  );
};

const Chorus2: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Gradient from="#4a1a1a" via="#d06030" to="#ffd070" pulse />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 50% 50%, rgba(255, 250, 220, 0.5), transparent 65%)`,
          mixBlendMode: "screen",
        }}
      />
      <Particles count={220} color="rgba(255, 250, 220, 0.95)" speed={1.6} />
      <CityScape tone="gold" />
      <FairyLights y={80} color="#fff5cc" />
      <FairyLights y={200} color="#ffd070" />
      <FairyLights y={320} color="#ffb84a" />
      {Array.from({ length: 8 }).map((_, i) => {
        const burstStart = i * 140;
        const local = (frame - burstStart) % 1140;
        const radius = interpolate(local, [0, 80], [0, 220], {
          extrapolateRight: "clamp",
        });
        const opacity = interpolate(local, [0, 30, 80], [0, 1, 0], {
          extrapolateRight: "clamp",
        });
        const cx = 200 + i * 220;
        const cy = 540 + Math.sin(i) * 100;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: cx - radius,
              top: cy - radius,
              width: radius * 2,
              height: radius * 2,
              borderRadius: "50%",
              border: "2px solid rgba(255,240,180,0.8)",
              boxShadow: "0 0 30px rgba(255,240,180,0.7)",
              opacity,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [600, 900], [1, 0.4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill>
      <Gradient from="#1a0a05" via="#4a2510" to="#a05a30" />
      <div style={{ position: "absolute", inset: 0, opacity: fade }}>
        <Particles count={80} color="rgba(255, 210, 150, 0.7)" speed={0.3} />
        <FairyLights y={180} color="#ffb86a" />
        <FairyLights y={320} color="#ffd28a" />
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 50% 60%, rgba(255, 220, 160, 0.35), transparent 60%)`,
        }}
      />
    </AbsoluteFill>
  );
};

const TitleCard: React.FC<{
  title: string;
  subtitle?: string;
  start: number;
  duration: number;
}> = ({ title, subtitle, start, duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - start;
  if (local < 0 || local > duration) return null;
  const scale = spring({ frame: local, fps, config: { damping: 18 } });
  const opacity = interpolate(
    local,
    [0, 20, duration - 25, duration],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      <div
        style={{
          fontSize: 160,
          fontWeight: 800,
          color: "#fff5d8",
          fontFamily: "Georgia, serif",
          letterSpacing: "0.04em",
          textShadow:
            "0 4px 40px rgba(0,0,0,0.6), 0 0 80px rgba(255,200,120,0.45)",
        }}
      >
        {title}
      </div>
      {subtitle && (
        <div
          style={{
            marginTop: 24,
            fontSize: 42,
            color: "#ffe7b8",
            fontStyle: "italic",
            fontFamily: "Georgia, serif",
            letterSpacing: "0.2em",
            opacity: 0.85,
          }}
        >
          {subtitle}
        </div>
      )}
    </AbsoluteFill>
  );
};

// === MAIN COMPOSITION ===
// 200 sec @ 30fps = 6000 frames
// Sections match the storyboard timing.

export const MyComposition: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Sequence from={0} durationInFrames={540}>
        <Intro />
      </Sequence>
      <Sequence from={540} durationInFrames={900}>
        <Verse1 />
      </Sequence>
      <Sequence from={1440} durationInFrames={360}>
        <Bridge1 />
      </Sequence>
      <Sequence from={1800} durationInFrames={900}>
        <Chorus1 />
      </Sequence>
      <Sequence from={2700} durationInFrames={900}>
        <Verse2 />
      </Sequence>
      <Sequence from={3600} durationInFrames={360}>
        <Bridge2 />
      </Sequence>
      <Sequence from={3960} durationInFrames={1140}>
        <Chorus2 />
      </Sequence>
      <Sequence from={5100} durationInFrames={900}>
        <Outro />
      </Sequence>

      <TitleCard
        title="WE RISE"
        subtitle="a music video"
        start={120}
        duration={300}
      />
      <TitleCard title="WE RISE" subtitle="together" start={5800} duration={200} />
    </AbsoluteFill>
  );
};
