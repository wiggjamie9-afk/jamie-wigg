# Kimi-Audio: Open-Source Audio Foundation Model

Universal audio foundation model by Moonshot AI for audio understanding, generation, and conversation. Pre-trained on 13M+ hours of diverse audio data (speech, music, sounds) and text.

## Key Features

**Universal Capabilities**
- Automatic Speech Recognition (ASR) — Transcribe speech to text
- Audio Question Answering (AQA) — Answer questions about audio content
- Automatic Audio Captioning (AAC) — Generate descriptions of audio
- Speech Emotion Recognition (SER) — Detect emotions in speech
- Sound Event/Scene Classification (SEC/ASC) — Identify sounds and scenes
- Audio-to-Text Chat — Conversational audio understanding
- Audio-to-Audio/Text Response — Generate speech + text responses
- Speech Conversation — Multi-turn voice dialogue with emotion/style control

**Technical Highlights**
- Hybrid audio input (continuous + discrete tokens)
- LLM core with parallel heads (text + audio generation)
- Chunk-wise streaming detokenizer (flow matching)
- Low-latency audio generation (24kHz output)
- Fine-tuning support for custom tasks

## Model Specifications

| Property | Value |
|----------|-------|
| Base Model | Qwen2.5-7B (pre-trained text LLM) |
| Pre-training Data | 13M+ hours audio + text |
| Audio Tokenizer | Discrete (12.5Hz) + Continuous (Whisper-based) |
| Decoder | Flow-matching + BigVGAN vocoder |
| Output Sample Rate | 24kHz |
| Architecture | Transformer with MLA attention |
| Training Approach | Multi-task instruction tuning |
| Open Source | Yes (code + weights + evaluation toolkit) |

## Performance Benchmarks

### Automatic Speech Recognition (ASR)

| Dataset | Metric | Kimi-Audio | Best Alternative |
|---------|--------|-----------|------------------|
| LibriSpeech test-clean | WER | 1.28 | Qwen2.5-Omni: 2.37 |
| LibriSpeech test-other | WER | 2.42 | Qwen2.5-Omni: 4.21 |
| AISHELL-1 | WER | 0.60 | Qwen2.5-Omni: 1.13 |
| Fleurs (zh) | WER | 2.69 | Qwen2.5-Omni: 2.92 |
| Fleurs (en) | WER | 4.44 | Qwen2.5-Omni: 4.17 |
| WenetSpeech test-meeting | WER | 6.28 | Qwen2.5-Omni: 7.71 |

### Audio Understanding

| Dataset | Metric | Kimi-Audio | Best Alternative |
|---------|--------|-----------|------------------|
| MMAU (music) | Accuracy | 61.68 | Qwen2.5-Omni: 62.16 |
| MMAU (sound) | Accuracy | 73.27 | Qwen2.5-Omni: 67.57 |
| MMAU (speech) | Accuracy | 60.66 | Qwen2.5-Omni: 53.92 |
| ClothoAQA | Accuracy | 71.24 | Qwen2.5-Omni: 72.86 |
| VocalSound | Accuracy | 94.85 | Qwen2.5-Omni: 93.73 |
| TUT2017 | Accuracy | 65.25 | Qwen2.5-Omni: 43.27 |
| CochlScene | Accuracy | 79.84 | Qwen2.5-Omni: 63.82 |

### Audio-to-Text Chat

| Benchmark | Metric | Kimi-Audio | Best Alternative |
|-----------|--------|-----------|------------------|
| OpenAudioBench (avg) | Score | 75.73 | Qwen2.5-Omni: 72.76 |
| VoiceBench | Avg Score | 76.93 | Qwen2.5-Omni: 72.83 |

## Installation

```bash
# Clone repository
git clone https://github.com/MoonshotAI/Kimi-Audio.git
cd Kimi-Audio
git submodule update --init --recursive
pip install -r requirements.txt

# Or install via pip
pip install torch
pip install git+https://github.com/MoonshotAI/Kimi-Audio.git
```

## Quick Start

