import { Section } from "./theme";

export type LyricLine = {
  start: number;
  end: number;
  text: string;
  section: Section;
};

export const SONG_DURATION_SECONDS = 210;
export const AUDIO_FILENAME = "song.mp3";

export const LYRICS: LyricLine[] = [
  { start: 8,   end: 15,  text: "In the heart of the night, we find our way,",         section: "verse1"  },
  { start: 15,  end: 23,  text: "Chasing the glow, where the dreamers play.",           section: "verse1"  },
  { start: 23,  end: 31,  text: "Every heartbeat’s a pulse, a call to ignite,",     section: "verse1"  },
  { start: 31,  end: 38,  text: "Together we rise, reaching higher in flight.",         section: "verse1"  },

  { start: 38,  end: 44,  text: "Let the lights guide our souls,",                      section: "bridge1" },
  { start: 44,  end: 50,  text: "Together we’ll break the mold.",                  section: "bridge1" },

  { start: 50,  end: 58,  text: "We rise like the sun, we rise like the tide,",         section: "chorus1" },
  { start: 58,  end: 65,  text: "Hand in hand, we’re on this ride.",               section: "chorus1" },
  { start: 65,  end: 72,  text: "Love is the anthem, hope leads the way,",              section: "chorus1" },
  { start: 72,  end: 80,  text: "Together forever, we’ll dance and we’ll sway.", section: "chorus1" },

  { start: 80,  end: 88,  text: "With every whisper, together we stand,",               section: "verse2"  },
  { start: 88,  end: 95,  text: "Taking our dreams, painting the land.",                section: "verse2"  },
  { start: 95,  end: 102, text: "No more shadows, we light up the skies,",              section: "verse2"  },
  { start: 102, end: 110, text: "With voices united, our hopes will arise.",            section: "verse2"  },

  { start: 110, end: 116, text: "Feel the rhythm, hear it loud,",                       section: "bridge2" },
  { start: 116, end: 122, text: "This is our moment, let’s make it proud.",        section: "bridge2" },

  { start: 122, end: 130, text: "We rise like the sun, we rise like the tide,",         section: "chorus2" },
  { start: 130, end: 138, text: "Hand in hand, we’re on this ride.",               section: "chorus2" },
  { start: 138, end: 146, text: "Love is the anthem, hope leads the way,",              section: "chorus2" },
  { start: 146, end: 154, text: "Together forever, we’ll dance and we’ll sway.", section: "chorus2" },
  { start: 154, end: 168, text: "Hands in the air, we’re shining bright,",         section: "chorus2" },
  { start: 168, end: 185, text: "We rise together into the night.",                     section: "outro"   },
];
