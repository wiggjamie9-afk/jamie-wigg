import { AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig } from "remotion";
import type { Campaign, Scene } from "./types";
import { TitleScene } from "./scenes/TitleScene";
import { BulletScene } from "./scenes/BulletScene";
import { ImageScene } from "./scenes/ImageScene";
import { OutroScene } from "./scenes/OutroScene";

type Props = {
  campaign: Campaign;
  availableVoiceovers?: number[];
};

const renderScene = (scene: Scene, theme: Campaign["theme"]) => {
  switch (scene.type) {
    case "title":
      return <TitleScene {...scene} theme={theme} />;
    case "bullets":
      return <BulletScene {...scene} theme={theme} />;
    case "image":
      return <ImageScene {...scene} theme={theme} />;
    case "outro":
      return <OutroScene {...scene} theme={theme} />;
  }
};

export const MyComposition: React.FC<Props> = ({ campaign, availableVoiceovers = [] }) => {
  const { fps } = useVideoConfig();
  const voiceSet = new Set(availableVoiceovers);
  let cursor = 0;

  return (
    <AbsoluteFill style={{ backgroundColor: campaign.theme?.background ?? "#0b0b12" }}>
      {campaign.scenes.map((scene, i) => {
        const durationInFrames = Math.max(1, Math.round(scene.durationInSeconds * fps));
        const from = cursor;
        cursor += durationInFrames;
        const hasVoice = voiceSet.has(i);
        return (
          <Sequence key={i} from={from} durationInFrames={durationInFrames}>
            {renderScene(scene, campaign.theme)}
            {hasVoice && <Audio src={staticFile(`voiceover/scene-${i}.mp3`)} />}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
