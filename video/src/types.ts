export type SceneBase = {
  durationInSeconds: number;
  voiceover?: string;
};

export type TitleScene = SceneBase & {
  type: "title";
  title: string;
  subtitle?: string;
  background?: string;
};

export type BulletScene = SceneBase & {
  type: "bullets";
  heading: string;
  bullets: string[];
  background?: string;
};

export type ImageScene = SceneBase & {
  type: "image";
  src: string;
  caption?: string;
  kenBurns?: boolean;
};

export type OutroScene = SceneBase & {
  type: "outro";
  title: string;
  subtitle?: string;
  background?: string;
};

export type Scene = TitleScene | BulletScene | ImageScene | OutroScene;

export type Campaign = {
  title: string;
  fps?: number;
  width?: number;
  height?: number;
  theme?: {
    primary?: string;
    accent?: string;
    text?: string;
    background?: string;
    fontFamily?: string;
  };
  scenes: Scene[];
};
