# Multi-Channel Pipeline Setup Template

**Purpose:** Replicate the Sonny pipeline across 5 other YouTube channels with unique characters and styles.

**Channels to Configure:**
1. Sunny the Crocker TV
2. [Channel 2 Name]
3. [Channel 3 Name]
4. [Channel 4 Name]
5. [Channel 5 Name]

---

## Directory Structure (After Rollout)

```
kids-channel/
├── pipeline.py                    (shared core, importable)
├── youtube_auth.py                (shared core)
├── queue.txt                      (Little Sunny queue)
├── characters/
│   ├── sonny-ref.jpg             (Little Sunny character)
│   ├── crocker-ref.jpg           (Crocker character)
│   ├── [char3]-ref.jpg
│   ├── [char4]-ref.jpg
│   ├── [char5]-ref.jpg
│   └── [char6]-ref.jpg
├── channels/
│   ├── little-sunny/
│   │   ├── pipeline.py           (channel-specific, imports shared core)
│   │   ├── config.py             (character defs, style, API keys)
│   │   ├── queue.txt             (86 pre-written scripts)
│   │   ├── scripts/              (script library)
│   │   └── episodes/             (generated output)
│   ├── crocker-tv/
│   │   ├── pipeline.py
│   │   ├── config.py
│   │   ├── queue.txt
│   │   ├── scripts/
│   │   └── episodes/
│   ├── channel-3/
│   ├── channel-4/
│   ├── channel-5/
│   └── channel-6/
└── scripts/                       (legacy shared scripts)
```

---

## Channel Configuration Template

Create `kids-channel/channels/[channel-name]/config.py`:

```python
# Channel-specific configuration

CHANNEL_NAME = "Sunny's Cozy Quokka Bedtime Tales"
CHARACTER_NAME = "Sonny"
CHARACTER_REF_SEED = 7777

# Unique character description
CHARACTER_DESC = (
    "Sonny the quokka: EXTREMELY CHUBBY and ROUND (compact teddy-bear shape, plump rounded body), "
    "WARM GOLDEN-BROWN soft fur (never dark, never grey), large gentle warm brown eyes with kind expression, "
    "small round ears, short snout with a natural gentle smile, always appears cosy and peaceful. "
    "Often sitting, lying down, or resting in calm poses. Sometimes wearing cozy details like pajamas or a blanket."
)

# Unique visual style
VISUAL_STYLE = (
    "Professional watercolour children's picture book illustration, Beatrix Potter and Jill Barklem style. "
    "Hand-painted on textured cold-press paper with visible brushstrokes, soft pigment bleeds, gentle colour washes, "
    "loose sketchy linework. Warm cosy palette: warm golds, burnt siennas, soft sage greens, deep indigo-navy blues, "
    "pale golden moonlight. Australian bush scenes at night: moonlit meadows, gum trees, wildflowers, gentle streams. "
    "Soft, safe, calming bedtime mood. No text or captions. Safe for toddlers ages 1-5."
)

# Show description (for YouTube)
SHOW_DESC = "Calm, magical Australian bush bedtime adventures with Sonny the little Quokka — cozy bedtime stories for toddlers."

# Upload schedule (AEST)
UPLOAD_TIMES = [
    ("0 21 * * *", "7:00 AM"),    # UTC 21:00 = AEST 7:00 AM
    ("0 3 * * *",  "1:00 PM"),    # UTC 03:00 = AEST 1:00 PM (next day)
    ("0 9 * * *",  "7:00 PM"),    # UTC 09:00 = AEST 7:00 PM
]

# API Keys (load from .env or GitHub Secrets)
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")
REPLICATE_API_TOKEN = os.getenv("REPLICATE_API_TOKEN")
FAL_KEY = os.getenv("FAL_KEY")

# ElevenLabs voice ID (customize per channel if desired)
VOICE_ID = "21m00Tcm4TlvDq8ikWAM"  # Calm voice

# YouTube metadata
YOUTUBE_CHANNEL_ID = "UC..."  # Set for each channel
MADE_FOR_KIDS = True
CHANNEL_CATEGORY = "27"  # Education
```

