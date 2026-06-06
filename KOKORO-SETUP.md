# Kokoro TTS Setup

**Kokoro TTS** is a fast, lightweight text-to-speech engine used by HyperFrames to generate narration audio (`.wav` files) for RHYTHMIX promos. It supports 30+ voices across multiple languages (English, French, Italian, Japanese, Chinese) with voice blending for creative effects.

## Quick Start

### Installation (Recommended: uv tool)

```bash
uv tool install kokoro-tts
```

Or with pip:

```bash
pip install kokoro-tts
```

### Download Model Files

Kokoro requires two model files. Download them to your working directory:

```bash
# Download voice data (bin format preferred for smaller size)
wget https://github.com/nazdridoy/kokoro-tts/releases/download/v1.0.0/voices-v1.0.bin

# Download the ONNX model
wget https://github.com/nazdridoy/kokoro-tts/releases/download/v1.0.0/kokoro-v1.0.onnx
```

Both files must be present in the directory where you run `kokoro-tts`.

### Verify Installation

```bash
kokoro-tts --help
kokoro-tts --help-voices
kokoro-tts --help-languages
```

## Available Voices

### 🇺🇸 American English (`en-us`)

**Female voices**: `af_alloy`, `af_aoede`, `af_bella`, `af_heart`, `af_jessica`, `af_kore`, `af_nicole`, `af_nova`, `af_river`, `af_sarah`, `af_sky`

**Male voices**: `am_adam`, `am_echo`, `am_eric`, `am_fenrir`, `am_liam`, `am_michael`, `am_onyx`, `am_puck`

### 🇬🇧 British English (`en-gb`)

**Female voices**: `bf_alice`, `bf_emma`, `bf_isabella`, `bf_lily`

**Male voices**: `bm_daniel`, `bm_fable`, `bm_george`, `bm_lewis`

### 🌍 Other Languages

| Language | Code | Voices |
|---|---|---|
| 🇫🇷 French | `fr-fr` | `ff_siwis` |
| 🇮🇹 Italian | `it` | `if_sara`, `im_nicola` |
| 🇯🇵 Japanese | `ja` | `jf_alpha`, `jf_gongitsune`, `jf_nezumi`, `jf_tebukuro`, `jm_kumo` |
| 🇨🇳 Mandarin | `cmn` | `zf_xiaobei`, `zf_xiaoni`, `zf_xiaoxiao`, `zf_xiaoyi`, `zm_yunjian`, `zm_yunxi`, `zm_yunxia`, `zm_yunyang` |

## Usage with HyperFrames

### Generate Narration for a Promo

When you create a new HyperFrames promo folder (`rhythmix-<name>-<length>/`), use Kokoro to generate the `narration.wav` file:

```bash
cd rhythmix-overview-60s/

# Generate narration from script.txt
npx --yes hyperframes@0.4.42 tts

# Or use kokoro-tts directly with a voice
kokoro-tts script.txt narration.wav --voice af_sarah --lang en-us --speed 1.0
```

The `script.txt` file in the folder will be converted to speech and saved as `narration.wav`.

### Basic Usage

```bash
# Single voice output
kokoro-tts input.txt output.wav --voice af_sarah --speed 1.0

# Stream audio directly (no file)
kokoro-tts input.txt --stream --voice af_sarah

# Read from stdin
echo "Hello World" | kokoro-tts - output.wav
cat script.txt | kokoro-tts - --stream
```

### Voice Blending

Create unique vocal textures by mixing two voices:

```bash
# 60-40 blend (60% af_sarah, 40% am_adam)
kokoro-tts script.txt narration.wav --voice "af_sarah:60,am_adam:40"

# 50-50 equal blend (no weights specified)
kokoro-tts script.txt --stream --voice "af_sarah,am_adam"
```

## Advanced Options

### Speed Control

Adjust speech speed (default: `1.0`). Values < 1.0 slow down, > 1.0 speed up:

```bash
# Slower narration (80% speed)
kokoro-tts script.txt narration.wav --voice af_sarah --speed 0.8

# Faster narration (125% speed)
kokoro-tts script.txt narration.wav --voice af_sarah --speed 1.25
```

### Language Selection

Generate speech in different languages:

```bash
# British English
kokoro-tts script.txt narration.wav --voice bf_alice --lang en-gb

# Mandarin Chinese
kokoro-tts script.txt narration.wav --voice zf_xiaobei --lang cmn
```

### Output Formats

Save audio in different formats:

```bash
# WAV format (default, lossless, larger file)
kokoro-tts script.txt narration.wav --format wav

# MP3 format (compressed, smaller file)
kokoro-tts script.txt narration.mp3 --format mp3
```

### Split Output by Chunks

For long narrations, save each chunk as a separate file:

```bash
kokoro-tts long-script.txt --split-output ./narration-chunks/ --format wav
```

This creates numbered files: `001.wav`, `002.wav`, etc., one per text chunk.

### Debug Mode

Show detailed processing information:

```bash
kokoro-tts script.txt narration.wav --debug
```

## File Input Formats

Kokoro accepts multiple input file types:

