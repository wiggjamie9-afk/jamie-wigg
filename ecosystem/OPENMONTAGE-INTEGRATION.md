# OpenMontage Integration — Jackson's Ecosystem

**OpenMontage bridges Pixabay Music API for royalty-free background tracks.**

Jackson's Ecosystem now supports dual music generation:

1. **Pixabay Music via OpenMontage** (default)
   - Royalty-free, instantly available
   - No API calls or waiting
   - Curated lullabies, ambient, calm tracks
   - Perfect for kids content (like your Sonny series)

2. **Replicate MusicGen** (fallback)
   - AI-generated custom music
   - Higher creative control
   - Requires API call + queuing

---

## Setup

### 1. Get Pixabay API Key

Go to **https://pixabay.com/api/**:
1. Click **Register**
2. Confirm email
3. Copy your **API Key**
4. Add to `.env`:

```bash
PIXABAY_API_KEY=YOUR_KEY_HERE
```

### 2. Update config.json

```json
{
  "pixabay_api_key": "YOUR_KEY_HERE",
  "prefer_pixabay_music": true,
  "replicate_token": "sk-rd-..."
}
```

---

## Usage

### CLI: Text → Music (Pixabay first)

```bash
node jackson.js text-to-music "calm lullaby for bedtime" --prefer-pixabay
```

**Output:**
```
🎵 Searching Pixabay Music for: "calm lullaby for bedtime"
✅ Found: "Peaceful Sleep" (28s)
⬇️  Downloading: Peaceful Sleep
✅ Saved to: ecosystem/outputs/music-pixabay-12345-1719136200123.mp4
```

### CLI: Force Replicate MusicGen

```bash
node jackson.js text-to-music "upbeat electronic" --no-prefer-pixabay
```

### Node.js API

```javascript
import { textToMusicWithFallback } from './music-generator.js';

// Try Pixabay first, fallback to MusicGen
const result = await textToMusicWithFallback(
  "calm ambient music for meditation",
  { preferPixabay: true, duration: 30 }
);

console.log(result);
// {
//   file: 'outputs/music-pixabay-12345-1719136200123.mp4',
//   track: { title: "Peaceful Sleep", duration: 28, ... },
//   source: 'Pixabay Music',
//   license: 'Free (commercial use allowed)',
//   attempt: 1  // Succeeded on first attempt
// }
```

### Generate Music Playlist (Multiple Segments)

For videos longer than 30 seconds, generate multiple tracks:

```javascript
import { generateMusicPlaylist } from './music-generator.js';

const tracks = await generateMusicPlaylist(
  "calm lullaby",
  3,  // 3 tracks
  { preferPixabay: true }
);

// Returns:
// [
//   { file: 'music-pixabay-...-1.mp4', trackNumber: 1, ... },
//   { file: 'music-pixabay-...-2.mp4', trackNumber: 2, ... },
//   { file: 'music-pixabay-...-3.mp4', trackNumber: 3, ... },
// ]
```

---

## Jackson's Ecosystem + OpenMontage

### Complete Pipeline

```
Text Script
    ↓
[Jackson]
├─ [Stage 1] Text Enhancement (Claude)
├─ [Stage 2] Text-to-Voice (TTS)
├─ [Stage 3] Text-to-Music
│   ├─ Try: Pixabay Music (OpenMontage) ← NEW!
│   └─ Fallback: Replicate MusicGen
├─ [Stage 4] Combine outputs
    ↓
ecosystem/outputs/
├─ voice-{ts}.wav
└─ music-pixabay-{id}.mp4 or music-{ts}.wav
```

### Example: Full Pipeline with OpenMontage

```bash
node jackson.js text-to-voice-music \
  "Create a calming bedtime story for toddlers" \
  --voice ElevenLabs \
  --prefer-pixabay
```

**Steps:**
1. ✅ Claude enhances script
2. ✅ Generates narration (ElevenLabs)
3. ✅ Searches Pixabay for "calming bedtime" music
4. ✅ Downloads royalty-free track
5. ✅ Saves manifest with all files

---

## For Your Kids Channel (Sonny Series)

