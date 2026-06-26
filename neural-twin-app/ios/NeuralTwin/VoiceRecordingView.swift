import SwiftUI
import AVFoundation
import CoreLocation

// ============================================================================
// VOICE RECORDING VIEW - Audio capture, emotion analysis, history
// Audio encoding to Base64, emotion results display, local persistence
// ============================================================================

@MainActor
class VoiceRecordingViewModel: NSObject, ObservableObject, AVAudioRecorderDelegate {
  @Published var isRecording = false
  @Published var isLoading = false
  @Published var recordingDuration: TimeInterval = 0
  @Published var recordings: [VoiceRecordingResponse] = []
  @Published var selectedRecording: VoiceRecordingResponse?
  @Published var error: String?
  @Published var showError = false
  @Published var uploadProgress: Float = 0

  // Recording context (optional metadata)
  @Published var decisionTitle: String = ""
  @Published var planningClarity: Int = 5
  @Published var location: String = ""
  @Published var recordingContext: String = ""

  private var audioRecorder: AVAudioRecorder?
  private var audioPlayer: AVAudioPlayer?
  private var displayLink: CADisplayLink?
  private var recordingURL: URL?

  let apiClient = APIClient.shared
  private let recordingsKey = "voice_recordings_local"

  override init() {
    super.init()
    requestMicrophonePermission()
    loadRecordings()
    loadLocalRecordings()
  }

  private func requestMicrophonePermission() {
    AVAudioApplication.shared.requestRecordPermission { granted in
      if !granted {
        DispatchQueue.main.async {
          self.error = "Microphone permission required for voice recording"
          self.showError = true
        }
      }
    }
  }

  func startRecording() {
    let audioSession = AVAudioSession.sharedInstance()
    do {
      try audioSession.setCategory(.record, mode: .measurement, options: [])
      try audioSession.setActive(true, options: .notifyOthersOnDeactivation)
    } catch {
      self.error = "Failed to set up audio session"
      self.showError = true
      return
    }

    let documentsPath = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0]
    let audioFilename = documentsPath.appendingPathComponent("neural-\(Date().timeIntervalSince1970).wav")

    let settings: [String: Any] = [
      AVFormatIDKey: Int(kAudioFormatLinearPCM),
      AVSampleRateKey: 44100,
      AVNumberOfChannelsKey: 1,
      AVEncoderAudioQualityKey: AVAudioQuality.high.rawValue
    ]

