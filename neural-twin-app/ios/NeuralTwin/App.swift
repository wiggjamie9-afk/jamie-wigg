import SwiftUI

// ============================================================================
// NEURAL TWIN iOS APP - 2026 DESIGN SYSTEM
// ============================================================================

@main
struct NeuralTwinApp: App {
  @StateObject private var authManager = AuthManager()
  @StateObject private var appState = AppState()

  var body: some Scene {
    WindowGroup {
      if authManager.isAuthenticated {
        MainTabView()
          .environmentObject(authManager)
          .environmentObject(appState)
          .preferredColorScheme(.dark)
      } else {
        AuthView()
          .environmentObject(authManager)
          .preferredColorScheme(.dark)
      }
    }
  }
}

// ============================================================================
// COLORS & DESIGN TOKENS
// ============================================================================

struct DesignTokens {
  // Colors
  static let brandBlue = Color(red: 0.04, green: 0.52, blue: 1.0)
  static let accentPurple = Color(red: 0.69, green: 0.06, blue: 1.0)
  static let accentPink = Color(red: 1.0, green: 0.06, blue: 0.69)
  static let successGreen = Color(red: 0.21, green: 0.78, blue: 0.35)
  static let warningOrange = Color(red: 1.0, green: 0.58, blue: 0.0)
  static let errorRed = Color(red: 1.0, green: 0.23, blue: 0.19)

  static let background = Color(red: 0.0, green: 0.0, blue: 0.0)
  static let surface1 = Color(red: 0.1, green: 0.1, blue: 0.1)
  static let surface2 = Color(red: 0.167, green: 0.167, blue: 0.167)
  static let textPrimary = Color.white
  static let textSecondary = Color(red: 0.627, green: 0.627, blue: 0.627)

  // Spacing
  static let spacing4: CGFloat = 4
  static let spacing8: CGFloat = 8
  static let spacing12: CGFloat = 12
  static let spacing16: CGFloat = 16
  static let spacing24: CGFloat = 24
  static let spacing32: CGFloat = 32

  // Corner radius
  static let radiusSmall: CGFloat = 12
  static let radiusMedium: CGFloat = 16
  static let radiusLarge: CGFloat = 24
}

// ============================================================================
// MAIN TAB VIEW - CAROUSEL STYLE
// ============================================================================

struct MainTabView: View {
  @EnvironmentObject var appState: AppState
  @State private var selectedTab = 0

  var body: some View {
    ZStack {
      // Background
      DesignTokens.background
        .ignoresSafeArea()

      VStack(spacing: 0) {
        // Content based on selected tab
        Group {
          switch selectedTab {
          case 0:
            HomeView()
          case 1:
            VoiceRecordingView()
          case 2:
            TwinsCarouselView()
          case 3:
            CoherenceView()
          case 4:
            MetacognitionView()
          case 5:
            SettingsView()
          default:
            HomeView()
          }
        }
        .transition(.opacity)

        Spacer()

        // Bottom tab bar
        HStack(spacing: 0) {
          ForEach(0..<6, id: \.self) { index in
            VStack(spacing: DesignTokens.spacing8) {
              Image(systemName: tabIcon(index))
                .font(.system(size: 24, weight: .semibold))
                .foregroundColor(
                  selectedTab == index ? DesignTokens.brandBlue : DesignTokens.textSecondary
                )
                .scaleEffect(selectedTab == index ? 1.1 : 1.0)

              Text(tabName(index))
                .font(.system(size: 11, weight: .semibold))
                .foregroundColor(
                  selectedTab == index ? DesignTokens.brandBlue : DesignTokens.textSecondary
                )
            }
            .frame(maxWidth: .infinity)
            .frame(height: 64)
            .contentShape(Rectangle())
            .onTapGesture {
              withAnimation(.spring(response: 0.3, dampingFraction: 0.7)) {
                selectedTab = index
              }
            }
          }
        }
        .background(DesignTokens.surface1)
        .border(top: 1, color: Color.white.opacity(0.1))
      }
    }
  }

  func tabIcon(_ index: Int) -> String {
    switch index {
    case 0: return "house.fill"
    case 1: return "waveform.circle.fill"
    case 2: return "person.2.fill"
    case 3: return "heart.fill"
    case 4: return "brain.head.profile"
    case 5: return "gear"
    default: return "house.fill"
    }
  }

  func tabName(_ index: Int) -> String {
    switch index {
    case 0: return "Home"
    case 1: return "Voice"
    case 2: return "Twins"
    case 3: return "Coherence"
    case 4: return "Thinking"
    case 5: return "Settings"
    default: return "Home"
    }
  }
}

