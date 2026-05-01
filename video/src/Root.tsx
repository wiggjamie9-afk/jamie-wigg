import "./index.css";
import { Composition } from "remotion";
import { DuckMovie } from "./Composition";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="DuckMovie"
        component={DuckMovie}
        durationInFrames={1800}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
