import { AbsoluteFill, Sequence } from "remotion";
import { CrossfadeScene } from "./components/CrossfadeScene";
import { Intro } from "./scenes/Intro";
import { Wordmark } from "./scenes/Wordmark";
import { Stats } from "./scenes/Stats";
import { CallToAction } from "./scenes/CallToAction";
import { COLORS, CROSSFADE, SCENE_FRAMES } from "./theme";

/**
 * Scene order and lengths. Each scene starts CROSSFADE frames before the
 * previous one ends, so the fade-out of one overlaps the fade-in of the next —
 * that overlap is the crossfade.
 */
const SCENES = [
  { Component: Intro, duration: SCENE_FRAMES.intro },
  { Component: Wordmark, duration: SCENE_FRAMES.wordmark },
  { Component: Stats, duration: SCENE_FRAMES.stats },
  { Component: CallToAction, duration: SCENE_FRAMES.cta },
] as const;

/** Start frame of each scene, accounting for the crossfade overlap. */
export const sceneStarts = SCENES.reduce<number[]>((starts, _, i) => {
  if (i === 0) return [0];
  const prevStart = starts[i - 1];
  const prevDuration = SCENES[i - 1].duration;
  starts.push(prevStart + prevDuration - CROSSFADE);
  return starts;
}, []);

/** Total timeline length in frames, kept in sync with <Composition>. */
export const TOTAL_FRAMES =
  sceneStarts[SCENES.length - 1] + SCENES[SCENES.length - 1].duration;

/** The RHYTHMIX brand promo — four crossfaded scenes over the dark canvas. */
export const MyComposition: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.canvas }}>
      {SCENES.map(({ Component, duration }, i) => (
        <Sequence key={i} from={sceneStarts[i]} durationInFrames={duration}>
          <CrossfadeScene
            durationInFrames={duration}
            holdEnd={i === SCENES.length - 1}
          >
            <Component />
          </CrossfadeScene>
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