// ============================================================================
// HOME VIEW - CAROUSEL CARDS
// ============================================================================

struct HomeView: View {
  @State private var coherenceScore: Float = 73
  @State private var interactions: Int = 12
  @State private var decisionsLogged: Int = 8

  var body: some View {
    ScrollView {
      VStack(spacing: DesignTokens.spacing24) {
        // Header
        VStack(alignment: .leading, spacing: DesignTokens.spacing8) {
          Text("Welcome back!")
            .font(.system(size: 32, weight: .bold))
            .foregroundColor(DesignTokens.textPrimary)

          Text("Your Neural Twin understands you 73% better today")
            .font(.system(size: 16, weight: .regular))
            .foregroundColor(DesignTokens.textSecondary)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(.horizontal, DesignTokens.spacing16)
        .padding(.top, DesignTokens.spacing16)

        // Stats carousel
        ScrollView(.horizontal, showsIndicators: false) {
          HStack(spacing: DesignTokens.spacing12) {
            StatCard(
              title: "Coherence",
              value: "73%",
              icon: "heart.fill",
              color: DesignTokens.successGreen
            )
            StatCard(
              title: "Interactions",
              value: "12",
              icon: "chat.bubble.fill",
              color: DesignTokens.brandBlue
            )
            StatCard(
              title: "Decisions",
              value: "8",
              icon: "checkmark.circle.fill",
              color: DesignTokens.accentPurple
            )
          }
          .padding(.horizontal, DesignTokens.spacing16)
        }
        .scrollTargetBehavior(.viewAligned)

        // Quick actions
        VStack(alignment: .leading, spacing: DesignTokens.spacing12) {
          Text("Quick Actions")
            .font(.system(size: 18, weight: .semibold))
            .padding(.horizontal, DesignTokens.spacing16)

          VStack(spacing: DesignTokens.spacing12) {
            HStack(spacing: DesignTokens.spacing12) {
              ActionButton(title: "Record Voice", icon: "mic.fill")
              ActionButton(title: "Log Decision", icon: "pencil.circle.fill")
            }
            HStack(spacing: DesignTokens.spacing12) {
              ActionButton(title: "View Patterns", icon: "chart.bar.fill")
              ActionButton(title: "Talk to Twin", icon: "bubble.left.fill")
            }
          }
          .padding(.horizontal, DesignTokens.spacing16)
        }

        Spacer(minLength: DesignTokens.spacing24)
      }
    }
  }
}

struct StatCard: View {
  let title: String
  let value: String
  let icon: String
  let color: Color

  var body: some View {
    VStack(alignment: .leading, spacing: DesignTokens.spacing12) {
      HStack {
        VStack(alignment: .leading, spacing: DesignTokens.spacing4) {
          Text(title)
            .font(.system(size: 13, weight: .regular))
            .foregroundColor(DesignTokens.textSecondary)
          Text(value)
            .font(.system(size: 28, weight: .bold))
            .foregroundColor(DesignTokens.textPrimary)
        }
        Spacer()
        Image(systemName: icon)
          .font(.system(size: 32))
          .foregroundColor(color)
      }
      .padding(DesignTokens.spacing16)
      .frame(width: 300, height: 120)
    }
    .background(
      ZStack {
        Color.black.opacity(0.6)
          .blur(radius: 20)
        Color.white.opacity(0.05)
      }
    )
    .border(1, color: Color.white.opacity(0.1))
    .cornerRadius(DesignTokens.radiusMedium)
  }
}

struct ActionButton: View {
  let title: String
  let icon: String
  @State private var isPressed = false

  var body: some View {
    VStack(spacing: DesignTokens.spacing8) {
      Image(systemName: icon)
        .font(.system(size: 24, weight: .semibold))
      Text(title)
        .font(.system(size: 12, weight: .semibold))
        .lineLimit(2)
        .multilineTextAlignment(.center)
    }
    .frame(maxWidth: .infinity)
    .frame(height: 100)
    .foregroundColor(.white)
    .background(
      LinearGradient(
        gradient: Gradient(colors: [
          DesignTokens.brandBlue,
          DesignTokens.accentPurple
        ]),
        startPoint: .topLeading,
        endPoint: .bottomTrailing
      )
    )
    .cornerRadius(DesignTokens.radiusMedium)
    .scaleEffect(isPressed ? 0.95 : 1.0)
    .onTapGesture {
      withAnimation(.easeInOut(duration: 0.2)) {
        isPressed = true
      }
      DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
        withAnimation(.easeInOut(duration: 0.2)) {
          isPressed = false
        }
      }
    }
  }
}