You already use this pattern! Jackson's Ecosystem now automates it:

**Before (manual):**
```python
# kids-channel/pipeline.py
import sys
sys.path.insert(0, str(Path(__file__).parent.parent / "OpenMontage"))
# ... manual Pixabay API calls ...
```

**After (Jackson automated):**
```bash
# One command generates everything:
node jackson.js text-to-voice-music \
  "Sonny discovers a magical waterfall" \
  --voice ElevenLabs \
  --prefer-pixabay
```

**Outputs:**
- ✅ Narration (ElevenLabs voice)
- ✅ Background music (Pixabay via OpenMontage)
- ✅ Manifest with all metadata

Then feed into HyperFrames to render final video.

---

## API Reference

### `searchPixabayMusic(query, options)`

Search Pixabay Music library.

```javascript
const track = await searchPixabayMusic("lullaby", {
  duration: 30,
  maxResults: 5,
  pixabayApiKey: "YOUR_KEY"
});

// Returns:
// {
//   title: "Peaceful Sleep",
//   id: 12345,
//   duration: 28,
//   url: "https://...",
//   license: "Pixabay Content License",
//   source: "Pixabay Music"
// }
```

### `downloadPixabayTrack(track, outputPath)`

Download track to disk.

```javascript
const filepath = await downloadPixabayTrack(track, './music.mp4');
```

### `musicFromPixabay(description, options)`

End-to-end: search → download → return.

```javascript
const result = await musicFromPixabay("calm ambient", {
  outputDir: './ecosystem/outputs',
  duration: 30
});

// Returns:
// {
//   file: 'outputs/music-pixabay-12345-1719136200123.mp4',
//   track: { title, id, duration, ... },
//   source: 'Pixabay Music',
//   license: 'Free (commercial use allowed)'
// }
```

### `musicFromMusicGen(description, options)`

Generate with Replicate (falls back from Pixabay).

```javascript
const result = await musicFromMusicGen("upbeat electronic", {
  replicateToken: config.replicate_token,
  model: 'musicgen-large',
  duration: 30
});

// Returns:
// {
//   prediction_id: 'abc123...',
//   source: 'Replicate MusicGen',
//   duration: 30
// }
```

### `textToMusicWithFallback(description, options)`

Intelligent fallback: tries preferred source first, then other.

```javascript
const result = await textToMusicWithFallback("lullaby", {
  preferPixabay: true,    // Try Pixabay first
  duration: 30
});

// attempt: 1 → Pixabay succeeded
// attempt: 2 → Pixabay failed, MusicGen succeeded
```

### `generateMusicPlaylist(description, count, options)`

Generate N tracks for segmented videos.

```javascript
const tracks = await generateMusicPlaylist(
  "calm meditation",
  3,  // 3 tracks
  { preferPixabay: true }
);

// [
//   { file: '...', trackNumber: 1 },
//   { file: '...', trackNumber: 2 },
//   { file: '...', trackNumber: 3 }
// ]
```

---

## Licensing

**Pixabay Music:**
- ✅ Free to use
- ✅ Commercial use allowed
- ✅ No attribution required
- ✅ Perfect for YouTube, TikTok, apps

**Replicate MusicGen:**
- Depends on your Replicate terms
- Generally: generated content is yours to use

---

## Troubleshooting

### "PIXABAY_API_KEY not set"

Add to `.env` or `ecosystem/config.json`:
```
PIXABAY_API_KEY=your_key_here
```

### "No Pixabay results for X"

Pixabay might not have that music. Falls back to MusicGen automatically.

### "Download failed"

Pixabay API might be rate-limited. Retry in a few seconds.

### "All music generation methods failed"

Check:
- Pixabay API key is valid
- Replicate token is valid
- Network connectivity

---

## What's Next?

Jackson's Ecosystem + OpenMontage now powers:

✅ **Kids channel automation** (Sonny series)
✅ **RHYTHMIX promos** (background music)
✅ **VoiceJournal/Heartbeat** (ambient soundscapes)
✅ **iPhone 17 app** (generate music on-device or via cloud)

All with automatic Pixabay fallback for fast, free results.
