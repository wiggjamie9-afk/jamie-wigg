import { interpolate, useCurrentFrame } from "remotion";
import { SPECTRUM } from "../theme";

/**
 * A deterministic audio equalizer. Bar heights come from layered sines (never
 * Math.random — renders must be frame-deterministic) so playback is identical
 * every time. Bars stagger in from the centre outward.
 */
export const Equalizer: React.FC<{
  bars?: number;
  width?: number;
  height?: number;
  /** Frame at which bars begin appearing. */
  startAt?: number;
}> = ({ bars = 24, width = 900, height = 260, startAt = 0 }) => {
  const frame = useCurrentFrame();
  const barWidth = width / bars / 1.6;
  const gap = (width - barWidth * bars) / (bars - 1);
  const mid = (bars - 1) / 2;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        gap,
        width,
        height,
      }}
    >
      {Array.from({ length: bars }).map((_, i) => {
        // Stagger from the centre outward: middle bars rise first.
        const delay = startAt + Math.abs(i - mid) * 2.2;
        const rise = interpolate(frame, [delay, delay + 14], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        // Layered sines keep neighbouring bars related but not identical.
        const level =
          0.35 +
          0.32 * Math.sin(frame / 6 + i * 0.55) +
          0.18 * Math.sin(frame / 11 + i * 1.3);
        const barHeight = Math.max(0.06, level) * height * rise;
        const color = SPECTRUM[i % SPECTRUM.length];

        return (
          <div
            key={i}
            style={{
              width: barWidth,
              height: barHeight,
              borderRadius: barWidth / 2,
              background: color,
              boxShadow: `0 0 ${barWidth}px ${color}aa`,
            }}
          />
        );
      })}
    </div>
  );
};
