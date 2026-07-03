import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../theme";
import { beatPulse } from "../motion";

/** A large, heavily-blurred colour blob drifting on a Lissajous path. */
const Blob: React.FC<{
  color: string;
  size: number;
  cx: number;
  cy: number;
  ax: number;
  ay: number;
  speed: number;
  phase: number;
  opacity: number;
}> = ({ color, size, cx, cy, ax, ay, speed, phase, opacity }) => {
  const frame = useCurrentFrame();
  const t = frame * speed + phase;
  const x = cx + Math.sin(t) * ax;
  const y = cy + Math.cos(t * 0.8) * ay;
  return (
    <div
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        transform: "translate(-50%, -50%)",
        borderRadius: "50%",
        background: color,
        filter: "blur(120px)",
        opacity,
        mixBlendMode: "screen",
      }}
    />
  );
};

/**
 * The RHYTHMIX canvas. Four drifting aurora blobs on the near-black canvas give
 * depth and colour that moves; a perspective dot-grid adds a floor; film grain
 * kills the flat digital look; a vignette focuses the centre. The whole field
 * brightens a touch on every beat so the background feels alive, not painted.
 */
export const Background: React.FC<{ intensity?: number }> = ({
  intensity = 1,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const beat = beatPulse(frame, fps);
  const gridShift = (frame * 0.6) % 46;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.canvas, overflow: "hidden" }}>
      {/* Aurora mesh — blurred blobs, no linear gradients (avoids banding). */}
      <AbsoluteFill style={{ opacity: 0.55 * intensity }}>
        <Blob color={COLORS.purple} size={1100} cx={28} cy={34} ax={9} ay={7} speed={0.012} phase={0} opacity={0.9} />
        <Blob color={COLORS.magenta} size={950} cx={74} cy={68} ax={11} ay={8} speed={0.016} phase={2} opacity={0.8} />
        <Blob color={COLORS.cyan} size={820} cx={64} cy={22} ax={13} ay={6} speed={0.02} phase={4} opacity={0.55} />
        <Blob color={COLORS.green} size={700} cx={22} cy={78} ax={10} ay={9} speed={0.014} phase={1} opacity={0.4} />
      </AbsoluteFill>

      {/* Perspective dot-grid floor for depth. */}
      <AbsoluteFill
        style={{
          top: "58%",
          backgroundImage: `radial-gradient(${COLORS.cyan}55 1.4px, transparent 1.4px)`,
          backgroundSize: "46px 46px",
          backgroundPosition: `center ${gridShift}px`,
          transform: "perspective(520px) rotateX(62deg) scale(2.4)",
          transformOrigin: "top center",
          maskImage: "linear-gradient(to bottom, black, transparent 70%)",
          WebkitMaskImage: "linear-gradient(to bottom, black, transparent 70%)",
          opacity: 0.35 * intensity,
        }}
      />

      {/* Beat bloom — subtle centre brighten on the downbeat. */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(60% 60% at 50% 46%, ${COLORS.magenta}22, transparent 72%)`,
          opacity: 0.25 + beat * 0.35 * intensity,
        }}
      />

      {/* Film grain — a fixed-seed turbulence so the compositor rasterises it
          once and reuses it (an animated seed recomputes every frame and OOMs
          a long render). Static grain still kills the flat digital look. */}
      <AbsoluteFill style={{ opacity: 0.07, mixBlendMode: "overlay" }}>
        <svg width="100%" height="100%">
          <filter id="grain">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.85"
              numOctaves={1}
              seed={2}
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#grain)" />
        </svg>
      </AbsoluteFill>

      {/* Vignette. */}
      <AbsoluteFill
        style={{
          boxShadow: "inset 0 0 420px 160px rgba(0,0,0,0.85)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
