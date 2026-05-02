export type Section =
  | "intro"
  | "verse1"
  | "bridge1"
  | "chorus1"
  | "verse2"
  | "bridge2"
  | "chorus2"
  | "outro";

type LyricPosition = "lower-third" | "center";

export const fontFamily = "'Playfair Display', 'Georgia', 'Times New Roman', serif";

export const SECTION_THEME: Record<
  Section,
  {
    lyricColor: string;
    lyricSize: number;
    lyricPosition: LyricPosition;
    lyricWeight: number;
  }
> = {
  intro: { lyricColor: "#ffffff", lyricSize: 64, lyricPosition: "lower-third", lyricWeight: 400 },
  verse1: { lyricColor: "#fffffff2", lyricSize: 64, lyricPosition: "lower-third", lyricWeight: 400 },
  bridge1: { lyricColor: "#fff4e5", lyricSize: 80, lyricPosition: "center", lyricWeight: 500 },
  chorus1: { lyricColor: "#fff4e5", lyricSize: 96, lyricPosition: "center", lyricWeight: 600 },
  verse2: { lyricColor: "#3a2640", lyricSize: 64, lyricPosition: "lower-third", lyricWeight: 400 },
  bridge2: { lyricColor: "#3a2640", lyricSize: 80, lyricPosition: "center", lyricWeight: 500 },
  chorus2: { lyricColor: "#3a2640", lyricSize: 104, lyricPosition: "center", lyricWeight: 700 },
  outro: { lyricColor: "#3a2640", lyricSize: 88, lyricPosition: "center", lyricWeight: 600 },
};
