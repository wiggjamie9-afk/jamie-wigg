# RHYTHMIX Podcast Network — Voiceover Kit

End-to-end pipeline for the 20-show network: scripts → TTS audio → Buzzsprout
publishing on a Mon/Wed/Fri cadence (all 20 shows release together).

## 1. Scripts

One file per show per episode: `NN-<show>-ep<N>.txt`
(e.g. `01-true-crime-brief-ep2.txt`). Body is everything after the `---` line.

## 2. Generate audio (Google Cloud TTS)

```bash
export GOOGLE_TTS_API_KEY="AIza..."     # Cloud Text-to-Speech API key
EPISODE=ep2 python3 generate-ep2-google.py
```

Writes `audio-ep2/ep2-01.mp3 … ep2-20.mp3`. Per-show voice + speaking-rate
mapping lives in `VOICES` inside the script. Long scripts are auto-chunked at
sentence boundaries (5000-byte API limit) and concatenated. Re-run with
`EPISODE=ep3`, `ep4`, … for later episodes.

## 3. Publish to Buzzsprout

```bash
cp buzzsprout-config.example.json buzzsprout-config.json   # fill in podcast_id per show
export BUZZSPROUT_API_TOKEN="...."                         # Buzzsprout > Account > API
EPISODE=ep2 python3 buzzsprout-publish.py --dry-run        # preview the schedule
EPISODE=ep2 python3 buzzsprout-publish.py                  # upload + schedule all 20
```

`buzzsprout-config.json` anchors Episode 2 to `ep2_date`; every later episode
number steps forward one Mon/Wed/Fri slot, and all 20 shows share that date.

## Notes

- Secrets are read from env vars only — never commit keys or `buzzsprout-config.json`.
- Generated `audio-ep*/` folders are gitignored.
- Rotate/restrict the Google key to the Text-to-Speech API in Cloud Console.