---

## Workflow Template for Each Channel

Create `.github/workflows/[channel-name]-episode.yml`:

```yaml
name: "[Channel Name] — New Episode"

on:
  workflow_dispatch:
    inputs:
      script_file:
        description: "Override script path (leave blank to use queue)"
        required: false
        type: string
      dry_run:
        description: "Dry run (skip YouTube upload)"
        required: false
        type: boolean
        default: false
  schedule:
    - cron: "0 21 * * *"   # 7 AM AEST
    - cron: "0 3 * * *"    # 1 PM AEST
    - cron: "0 9 * * *"    # 7 PM AEST

jobs:
  produce-episode:
    runs-on: ubuntu-latest
    timeout-minutes: 60
    permissions:
      contents: write

    steps:
      - name: Checkout repo
        uses: actions/checkout@v4
        with:
          ref: main
          token: ${{ secrets.GITHUB_TOKEN }}

      - name: Determine script from queue
        id: pick-script
        run: |
          CHANNEL_DIR="kids-channel/channels/[channel-name]"
          OVERRIDE="${{ github.event.inputs.script_file }}"
          if [ -n "$OVERRIDE" ]; then
            echo "script=$OVERRIDE" >> $GITHUB_OUTPUT
            echo "from_queue=false" >> $GITHUB_OUTPUT
          else
            NEXT=$(head -1 "$CHANNEL_DIR/queue.txt" 2>/dev/null | tr -d '[:space:]')
            if [ -z "$NEXT" ]; then
              echo "::error::Episode queue is empty — add more scripts to $CHANNEL_DIR/queue.txt"
              exit 1
            fi
            echo "script=$NEXT" >> $GITHUB_OUTPUT
            echo "from_queue=true" >> $GITHUB_OUTPUT
          fi

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: "3.11"

      - name: Install system deps
        run: sudo apt-get update && sudo apt-get install -y ffmpeg

      - name: Install Python deps
        run: |
          pip install requests python-dotenv anthropic \
            google-auth google-auth-oauthlib google-api-python-client \
            elevenlabs Pillow fal-client

      - name: Write .env
        run: |
          cat > .env <<EOF
          ANTHROPIC_API_KEY=${{ secrets.ANTHROPIC_API_KEY }}
          ELEVENLABS_API_KEY=${{ secrets.ELEVENLABS_API_KEY }}
          REPLICATE_API_TOKEN=${{ secrets.REPLICATE_API_TOKEN }}
          FAL_KEY=${{ secrets.FAL_KEY }}
          EOF

      - name: Run channel pipeline
        id: run-pipeline
        env:
          CHANNEL: "[channel-name]"
        run: |
          python kids-channel/channels/${{ env.CHANNEL }}/pipeline.py \
            --script-file "${{ steps.pick-script.outputs.script }}" \
            ${{ inputs.dry_run && '--dry-run' || '' }}

      - name: Advance queue
        if: steps.pick-script.outputs.from_queue == 'true' && steps.run-pipeline.conclusion == 'success'
        run: |
          CHANNEL_DIR="kids-channel/channels/[channel-name]"
          git config user.email "channel-bot@rhythmixapp.com.au"
          git config user.name "[Channel Name] Bot"
          tail -n +2 "$CHANNEL_DIR/queue.txt" > "$CHANNEL_DIR/queue_tmp.txt"
          mv "$CHANNEL_DIR/queue_tmp.txt" "$CHANNEL_DIR/queue.txt"
          git add "$CHANNEL_DIR/queue.txt"
          git add kids-channel/characters/ 2>/dev/null || true
          git commit -m "queue: processed [script name]"
          git push origin main

      - name: Upload artifacts
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: episode-files-[channel-name]
          path: kids-channel/channels/[channel-name]/episodes/
          retention-days: 7
```

---

## Python Pipeline Wrapper

Create `kids-channel/channels/[channel-name]/pipeline.py`:

