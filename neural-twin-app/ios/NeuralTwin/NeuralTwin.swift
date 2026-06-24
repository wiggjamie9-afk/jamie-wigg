import SwiftUI

// ============================================================================
// NEURAL TWIN iOS APP - ROOT
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
      } else {
        AuthView()
          .environmentObject(authManager)
      }
    }
  }
}

// ============================================================================
// MAIN TAB VIEW
// ============================================================================

struct MainTabView: View {
  @EnvironmentObject var appState: AppState

  var body: some View {
    TabView(selection: $appState.selectedTab) {
      // HOME TAB
      HomeView()
        .tabItem {
          Label("Home", systemImage: "house.fill")
        }
        .tag(Tab.home)

      // VOICE TAB
      VoiceRecordingView()
        .tabItem {
          Label("Voice", systemImage: "waveform.circle.fill")
        }
        .tag(Tab.voice)

      // TWINS TAB
      TwinsView()
        .tabItem {
          Label("Twins", systemImage: "person.2.fill")
        }
        .tag(Tab.twins)

      // COHERENCE TAB
      CoherenceView()
        .tabItem {
          Label("Coherence", systemImage: "heart.fill")
        }
        .tag(Tab.coherence)

      // SETTINGS TAB
      SettingsView()
        .tabItem {
          Label("Settings", systemImage: "gear")
        }
        .tag(Tab.settings)
    }
  }
}

enum Tab {
  case home
  case voice
  case twins
  case coherence
  case settings
}

// ============================================================================
// HOME VIEW
// ============================================================================

struct HomeView: View {
  @EnvironmentObject var appState: AppState

  var body: some View {
    NavigationStack {
      ScrollView {
        VStack(spacing: 20) {
          // Header
          VStack(alignment: .leading, spacing: 8) {
            Text("Welcome back!")
              .font(.title2)
              .fontWeight(.bold)
            Text("Your Neural Twin is ready to understand you")
              .font(.caption)
              .foregroundColor(.secondary)
          }
          .frame(maxWidth: .infinity, alignment: .leading)
          .padding()

          // Today's Stats
          VStack(spacing: 12) {
            StatCard(title: "Coherence", value: "73%", icon: "heart.fill", color: .red)
            StatCard(title: "Interactions", value: "12", icon: "chat.bubble.fill", color: .blue)
            StatCard(title: "Decisions Logged", value: "8", icon: "checkmark.circle.fill", color: .green)
          }

          // Quick Actions
          VStack(alignment: .leading, spacing: 12) {
            Text("Quick Actions")
              .font(.headline)
              .padding(.horizontal)

            HStack(spacing: 12) {
              ActionButton(title: "Record Voice", icon: "mic.fill")
              ActionButton(title: "Log Decision", icon: "pencil.circle.fill")
            }
            .padding(.horizontal)

            HStack(spacing: 12) {
              ActionButton(title: "View Patterns", icon: "chart.bar.fill")
              ActionButton(title: "Talk to Twin", icon: "bubble.left.fill")
            }
            .padding(.horizontal)
          }

          Spacer()
        }
        .padding(.vertical)
      }
      .navigationTitle("Neural Twin")
      .navigationBarTitleDisplayMode(.inline)
    }
  }
}

struct StatCard: View {
  let title: String
  let value: String
  let icon: String
  let color: Color

  var body: some View {
    HStack {
      VStack(alignment: .leading, spacing: 4) {
        Text(title)
          .font(.caption)
          .foregroundColor(.secondary)
        Text(value)
          .font(.title2)
          .fontWeight(.bold)
      }
      Spacer()
      Image(systemName: icon)
        .font(.title)
        .foregroundColor(color)
    }
    .padding()
    .background(Color(.systemGray6))
    .cornerRadius(12)
  }
}

struct ActionButton: View {
  let title: String
  let icon: String

  var body: some View {
    VStack(spacing: 8) {
      Image(systemName: icon)
        .font(.title3)
      Text(title)
        .font(.caption2)
        .lineLimit(2)
        .multilineTextAlignment(.center)
    }
    .frame(maxWidth: .infinity)
    .frame(height: 80)
    .background(Color(.systemBlue))
    .foregroundColor(.white)
    .cornerRadius(12)
  }
}

// ============================================================================
// VOICE RECORDING VIEW
// ============================================================================

struct VoiceRecordingView: View {
  @StateObject private var voiceRecorder = VoiceRecorder()

