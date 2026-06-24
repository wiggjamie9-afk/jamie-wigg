# Neural Twin Accessibility Layer: Book Scanning for Dyslexia/ADHD

## Vision

Make Neural Twin not just a personal AI companion, but an **accessibility tool** that helps people with dyslexia, ADHD, visual impairments, and learning differences access knowledge without friction.

**"Turn any book into an audiobook in 5 seconds"**

---

## Core Features

### 1. Book Scanning (Camera → Text → Speech)

**User journey:**
1. Open Coach Twin → "Scan a book"
2. Point phone camera at book page
3. Text instantly extracted via OCR
4. Choose voice, speed, accent
5. Press play → listen while text highlights
6. Save to knowledge base for later

**Technical flow:**
```
Camera → OCR (Tesseract/Cloud Vision) → Text → TTS → Audio + highlighting
                                          ↓
                                      Knowledge base
                                      (searchable, citable)
```

### 2. Multiple Reading Modes

#### Mode 1: Real-Time Page Scanning
- Point camera at single page
- OCR extracts text
- Immediate audio playback
- **Use case:** Student reading textbook, parent reading bedtime story

#### Mode 2: Document Upload
- Upload PDF, EPUB, or photo sequence
- Batch OCR processing
- Full book conversion to audio
- **Use case:** Reading long documents

#### Mode 3: Article/Blog Clipping
- Paste URL or text
- Instant audio conversion
- **Use case:** Research, social media content

#### Mode 4: Handwriting Recognition
- Write or draw on screen
- Recognize handwriting
- Convert to text/audio
- **Use case:** Sketching notes, reading own writing

### 3. Personalized Reading Experience

