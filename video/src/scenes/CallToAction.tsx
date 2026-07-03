import {
  AbsoluteFill,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Background } from "../components/Background";
import { LightSweep } from "../components/LightSweep";
import { COLORS, FONTS } from "../theme";
import { beatPulse } from "../motion";

const WORD = "RHYTHMIX";

/** Closing beat: the wordmark de-blurs into focus, the CTA pill springs in and
 * pulses on the beat. */
export const CallToAction: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const beat = beatPulse(frame, fps);

  const pill = spring({ frame: frame - 24, fps, config: { damping: 200 } });
  const float = Math.sin(frame / 20) * 6;

  return (
    <AbsoluteFill>
      <Background intensity={1.15} />
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 44,
          transform: `translateY(${float}px)`,
        }}
      >
        <div style={{ display: "flex", gap: 4 }}>
          {WORD.split("").map((ch, i) => {
            const s = spring({
              frame: frame - i * 2,
              fps,
              config: { damping: 200, mass: 0.6 },
            });
            const blur = (1 - s) * 20;
            return (
              <span
                key={i}
                style={{
                  fontFamily: FONTS.display,
                  fontWeight: 700,
                  fontSize: 138,
                  letterSpacing: 4,
                  color: COLORS.white,
                  opacity: s,
                  filter: blur > 0.1 ? `blur(${blur}px)` : undefined,
                  textShadow: `0 0 ${40 + beat * 44}px ${COLORS.magenta}aa`,
                }}
              >
                {ch}
              </span>
            );
          })}
        </div>

        <div
          style={{
            position: "relative",
            overflow: "hidden",
            fontFamily: FONTS.mono,
            fontSize: 46,
            fontWeight: 500,
            letterSpacing: 6,
            padding: "24px 60px",
            borderRadius: 999,
            color: COLORS.white,
            background: `linear-gradient(90deg, ${COLORS.magenta}, ${COLORS.purple})`,
            boxShadow: `0 0 ${44 + beat * 60}px ${COLORS.magenta}${beat > 0.4 ? "cc" : "66"}`,
            opacity: pill,
            transform: `scale(${0.8 + pill * 0.2})`,
          }}
        >
          rhythmixapp.com.au
          <LightSweep start={40} duration={30} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