  var body: some View {
    NavigationStack {
      VStack(spacing: 20) {
        // Waveform visualization
        if voiceRecorder.isRecording {
          WaveformView()
            .frame(height: 100)
            .padding()
        } else {
          Image(systemName: "waveform")
            .font(.system(size: 60))
            .foregroundColor(.blue)
            .padding()
        }

        // Recording time
        if voiceRecorder.isRecording {
          Text(voiceRecorder.recordingTime)
            .font(.title2)
            .fontWeight(.bold)
            .monospacedDigit()
        }

        // Record / Stop button
        Button(action: {
          if voiceRecorder.isRecording {
            voiceRecorder.stopRecording()
          } else {
            voiceRecorder.startRecording()
          }
        }) {
          Text(voiceRecorder.isRecording ? "Stop Recording" : "Start Recording")
            .font(.headline)
            .foregroundColor(.white)
            .frame(maxWidth: .infinity)
            .frame(height: 50)
            .background(voiceRecorder.isRecording ? Color.red : Color.blue)
            .cornerRadius(12)
        }
        .padding()

        Spacer()
      }
      .navigationTitle("Voice Recording")
      .navigationBarTitleDisplayMode(.inline)
    }
  }
}

struct WaveformView: View {
  var body: some View {
    Canvas { context, size in
      // Draw animated waveform
      var path = Path()
      let width = size.width
      let height = size.height / 2

      for x in stride(from: 0, to: width, by: 2) {
        let y = height + sin(x * 0.02) * 20
        if x == 0 {
          path.move(to: CGPoint(x: x, y: y))
        } else {
          path.addLine(to: CGPoint(x: x, y: y))
        }
      }

      context.stroke(
        path,
        with: .color(.blue),
        lineWidth: 2
      )
    }
  }
}

// ============================================================================
// TWINS VIEW
// ============================================================================

struct TwinsView: View {
  let twins = ["Task", "Coach", "Growth", "Health", "Relationship", "Financial", "Creative", "Research"]

  var body: some View {
    NavigationStack {
      List {
        ForEach(twins, id: \.self) { twinName in
          NavigationLink(destination: TwinChatView(twinName: twinName)) {
            HStack {
              Image(systemName: "person.fill")
                .font(.title3)
                .foregroundColor(.blue)
              VStack(alignment: .leading, spacing: 4) {
                Text(twinName + " Twin")
                  .fontWeight(.semibold)
                Text("Last talked 2h ago")
                  .font(.caption)
                  .foregroundColor(.secondary)
              }
            }
          }
        }
      }
      .navigationTitle("Your Twins")
      .navigationBarTitleDisplayMode(.inline)
    }
  }
}

struct TwinChatView: View {
  let twinName: String
  @State private var messageText = ""

  var body: some View {
    VStack {
      ScrollView {
        VStack(alignment: .leading, spacing: 12) {
          // Sample messages
          HStack {
            VStack(alignment: .leading) {
              Text("How can I help you with your day?")
                .padding()
                .background(Color(.systemGray6))
                .cornerRadius(12)
            }
            Spacer()
          }

          HStack {
            Spacer()
            VStack(alignment: .trailing) {
              Text("I'd like to talk about my decisions")
                .padding()
                .background(Color.blue)
                .foregroundColor(.white)
                .cornerRadius(12)
            }
          }
        }
        .padding()
      }

      // Input
      HStack {
        TextField("Type a message...", text: $messageText)
          .padding(10)
          .background(Color(.systemGray6))
          .cornerRadius(8)

        Button(action: {}) {
          Image(systemName: "arrow.up.circle.fill")
            .font(.title2)
            .foregroundColor(.blue)
        }
      }
      .padding()
    }
    .navigationTitle("\(twinName) Twin")
    .navigationBarTitleDisplayMode(.inline)
  }
}

// ============================================================================
// COHERENCE VIEW
// ============================================================================

struct CoherenceView: View {
  var body: some View {
    NavigationStack {
      ScrollView {
        VStack(spacing: 20) {
          // Main coherence score
          VStack(spacing: 12) {
            Text("Overall Coherence")
              .font(.headline)

            ZStack {
              Circle()
                .fill(Color.blue.opacity(0.1))

              VStack(spacing: 4) {
                Text("73")
                  .font(.system(size: 48, weight: .bold))
                Text("out of 100")
                  .font(.caption)
                  .foregroundColor(.secondary)
              }
            }
            .frame(height: 150)
          }
          .padding()

          // 7 Coherence layers
          VStack(alignment: .leading, spacing: 12) {
            Text("Coherence Metrics")
              .font(.headline)
              .padding(.horizontal)

            VStack(spacing: 8) {
              CoherenceMetricRow(name: "Heart-Brain", value: 0.78)
              CoherenceMetricRow(name: "Breath", value: 0.72)
              CoherenceMetricRow(name: "Brain", value: 0.65)
              CoherenceMetricRow(name: "Vagal Tone", value: 0.81)
              CoherenceMetricRow(name: "Circadian", value: 0.88)
              CoherenceMetricRow(name: "Biofield", value: 0.71)
              CoherenceMetricRow(name: "Decision", value: 0.79)
            }
            .padding()
          }

          Spacer()
        }
      }
      .navigationTitle("Coherence")
      .navigationBarTitleDisplayMode(.inline)
    }
  }
}

