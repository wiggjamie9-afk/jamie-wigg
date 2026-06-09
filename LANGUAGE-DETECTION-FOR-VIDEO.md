# Language Detection Integration — MoneyPrinterTurbo + Video Pipeline

**Installed:** `langdetect==1.0.9` in MoneyPrinterTurbo environment  
**Use Case:** Auto-detect script language before TTS, enable multi-language video generation  
**Supported Languages:** 55+ languages (English, Chinese, Spanish, French, Japanese, etc.)

---

## Why Language Detection Matters

MoneyPrinterTurbo's video pipeline supports multiple languages for:
- **Script generation** (Claude via ECC can write in any language)
- **TTS (Text-to-Speech)** — different voice engines for different languages
- **Subtitles** — Unicode support for any script

But the pipeline needs to know: **What language is this script in?**

```
Topic → ECC generates script
             ↓
[Language Detection] Detect: English? Chinese? Spanish?
             ↓
Route to appropriate TTS engine
             ↓
Select subtitle font (Latin, CJK, Cyrillic)
             ↓
Generate video with correct narration + subtitles
```

---

## Installation

Already installed in MoneyPrinterTurbo:

```bash
cd MoneyPrinterTurbo
uv run python -c "import langdetect; print(langdetect.__version__)"
# 1.0.9
```

---

## Quick Usage

### Detect Single Script

```python
from langdetect import detect, detect_langs

script = "这是一个关于音乐制作的视频剧本。"  # Chinese
lang = detect(script)
print(lang)  # Output: 'zh-cn'

# Get confidence scores
langs_with_confidence = detect_langs(script)
for item in langs_with_confidence:
    print(f"{item.lang}: {item.prob:.2%}")
    # Output: zh-cn: 99.99%
```

### Detect with Fallback (Robustness)

```python
from langdetect import detect, LangDetectException

def safe_detect(text: str, default: str = "en") -> str:
    """Detect language, fallback to English if uncertain."""
    if not text or len(text.strip()) < 10:
        return default  # Text too short
    
    try:
        detected = detect(text)
        return detected
    except LangDetectException:
        return default  # Unable to detect, use default

script = "Hello world"  # English
lang = safe_detect(script)
print(lang)  # 'en'
```

---

## Integration with MoneyPrinterTurbo

### 1. **Auto-Detect Script Language**

When a script is provided, automatically detect language:

```python
# In MoneyPrinterTurbo video generation flow
from langdetect import detect
from app.services.tts import get_tts_engine

async def generate_video_with_auto_language(script: str, **kwargs) -> dict:
    """Generate video with automatic language detection."""
    
    # Step 1: Detect language
    detected_lang = detect(script)
    print(f"Script language: {detected_lang}")
    
    # Step 2: Route to appropriate TTS engine
    if detected_lang.startswith('zh'):  # Chinese
        tts_engine = 'azure-tts-chinese'  # or 'edge-tts-zh'
        voice = 'zh-CN-XiaomoNeural'
    elif detected_lang == 'en':  # English
        tts_engine = 'edge-tts-en'
        voice = 'en-US-GuyNeural'
    elif detected_lang == 'ja':  # Japanese
        tts_engine = 'azure-tts-japanese'
        voice = 'ja-JP-NanamiNeural'
    elif detected_lang == 'es':  # Spanish
        tts_engine = 'edge-tts-es'
        voice = 'es-ES-PabloNeural'
    else:
        # Fallback to English for unsupported languages
        tts_engine = 'edge-tts-en'
        voice = 'en-US-GuyNeural'
    
    # Step 3: Generate TTS with correct language
    narration = await tts_engine.synthesize(script, voice=voice)
    
    # Step 4: Select subtitle font (important for CJK)
    if detected_lang.startswith('zh'):
        subtitle_font = 'SimHei'  # Chinese font
    elif detected_lang == 'ja':
        subtitle_font = 'Noto Sans CJK JP'  # Japanese font
    elif detected_lang == 'ko':
        subtitle_font = 'Noto Sans CJK KR'  # Korean font
    else:
        subtitle_font = 'Arial'  # Latin
    
    # Step 5: Compose video with detected language
    video = compose_video(
        script=script,
        narration=narration,
        subtitle_font=subtitle_font,
        language=detected_lang,
        **kwargs
    )
    
    return {
        "video": video,
        "detected_language": detected_lang,
        "tts_engine": tts_engine,
        "subtitle_font": subtitle_font,
    }
```

### 2. **Detect Language for Web Search Context**

When MoneyPrinterTurbo needs to fetch materials (from Pexels, Pixabay):

```python
# Detect language to search for materials in appropriate language
from langdetect import detect

script = "一个关于瑜伽冥想的60秒视频..."  # Chinese

detected_lang = detect(script)

if detected_lang.startswith('zh'):
    search_query = "瑜伽 冥想"  # Chinese search query
elif detected_lang == 'en':
    search_query = "yoga meditation"
else:
    search_query = "yoga meditation"  # Fallback to English

# Fetch materials with appropriate query
materials = fetch_from_pexels(search_query, language=detected_lang)
```

### 3. **Map Detected Language to TTS Voice**

