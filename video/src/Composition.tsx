import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  interpolateColors,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const Sky: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = frame / durationInFrames;

  const top = interpolateColors(
    t,
    [0, 0.55, 0.8, 1],
    ["#7ec8ff", "#a0d8ff", "#ffb27a", "#3b2a5a"],
  );
  const bottom = interpolateColors(
    t,
    [0, 0.55, 0.8, 1],
    ["#cdeaff", "#e6f4ff", "#ffd7a0", "#7c5da0"],
  );

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(to bottom, ${top} 0%, ${bottom} 70%)`,
      }}
    />
  );
};

const Sun: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames, width, height } = useVideoConfig();
  const t = frame / durationInFrames;

  const x = interpolate(t, [0, 1], [width * 0.15, width * 0.85]);
  const y = interpolate(
    t,
    [0, 0.5, 1],
    [height * 0.18, height * 0.12, height * 0.62],
  );
  const color = interpolateColors(
    t,
    [0, 0.7, 1],
    ["#fff3a8", "#ffd06a", "#ff7a5a"],
  );

  return (
    <div
      style={{
        position: "absolute",
        left: x - 90,
        top: y - 90,
        width: 180,
        height: 180,
        borderRadius: "50%",
        background: color,
        boxShadow: `0 0 120px 40px ${color}`,
      }}
    />
  );
};

const Cloud: React.FC<{
  startX: number;
  y: number;
  scale: number;
  speed: number;
}> = ({ startX, y, scale, speed }) => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  const x = ((startX + frame * speed) % (width + 400)) - 200;

  return (
    <svg
      width={220 * scale}
      height={110 * scale}
      viewBox="0 0 220 110"
      style={{ position: "absolute", left: x, top: y, opacity: 0.85 }}
    >
      <g fill="white">
        <circle cx="55" cy="65" r="35" />
        <circle cx="95" cy="45" r="40" />
        <circle cx="140" cy="55" r="38" />
        <circle cx="175" cy="70" r="30" />
        <ellipse cx="110" cy="80" rx="90" ry="22" />
      </g>
    </svg>
  );
};

const Clouds: React.FC = () => (
  <>
    <Cloud startX={100} y={120} scale={1} speed={0.6} />
    <Cloud startX={700} y={220} scale={0.7} speed={0.4} />
    <Cloud startX={1300} y={80} scale={1.2} speed={0.5} />
    <Cloud startX={1700} y={300} scale={0.9} speed={0.7} />
  </>
);

const Pond: React.FC = () => {
  const { width, height } = useVideoConfig();
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: height * 0.62,
        width,
        height: height * 0.5,
        background:
          "linear-gradient(to bottom, #4ea8d8 0%, #2c6f9a 60%, #1e5276 100%)",
      }}
    />
  );
};

const Ripple: React.FC<{
  cx: number;
  cy: number;
  delay: number;
  color?: string;
}> = ({ cx, cy, delay, color = "rgba(255,255,255,0.55)" }) => {
  const frame = useCurrentFrame();
  const local = (frame - delay) % 90;
  if (local < 0) return null;
  const r = interpolate(local, [0, 90], [10, 90]);
  const opacity = interpolate(local, [0, 90], [0.7, 0]);
  return (
    <ellipse
      cx={cx}
      cy={cy}
      rx={r}
      ry={r * 0.35}
      fill="none"
      stroke={color}
      strokeWidth={3}
      opacity={opacity}
    />
  );
};

const DuckSvg: React.FC<{ size?: number; flip?: boolean }> = ({
  size = 1,
  flip = false,
}) => {
  return (
    <svg
      width={260 * size}
      height={200 * size}
      viewBox="0 0 260 200"
      style={{ transform: flip ? "scaleX(-1)" : undefined }}
    >
      <ellipse cx="130" cy="170" rx="90" ry="14" fill="rgba(0,0,0,0.18)" />
      <path
        d="M40,140 Q60,90 130,90 Q200,90 215,130 Q220,160 175,165 Q90,170 50,160 Z"
        fill="#fff2a8"
        stroke="#e0c060"
        strokeWidth="3"
      />
      <path
        d="M55,150 Q60,135 75,138 Q72,150 60,158 Z"
        fill="#fff2a8"
        stroke="#e0c060"
        strokeWidth="2"
      />
      <circle cx="195" cy="80" r="38" fill="#fff2a8" stroke="#e0c060" strokeWidth="3" />
      <circle cx="205" cy="74" r="6" fill="#1a1a1a" />
      <circle cx="207" cy="72" r="2" fill="#fff" />
      <path
        d="M225,82 Q252,82 250,95 Q248,103 225,100 Z"
        fill="#ff9a3c"
        stroke="#c46a14"
        strokeWidth="2"
      />
      <path
        d="M228,92 Q244,92 244,98 Q240,102 228,100 Z"
        fill="#c46a14"
        opacity="0.5"
      />
      <path
        d="M150,85 Q170,55 195,55 Q200,68 195,80"
        fill="none"
        stroke="#e0c060"
        strokeWidth="3"
      />
    </svg>
  );
};

const FloatingDuck: React.FC<{
  x: number;
  y: number;
  size?: number;
  bobPhase?: number;
  flip?: boolean;
}> = ({ x, y, size = 1, bobPhase = 0, flip = false }) => {
  const frame = useCurrentFrame();
  const bob = Math.sin((frame + bobPhase) / 14) * 6;
  const tilt = Math.sin((frame + bobPhase) / 18) * 2;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y + bob,
        transform: `rotate(${tilt}deg)`,
      }}
    >
      <DuckSvg size={size} flip={flip} />
    </div>
  );
};

const TitleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const intro = spring({ frame, fps, config: { damping: 12 } });
  const sub = spring({ frame: frame - 20, fps, config: { damping: 14 } });
  const fadeOut = interpolate(frame, [120, 150], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        opacity: fadeOut,
      }}
    >
      <div
        style={{
          transform: `scale(${intro})`,
          fontFamily: "Georgia, serif",
          fontSize: 160,
          fontWeight: 800,
          color: "#fff8d8",
          textShadow: "0 8px 30px rgba(40,30,0,0.45)",
          letterSpacing: 4,
        }}
      >
        A Duck's Tale
      </div>
      <div
        style={{
          marginTop: 24,
          opacity: sub,
          transform: `translateY(${(1 - sub) * 20}px)`,
          fontFamily: "Georgia, serif",
          fontSize: 44,
          color: "#fff8d8",
          fontStyle: "italic",
          textShadow: "0 4px 12px rgba(40,30,0,0.45)",
        }}
      >
        a quiet day at the pond
      </div>
    </AbsoluteFill>
  );
};

const Caption: React.FC<{ text: string; from: number; to: number }> = ({
  text,
  from,
  to,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(
    frame,
    [from, from + 15, to - 15, to],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  if (frame < from || frame > to) return null;
  return (
    <div
      style={{
        position: "absolute",
        bottom: 80,
        width: "100%",
        textAlign: "center",
        opacity,
        fontFamily: "Georgia, serif",
        fontSize: 56,
        color: "white",
        textShadow: "0 4px 16px rgba(0,0,0,0.55)",
        fontStyle: "italic",
        letterSpacing: 1,
      }}
    >
      {text}
    </div>
  );
};

const ArrivalScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const x = interpolate(frame, [0, 180], [-300, width * 0.25], {
    extrapolateRight: "clamp",
  });
  const y = height * 0.66;
  return (
    <>
      <FloatingDuck x={x} y={y} size={1.1} />
      <svg
        width={width}
        height={height}
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        <Ripple cx={x + 130} cy={y + 175} delay={0} />
        <Ripple cx={x + 130} cy={y + 175} delay={45} />
      </svg>
    </>
  );
};

const SwimScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const x = interpolate(frame, [0, 300], [width * 0.25, width * 0.55]);
  const y = height * 0.66;
  return (
    <>
      <FloatingDuck x={x} y={y} size={1.1} bobPhase={5} />
      <svg
        width={width}
        height={height}
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        <Ripple cx={x + 130} cy={y + 175} delay={0} />
        <Ripple cx={x + 130} cy={y + 175} delay={30} />
        <Ripple cx={x + 130} cy={y + 175} delay={60} />
      </svg>
    </>
  );
};

const FamilyScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const baseX = interpolate(frame, [0, 300], [width * 0.55, width * 0.78]);
  const y = height * 0.66;

  const ducklings = [0, 1, 2, 3].map((i) => {
    const appear = spring({
      frame: frame - 30 - i * 15,
      fps: 30,
      config: { damping: 12 },
    });
    const offset = 110 + i * 80;
    return (
      <div
        key={i}
        style={{
          position: "absolute",
          left: baseX - offset,
          top: y + 40,
          opacity: appear,
          transform: `scale(${0.45 * appear})`,
          transformOrigin: "bottom left",
        }}
      >
        <DuckSvg size={0.45} />
      </div>
    );
  });

  return (
    <>
      <FloatingDuck x={baseX} y={y} size={1.1} bobPhase={9} />
      {ducklings}
      <svg
        width={width}
        height={height}
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        <Ripple cx={baseX + 130} cy={y + 175} delay={0} />
        <Ripple cx={baseX + 130} cy={y + 175} delay={45} />
        {[0, 1, 2, 3].map((i) => (
          <Ripple
            key={i}
            cx={baseX - 110 - i * 80 + 60}
            cy={y + 215}
            delay={i * 10}
            color="rgba(255,255,255,0.4)"
          />
        ))}
      </svg>
    </>
  );
};

const SunsetScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const liftStart = 90;
  const flyProgress = spring({
    frame: frame - liftStart,
    fps,
    config: { damping: 18, stiffness: 60 },
  });
  const x = interpolate(flyProgress, [0, 1], [width * 0.78, width * 1.1]);
  const y = interpolate(flyProgress, [0, 1], [height * 0.66, height * 0.2]);

  const wingFlap = Math.sin(frame / 3) * 18;

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          transform: `rotate(${-8}deg)`,
        }}
      >
        <svg width={300} height={220} viewBox="0 0 300 220">
          <ellipse cx="150" cy="130" rx="100" ry="22" fill="#fff2a8" stroke="#e0c060" strokeWidth="3" />
          <circle cx="220" cy="100" r="38" fill="#fff2a8" stroke="#e0c060" strokeWidth="3" />
          <circle cx="230" cy="94" r="5" fill="#1a1a1a" />
          <path d="M250,102 Q278,102 276,114 Q274,122 250,118 Z" fill="#ff9a3c" stroke="#c46a14" strokeWidth="2" />
          <path
            d={`M120,120 Q130,${90 - wingFlap} 80,${100 - wingFlap} Q60,${110 - wingFlap} 110,140 Z`}
            fill="#ffe27a"
            stroke="#e0c060"
            strokeWidth="3"
          />
          <path
            d={`M150,140 Q160,${170 + wingFlap} 110,${180 + wingFlap} Q90,${175 + wingFlap} 130,150 Z`}
            fill="#e0c060"
            opacity="0.85"
          />
        </svg>
      </div>
      {[0, 1, 2, 3].map((i) => {
        const yy = height * 0.66 + 40;
        const xx = interpolate(
          frame,
          [0, 200],
          [width * 0.78 - 110 - i * 80, width * 0.85 - 110 - i * 80],
        );
        const fade = interpolate(frame, [120, 200], [1, 0.7]);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: xx,
              top: yy,
              opacity: fade,
              transform: "scale(0.45)",
              transformOrigin: "bottom left",
            }}
          >
            <DuckSvg size={0.45} />
          </div>
        );
      })}
    </>
  );
};

const EndScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fadeIn = spring({ frame, fps, config: { damping: 18 } });
  return (
    <AbsoluteFill
      style={{
        background: "rgba(20,10,40,0.55)",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          opacity: fadeIn,
          transform: `scale(${0.9 + fadeIn * 0.1})`,
          fontFamily: "Georgia, serif",
          fontSize: 180,
          fontWeight: 800,
          color: "#fff8d8",
          textShadow: "0 8px 30px rgba(0,0,0,0.6)",
          letterSpacing: 6,
        }}
      >
        Fin.
      </div>
      <div
        style={{
          marginTop: 20,
          opacity: fadeIn,
          fontFamily: "Georgia, serif",
          fontSize: 36,
          color: "#fff8d8",
          fontStyle: "italic",
          letterSpacing: 2,
        }}
      >
        🦆
      </div>
    </AbsoluteFill>
  );
};

const Soundtrack: React.FC = () => {
  const { durationInFrames, fps } = useVideoConfig();
  const fadeIn = Math.round(fps * 1.5);
  const fadeOut = Math.round(fps * 2);
  return (
    <Audio
      src={staticFile("music.mp3")}
      volume={(f) =>
        interpolate(
          f,
          [0, fadeIn, durationInFrames - fadeOut, durationInFrames],
          [0, 0.6, 0.6, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        )
      }
    />
  );
};

export const DuckMovie: React.FC = () => {
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Soundtrack />
      <Sky />
      <Sun />
      <Clouds />
      <Pond />

      <Sequence from={150} durationInFrames={300}>
        <ArrivalScene />
      </Sequence>
      <Sequence from={450} durationInFrames={300}>
        <SwimScene />
      </Sequence>
      <Sequence from={750} durationInFrames={300}>
        <FamilyScene />
      </Sequence>
      <Sequence from={1050} durationInFrames={450}>
        <SunsetScene />
      </Sequence>

      <Sequence from={0} durationInFrames={150}>
        <TitleScene />
      </Sequence>

      <Caption text="One quiet morning..." from={170} to={420} />
      <Caption text="A duck arrived at the pond." from={460} to={720} />
      <Caption text="And was not alone." from={820} to={1020} />
      <Caption text="As the sun set, they took to the sky." from={1100} to={1450} />

      <Sequence from={1500} durationInFrames={300}>
        <EndScene />
      </Sequence>
    </AbsoluteFill>
  );
};
