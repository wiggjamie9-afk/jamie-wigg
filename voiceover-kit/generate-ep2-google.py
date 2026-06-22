#!/usr/bin/env python3
"""Generate all 20 Episode 2 MP3s via Google Cloud Text-to-Speech."""
import base64
import os
import re
import sys
import time
from pathlib import Path

import requests

# Set your key first:  export GOOGLE_TTS_API_KEY="AIza..."
API_KEY = os.environ.get("GOOGLE_TTS_API_KEY", "")
if not API_KEY:
    sys.exit("Set GOOGLE_TTS_API_KEY in your environment first.")
URL = f"https://texttospeech.googleapis.com/v1/text:synthesize?key={API_KEY}"
HERE = Path(__file__).parent
EP = os.environ.get("EPISODE", "ep2")  # e.g. ep2, ep3
OUT = HERE / f"audio-{EP}"
MAX_BYTES = 4500

# podcast_key : (google_voice, speaking_rate)
VOICES = {
    "01-true-crime-brief":       ("en-US-Neural2-J", 0.96),
    "02-ai-briefing":            ("en-US-Neural2-F", 1.0),
    "03-dating-decoded":         ("en-US-Neural2-C", 1.0),
    "04-side-hustle-school":     ("en-US-Neural2-D", 1.0),
    "05-dad-code":               ("en-US-Neural2-A", 1.0),
    "06-money-mindset":          ("en-US-Neural2-I", 0.98),
    "07-sleep-and-calm":         ("en-US-Neural2-J", 0.86),
    "08-longevity-brief":        ("en-US-Neural2-G", 0.98),
    "09-history-uncovered":      ("en-US-Neural2-D", 0.97),
    "10-unexplained":            ("en-US-Neural2-J", 0.95),
    "11-pop-culture-now":        ("en-US-Neural2-H", 1.02),
    "12-stoic-minute":           ("en-US-Neural2-A", 0.9),
    "13-focus-lab":              ("en-US-Neural2-I", 1.0),
    "14-parenting-playbook":     ("en-US-Neural2-E", 0.98),
    "15-sports-unfiltered":      ("en-US-Neural2-C", 1.02),
    "16-plain-tech":             ("en-US-Neural2-F", 1.0),
    "17-founders-stories":       ("en-US-Neural2-D", 1.0),
    "18-calm-mind":              ("en-US-Neural2-A", 0.88),
    "19-fifteen-minute-kitchen": ("en-US-Neural2-I", 1.0),
    "20-wanderlust":             ("en-US-Neural2-J", 0.98),
}


def read_body(podcast_key):
    path = HERE / f"{podcast_key}-{EP}.txt"
    lines = path.read_text(encoding="utf-8").splitlines()
    start = next((i + 1 for i, l in enumerate(lines) if l.strip() == "---"), 0)
    body = "\n".join(lines[start:])
    # strip markdown emphasis / headers
    body = re.sub(r"[*#`]", "", body)
    return body.strip()


def chunk(text):
    sentences = re.split(r"(?<=[.!?])\s+", text)
    chunks, cur = [], ""
    for s in sentences:
        if len((cur + " " + s).encode("utf-8")) > MAX_BYTES and cur:
            chunks.append(cur.strip())
            cur = s
        else:
            cur = (cur + " " + s) if cur else s
    if cur.strip():
        chunks.append(cur.strip())
    return chunks


def synth(text, voice, rate):
    payload = {
        "input": {"text": text},
        "voice": {"languageCode": "en-US", "name": voice},
        "audioConfig": {"audioEncoding": "MP3", "speakingRate": rate, "pitch": 0.0},
    }
    r = requests.post(URL, json=payload, timeout=120)
    if r.status_code != 200:
        raise RuntimeError(f"{r.status_code}: {r.text[:200]}")
    return base64.b64decode(r.json()["audioContent"])


def main():
    OUT.mkdir(exist_ok=True)
    done = 0
    for i, (key, (voice, rate)) in enumerate(sorted(VOICES.items()), 1):
        num = key.split("-")[0]
        body = read_body(key)
        chunks = chunk(body)
        try:
            audio = b""
            for c in chunks:
                audio += synth(c, voice, rate)
                time.sleep(0.2)
            out = OUT / f"{EP}-{num}.mp3"
            out.write_bytes(audio)
            kb = len(audio) // 1024
            print(f"  OK  {EP}-{num}.mp3  {voice:18} {kb:4}KB  ({len(chunks)} chunk)  {key}")
            done += 1
        except Exception as e:
            print(f"  FAIL {key}: {e}", file=sys.stderr)
    print(f"\nDone: {done}/{len(VOICES)} → {OUT}")


if __name__ == "__main__":
    main()
