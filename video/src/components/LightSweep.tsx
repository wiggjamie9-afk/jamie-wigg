import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

/**
 * A specular highlight that sweeps left→right across its parent once, between
 * `start` and `start+duration`. Layer it over text or a card (parent needs
 * `position: relative` + `overflow: hidden`) for a premium glint.
 */
export const LightSweep: React.FC<{
  start: number;
  duration?: number;
  angle?: number;
  width?: number;
}> = ({ start, duration = 26, angle = 20, width = 24 }) => {
  const frame = useCurrentFrame();
  const pos = interpolate(frame, [start, start + duration], [-30, 130], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const visible = frame >= start && frame <= start + duration;

  return (
    <AbsoluteFill
      style={{
        opacity: visible ? 1 : 0,
        background: `linear-gradient(${90 + angle}deg, transparent ${pos - width}%, rgba(255,255,255,0.55) ${pos}%, transparent ${pos + width}%)`,
        mixBlendMode: "overlay",
        pointerEvents: "none",
      }}
    />
  );
};
