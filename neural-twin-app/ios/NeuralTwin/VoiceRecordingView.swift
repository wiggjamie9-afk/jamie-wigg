import SwiftUI
import AVFoundation

// ============================================================================
// VOICE RECORDING VIEW - Audio capture, emotion analysis, history
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

  private var audioRecorder: AVAudioRecorder?
  private var audioPlayer: AVAudioPlayer?
  private var displayLink: CADisplayLink?

  let apiClient = APIClient.shared

  override init() {
    super.init()
    loadRecordings()
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
    error = nil

    Task {
      do {
        let audioData = try Data(contentsOf: url)
        let audioBase64 = audioData.base64EncodedString()

        let response = try await apiClient.uploadVoiceRecording(
          audioBase64: audioBase64,
          context: "Voice recording"
        )

        // Add to beginning of list
        recordings.insert(response, at: 0)
        selectedRecording = response

        // Clean up file
        try? FileManager.default.removeItem(at: url)

      } catch {
        self.error = "Upload failed: \(error.localizedDescription)"
        self.showError = true
      }

      isLoading = false
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

  var body: some View {
    ZStack {
      DesignTokens.background.ignoresSafeArea()

      VStack(spacing: DesignTokens.spacing24) {
        // Header
        Text("Voice Journal")
          .font(.system(size: 28, weight: .bold))
          .foregroundColor(.white)
          .frame(maxWidth: .infinity, alignment: .leading)
          .padding(.horizontal, DesignTokens.spacing16)

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
        }
        .padding(DesignTokens.spacing16)
        .background(DesignTokens.surface1)
        .cornerRadius(DesignTokens.radiusMedium)

        // Selected recording details
        if let recording = viewModel.selectedRecording {
          VStack(spacing: DesignTokens.spacing12) {
            Text("Emotion Analysis")
              .font(.system(size: 14, weight: .semibold))
              .foregroundColor(DesignTokens.textSecondary)
              .frame(maxWidth: .infinity, alignment: .leading)

            // Emotion bars
            VStack(spacing: DesignTokens.spacing8) {
              EmotionBar(label: "Joy", value: recording.emotionResult.emotions["joy"] ?? 0)
              EmotionBar(label: "Calm", value: recording.emotionResult.emotions["calm"] ?? 0)
              EmotionBar(label: "Focus", value: recording.emotionResult.emotions["focus"] ?? 0)
              EmotionBar(label: "Neutral", value: recording.emotionResult.emotions["neutral"] ?? 0)
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

          if viewModel.isLoading {
            ProgressView()
              .frame(maxWidth: .infinity)
              .frame(height: 100)
          } else if viewModel.recordings.isEmpty {
            Text("No recordings yet. Start by recording your first voice message.")
              .font(.system(size: 14, weight: .regular))
              .foregroundColor(DesignTokens.textSecondary)
              .frame(maxWidth: .infinity)
              .frame(height: 100)
              .background(DesignTokens.surface1)
              .cornerRadius(DesignTokens.radiusMedium)
          } else {
            ScrollView {
              VStack(spacing: DesignTokens.spacing12) {
                ForEach(viewModel.recordings.prefix(5), id: \.id) { recording in
                  RecordingListItem(recording: recording, isSelected: viewModel.selectedRecording?.id == recording.id) {
                    viewModel.selectedRecording = recording
                  }
                }
              }
            }
          }
        }
        .frame(maxHeight: .infinity, alignment: .top)

        Spacer()
      }
      .padding(DesignTokens.spacing16)
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

          Text(recording.createdAt.formatted(date: .abbreviated, time: .shortened))
            .font(.system(size: 12, weight: .regular))
            .foregroundColor(DesignTokens.textSecondary)
        }

        Spacer()

        VStack(alignment: .trailing, spacing: 4) {
          Text(recording.emotionResult.emotions["joy"].map { String(format: "%.0f%%", $0 * 100) } ?? "—")
            .font(.system(size: 14, weight: .semibold))
            .foregroundColor(DesignTokens.successGreen)
        }
      }
      .padding(DesignTokens.spacing12)
      .background(isSelected ? DesignTokens.surface2 : DesignTokens.surface1)
      .cornerRadius(DesignTokens.radiusSmall)
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