// ============================================================================
// VOICE RECORDING VIEW
// ============================================================================

struct VoiceRecordingView: View {
  @StateObject private var voiceRecorder = VoiceRecorder()
  @State private var showingEmotionResult = false
  @State private var detectedEmotion = ""

  var body: some View {
    ZStack {
      DesignTokens.background.ignoresSafeArea()

      VStack(spacing: DesignTokens.spacing24) {
        Text("Voice Recording")
          .font(.system(size: 28, weight: .bold))
          .foregroundColor(DesignTokens.textPrimary)
          .frame(maxWidth: .infinity, alignment: .leading)
          .padding(.horizontal, DesignTokens.spacing16)

        Spacer()

        // Waveform or recording state
        ZStack {
          Circle()
            .fill(
              LinearGradient(
                gradient: Gradient(colors: [
                  DesignTokens.brandBlue.opacity(0.3),
                  DesignTokens.accentPurple.opacity(0.3)
                ]),
                startPoint: .topLeading,
                endPoint: .bottomTrailing
              )
            )
            .frame(width: 200, height: 200)

          if voiceRecorder.isRecording {
            Canvas { context, size in
              let waves = 3
              let animationProgress = voiceRecorder.waveProgress

              for i in 0..<waves {
                let scale = 1.0 + (Double(i) * 0.3 * animationProgress)
                let opacity = 1.0 - animationProgress
                let radius = 100 * scale

                context.stroke(
                  Circle().path(in: CGRect(x: 50 - radius, y: 50 - radius, width: radius * 2, height: radius * 2)),
                  with: .color(DesignTokens.brandBlue.opacity(opacity * 0.5)),
                  lineWidth: 2
                )
              }
            }
            .frame(width: 200, height: 200)
          } else {
            Image(systemName: "mic.fill")
              .font(.system(size: 60))
              .foregroundColor(DesignTokens.brandBlue)
          }

          if voiceRecorder.isRecording {
            VStack(spacing: DesignTokens.spacing8) {
              Text(voiceRecorder.recordingTime)
                .font(.system(size: 24, weight: .bold, design: .monospaced))
                .foregroundColor(DesignTokens.textPrimary)
              Text("Recording...")
                .font(.system(size: 14, weight: .regular))
                .foregroundColor(DesignTokens.textSecondary)
            }
            .position(x: 100, y: 100)
          }
        }

        Spacer()

        // Record / Stop button
        Button(action: {
          if voiceRecorder.isRecording {
            voiceRecorder.stopRecording()
            DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
              detectedEmotion = voiceRecorder.detectedEmotion
              withAnimation {
                showingEmotionResult = true
              }
            }
          } else {
            voiceRecorder.startRecording()
          }
        }) {
          HStack(spacing: DesignTokens.spacing12) {
            Image(systemName: voiceRecorder.isRecording ? "stop.fill" : "mic.fill")
            Text(voiceRecorder.isRecording ? "Stop Recording" : "Start Recording")
              .font(.system(size: 18, weight: .semibold))
          }
          .frame(maxWidth: .infinity)
          .frame(height: 56)
          .foregroundColor(.white)
          .background(
            voiceRecorder.isRecording ?
            DesignTokens.errorRed :
            LinearGradient(
              gradient: Gradient(colors: [DesignTokens.brandBlue, DesignTokens.accentPurple]),
              startPoint: .topLeading,
              endPoint: .bottomTrailing
            )
          )
          .cornerRadius(DesignTokens.radiusMedium)
        }
        .padding(.horizontal, DesignTokens.spacing16)

        if showingEmotionResult && !detectedEmotion.isEmpty {
          VStack(spacing: DesignTokens.spacing12) {
            Text("Voice Emotion Detected")
              .font(.system(size: 14, weight: .semibold))
              .foregroundColor(DesignTokens.textSecondary)

            Text(detectedEmotion)
              .font(.system(size: 28, weight: .bold))
              .foregroundColor(emotionColor(detectedEmotion))

            HStack(spacing: DesignTokens.spacing8) {
              Text("Confidence: 82%")
                .font(.system(size: 12, weight: .regular))
                .foregroundColor(DesignTokens.textSecondary)
              ProgressView(value: 0.82)
                .tint(DesignTokens.successGreen)
            }
          }
          .frame(maxWidth: .infinity)
          .padding(DesignTokens.spacing16)
          .background(
            ZStack {
              Color.black.opacity(0.6).blur(radius: 20)
              Color.white.opacity(0.05)
            }
          )
          .border(1, color: Color.white.opacity(0.1))
          .cornerRadius(DesignTokens.radiusMedium)
          .padding(.horizontal, DesignTokens.spacing16)
          .transition(.scale.combined(with: .opacity))
        }

        Spacer()
      }
      .padding(.vertical, DesignTokens.spacing16)
    }
  }

  func emotionColor(_ emotion: String) -> Color {
    switch emotion.lowercased() {
    case "happy": return DesignTokens.successGreen
    case "sad": return DesignTokens.brandBlue
    case "angry": return DesignTokens.errorRed
    case "calm": return DesignTokens.accentPurple
    case "stressed": return DesignTokens.warningOrange
    default: return DesignTokens.textPrimary
    }
  }
}