```python
#!/usr/bin/env python3
"""
Channel-specific pipeline wrapper.
Imports shared core from parent pipeline.py, applies channel-specific config.
"""

import sys
from pathlib import Path

# Import channel config
from config import *

# Import shared pipeline core
_CORE_PATH = Path(__file__).parent.parent.parent / "pipeline.py"
sys.path.insert(0, str(_CORE_PATH.parent))

# Now run the shared pipeline with channel-specific overrides
if __name__ == "__main__":
    # The shared pipeline.py already has all the logic;
    # we just need to override the character/style/config constants
    # before it runs.
    
    # This is typically done by:
    # 1. Setting module-level vars before importing
    # 2. Or passing config as parameters
    # Or refactoring pipeline.py to accept a config object
    
    # For now: run the shared pipeline with our config already loaded
    exec(open(_CORE_PATH).read())
```

---

## Character Design Briefs (Customize Per Channel)

### Template: Character Design Brief

```markdown
# [Channel Name] — Character Design

## Character Name
[Name]

## Visual Description
[Detailed description matching your reference images]

## Personality
[Bedtime-appropriate personality traits]

## Setting
[Australian bush variations — coastal, forest, plains, etc.]

## Art Style
[Watercolor style specific to this character/theme]

## Reference Images
[Attach 3-5 reference images showing the character in different poses/scenes]

## Palette
[Specific color palette for this character]

## Clothing/Accessories
[What the character typically wears]
```

---

## Scaling Checklist

For each new channel:

- [ ] **Create directory:** `kids-channel/channels/[channel-name]/`
- [ ] **Add config:** `config.py` with channel-specific character/style
- [ ] **Add scripts:** 86+ pre-written scripts in `scripts/` folder
- [ ] **Add queue:** `queue.txt` with script paths (one per line)
- [ ] **Create workflow:** `.github/workflows/[channel-name]-episode.yml`
- [ ] **Reference image:** Character ref will auto-generate on first run (seed 7777)
- [ ] **Test dry run:** Manually trigger workflow with dry_run=true
- [ ] **Validate:** Check character consistency, colors, style
- [ ] **Deploy:** Schedule cron jobs and enable live episodes
- [ ] **Monitor:** First week daily, then weekly

---

## Benefits of This Structure

**Isolation:**
- Each channel has independent queue, scripts, episodes
- Character refs kept separate
- API costs trackable per channel

**Reusability:**
- Shared pipeline core (DRY principle)
- Config-driven customization
- No code duplication

**Scalability:**
- Add channel 7, 8, 9... by copying template
- Parallel episode generation (one workflow per channel)
- Shared GitHub Secrets work across all channels

**Git Hygiene:**
- Each channel's queue advances independently
- Character refs committed per channel
- Easy to audit changes per channel

---

## Example: Setting Up Crocker TV

1. **Create directory:**
   ```bash
   mkdir -p kids-channel/channels/crocker-tv
   mkdir -p kids-channel/channels/crocker-tv/{scripts,episodes}
   ```

2. **Create config.py:**
   ```python
   CHANNEL_NAME = "Sunny the Crocker TV"
   CHARACTER_NAME = "Crocker"
   CHARACTER_DESC = "Crocker: a brave young crocodile with emerald-green scales..."
   VISUAL_STYLE = "Riverbank adventures at dusk, tropical watercolor style..."
   ```

3. **Add scripts:** Copy 86 Crocker-themed scripts to `scripts/`

4. **Add queue.txt:** List all script paths

5. **Create workflow:** Copy template, replace `[channel-name]` with `crocker-tv`

6. **Test:** `Actions → Crocker TV New Episode → Run workflow (dry run)`

7. **Deploy:** Remove dry_run flag from next run

---

## Future Enhancements

- [ ] Unified dashboard showing all 6 channels' status
- [ ] Shared character library (mix characters across channels)
- [ ] A/B testing different character designs
- [ ] Automated script generation per channel (unique themes)
- [ ] Cross-channel story arcs
- [ ] Merchandise generation (character variations)
