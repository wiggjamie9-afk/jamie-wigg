import "./index.css";
import { Composition } from "remotion";
import { MyComposition } from "./Composition";
import { SONG_DURATION_SECONDS } from "./lyrics";

const FPS = 30;
const WIDTH = 1920;
const HEIGHT = 1080;

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="MyComp"
      component={MyComposition}
      durationInFrames={Math.round(SONG_DURATION_SECONDS * FPS)}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
      defaultProps={{ hasAudio: false }}
    />
  );
};