```python
import soundfile as sf
from kimia_infer.api.kimia import KimiAudio

# Load model
model = KimiAudio(model_path="moonshotai/Kimi-Audio-7B-Instruct", load_detokenizer=True)

# Define sampling parameters
sampling_params = {
    "audio_temperature": 0.8,
    "audio_top_k": 10,
    "text_temperature": 0.0,
    "text_top_k": 5
}

# Example 1: ASR (Audio-to-Text)
messages = [
    {"role": "user", "message_type": "text", "content": "Transcribe this audio:"},
    {"role": "user", "message_type": "audio", "content": "audio.wav"}
]
_, text_output = model.generate(messages, **sampling_params, output_type="text")

# Example 2: Audio Conversation (Audio-to-Audio/Text)
messages = [
    {"role": "user", "message_type": "audio", "content": "question.wav"}
]
wav_output, text_output = model.generate(messages, **sampling_params, output_type="both")
sf.write("response.wav", wav_output.detach().cpu().view(-1).numpy(), 24000)

# Example 3: Multi-turn Conversation
messages = [
    {"role": "user", "message_type": "audio", "content": "q1.wav"},
    {"role": "assistant", "message_type": "audio-text", "content": ["a1.wav", "Assistant response"]},
    {"role": "user", "message_type": "audio", "content": "q2.wav"}
]
wav, text = model.generate(messages, **sampling_params, output_type="both")
```

## Architecture Components

**1. Audio Tokenizer**
- Discrete semantic tokens at 12.5Hz (via vector quantization)
- Continuous acoustic features (Whisper encoder, downsampled to 12.5Hz)
- Enables both compressed and detailed audio representations

**2. Audio LLM**
- Transformer-based with shared multimodal layers
- Parallel heads for text and audio token generation
- Initialized from Qwen2.5-7B (text LLM)
- Autoregressively generates text + audio tokens

**3. Audio Detokenizer**
- Flow-matching model converts discrete tokens → continuous waveforms
- BigVGAN vocoder for high-fidelity audio
- Chunk-wise streaming with look-ahead for low latency
- 24kHz output

## Use Cases

1. **Speech Recognition** — Transcribe audio in multiple languages
2. **Audio Q&A** — Answer questions about audio content (music, sounds, speech)
3. **Conversational AI** — Multi-turn audio dialogues with emotion/style control
4. **Content Understanding** — Classify sounds, detect emotions, caption audio
5. **Accessibility** — Convert audio to text or vice versa
6. **Audio Analytics** — Extract information from large audio datasets

## Evaluation Toolkit

Kimi-Audio-Evalkit provides:
- Standardized metric calculation
- Integrated evaluation for Kimi-Audio + baselines
- LLM-based intelligent judging for subjective tasks
- Speech conversation benchmark (control, empathy, style)
- Reproducible "recipes" for fair comparison

GitHub: https://github.com/MoonshotAI/Kimi-Audio-Evalkit

## Fine-tuning Support

```bash
# Fine-tune on custom data
cd finetune_codes/
# See README.md for instructions
```

Lightweight fine-tuning code available for domain adaptation.

## Integration with Ecosystem

**Kimi-Audio for Nucleus/Mary:**
- Audio input understanding (analyze voiceover/dialogue from videos)
- Voice generation for video narration (TTS alternative)
- Emotional analysis of audio/speech
- Multi-modal content creation (text + voice + video)

**Audio-to-Video Pipeline:**
1. User provides audio brief + optional voice sample
2. Kimi-Audio analyzes audio (emotion, tone, content)
3. Mary agent generates carousel + video variants
4. Kimi-Audio generates matching voiceover
5. Output: Synchronized video with generated narration

## Technical Specifications

| Aspect | Details |
|--------|---------|
| Language Support | English, Chinese, and others (via Whisper) |
| Audio Format | WAV, MP3, FLAC, etc. (via soundfile) |
| Max Audio Length | Limited by token context (typically minutes) |
| Processing | CPU/GPU supported |
| Inference Speed | Real-time capable (chunk-wise streaming) |
| License | MIT + Apache 2.0 (from Qwen base) |

## References

- **Paper:** https://arxiv.org/abs/2504.18425
- **GitHub:** https://github.com/MoonshotAI/Kimi-Audio
- **Hugging Face:** moonshotai/Kimi-Audio-7B-Instruct
- **Creator:** Moonshot AI

## Citation

```bibtex
@misc{kimiteam2025kimiaudiotechnicalreport,
  title={Kimi-Audio Technical Report},
  author={Kimi Team and ...},
  year={2025},
  eprint={2504.18425},
  archivePrefix={arXiv},
  primaryClass={eess.AS}
}
```

---

**Use Case for Nucleus:** Kimi-Audio can handle audio understanding (analyze voiceovers, detect speaker emotion) and audio generation (TTS for video narration), creating a unified audio-visual content pipeline.