// ============================================================================
// TWINS CAROUSEL VIEW
// ============================================================================

struct TwinsCarouselView: View {
  let twins = [
    ("Task", "📋", "Productivity & priorities"),
    ("Coach", "🎯", "Real-time guidance"),
    ("Growth", "📈", "Learning & development"),
    ("Health", "💪", "Biometric optimization"),
    ("Relationship", "🤝", "Social coherence"),
    ("Financial", "💰", "Money psychology"),
    ("Creative", "🎨", "Flow & inspiration"),
    ("Research", "🔬", "Knowledge synthesis"),
    ("Metacognition", "🪞", "Thinking about thinking")
  ]

  var body: some View {
    ZStack {
      DesignTokens.background.ignoresSafeArea()

      VStack(spacing: DesignTokens.spacing16) {
        Text("Your Twins")
          .font(.system(size: 28, weight: .bold))
          .foregroundColor(DesignTokens.textPrimary)
          .frame(maxWidth: .infinity, alignment: .leading)
          .padding(.horizontal, DesignTokens.spacing16)

        // Carousel
        ScrollView(.horizontal, showsIndicators: false) {
          HStack(spacing: DesignTokens.spacing12) {
            ForEach(twins, id: \.0) { twin, emoji, subtitle in
              TwinCard(name: twin, emoji: emoji, subtitle: subtitle)
            }
          }
          .padding(.horizontal, DesignTokens.spacing16)
        }
        .scrollTargetBehavior(.viewAligned)

        Spacer()
      }
      .padding(.vertical, DesignTokens.spacing16)
    }
  }
}

struct TwinCard: View {
  let name: String
  let emoji: String
  let subtitle: String
  @State private var isPressed = false

  var body: some View {
    NavigationLink(destination: TwinChatView(twinName: name)) {
      VStack(alignment: .leading, spacing: DesignTokens.spacing12) {
        HStack {
          Text(emoji)
            .font(.system(size: 40))
          Spacer()
          Image(systemName: "chevron.right")
            .font(.system(size: 14, weight: .semibold))
            .foregroundColor(DesignTokens.textSecondary)
        }

        VStack(alignment: .leading, spacing: DesignTokens.spacing4) {
          Text(name + " Twin")
            .font(.system(size: 20, weight: .bold))
            .foregroundColor(DesignTokens.textPrimary)

          Text(subtitle)
            .font(.system(size: 13, weight: .regular))
            .foregroundColor(DesignTokens.textSecondary)
        }
      }
      .frame(width: 280, height: 160, alignment: .topLeading)
      .padding(DesignTokens.spacing16)
      .background(
        ZStack {
          Color.black.opacity(0.6).blur(radius: 20)
          Color.white.opacity(0.05)
        }
      )
      .border(1, color: Color.white.opacity(0.1))
      .cornerRadius(DesignTokens.radiusMedium)
      .scaleEffect(isPressed ? 0.95 : 1.0)
      .onTapGesture {
        withAnimation(.spring(response: 0.3, dampingFraction: 0.7)) {
          isPressed = true
        }
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
          withAnimation(.spring(response: 0.3, dampingFraction: 0.7)) {
            isPressed = false
          }
        }
      }
    }
  }
}

struct TwinChatView: View {
  let twinName: String
  @State private var messageText = ""
  @State private var messages: [(text: String, isUser: Bool)] = []

