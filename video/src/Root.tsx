import "./index.css";
import { Composition } from "remotion";
import { MyComposition } from "./Composition";
import type { Campaign } from "./types";
import defaultCampaign from "../campaigns/example.json";
import activeCampaign from "../campaigns/active.json";
import voiceoverManifest from "../campaigns/voiceover-manifest.json";

const loadCampaign = (): Campaign => {
  return (activeCampaign ?? defaultCampaign) as Campaign;
};

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Campaign"
      component={MyComposition}
      durationInFrames={60}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{
        campaign: loadCampaign(),
        availableVoiceovers: voiceoverManifest.available,
      }}
      calculateMetadata={({ props }) => {
        const campaign = props.campaign ?? loadCampaign();
        const fps = campaign.fps ?? 30;
        const totalSeconds = campaign.scenes.reduce(
          (sum, s) => sum + s.durationInSeconds,
          0,
        );
        return {
          props: {
            campaign,
            availableVoiceovers: props.availableVoiceovers ?? voiceoverManifest.available,
          },
          durationInFrames: Math.max(1, Math.round(totalSeconds * fps)),
          fps,
          width: campaign.width ?? 1920,
          height: campaign.height ?? 1080,
        };
      }}
    />
  );
};
