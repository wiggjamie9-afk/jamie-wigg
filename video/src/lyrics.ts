import { Section } from "./theme";

export type LyricLine = {
  start: number;
  end: number;
  text: string;
  section: Section;
};

export const SONG_DURATION_SECONDS = 200;
export const AUDIO_FILENAME = "song.mp3";

export const LYRICS: LyricLine[] = [
  { start: 8,   end: 15,  text: "In the heart of the night, we find our way,",         section: "verse1"  },
  { start: 15,  end: 22,  text: "Chasing the glow, where the dreamers play.",           section: "verse1"  },
  { start: 22,  end: 29,  text: "Every heartbeat’s a pulse, a call to ignite,",     section: "verse1"  },
  { start: 29,  end: 36,  text: "Together we rise, reaching higher in flight.",         section: "verse1"  },

  { start: 36,  end: 42,  text: "Let the lights guide our souls,",                      section: "bridge1" },
  { start: 42,  end: 48,  text: "Together we’ll break the mold.",                  section: "bridge1" },

  { start: 48,  end: 55,  text: "We rise like the sun, we rise like the tide,",         section: "chorus1" },
  { start: 55,  end: 62,  text: "Hand in hand, we’re on this ride.",               section: "chorus1" },
  { start: 62,  end: 69,  text: "Love is the anthem, hope leads the way,",              section: "chorus1" },
  { start: 69,  end: 76,  text: "Together forever, we’ll dance and we’ll sway.", section: "chorus1" },

  { start: 76,  end: 83,  text: "With every whisper, together we stand,",               section: "verse2"  },
  { start: 83,  end: 90,  text: "Taking our dreams, painting the land.",                section: "verse2"  },
  { start: 90,  end: 97,  text: "No more shadows, we light up the skies,",              section: "verse2"  },
  { start: 97,  end: 104, text: "With voices united, our hopes will arise.",            section: "verse2"  },

  { start: 104, end: 110, text: "Feel the rhythm, hear it loud,",                       section: "bridge2" },
  { start: 110, end: 116, text: "This is our moment, let’s make it proud.",        section: "bridge2" },

  { start: 116, end: 123, text: "We rise like the sun, we rise like the tide,",         section: "chorus2" },
  { start: 123, end: 130, text: "Hand in hand, we’re on this ride.",               section: "chorus2" },
  { start: 130, end: 137, text: "Love is the anthem, hope leads the way,",              section: "chorus2" },
  { start: 137, end: 144, text: "Together forever, we’ll dance and we’ll sway.", section: "chorus2" },
  { start: 144, end: 158, text: "Hands in the air, we’re shining bright,",         section: "chorus2" },
  { start: 158, end: 180, text: "We rise together into the night.",                     section: "outro"   },
];