  var body: some View {
    ZStack {
      DesignTokens.background.ignoresSafeArea()

      VStack(spacing: 0) {
        // Header
        HStack {
          VStack(alignment: .leading, spacing: 4) {
            Text(twinName)
              .font(.system(size: 18, weight: .bold))
              .foregroundColor(DesignTokens.textPrimary)
            Text("Online")
              .font(.system(size: 12, weight: .regular))
              .foregroundColor(DesignTokens.successGreen)
          }
          Spacer()
          Image(systemName: "info.circle")
            .font(.system(size: 18))
            .foregroundColor(DesignTokens.textSecondary)
        }
        .padding(DesignTokens.spacing16)
        .background(DesignTokens.surface1)
        .border(bottom: 1, color: Color.white.opacity(0.1))

        // Messages
        ScrollView {
          VStack(alignment: .leading, spacing: DesignTokens.spacing12) {
            ForEach(messages, id: \.text) { message in
              HStack(alignment: .top, spacing: DesignTokens.spacing8) {
                if message.isUser {
                  Spacer()
                }

                VStack(alignment: message.isUser ? .trailing : .leading) {
                  Text(message.text)
                    .font(.system(size: 16, weight: .regular))
                    .foregroundColor(message.isUser ? .white : DesignTokens.textSecondary)
                    .padding(DesignTokens.spacing12)
                    .background(
                      message.isUser ?
                      LinearGradient(
                        gradient: Gradient(colors: [DesignTokens.brandBlue, DesignTokens.accentPurple]),
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                      ) :
                      LinearGradient(
                        gradient: Gradient(colors: [DesignTokens.surface2, DesignTokens.surface1]),
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                      )
                    )
                    .cornerRadius(DesignTokens.radiusMedium)
                }

                if !message.isUser {
                  Spacer()
                }
              }
            }
          }
          .padding(DesignTokens.spacing16)
        }

        // Input
        HStack(spacing: DesignTokens.spacing12) {
          TextField("Message...", text: $messageText)
            .textFieldStyle(.roundedBorder)
            .frame(height: 44)
            .foregroundColor(DesignTokens.textPrimary)

          Button(action: {
            if !messageText.isEmpty {
              messages.append((messageText, true))
              messageText = ""

              DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
                messages.append(("I'm thinking about that...", false))
              }
            }
          }) {
            Image(systemName: "arrow.up.circle.fill")
              .font(.system(size: 24))
              .foregroundColor(DesignTokens.brandBlue)
          }
        }
        .padding(DesignTokens.spacing16)
        .background(DesignTokens.surface1)
        .border(top: 1, color: Color.white.opacity(0.1))
      }
    }
    .navigationBarTitleDisplayMode(.inline)
    .onAppear {
      messages = [
        ("How are you feeling today?", false)
      ]
    }
  }
}

// ============================================================================
// COHERENCE VIEW - METRICS CAROUSEL
// ============================================================================

struct CoherenceView: View {
  @State private var selectedMetric = 0

  let metrics = [
    ("Heart-Brain", 0.78, DesignTokens.successGreen),
    ("Breath", 0.72, DesignTokens.brandBlue),
    ("Brain", 0.65, DesignTokens.accentPurple),
    ("Vagal Tone", 0.81, DesignTokens.accentPink),
    ("Circadian", 0.88, DesignTokens.warningOrange),
    ("Biofield", 0.71, DesignTokens.brandBlue),
    ("Decision", 0.79, DesignTokens.successGreen),
    ("Metacognition", 0.76, DesignTokens.accentPurple)
  ]

  var body: some View {
    ZStack {
      DesignTokens.background.ignoresSafeArea()

      VStack(spacing: DesignTokens.spacing24) {
        Text("Coherence")
          .font(.system(size: 28, weight: .bold))
          .foregroundColor(DesignTokens.textPrimary)
          .frame(maxWidth: .infinity, alignment: .leading)
          .padding(.horizontal, DesignTokens.spacing16)

        // Overall score
        VStack(spacing: DesignTokens.spacing12) {
          Text("Overall Coherence")
            .font(.system(size: 14, weight: .semibold))
            .foregroundColor(DesignTokens.textSecondary)

          ZStack {
            Circle()
              .stroke(Color.white.opacity(0.1), lineWidth: 12)

            Circle()
              .trim(from: 0, to: 0.73)
              .stroke(
                LinearGradient(
                  gradient: Gradient(colors: [DesignTokens.successGreen, DesignTokens.brandBlue]),
                  startPoint: .topLeading,
                  endPoint: .bottomTrailing
                ),
                style: StrokeStyle(lineWidth: 12, lineCap: .round)
              )
              .rotationEffect(.degrees(-90))

            VStack(spacing: 4) {
              Text("73")
                .font(.system(size: 48, weight: .bold))
                .foregroundColor(DesignTokens.textPrimary)
              Text("out of 100")
                .font(.system(size: 12, weight: .regular))
                .foregroundColor(DesignTokens.textSecondary)
            }
          }
          .frame(height: 200)
        }
        .padding(DesignTokens.spacing16)
        .background(
          ZStack {
            Color.black.opacity(0.6).blur(radius: 20)
            Color.white.opacity(0.05)
          }
        )
        .border(1, color: Color.white.opacity(0.1))
        .cornerRadius(DesignTokens.radiusMedium)
        .padding(.horizontal, DesignTokens.spacing16)

        // Metrics carousel
        VStack(alignment: .leading, spacing: DesignTokens.spacing12) {
          Text("8 Coherence Layers")
            .font(.system(size: 16, weight: .semibold))
            .padding(.horizontal, DesignTokens.spacing16)

          ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: DesignTokens.spacing12) {
              ForEach(0..<metrics.count, id: \.self) { index in
                CoherenceMetricCard(
                  name: metrics[index].0,
                  value: metrics[index].1,
                  color: metrics[index].2
                )
              }
            }
            .padding(.horizontal, DesignTokens.spacing16)
          }
          .scrollTargetBehavior(.viewAligned)
        }

        Spacer()
      }
      .padding(.vertical, DesignTokens.spacing16)
    }
  }
}

