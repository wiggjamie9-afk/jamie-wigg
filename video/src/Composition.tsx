import { AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig } from "remotion";
import { AUDIO_FILENAME, LYRICS } from "./lyrics";
import { Background } from "./scenes/Background";
import { LyricLine } from "./scenes/LyricLine";
import { CinematicOverlay } from "./scenes/CinematicOverlay";

export const MyComposition: React.FC<{ hasAudio: boolean }> = ({ hasAudio }) => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      <Background />
      {LYRICS.map((line, i) => (
        <Sequence
          key={i}
          from={Math.round(line.start * fps)}
          durationInFrames={Math.round((line.end - line.start) * fps)}
          name={`lyric-${i}`}
        >
          <LyricLine text={line.text} section={line.section} />
        </Sequence>
      ))}
      <CinematicOverlay />
      {hasAudio && <Audio src={staticFile(AUDIO_FILENAME)} />}
    </AbsoluteFill>
  );
};