    do {
      audioRecorder = try AVAudioRecorder(url: audioFilename, settings: settings)
      audioRecorder?.delegate = self
      audioRecorder?.record()
      isRecording = true
      recordingDuration = 0
      startTimer()
    } catch {
      self.error = "Failed to start recording: \(error.localizedDescription)"
      self.showError = true
    }
  }

  func stopRecording() {
    audioRecorder?.stop()
    isRecording = false
    displayLink?.invalidate()
    displayLink = nil

    if let url = audioRecorder?.url {
      uploadRecording(url)
    }
  }

  private func startTimer() {
    displayLink = CADisplayLink(
      target: self,
      selector: #selector(updateTimer)
    )
    displayLink?.preferredFramesPerSecond = 10
    displayLink?.add(to: .main, forMode: .common)
  }

  @objc private func updateTimer() {
    if isRecording {
      recordingDuration += 0.1
    }
  }

  private func uploadRecording(_ url: URL) {
    isLoading = true
    uploadProgress = 0
    error = nil

    Task {
      do {
        // Read audio file and convert to Base64
        let audioData = try Data(contentsOf: url)
        let audioBase64 = audioData.base64EncodedString()

        uploadProgress = 0.3

        // Build context string from available metadata
        let contextArray = [
          recordingContext,
          decisionTitle.isEmpty ? nil : "Decision: \(decisionTitle)",
          location.isEmpty ? nil : "Location: \(location)"
        ].compactMap { $0 }
        let fullContext = contextArray.joined(separator: " | ")

        // Call backend: POST /api/voice with audio + metadata
        // Backend contract: {audioBase64, context, location, decisionTitle, planningClarity}
        let response = try await apiClient.uploadVoiceRecording(
          audioBase64: audioBase64,
          context: fullContext.isEmpty ? "Voice recording" : fullContext,
          location: location.isEmpty ? nil : location,
          decisionTitle: decisionTitle.isEmpty ? nil : decisionTitle,
          planningClarity: planningClarity
        )

        uploadProgress = 0.8

        // Add to beginning of list (most recent first)
        recordings.insert(response, at: 0)
        selectedRecording = response

        // Store locally for offline access
        saveRecordingLocally(response)

        // Clean up temporary file
        try? FileManager.default.removeItem(at: url)

        uploadProgress = 1.0

      } catch {
        self.error = "Upload failed: \(error.localizedDescription)"
        self.showError = true
        uploadProgress = 0
      }

      isLoading = false
    }
  }

  private func saveRecordingLocally(_ recording: VoiceRecordingResponse) {
    if let encoded = try? JSONEncoder().encode(recording),
       var localRecordings = UserDefaults.standard.data(forKey: recordingsKey)
        .flatMap({ try? JSONDecoder().decode([VoiceRecordingResponse].self, from: $0) }) ?? [] {
      localRecordings.insert(recording, at: 0)
      if let encoded = try? JSONEncoder().encode(localRecordings) {
        UserDefaults.standard.set(encoded, forKey: recordingsKey)
      }
    }
  }

  private func loadLocalRecordings() {
    if let data = UserDefaults.standard.data(forKey: recordingsKey),
       let localRecordings = try? JSONDecoder().decode([VoiceRecordingResponse].self, from: data) {
      // Merge with remote recordings, avoiding duplicates
      var merged = recordings
      for local in localRecordings {
        if !merged.contains(where: { $0.id == local.id }) {
          merged.append(local)
        }
      }
      merged.sort { $0.timestamp > $1.timestamp }
      recordings = merged
    }
  }

  func loadRecordings() {
    isLoading = true

    Task {
      do {
        let response = try await apiClient.getVoiceRecordings()
        recordings = response.recordings
      } catch {
        self.error = "Failed to load recordings: \(error.localizedDescription)"
        self.showError = true
      }
      isLoading = false
    }
  }

  func playRecording(_ url: URL) {
    do {
      audioPlayer = try AVAudioPlayer(contentsOf: url)
      audioPlayer?.play()
    } catch {
      self.error = "Failed to play recording: \(error.localizedDescription)"
      self.showError = true
    }
  }
}

struct VoiceRecordingView: View {
  @StateObject private var viewModel = VoiceRecordingViewModel()
  @State private var showContextSheet = false