struct CoherenceMetricCard: View {
  let name: String
  let value: Float
  let color: Color

  var body: some View {
    VStack(alignment: .leading, spacing: DesignTokens.spacing12) {
      Text(name)
        .font(.system(size: 14, weight: .semibold))
        .foregroundColor(DesignTokens.textPrimary)

      HStack(spacing: DesignTokens.spacing8) {
        VStack(alignment: .leading, spacing: 4) {
          Text(String(format: "%.0f%%", value * 100))
            .font(.system(size: 20, weight: .bold))
            .foregroundColor(color)

          ProgressView(value: Double(value))
            .tint(color)
        }
        .frame(maxWidth: .infinity)
      }
    }
    .frame(width: 200, height: 100)
    .padding(DesignTokens.spacing12)
    .background(
      ZStack {
        Color.black.opacity(0.6).blur(radius: 20)
        Color.white.opacity(0.05)
      }
    )
    .border(1, color: Color.white.opacity(0.1))
    .cornerRadius(DesignTokens.radiusMedium)
  }
}

// ============================================================================
// SETTINGS VIEW
// ============================================================================

struct SettingsView: View {
  @EnvironmentObject var authManager: AuthManager

  var body: some View {
    ZStack {
      DesignTokens.background.ignoresSafeArea()

      VStack(alignment: .leading, spacing: DesignTokens.spacing24) {
        Text("Settings")
          .font(.system(size: 28, weight: .bold))
          .foregroundColor(DesignTokens.textPrimary)
          .padding(.horizontal, DesignTokens.spacing16)

        VStack(spacing: DesignTokens.spacing12) {
          SettingRow(title: "Account", icon: "person.crop.circle.fill")
          SettingRow(title: "Privacy", icon: "lock.fill")
          SettingRow(title: "Data Export", icon: "arrow.down.doc.fill")
          SettingRow(title: "Accessibility", icon: "accessibility")
        }

        Spacer()

        Button(role: .destructive, action: {
          authManager.logout()
        }) {
          HStack {
            Image(systemName: "arrow.left.circle.fill")
            Text("Sign Out")
              .font(.system(size: 16, weight: .semibold))
          }
          .frame(maxWidth: .infinity)
          .frame(height: 50)
          .foregroundColor(.white)
          .background(DesignTokens.errorRed)
          .cornerRadius(DesignTokens.radiusMedium)
        }
        .padding(.horizontal, DesignTokens.spacing16)
        .padding(.bottom, DesignTokens.spacing16)
      }
    }
  }
}

struct SettingRow: View {
  let title: String
  let icon: String

  var body: some View {
    HStack(spacing: DesignTokens.spacing12) {
      Image(systemName: icon)
        .font(.system(size: 18, weight: .semibold))
        .foregroundColor(DesignTokens.brandBlue)
        .frame(width: 32)

      Text(title)
        .font(.system(size: 16, weight: .semibold))
        .foregroundColor(DesignTokens.textPrimary)

      Spacer()

      Image(systemName: "chevron.right")
        .font(.system(size: 14, weight: .semibold))
        .foregroundColor(DesignTokens.textSecondary)
    }
    .padding(DesignTokens.spacing16)
    .background(
      ZStack {
        Color.black.opacity(0.6).blur(radius: 20)
        Color.white.opacity(0.05)
      }
    )
    .border(1, color: Color.white.opacity(0.1))
    .cornerRadius(DesignTokens.radiusMedium)
    .padding(.horizontal, DesignTokens.spacing16)
  }
}

