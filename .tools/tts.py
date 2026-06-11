#!/usr/bin/env python3
"""Generate narration.wav from a text file using kokoro-onnx."""
import sys
import soundfile as sf
from kokoro_onnx import Kokoro

text_path, out_path, voice = sys.argv[1], sys.argv[2], (sys.argv[3] if len(sys.argv) > 3 else "af_heart")
text = open(text_path).read().strip()

kokoro = Kokoro("/home/user/jamie-wigg/.tools/kokoro-v1.0.onnx",
                "/home/user/jamie-wigg/.tools/voices-v1.0.bin")
samples, sr = kokoro.create(text, voice=voice, speed=1.0, lang="en-us")
sf.write(out_path, samples, sr)
print(f"wrote {out_path}: {len(samples)/sr:.1f}s @ {sr}Hz")