struct CoherenceMetricRow: View {
  let name: String
  let value: Float

  var body: some View {
    VStack(alignment: .leading, spacing: 4) {
      HStack {
        Text(name)
          .font(.subheadline)
        Spacer()
        Text(String(format: "%.0f%%", value * 100))
          .font(.subheadline)
          .fontWeight(.semibold)
      }

      ProgressView(value: Double(value))
        .tint(.blue)
    }
  }
}

// ============================================================================
// SETTINGS VIEW
// ============================================================================

struct SettingsView: View {
  @EnvironmentObject var authManager: AuthManager

  var body: some View {
    NavigationStack {
      List {
        Section("Account") {
          NavigationLink("Profile", destination: Text("Profile settings"))
          NavigationLink("Privacy", destination: Text("Privacy settings"))
          NavigationLink("Data Export", destination: Text("Export your data"))
        }

        Section("App") {
          Toggle("Notifications", isOn: .constant(true))
          NavigationLink("About", destination: Text("Neural Twin v0.1.0"))
        }

        Section {
          Button(role: .destructive) {
            authManager.logout()
          } label: {
            Text("Sign Out")
          }
        }
      }
      .navigationTitle("Settings")
      .navigationBarTitleDisplayMode(.inline)
    }
  }
}

// ============================================================================
// AUTHENTICATION VIEW
// ============================================================================

struct AuthView: View {
  @EnvironmentObject var authManager: AuthManager
  @State private var email = ""
  @State private var password = ""

  var body: some View {
    NavigationStack {
      VStack(spacing: 20) {
        VStack(spacing: 12) {
          Image(systemName: "brain.head.profile")
            .font(.system(size: 60))
            .foregroundColor(.blue)
          Text("Neural Twin")
            .font(.title)
            .fontWeight(.bold)
          Text("Your personal AI companion")
            .font(.caption)
            .foregroundColor(.secondary)
        }
        .padding(.vertical, 40)

        VStack(spacing: 12) {
          TextField("Email", text: $email)
            .textContentType(.emailAddress)
            .keyboardType(.emailAddress)
            .padding()
            .background(Color(.systemGray6))
            .cornerRadius(8)

          SecureField("Password", text: $password)
            .textContentType(.password)
            .padding()
            .background(Color(.systemGray6))
            .cornerRadius(8)
        }

        Button(action: {
          authManager.login(email: email, password: password)
        }) {
          Text("Sign In")
            .font(.headline)
            .foregroundColor(.white)
            .frame(maxWidth: .infinity)
            .frame(height: 50)
            .background(Color.blue)
            .cornerRadius(8)
        }

        Divider()

        VStack(spacing: 12) {
          Button(action: {
            authManager.loginWithApple()
          }) {
            HStack {
              Image(systemName: "apple.logo")
              Text("Sign in with Apple")
            }
            .frame(maxWidth: .infinity)
            .frame(height: 50)
            .background(Color.black)
            .foregroundColor(.white)
            .cornerRadius(8)
          }

          Button(action: {
            authManager.loginWithGoogle()
          }) {
            HStack {
              Image(systemName: "g.circle.fill")
              Text("Sign in with Google")
            }
            .frame(maxWidth: .infinity)
            .frame(height: 50)
            .background(Color(.systemGray))
            .foregroundColor(.white)
            .cornerRadius(8)
          }
        }

        Spacer()

        HStack(spacing: 4) {
          Text("Don't have an account?")
          NavigationLink("Sign up", destination: SignupView())
        }
        .font(.caption)
      }
      .padding()
    }
  }
}

struct SignupView: View {
  var body: some View {
    Text("Sign up form coming soon")
  }
}

// ============================================================================
// VIEW MODELS & MANAGERS
// ============================================================================

@MainActor
class AuthManager: ObservableObject {
  @Published var isAuthenticated = false
  @Published var user: User?

  func login(email: String, password: String) {
    // TODO: Call backend API
    isAuthenticated = true
  }

  func loginWithApple() {
    // TODO: Implement Apple Sign-in
  }

  func loginWithGoogle() {
    // TODO: Implement Google Sign-in
  }

  func logout() {
    isAuthenticated = false
    user = nil
  }
}

class AppState: ObservableObject {
  @Published var selectedTab: Tab = .home
}

class VoiceRecorder: NSObject, ObservableObject {
  @Published var isRecording = false
  @Published var recordingTime = "0:00"

  func startRecording() {
    isRecording = true
    // TODO: Implement AVAudioEngine recording
  }

  func stopRecording() {
    isRecording = false
    // TODO: Send to backend and get emotion analysis
  }
}

struct User {
  let id: String
  let email: String
  let name: String
}

#Preview {
  MainTabView()
    .environmentObject(AppState())
    .environmentObject(AuthManager())
}