// ============================================================================
// AUTH VIEW
// ============================================================================

struct AuthView: View {
  @EnvironmentObject var authManager: AuthManager
  @State private var email = ""
  @State private var password = ""

  var body: some View {
    ZStack {
      DesignTokens.background.ignoresSafeArea()

      VStack(spacing: DesignTokens.spacing24) {
        Spacer()

        VStack(spacing: DesignTokens.spacing12) {
          Image(systemName: "brain.head.profile")
            .font(.system(size: 64, weight: .semibold))
            .foregroundColor(DesignTokens.brandBlue)

          Text("Neural Twin")
            .font(.system(size: 32, weight: .bold))
            .foregroundColor(DesignTokens.textPrimary)

          Text("Your personal AI companion")
            .font(.system(size: 16, weight: .regular))
            .foregroundColor(DesignTokens.textSecondary)
        }

        Spacer()

        VStack(spacing: DesignTokens.spacing12) {
          TextField("Email", text: $email)
            .textContentType(.emailAddress)
            .keyboardType(.emailAddress)
            .padding(DesignTokens.spacing12)
            .background(DesignTokens.surface1)
            .cornerRadius(DesignTokens.radiusSmall)

          SecureField("Password", text: $password)
            .textContentType(.password)
            .padding(DesignTokens.spacing12)
            .background(DesignTokens.surface1)
            .cornerRadius(DesignTokens.radiusSmall)
        }

        Button(action: {
          authManager.login(email: email, password: password)
        }) {
          Text("Sign In")
            .font(.system(size: 16, weight: .semibold))
            .frame(maxWidth: .infinity)
            .frame(height: 50)
            .foregroundColor(.white)
            .background(
              LinearGradient(
                gradient: Gradient(colors: [DesignTokens.brandBlue, DesignTokens.accentPurple]),
                startPoint: .topLeading,
                endPoint: .bottomTrailing
              )
            )
            .cornerRadius(DesignTokens.radiusSmall)
        }

        Spacer()

        HStack(spacing: 4) {
          Text("Don't have an account?")
            .foregroundColor(DesignTokens.textSecondary)
          Text("Sign up")
            .foregroundColor(DesignTokens.brandBlue)
            .fontWeight(.semibold)
        }
        .font(.system(size: 14, weight: .regular))
      }
      .padding(DesignTokens.spacing24)
    }
  }
}

// ============================================================================
// VIEW MODELS & STATE
// ============================================================================

@MainActor
class AuthManager: ObservableObject {
  @Published var isAuthenticated = false

  func login(email: String, password: String) {
    // TODO: API call to backend
    isAuthenticated = true
  }

  func logout() {
    isAuthenticated = false
  }
}

class AppState: ObservableObject {
  @Published var selectedTab = 0
}

class VoiceRecorder: NSObject, ObservableObject {
  @Published var isRecording = false
  @Published var recordingTime = "0:00"
  @Published var waveProgress: Double = 0
  @Published var detectedEmotion = "Happy"

  private var timer: Timer?
  private var seconds = 0

  func startRecording() {
    isRecording = true
    seconds = 0
    timer = Timer.scheduledTimer(withTimeInterval: 1, repeats: true) { [weak self] _ in
      guard let self = self else { return }
      self.seconds += 1
      self.recordingTime = String(format: "%d:%02d", self.seconds / 60, self.seconds % 60)
      self.waveProgress = Double(Int.random(in: 0...100)) / 100
    }
    // TODO: Start AVAudioEngine
  }

  func stopRecording() {
    isRecording = false
    timer?.invalidate()
    // TODO: Send to backend, get emotion analysis
    // Simulate emotion detection
    let emotions = ["Happy", "Calm", "Curious", "Excited", "Thoughtful"]
    detectedEmotion = emotions.randomElement() ?? "Happy"
  }
}

// ============================================================================
// EXTENSIONS
// ============================================================================

extension View {
  /// Divider-style hairline on the top edge only.
  func border(top width: CGFloat, color: Color) -> some View {
    overlay(
      VStack(spacing: 0) {
        Rectangle().fill(color).frame(height: width)
        Spacer(minLength: 0)
      }
    )
  }

  /// Divider-style hairline on the bottom edge only.
  func border(bottom width: CGFloat, color: Color) -> some View {
    overlay(
      VStack(spacing: 0) {
        Spacer(minLength: 0)
        Rectangle().fill(color).frame(height: width)
      }
    )
  }

  /// Full rounded-rectangle stroke.
  func border(_ thickness: CGFloat, color: Color) -> some View {
    overlay(
      RoundedRectangle(cornerRadius: 16)
        .stroke(color, lineWidth: thickness)
    )
  }
}

