# Voicebox — Local Voice Cloning & TTS

Voicebox is a free, local application that clones your voice from audio samples and generates speech-to-text audio. Everything runs on your Mac — no cloud uploads, no API keys needed.

## Download Voicebox

### For Mac (Intel or Apple Silicon)

Go to: **https://github.com/metavoiceio/voicebox-mac/releases**

Look for the latest release (v1.x.x or higher) and download:
- `Voicebox-arm64.dmg` (if you have Apple Silicon / M1/M2/M3 Mac)
- `Voicebox-x64.dmg` (if you have Intel Mac)

**Not sure which one?** Open Terminal and run:
```bash
uname -m
```

If it says `arm64` → download the arm64 version
If it says `x86_64` → download the x64 version

---

## Install Voicebox

1. **Download** the `.dmg` file from the link above
2. **Double-click** the `.dmg` file
3. **Drag** the Voicebox icon into the Applications folder
4. **Wait** for copy to finish
5. **Open Applications** folder and **double-click Voicebox**
6. **Click "Open"** if macOS asks about unverified developer

---

## Start Using Voicebox

Once Voicebox opens:
1. You should see the Voicebox window
2. It listens on `http://127.0.0.1:17493` (local only)
3. Go back to Terminal and run the setup command:

```bash
bash <(curl -s https://raw.githubusercontent.com/wiggjamie9-afk/jamie-wigg/claude/system-prompts-leaks-2sg44g/voiceover-kit/setup-mac.sh)
```

---

## What Voicebox Does

✅ **Voice cloning** — learns your voice from a short audio sample
✅ **Speech generation** — generates narration in your cloned voice
✅ **Local processing** — everything runs on your Mac (no cloud)
✅ **No cost** — completely free, no API keys

---

## Need Help?

- **GitHub:** https://github.com/metavoiceio/voicebox-mac
- **Issues:** https://github.com/metavoiceio/voicebox-mac/issues

---

**Next steps:**
1. Download and install Voicebox from the link above
2. Open Voicebox app
3. Run the setup command in Terminal
4. All 20 Episode 2 MP3s will generate automatically ✅