| Format | Command | Notes |
|---|---|---|
| Plain text | `kokoro-tts script.txt` | Simple text file |
| EPUB (ebook) | `kokoro-tts book.epub --split-output ./chapters/` | Extracts chapters, processes each |
| PDF | `kokoro-tts document.pdf --split-output ./pages/` | Extracts chapters from TOC |
| stdin | `echo "text" \| kokoro-tts -` | Pipe from other commands |

## Recommended Voices for RHYTHMIX Promos

### Default / Safe Choice
- **`af_sarah` (US English, female)** — natural, clear, friendly. Good all-purpose narration.

### Dynamic / Energetic
- **`am_liam` (US English, male)** — warm, confident. Great for product intros.
- **`af_nova` (US English, female)** — bright, youthful energy.

### Calm / Contemplative
- **`bf_emma` (British English, female)** — elegant, measured delivery.
- **`am_echo` (US English, male)** — smooth, steady presence.

### Creative / Blended
- **`"af_sarah:70,am_liam:30"`** — female-led blend with male depth.
- **`"am_liam:60,af_nova:40"`** — male-led with youthful brightness.

## Integration with HyperFrames Workflow

### Step-by-step: Adding TTS to a New Promo

1. **Create the promo folder** (HyperFrames scaffold):
   ```bash
   mkdir -p rhythmix-my-cut-60s
   cd rhythmix-my-cut-60s
   ```

2. **Write the narration script**:
   ```bash
   cat > script.txt << 'EOF'
   Your narration text here.
   Multi-line is fine.
   EOF
   ```

3. **Generate the audio**:
   ```bash
   # Option A: Use HyperFrames's built-in TTS (requires kokoro-tts installed)
   npx --yes hyperframes@0.4.42 tts

   # Option B: Use kokoro-tts directly with custom voice
   kokoro-tts script.txt narration.wav --voice af_sarah --speed 1.0
   ```

4. **Verify the output**:
   ```bash
   ls -lh narration.wav    # Check file size
   ffprobe narration.wav   # Check duration and metadata
   ```

5. **Add to HyperFrames composition**:
   - Place `narration.wav` in the promo folder
   - Reference in `index.html` with `<audio>` or via JavaScript

6. **Render the final video**:
   ```bash
   npx --yes hyperframes@0.4.42 render
   ```

## Troubleshooting

### Model Files Not Found

```
Error: voices-v1.0.bin not found in current directory
```

**Solution:** Ensure both `voices-v1.0.bin` and `kokoro-v1.0.onnx` are in the directory where you run the command. You may need to download them again or symlink them:

```bash
ln -s ~/kokoro-models/voices-v1.0.bin ./
ln -s ~/kokoro-models/kokoro-v1.0.onnx ./
```

### Voice Not Available

```
Error: Voice 'af_nonexistent' not found
```

**Solution:** Check available voices:
```bash
kokoro-tts --help-voices
```

### Audio Quality Issues

- **Robotic/metallic sound** → Try a different voice or reduce speed (`--speed 0.9`)
- **Clipping/distortion** → Ensure `script.txt` doesn't have artifacts; regenerate
- **Wrong language** → Verify `--lang` matches voice code (e.g., `af_sarah` requires `--lang en-us`)

### Installation Issues

**Issue:** `kokoro-tts: command not found`

**Solution (uv):**
```bash
# Ensure uv is installed
curl -PsSL https://astral.sh/uv/install.sh | sh

# Reinstall
uv tool install kokoro-tts
```

**Solution (pip):**
```bash
pip install --upgrade kokoro-tts
which kokoro-tts  # Verify installation
```

## Performance Notes

- **First run:** Slower (model loads into memory). Subsequent runs are faster.
- **Long texts:** Chunked automatically; progress indicators show status.
- **Streaming:** Use `--stream` for immediate playback; audio not saved.
- **Voice blending:** Slightly slower than single-voice (more computation).
- **MP3 output:** Smaller files but slower generation than WAV.

## Advanced: Batch Processing

Generate narration for multiple promos in parallel:

```bash
#!/bin/bash
# batch-tts.sh

for folder in rhythmix-*-60s/; do
  if [ -f "$folder/script.txt" ]; then
    echo "Generating: $folder/narration.wav"
    kokoro-tts "$folder/script.txt" "$folder/narration.wav" \
      --voice af_sarah --speed 1.0 &
  fi
done
wait
echo "Done!"
```

Run:
```bash
bash batch-tts.sh
```

## References

- **GitHub:** https://github.com/nazdridoy/kokoro-tts
- **Releases:** https://github.com/nazdridoy/kokoro-tts/releases
- **Supported Languages:** Run `kokoro-tts --help-languages`
- **All Voices:** Run `kokoro-tts --help-voices`

## See Also

- **HyperFrames TTS:** `npx --yes hyperframes@0.4.42 tts --help`
- **Voice Cloning (on-device Mac):** See `VOICEBOX-SETUP.md`
- **ElevenLabs TTS (cloud):** Documented in `CREATIVE-AI-STACK.md`
