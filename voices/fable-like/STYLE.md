# "Fable-like" narration style

An **original** narration style inspired by the *character* of a warm storyteller
voice — unhurried, intimate, gently authoritative. It does **not** clone, copy, or
reproduce any specific proprietary voice (OpenAI's `fable`, ElevenLabs, etc.). It's
a reusable delivery + writing recipe you map onto a voice you're licensed to use
(Kokoro `bm_fable`, a warm ElevenLabs voice, macOS `Daniel`, or your own clone).

Use it whenever a script wants to feel like a story being told to one person, not an
announcer broadcasting to a crowd.

## The character in one line

> A calm narrator by a fire — warm mid-range, measured pace, sentences that settle
> downward at the end, more curious than salesy.

## Delivery direction (how it should sound)

| Dimension | Direction |
|---|---|
| **Pace** | Unhurried — ~135–150 wpm. Let clauses breathe; never rush the payoff word. |
| **Pitch** | Warm mid-range. Start phrases slightly up, resolve **downward** — gentle falling cadence, not upward "announcer" lift. |
| **Energy** | Low-to-moderate and steady. Intimate, close-mic feel — as if leaning in, not projecting. |
| **Emphasis** | Land one word per sentence, softly. Emphasis by *slowing*, not by getting louder. |
| **Pauses** | Generous. A full beat after each idea; a longer beat before a turn ("But…", "Then…"). |
| **Warmth** | Slight smile in the tone. Curious, reassuring, a touch of wonder — never hard-sell. |

## Writing style (how to write *for* this voice)

The delivery only lands if the words are shaped for it. When rewriting a script into
Fable-like narration:

1. **Short, complete sentences.** One idea each. Fragments are fine for rhythm ("No
   studio. No instrument.").
2. **Open on a question or an image**, not a claim. *"What if making music didn't take
   years?"* beats *"RHYTHMIX is an AI music platform."*
3. **Concrete over abstract.** "A complete studio in your pocket" over "a comprehensive
   feature set."
4. **Cadence in threes.** Group ideas in triads with a falling final beat
   ("Generate. Master. Release.").
5. **End on the quiet, human line**, not the loudest one. Trust the pause to sell.
6. **Cut hype adjectives.** No "revolutionary", "game-changing", "cutting-edge". Warmth
   comes from restraint.

## Reference cadence

The existing `rhythmix-overview-60s/script.txt` is already close to this style — note
the opening question, the triads, the plain concrete nouns, and the quiet close
("Just be first in line."). That script is a good north star.

## How to apply it

- **Sound**: feed `preset.json` prosody params to whichever backend you're using
  (see the `backends` block — Kokoro / ElevenLabs / macOS `say` / Pollinations).
- **Words**: run a script through the "Writing style" rules above (or hand it to the
  `video-scripter` / `copywriter` subagent with this file as the brief) before TTS.
- **Both**: `preset.json` is the machine-readable half of this doc — same style, wired
  for tooling.
