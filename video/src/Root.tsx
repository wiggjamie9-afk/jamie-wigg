import "./index.css";
import { Composition } from "remotion";
import { MyComposition } from "./Composition";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="WeRise"
        component={MyComposition}
        durationInFrames={6000}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
