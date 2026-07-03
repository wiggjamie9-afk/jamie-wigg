import { useCurrentFrame, useVideoConfig } from "remotion";
import { SPECTRUM } from "../theme";
import { beatPulse, ramp } from "../motion";

/**
 * A deterministic, beat-reactive audio equalizer. Heights come from layered
 * sines plus the shared beat envelope (never Math.random — renders must be
 * frame-deterministic), so bars punch on tempo together. Each bar casts a
 * fading mirror reflection for a "on a glossy stage" feel.
 */
export const Equalizer: React.FC<{
  bars?: number;
  width?: number;
  height?: number;
  startAt?: number;
}> = ({ bars = 32, width = 1080, height = 300, startAt = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const beat = beatPulse(frame, fps);
  const barWidth = width / bars / 1.7;
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
        const delay = startAt + Math.abs(i - mid) * 1.8;
        const rise = ramp(frame, delay, 16, (x) => 1 - Math.pow(1 - x, 3));
        // Layered sines keep neighbours related; the beat adds a shared punch
        // strongest toward the centre.
        const centreBias = 1 - Math.abs(i - mid) / mid;
        const level =
          0.28 +
          0.26 * Math.sin(frame / 5.5 + i * 0.5) +
          0.16 * Math.sin(frame / 9 + i * 1.2) +
          beat * 0.4 * (0.4 + 0.6 * centreBias);
        const h = Math.max(0.05, level) * height * rise;
        const color = SPECTRUM[i % SPECTRUM.length];

        // Each bar stands on the shared baseline (flex-end) and grows up; its
        // reflection is absolutely positioned just below the baseline.
        return (
          <div key={i} style={{ position: "relative", width: barWidth, height: h }}>
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: barWidth,
                background: `linear-gradient(to top, ${color}, #ffffff)`,
                boxShadow: `0 0 ${barWidth * (1 + beat)}px ${color}`,
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                marginTop: 8,
                width: barWidth,
                height: h * 0.55,
                borderRadius: barWidth,
                background: color,
                opacity: 0.18,
                transform: "scaleY(-1)",
                filter: "blur(2px)",
                maskImage: "linear-gradient(to bottom, black, transparent)",
                WebkitMaskImage: "linear-gradient(to bottom, black, transparent)",
              }}
            />
          </div>
        );
      })}
    </div>
  );
};
