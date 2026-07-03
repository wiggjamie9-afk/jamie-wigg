import {
  AbsoluteFill,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Background } from "../components/Background";
import { COLORS, FONTS, SPECTRUM } from "../theme";
import { beatPulse, ramp } from "../motion";

const WORD = "RHYTHMIX";

/**
 * Wordmark reveal: each letter unmasks upward from behind a clip (not a plain
 * translate+fade), lands with a spring, and carries a spectrum glow that pulses
 * on the beat. A light sweep glints across the finished word; the underline
 * draws with a leading dot.
 */
export const Wordmark: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const beat = beatPulse(frame, fps);

  const underline = ramp(frame, 30, 22, (x) => 1 - Math.pow(1 - x, 3));
  const tagline = spring({ frame: frame - 46, fps, config: { damping: 200 } });
  const breathe = 1 + Math.sin(frame / 22) * 0.012;

  return (
    <AbsoluteFill>
      <Background intensity={1.1} />
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 30,
        }}
      >
        <div
          style={{
            position: "relative",
            display: "flex",
            gap: 2,
            padding: "20px 10px",
            transform: `scale(${breathe})`,
          }}
        >
          {WORD.split("").map((ch, i) => {
            const start = i * 3.5;
            const rise = spring({
              frame: frame - start,
              fps,
              config: { damping: 200, mass: 0.7 },
            });
            const color = SPECTRUM[i % SPECTRUM.length];
            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  fontFamily: FONTS.display,
                  fontWeight: 700,
                  fontSize: 200,
                  lineHeight: 1.05,
                  color: COLORS.white,
                  opacity: rise,
                  transform: `translateY(${(1 - rise) * 90}px)`,
                  textShadow: `0 0 ${34 + beat * 40}px ${color}dd, 0 0 90px ${color}55`,
                }}
              >
                {ch}
              </span>
            );
          })}
        </div>

        {/* Underline that draws in, with a glowing leading dot. */}
        <div style={{ position: "relative", width: 820, height: 8 }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              width: `${underline * 100}%`,
              borderRadius: 4,
              background: `linear-gradient(90deg, ${COLORS.magenta}, ${COLORS.purple}, ${COLORS.cyan})`,
            }}
          />
          {underline > 0 && underline < 1 && (
            <div
              style={{
                position: "absolute",
                left: `${underline * 100}%`,
                top: "50%",
                width: 22,
                height: 22,
                transform: "translate(-50%,-50%)",
                borderRadius: "50%",
                background: COLORS.white,
                boxShadow: `0 0 26px ${COLORS.cyan}`,
              }}
            />
          )}
        </div>

        <div
          style={{
            fontFamily: FONTS.mono,
            fontSize: 32,
            fontWeight: 500,
            letterSpacing: 8,
            color: COLORS.muted,
            opacity: tagline,
            transform: `translateY(${(1 - tagline) * 16}px)`,
          }}
        >
          Your track. Your video. Your voice.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