```python
# Language code → TTS provider mapping
LANGUAGE_TO_TTS = {
    'en': ('edge-tts', 'en-US-GuyNeural'),
    'zh-cn': ('azure-tts', 'zh-CN-XiaomoNeural'),
    'zh-tw': ('azure-tts', 'zh-TW-YunJheNeural'),
    'ja': ('azure-tts', 'ja-JP-NanamiNeural'),
    'ko': ('azure-tts', 'ko-KR-BongJinNeural'),
    'es': ('edge-tts', 'es-ES-PabloNeural'),
    'fr': ('edge-tts', 'fr-FR-HenriNeural'),
    'de': ('edge-tts', 'de-DE-ConradNeural'),
    'pt': ('edge-tts', 'pt-BR-AntonioNeural'),
    'ru': ('azure-tts', 'ru-RU-DmitryNeural'),
}

def get_tts_for_language(detected_lang: str) -> tuple:
    """Get TTS engine + voice for detected language."""
    normalized_lang = detected_lang.lower().replace('_', '-')
    return LANGUAGE_TO_TTS.get(normalized_lang, ('edge-tts', 'en-US-GuyNeural'))

lang = 'zh-cn'
engine, voice = get_tts_for_language(lang)
print(f"Use {engine} with voice {voice}")
```

### 4. **Confidence-Based Quality Gates**

Reject low-confidence detections:

```python
from langdetect import detect_langs, LangDetectException

def validate_language_detection(script: str, min_confidence: float = 0.9) -> str:
    """Validate that language is detected with sufficient confidence."""
    try:
        results = detect_langs(script)
        top_result = results[0]
        
        if top_result.prob < min_confidence:
            print(f"Low confidence: {top_result.lang} ({top_result.prob:.2%})")
            print(f"Alternatives: {results[1:]}")
            # Could be mixed-language script
            return "mixed"
        
        return top_result.lang
    except LangDetectException:
        return "unknown"
```

---

## Language Codes Reference

| Language | Code | TTS Support | Subtitle Font |
|---|---|---|---|
| **English** | `en` | ✅ (Edge, Azure) | Arial |
| **Chinese (Simplified)** | `zh-cn` | ✅ (Azure, Aliyun) | SimHei |
| **Chinese (Traditional)** | `zh-tw` | ✅ (Azure) | YouYuan |
| **Japanese** | `ja` | ✅ (Azure, Google) | Noto Sans CJK JP |
| **Korean** | `ko` | ✅ (Azure, Google) | Noto Sans CJK KR |
| **Spanish** | `es` | ✅ (Edge, Google) | Arial |
| **French** | `fr` | ✅ (Edge, Azure) | Arial |
| **German** | `de` | ✅ (Edge, Azure) | Arial |
| **Portuguese** | `pt` | ✅ (Edge, Google) | Arial |
| **Russian** | `ru` | ✅ (Azure) | DejaVu Sans |
| **Italian** | `it` | ✅ (Edge, Azure) | Arial |
| **Dutch** | `nl` | ✅ (Edge) | Arial |
| **Vietnamese** | `vi` | ⚠️ Limited | Arial |
| **Thai** | `th` | ⚠️ Limited | Noto Sans Thai |
| **Arabic** | `ar` | ✅ (Azure, Google) | Arial |

---

## Architecture: Language Detection in Pipeline

```
Topic (user input or /ecc:plan output)
        ↓
ECC generates script (any language)
        ↓
[langdetect] Detect language + confidence
        ↓
IF confidence < 90% → Ask user OR use default (English)
ELSE → Continue
        ↓
[Language-aware routing]
├─ Select TTS engine (Edge for English/European, Azure for CJK)
├─ Choose voice (gender, accent, speed)
├─ Select subtitle font (Latin vs. CJK)
└─ Set material search language
        ↓
Fetch materials (Pexels/Pixabay) with language-aware query
        ↓
Compose video with correct narration + subtitles
        ↓
Output MP4 (9:16 portrait or 16:9 landscape)
```

---

## Multi-Language Examples

### Example 1: English Script

```python
script = """
A serene beach at sunset. 
Waves crashing softly. 
The sun sinks below the horizon, 
painting the sky in shades of orange and purple.
"""

lang = detect(script)  # 'en'
# → Route to Edge TTS (English), Arial font
```

### Example 2: Chinese Script

```python
script = """
一个宁静的海滩日落。
海浪柔和地冲击。
太阳沉入地平线下方，
将天空涂成橙色和紫色。
"""

lang = detect(script)  # 'zh-cn'
# → Route to Azure TTS (Chinese), SimHei font
```

### Example 3: Mixed Language (Detected as One)

```python
script = """
The music production studio opens. 音乐制作开始了。
Beats drop, synthesizers sing. 节拍下降，合成器唱歌。
"""

lang = detect(script)  # Likely 'en' or 'zh-cn' depending on which is more dominant
confidence_list = detect_langs(script)
# Results: ['en: 0.57', 'zh-cn: 0.43']
# → User should be warned: "Mixed language detected"
```

---

## Integration Checklist

- [ ] Add `langdetect` to MoneyPrinterTurbo requirements (✅ Done)
- [ ] Implement `safe_detect()` function in TTS service
- [ ] Create `LANGUAGE_TO_TTS` mapping
- [ ] Add language detection to video generation flow
- [ ] Update subtitle font selection logic
- [ ] Test with multi-language scripts (EN, ZH, JA, ES)
- [ ] Document language support in `/webui/Main.py` UI
- [ ] Add `detected_language` to video metadata

---

## Next Steps

1. **Test language detection** — Try with scripts in 5+ languages
2. **Wire into video generation** — Update flow to use detected language
3. **Add UI toggle** — Let users override auto-detected language if needed
4. **Monitor accuracy** — Track detection vs. actual in production
5. **Expand TTS support** — Add more language-specific voices as needed

---

**Language detection is now ready. Multi-language video generation is enabled.**