// ============================================================================
// METACOGNITION VIEW - 8TH COHERENCE LAYER
// ============================================================================

struct MetacognitionView: View {
  @State private var planningScore: Float = 0.7
  @State private var monitoringScore: Float = 0.65
  @State private var evaluatingScore: Float = 0.72
  @State private var reflectingScore: Float = 0.68

  var metacognitiveCoherence: Float {
    ((planningScore + monitoringScore + evaluatingScore + reflectingScore) / 4) * 100
  }

  var body: some View {
    ScrollView {
      VStack(spacing: DesignTokens.spacing24) {
        // Header
        VStack(alignment: .leading, spacing: DesignTokens.spacing8) {
          Text("Thinking About Your Thinking")
            .font(.system(size: 32, weight: .bold))
            .foregroundColor(DesignTokens.textPrimary)

          Text("Metacognitive awareness")
            .font(.system(size: 16, weight: .regular))
            .foregroundColor(DesignTokens.textSecondary)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(.horizontal, DesignTokens.spacing16)
        .padding(.top, DesignTokens.spacing16)

        // Metacognitive Coherence Card
        VStack(spacing: DesignTokens.spacing12) {
          Text("Metacognitive Coherence")
            .font(.system(size: 14, weight: .regular))
            .foregroundColor(DesignTokens.textSecondary)

          Text(String(format: "%.0f%%", metacognitiveCoherence))
            .font(.system(size: 48, weight: .bold))
            .foregroundColor(DesignTokens.brandBlue)

          Text("Your thinking clarity across all domains")
            .font(.system(size: 12, weight: .regular))
            .foregroundColor(DesignTokens.textSecondary)
        }
        .frame(maxWidth: .infinity)
        .padding(DesignTokens.spacing24)
        .background(
          ZStack {
            Color.black.opacity(0.6).blur(radius: 20)
            Color.white.opacity(0.05)
          }
        )
        .border(1, color: Color.white.opacity(0.1))
        .cornerRadius(DesignTokens.radiusMedium)
        .padding(.horizontal, DesignTokens.spacing16)

        // 4 Pillars
        VStack(alignment: .leading, spacing: DesignTokens.spacing12) {
          Text("4 Pillars of Thinking")
            .font(.system(size: 18, weight: .semibold))
            .padding(.horizontal, DesignTokens.spacing16)

          ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: DesignTokens.spacing12) {
              MetacognitiveScorePillar(
                title: "Planning",
                emoji: "🎯",
                score: planningScore,
                description: "Goal clarity"
              )
              MetacognitiveScorePillar(
                title: "Monitoring",
                emoji: "👁️",
                score: monitoringScore,
                description: "Self-awareness"
              )
              MetacognitiveScorePillar(
                title: "Evaluating",
                emoji: "⚖️",
                score: evaluatingScore,
                description: "Critical thinking"
              )
              MetacognitiveScorePillar(
                title: "Reflecting",
                emoji: "🪞",
                score: reflectingScore,
                description: "Learning"
              )
            }
            .padding(.horizontal, DesignTokens.spacing16)
          }
          .scrollTargetBehavior(.viewAligned)
        }

        Spacer(minLength: DesignTokens.spacing24)
      }
    }
  }
}

struct MetacognitiveScorePillar: View {
  let title: String
  let emoji: String
  let score: Float
  let description: String

  var body: some View {
    VStack(alignment: .center, spacing: DesignTokens.spacing8) {
      Text(emoji)
        .font(.system(size: 28))

      Text(title)
        .font(.system(size: 14, weight: .semibold))
        .foregroundColor(DesignTokens.textPrimary)

      Text(String(format: "%.0f%%", score * 100))
        .font(.system(size: 20, weight: .bold))
        .foregroundColor(score > 0.7 ? DesignTokens.successGreen : DesignTokens.brandBlue)

      Text(description)
        .font(.system(size: 10, weight: .regular))
        .foregroundColor(DesignTokens.textSecondary)
        .lineLimit(1)
    }
    .frame(width: 140, height: 160)
    .padding(DesignTokens.spacing12)
    .background(
      ZStack {
        Color.black.opacity(0.6).blur(radius: 20)
        Color.white.opacity(0.05)
      }
    )
    .border(1, color: DesignTokens.brandBlue.opacity(0.3))
    .cornerRadius(DesignTokens.radiusMedium)
  }
}

#Preview {
  MainTabView()
    .environmentObject(AppState())
    .environmentObject(AuthManager())
}