  var body: some View {
    ZStack {
      DesignTokens.background.ignoresSafeArea()

      VStack(spacing: DesignTokens.spacing16) {
        // Header
        VStack(alignment: .leading, spacing: DesignTokens.spacing8) {
          Text("Voice Journal")
            .font(.system(size: 28, weight: .bold))
            .foregroundColor(.white)

          Text("Record your thoughts and emotions")
            .font(.system(size: 14, weight: .regular))
            .foregroundColor(DesignTokens.textSecondary)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(.horizontal, DesignTokens.spacing16)

        ScrollView {
          VStack(spacing: DesignTokens.spacing16) {
            // Recording section
            VStack(spacing: DesignTokens.spacing16) {
              // Waveform animation
              if viewModel.isRecording {
                HStack(spacing: 6) {
                  ForEach(0..<5, id: \.self) { i in
                    RoundedRectangle(cornerRadius: 2)
                      .fill(DesignTokens.brandBlue)
                      .frame(width: 4, height: CGFloat(Double.random(in: 10...40)))
                      .animation(.easeInOut(duration: Double.random(in: 0.3...0.6)).repeatForever(), value: viewModel.isRecording)
                  }
                }
                .frame(height: 60)
                .frame(maxWidth: .infinity)
                .background(DesignTokens.surface2)
                .cornerRadius(DesignTokens.radiusLarge)
              }

              // Duration display
              if viewModel.isRecording {
                HStack(spacing: DesignTokens.spacing8) {
                  Circle()
                    .fill(DesignTokens.errorRed)
                    .frame(width: 8, height: 8)

                  Text(formatDuration(viewModel.recordingDuration))
                    .font(.system(size: 16, weight: .semibold, design: .monospaced))
                    .foregroundColor(DesignTokens.textPrimary)

                  Spacer()
                }
              }

              // Record/Stop button
              Button(action: {
                if viewModel.isRecording {
                  viewModel.stopRecording()
                } else {
                  viewModel.startRecording()
                }
              }) {
                HStack(spacing: DesignTokens.spacing12) {
                  Image(systemName: viewModel.isRecording ? "stop.fill" : "mic.fill")
                  Text(viewModel.isRecording ? "Stop Recording" : "Start Recording")
                }
                .font(.system(size: 16, weight: .semibold))
                .foregroundColor(.white)
                .frame(maxWidth: .infinity)
                .frame(height: 56)
                .background(viewModel.isRecording ? DesignTokens.errorRed : DesignTokens.brandBlue)
                .cornerRadius(DesignTokens.radiusMedium)
              }
              .disabled(viewModel.isLoading)

              // Upload progress
              if viewModel.isLoading && viewModel.uploadProgress > 0 {
                VStack(spacing: DesignTokens.spacing8) {
                  HStack {
                    Text("Uploading...")
                      .font(.system(size: 12, weight: .semibold))
                      .foregroundColor(DesignTokens.textSecondary)
                    Spacer()
                    Text("\(Int(viewModel.uploadProgress * 100))%")
                      .font(.system(size: 12, weight: .semibold))
                      .foregroundColor(DesignTokens.brandBlue)
                  }
                  ProgressView(value: viewModel.uploadProgress)
                    .tint(DesignTokens.brandBlue)
                }
              }
            }
            .padding(DesignTokens.spacing16)
            .background(DesignTokens.surface1)
            .cornerRadius(DesignTokens.radiusMedium)

            // Context metadata section (optional)
            VStack(spacing: DesignTokens.spacing12) {
              Button(action: { showContextSheet = true }) {
                HStack(spacing: DesignTokens.spacing8) {
                  Image(systemName: "info.circle.fill")
                    .foregroundColor(DesignTokens.brandBlue)
                  Text("Add Context (Optional)")
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundColor(DesignTokens.textPrimary)
                  Spacer()
                  Image(systemName: "chevron.right")
                    .font(.system(size: 12, weight: .semibold))
                    .foregroundColor(DesignTokens.textSecondary)
                }
                .padding(DesignTokens.spacing12)
                .background(DesignTokens.surface2)
                .cornerRadius(DesignTokens.radiusSmall)
              }
            }
            .padding(.horizontal, DesignTokens.spacing16)

            // Selected recording details with emotion analysis
            if let recording = viewModel.selectedRecording {
              VStack(spacing: DesignTokens.spacing12) {
                HStack {
                  Text("Emotion Analysis")
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundColor(DesignTokens.textSecondary)
                  Spacer()
                  Text("Confidence: \(String(format: "%.0f%%", recording.emotionResult.confidence * 100))")
                    .font(.system(size: 12, weight: .semibold))
                    .foregroundColor(DesignTokens.successGreen)
                }

                // Emotion bars - display all emotions from response
                VStack(spacing: DesignTokens.spacing8) {
                  let emotions = recording.emotionResult.emotions.sorted { $0.value > $1.value }
                  ForEach(emotions.prefix(4), id: \.key) { emotionKey, value in
                    EmotionBar(label: emotionKey.capitalized, value: value)
                  }
                }

                // Primary emotion badge
                if let primary = recording.emotionResult.primaryEmotion {
                  HStack {
                    Image(systemName: "sparkles")
                      .font(.system(size: 12, weight: .semibold))
                    Text("Primary: \(primary.capitalized)")
                      .font(.system(size: 12, weight: .semibold))
                  }
                  .frame(maxWidth: .infinity, alignment: .leading)
                  .padding(DesignTokens.spacing8)
                  .background(DesignTokens.surface2)
                  .cornerRadius(DesignTokens.radiusSmall)
                  .foregroundColor(DesignTokens.accentPurple)
                }
              }
              .padding(DesignTokens.spacing16)
              .background(DesignTokens.surface1)
              .cornerRadius(DesignTokens.radiusMedium)
            }

            // Recordings list
            VStack(spacing: DesignTokens.spacing12) {
              Text("Recent Recordings")
                .font(.system(size: 14, weight: .semibold))
                .foregroundColor(DesignTokens.textSecondary)
                .frame(maxWidth: .infinity, alignment: .leading)

              if viewModel.isLoading && viewModel.recordings.isEmpty {
                VStack(spacing: DesignTokens.spacing12) {
                  ProgressView()
                  Text("Loading recordings...")
                    .font(.system(size: 12, weight: .regular))
                    .foregroundColor(DesignTokens.textSecondary)
                }
                .frame(maxWidth: .infinity)
                .frame(height: 120)
                .background(DesignTokens.surface1)
                .cornerRadius(DesignTokens.radiusMedium)
              } else if viewModel.recordings.isEmpty {
                Text("No recordings yet. Start by recording your first voice message.")
                  .font(.system(size: 14, weight: .regular))
                  .foregroundColor(DesignTokens.textSecondary)
                  .frame(maxWidth: .infinity)
                  .frame(height: 120)
                  .background(DesignTokens.surface1)
                  .cornerRadius(DesignTokens.radiusMedium)
              } else {
                VStack(spacing: DesignTokens.spacing12) {
                  ForEach(viewModel.recordings.prefix(5), id: \.id) { recording in
                    RecordingListItem(
                      recording: recording,
                      isSelected: viewModel.selectedRecording?.id == recording.id
                    ) {
                      viewModel.selectedRecording = recording
                    }
                  }
                }
              }
            }
            .padding(.horizontal, DesignTokens.spacing16)
          }
        }
      }
    }
    .sheet(isPresented: $showContextSheet) {
      VoiceContextSheet(viewModel: viewModel)
    }
    .alert("Error", isPresented: $viewModel.showError, presenting: viewModel.error) { _ in
      Button("OK") { viewModel.showError = false }
    } message: { error in
      Text(error)
    }
  }

  private func formatDuration(_ seconds: TimeInterval) -> String {
    let minutes = Int(seconds) / 60
    let secs = Int(seconds) % 60
    return String(format: "%02d:%02d", minutes, secs)
  }
}

struct RecordingListItem: View {
  let recording: VoiceRecordingResponse
  let isSelected: Bool
  let onSelect: () -> Void