**Voice Options:**
- Multiple TTS voices (gender, accent, age options)
- Voice cloning (optional: clone user's own voice reading)
- Tempo adjustment (0.75x to 2.0x speed)
- Pitch adjustment (for auditory comfort)

**Text Display:**
- Highlight current word as it's read
- Adjustable text size and font
- High contrast mode
- Dyslexia-friendly fonts (Comic Sans, OpenDyslexia, Verdana)
- Single-line or full-page view

**Visual Supports:**
- Color-coding by part of speech
- Word definitions on-tap
- Syllable breaks (help-ful)
- Phonic guides (phonetic pronunciation)

**Cognitive Supports:**
- Sentence breaks with natural pauses
- Summary at end of section
- Key terms highlighted
- Comprehension check-ins

### 4. Learning Integration

**Connect to Knowledge Base:**
- Scanned text automatically saved as Knowledge Entry
- Auto-tagged with topic, difficulty, source
- Linked to your values & interests
- Searchable across all scans

**Connect to Coach Twin:**
- "I just scanned a chapter on decision-making. Explain the 3 frameworks they mentioned."
- Coach Twin contextually aware of what you just read
- Can quiz you on comprehension
- Adapt teaching to your learning style

**Weekly Learning Report:**
- Books scanned this week
- Topics covered
- Key insights captured
- Reading progress

### 5. Offline-First Design

- Local OCR engine (offline scanning, no internet needed)
- TTS cache (pre-download voices you use frequently)
- Works on flights, rural areas, underground
- Auto-syncs when connection returns

---

## Technical Implementation

### iOS (Vision Framework)

```swift
import Vision
import AVFoundation
import Speech

struct BookScannerView: View {
  @StateObject var scanner = OCRScanner()
  @State var recognizedText = ""
  
  var body: some View {
    ZStack {
      // Camera preview
      CameraPreview(session: scanner.session)
      
      // Focus rectangle
      Rectangle()
        .stroke(.white, lineWidth: 2)
        .frame(width: 300, height: 300)
      
      VStack {
        HStack {
          Button("Cancel") { /* dismiss */ }
          Spacer()
          Button(scanner.isScanning ? "Stop" : "Scan") {
            scanner.startScanning()
          }
        }
        .padding()
        
        Spacer()
        
        if !recognizedText.isEmpty {
          VStack {
            Text(recognizedText)
              .font(.system(.body, design: .rounded))
              .padding()
            
            Button("Play") {
              scanner.startReadingAloud(recognizedText)
            }
            .buttonStyle(.borderedProminent)
          }
          .background(.white)
          .cornerRadius(12)
          .padding()
        }
      }
    }
    .task {
      await scanner.onAppear()
    }
  }
}

class OCRScanner: NSObject, ObservableObject {
  @Published var recognizedText = ""
  @Published var isScanning = false
  
  let session = AVCaptureSession()
  let speechSynthesizer = AVSpeechSynthesizer()
  
  func startScanning() {
    // Use Vision framework to perform text recognition
    let request = VNRecognizeTextRequest()
    request.recognitionLanguages = ["en-US"]
    request.usesLanguageCorrection = true
    
    // Process camera frame
    let handler = VNImageRequestHandler(cvPixelBuffer: pixelBuffer, options: [:])
    try? handler.perform([request])
    
    if let results = request.results as? [VNRecognizedTextObservation] {
      self.recognizedText = results
        .compactMap { $0.topCandidates(1).first?.string }
        .joined(separator: " ")
    }
  }
  
  func startReadingAloud(_ text: String) {
    let utterance = AVSpeechUtterance(string: text)
    utterance.voice = AVSpeechSynthesisVoice(language: "en-US")
    utterance.rate = 0.5 // Adjustable
    speechSynthesizer.speak(utterance)
  }
}
```

### Android (ML Kit + TextToSpeech)

```kotlin
import com.google.mlkit.vision.text.TextRecognition
import com.google.mlkit.vision.text.latin.TextRecognizerOptions
import android.speech.tts.TextToSpeech

class BookScannerViewModel : ViewModel() {
  private val textRecognizer = TextRecognition.getClient(
    TextRecognizerOptions.DEFAULT_OPTIONS
  )
  private var textToSpeech: TextToSpeech? = null
  
  fun scanBook(bitmap: Bitmap) {
    val image = InputImage.fromBitmap(bitmap, 0)
    
    textRecognizer.process(image)
      .addOnSuccessListener { visionText ->
        val recognizedText = visionText.text
        viewModelScope.launch {
          readAloud(recognizedText)
        }
      }
      .addOnFailureListener { e ->
        // Handle error
      }
  }
  
  fun readAloud(text: String) {
    textToSpeech?.speak(
      text,
      TextToSpeech.QUEUE_FLUSH,
      null
    )
  }
}
```

### Backend (Optional: Google Cloud Vision / Tesseract)

For high-accuracy OCR or batch processing:

```typescript
// Optional: Use Google Cloud Vision API for better accuracy
import vision from '@google-cloud/vision';

async function recognizeTextFromImage(imagePath: string) {
  const client = new vision.ImageAnnotatorClient();
  
  const [result] = await client.textDetection(imagePath);
  const detections = result.textAnnotations;
  
  return detections
    .map(text => text.description)
    .join(' ');
}

// Or: Local Tesseract (offline)
import Tesseract from 'tesseract.js';

async function recognizeLocal(imagePath: string) {
  const result = await Tesseract.recognize(
    imagePath,
    'eng',
    {
      logger: m => console.log(m)
    }
  );
  
  return result.data.text;
}
```

---

## Phase Integration

### Phase 1C+ (Weeks 8-12): Accessibility MVP
- Basic book scanning (single page)
- Voice playback with highlighting
- Save to knowledge base
- iOS only (Vision framework available)

### Phase 2 (Weeks 17-28): Full Accessibility
- Multi-page document upload
- Multiple TTS voices
- Dyslexia-friendly fonts & display options
- Android implementation (ML Kit)
- Coach Twin integration ("Ask about what you just read")

### Phase 3+ (Weeks 29+): Advanced Accessibility
- Voice cloning for personal voice
- Handwriting recognition
- Comprehension coaching
- Offline-first full deployment
- Browser extension for web articles

---

## User Impact

### For People with Dyslexia
- OCR → phonetic guides → instant audio
- Dyslexia-friendly fonts (Comic Sans, OpenDyslexia)
- Syllable breaks and color-coding
- Removes cognitive load of decoding

### For People with ADHD
- Hyperfocus on audio while text highlights
- Adjustable speed/pacing
- Break reading into chunks
- Summarize after each section
- Coach Twin keeps them on task

### For People with Visual Impairments
- Full audio-first experience
- Screen reader friendly
- High contrast options
- Accessible navigation

### For English Language Learners
- Multiple accent options
- Slower playback
- Word definitions on-tap
- Syllable breaks

### For All Users
- **Access knowledge faster** — turn any book into audio in 5 seconds
- **Learn more effectively** — multi-sensory (read + listen simultaneously)
- **Build knowledge base** — all scanned content automatically saved & linked

---

## Business Opportunity

This feature positions Neural Twin not just as a personal AI companion, but as an **accessibility platform**.

**Market:**
- ~780M people with dyslexia globally (UNESCO)
- ~140M people with ADHD worldwide
- Billions with learning differences, visual impairments, language barriers
- Educational institutions (schools, universities)
- Corporate training departments

**Positioning:**
- "The AI that reads books for you"
- "Accessibility that actually works"
- "Turn any book into an audiobook"

**Pricing:**
- Free tier: 10 scans/month
- Pro ($99/mo): Unlimited scans, voice cloning, advanced fonts
- School ($499/mo): Team accounts, analytics, compliance

**Distribution:**
- Target educators & special education departments
- Partner with dyslexia/ADHD advocacy groups
- Integrate with accessibility platforms (ReadSpeaker, Bookshare)

---

## Implementation Roadmap

```
Week 8-9:   Vision Framework OCR (iOS)
Week 10:    Text-to-speech + highlighting
Week 11:    Save to knowledge base
Week 12:    Coach Twin integration

Week 17-18: ML Kit OCR (Android)
Week 19:    Multiple voices & speed
Week 20:    Dyslexia-friendly fonts
Week 21:    Document upload (multi-page)
Week 22:    Offline TTS caching

Week 29+:   Voice cloning
Week 30+:   Handwriting recognition
Week 31+:   Browser extension
Week 32+:   Comprehension coaching
```

---

## Why This Matters

Neural Twin isn't just building a product — you're building **a bridge** between people and knowledge.

For a student with dyslexia, the difference between "struggling to read a 300-page textbook" and "listening to the audiobook while following along" is **life-changing**.

This accessibility layer is **who Neural Twin becomes:** not just your personal AI companion, but **humanity's AI companion** — accessible to everyone, regardless of how their brain works.

---

## Next: Create Dyslexia/ADHD UI Feature Spec

Ready to add this to Phase 1C?

I'll create:
1. **UI mockups** (Figma) for book scanner screen
2. **Font specifications** (dyslexia-friendly options)
3. **TTS voice options** (tone, pace, accent preferences)
4. **Integration spec** (how Coach Twin leverages scanned content)

**Include this in Neural Twin and you've built something that genuinely changes lives.**