  var body: some View {
    Button(action: onSelect) {
      HStack(spacing: DesignTokens.spacing12) {
        VStack(alignment: .leading, spacing: 4) {
          Text("Recording")
            .font(.system(size: 14, weight: .semibold))
            .foregroundColor(DesignTokens.textPrimary)

          Text(recording.timestamp.formatted(date: .abbreviated, time: .shortened))
            .font(.system(size: 12, weight: .regular))
            .foregroundColor(DesignTokens.textSecondary)

          if let context = recording.context {
            Text(context)
              .font(.system(size: 11, weight: .regular))
              .foregroundColor(DesignTokens.textSecondary)
              .lineLimit(1)
          }
        }

        Spacer()

        VStack(alignment: .trailing, spacing: 4) {
          Text(recording.emotionResult.emotions["joy"].map { String(format: "%.0f%%", $0 * 100) } ?? "—")
            .font(.system(size: 14, weight: .semibold))
            .foregroundColor(DesignTokens.successGreen)

          if let primary = recording.emotionResult.primaryEmotion {
            Text(primary.capitalized)
              .font(.system(size: 11, weight: .regular))
              .foregroundColor(DesignTokens.textSecondary)
          }
        }
      }
      .padding(DesignTokens.spacing12)
      .background(isSelected ? DesignTokens.surface2 : DesignTokens.surface1)
      .cornerRadius(DesignTokens.radiusSmall)
    }
  }
}

// Context sheet for adding metadata to recording
struct VoiceContextSheet: View {
  @ObservedObject var viewModel: VoiceRecordingViewModel
  @Environment(\.dismiss) var dismiss

  var body: some View {
    ZStack {
      DesignTokens.background.ignoresSafeArea()

      VStack(spacing: DesignTokens.spacing16) {
        // Header
        HStack {
          Text("Recording Context")
            .font(.system(size: 20, weight: .bold))
            .foregroundColor(.white)
          Spacer()
          Button(action: { dismiss() }) {
            Image(systemName: "xmark.circle.fill")
              .font(.system(size: 24))
              .foregroundColor(DesignTokens.textSecondary)
          }
        }
        .padding(.horizontal, DesignTokens.spacing16)

        ScrollView {
          VStack(spacing: DesignTokens.spacing16) {
            // Recording context
            VStack(alignment: .leading, spacing: DesignTokens.spacing8) {
              Text("What are you thinking about?")
                .font(.system(size: 12, weight: .semibold))
                .foregroundColor(DesignTokens.textSecondary)

              TextEditor(text: $viewModel.recordingContext)
                .font(.system(size: 14, weight: .regular))
                .foregroundColor(DesignTokens.textPrimary)
                .scrollContentBackground(.hidden)
                .background(DesignTokens.surface1)
                .cornerRadius(DesignTokens.radiusSmall)
                .frame(height: 80)
            }

            // Decision title
            VStack(alignment: .leading, spacing: DesignTokens.spacing8) {
              Text("Related Decision (Optional)")
                .font(.system(size: 12, weight: .semibold))
                .foregroundColor(DesignTokens.textSecondary)

              TextField("e.g., Career Change", text: $viewModel.decisionTitle)
                .font(.system(size: 14, weight: .regular))
                .foregroundColor(DesignTokens.textPrimary)
                .padding(DesignTokens.spacing12)
                .background(DesignTokens.surface1)
                .cornerRadius(DesignTokens.radiusSmall)
            }

            // Location
            VStack(alignment: .leading, spacing: DesignTokens.spacing8) {
              Text("Location (Optional)")
                .font(.system(size: 12, weight: .semibold))
                .foregroundColor(DesignTokens.textSecondary)

              TextField("e.g., Office, Home", text: $viewModel.location)
                .font(.system(size: 14, weight: .regular))
                .foregroundColor(DesignTokens.textPrimary)
                .padding(DesignTokens.spacing12)
                .background(DesignTokens.surface1)
                .cornerRadius(DesignTokens.radiusSmall)
            }

            // Planning clarity slider
            VStack(alignment: .leading, spacing: DesignTokens.spacing8) {
              HStack {
                Text("Planning Clarity")
                  .font(.system(size: 12, weight: .semibold))
                  .foregroundColor(DesignTokens.textSecondary)
                Spacer()
                Text("\(viewModel.planningClarity)/10")
                  .font(.system(size: 12, weight: .semibold))
                  .foregroundColor(DesignTokens.brandBlue)
              }

              Slider(value: Binding(
                get: { Double(viewModel.planningClarity) },
                set: { viewModel.planningClarity = Int($0) }
              ), in: 1...10, step: 1)
                .tint(DesignTokens.brandBlue)
            }

            Spacer()

            Button(action: { dismiss() }) {
              Text("Done")
                .font(.system(size: 16, weight: .semibold))
                .foregroundColor(.white)
                .frame(maxWidth: .infinity)
                .frame(height: 56)
                .background(DesignTokens.brandBlue)
                .cornerRadius(DesignTokens.radiusMedium)
            }
          }
          .padding(DesignTokens.spacing16)
        }
      }
      .padding(.vertical, DesignTokens.spacing16)
    }
  }
}

struct EmotionBar: View {
  let label: String
  let value: Double

  var body: some View {
    HStack(spacing: DesignTokens.spacing8) {
      Text(label)
        .font(.system(size: 12, weight: .semibold))
        .foregroundColor(DesignTokens.textSecondary)
        .frame(width: 50, alignment: .leading)

      GeometryReader { geometry in
        ZStack(alignment: .leading) {
          RoundedRectangle(cornerRadius: 4)
            .fill(DesignTokens.surface2)

          RoundedRectangle(cornerRadius: 4)
            .fill(
              LinearGradient(
                gradient: Gradient(colors: [DesignTokens.brandBlue, DesignTokens.accentPurple]),
                startPoint: .leading,
                endPoint: .trailing
              )
            )
            .frame(width: geometry.size.width * CGFloat(min(value, 1.0)))
        }
      }
      .frame(height: 8)

      Text(String(format: "%.0f%%", value * 100))
        .font(.system(size: 12, weight: .semibold))
        .foregroundColor(DesignTokens.textPrimary)
        .frame(width: 40, alignment: .trailing)
    }
  }
}

#Preview {
  VoiceRecordingView()
    .preferredColorScheme(.dark)
}
