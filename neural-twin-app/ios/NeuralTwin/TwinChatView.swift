import SwiftUI

// ============================================================================
// TWIN CHAT VIEW - Multi-turn conversations with 9 specialist AIs
// ============================================================================

struct TwinInfo {
  let type: String
  let name: String
  let emoji: String
  let subtitle: String
  let description: String
}

let TWINS = [
  TwinInfo(type: "task", name: "Task Twin", emoji: "✅", subtitle: "Productivity", description: "Workflow optimization & prioritization"),
  TwinInfo(type: "coach", name: "Coach Twin", emoji: "🏆", subtitle: "Guidance", description: "Metacognitive coaching"),
  TwinInfo(type: "growth", name: "Growth Twin", emoji: "📈", subtitle: "Learning", description: "Learning & development"),
  TwinInfo(type: "health", name: "Health Twin", emoji: "💪", subtitle: "Wellness", description: "Physical & mental health"),
  TwinInfo(type: "relationship", name: "Relationship Twin", emoji: "❤️", subtitle: "Connection", description: "Social & relationship patterns"),
  TwinInfo(type: "financial", name: "Financial Twin", emoji: "💰", subtitle: "Money", description: "Financial psychology & planning"),
  TwinInfo(type: "creative", name: "Creative Twin", emoji: "🎨", subtitle: "Expression", description: "Creative flow & inspiration"),
  TwinInfo(type: "research", name: "Research Twin", emoji: "🔬", subtitle: "Knowledge", description: "Knowledge synthesis"),
  TwinInfo(type: "metacognition", name: "Metacognition Twin", emoji: "🪞", subtitle: "Thinking", description: "Thinking about thinking")
]

@MainActor
class TwinChatViewModel: ObservableObject {
  @Published var selectedTwinType: String?
  @Published var messages: [ChatMessage] = []
  @Published var messageInput = ""
  @Published var isLoading = false
  @Published var error: String?
  @Published var showError = false

  private let apiClient = APIClient.shared

  func sendMessage(twinType: String) {
    guard !messageInput.isEmpty else { return }

    let userMessage = messageInput
    messageInput = ""
    isLoading = true
    error = nil

    // Add user message to display
    messages.append(ChatMessage(
      id: UUID().uuidString,
      role: "user",
      content: userMessage,
      timestamp: Date()
    ))

    Task {
      do {
        let response = try await apiClient.chatWithTwin(
          twinType: twinType,
          userMessage: userMessage
        )

        // Add Twin response
        messages.append(ChatMessage(
          id: response.id,
          role: "twin",
          content: response.twinResponse,
          timestamp: Date()
        ))

      } catch {
        self.error = "Failed to get Twin response: \(error.localizedDescription)"
        self.showError = true

        // Remove user message if sending failed
        if !messages.isEmpty {
          messages.removeLast()
        }
      }

      isLoading = false
    }
  }

  func loadTwinHistory(twinType: String) {
    isLoading = true
    error = nil

    Task {
      do {
        let response = try await apiClient.getTwinHistory(twinType: twinType)
        messages = response.interactions.map { interaction in
          // Alternate user and twin messages
          ChatMessage(
            id: interaction.id,
            role: "user",
            content: interaction.userMessage,
            timestamp: interaction.timestamp
          )
        }
      } catch {
        self.error = "Failed to load history: \(error.localizedDescription)"
        self.showError = true
      }

      isLoading = false
    }
  }
}

struct ChatMessage {
  let id: String
  let role: String // "user" or "twin"
  let content: String
  let timestamp: Date
}

struct TwinsCarouselView: View {
  @StateObject private var viewModel = TwinChatViewModel()
  @State private var selectedTwin: TwinInfo?

  var body: some View {
    ZStack {
      DesignTokens.background.ignoresSafeArea()

      if let selectedTwin = selectedTwin {
        TwinChatDetailView(
          twin: selectedTwin,
          viewModel: viewModel,
          onClose: { selectedTwin = nil }
        )
      } else {
        TwinsGridView(onSelectTwin: { twin in
          selectedTwin = twin
          viewModel.selectedTwinType = twin.type
          viewModel.loadTwinHistory(twinType: twin.type)
        })
      }
    }
  }
}

struct TwinsGridView: View {
  let onSelectTwin: (TwinInfo) -> Void

  var columns: [GridItem] {
    [GridItem(.flexible(), spacing: DesignTokens.spacing12),
     GridItem(.flexible(), spacing: DesignTokens.spacing12)]
  }

  var body: some View {
    VStack(spacing: DesignTokens.spacing24) {
      Text("Twin Specialists")
        .font(.system(size: 28, weight: .bold))
        .foregroundColor(.white)
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(.horizontal, DesignTokens.spacing16)

      ScrollView {
        LazyVGrid(columns: columns, spacing: DesignTokens.spacing12) {
          ForEach(TWINS, id: \.type) { twin in
            TwinCard(twin: twin) {
              onSelectTwin(twin)
            }
          }
        }
        .padding(DesignTokens.spacing16)
      }
    }
  }
}

struct TwinCard: View {
  let twin: TwinInfo
  let onTap: () -> Void

  var body: some View {
    Button(action: onTap) {
      VStack(spacing: DesignTokens.spacing12) {
        Text(twin.emoji)
          .font(.system(size: 40))

        Text(twin.name)
          .font(.system(size: 14, weight: .semibold))
          .foregroundColor(.white)

        Text(twin.description)
          .font(.system(size: 11, weight: .regular))
          .foregroundColor(DesignTokens.textSecondary)
          .lineLimit(2)
          .multilineTextAlignment(.center)
      }
      .frame(maxWidth: .infinity)
      .frame(height: 140)
      .padding(DesignTokens.spacing12)
      .background(
        LinearGradient(
          gradient: Gradient(colors: [DesignTokens.surface2, DesignTokens.surface1]),
          startPoint: .topLeading,
          endPoint: .bottomTrailing
        )
      )
      .cornerRadius(DesignTokens.radiusMedium)
      .overlay(
        RoundedRectangle(cornerRadius: DesignTokens.radiusMedium)
          .stroke(DesignTokens.brandBlue, lineWidth: 1)
          .opacity(0.3)
      )
    }
  }
}

struct TwinChatDetailView: View {
  let twin: TwinInfo
  @ObservedObject var viewModel: TwinChatViewModel
  let onClose: () -> Void

  var body: some View {
    VStack(spacing: 0) {
      // Header
      HStack(spacing: DesignTokens.spacing12) {
        Button(action: onClose) {
          Image(systemName: "chevron.left")
            .font(.system(size: 16, weight: .semibold))
            .foregroundColor(DesignTokens.brandBlue)
        }

        VStack(alignment: .leading, spacing: 2) {
          HStack(spacing: DesignTokens.spacing8) {
            Text(twin.emoji)
              .font(.system(size: 18))
            Text(twin.name)
              .font(.system(size: 16, weight: .semibold))
              .foregroundColor(.white)
          }

          Text(twin.description)
            .font(.system(size: 12, weight: .regular))
            .foregroundColor(DesignTokens.textSecondary)
        }

        Spacer()
      }
      .padding(DesignTokens.spacing16)
      .background(DesignTokens.surface1)

      // Messages
      ScrollViewReader { proxy in
        ScrollView {
          LazyVStack(spacing: DesignTokens.spacing12, pinnedViews: []) {
            ForEach(viewModel.messages, id: \.id) { message in
              ChatBubble(message: message)
                .id(message.id)
            }
          }
          .padding(DesignTokens.spacing16)
          .onChange(of: viewModel.messages.count) { _ in
            if let lastId = viewModel.messages.last?.id {
              withAnimation {
                proxy.scrollTo(lastId, anchor: .bottom)
              }
            }
          }
        }
      }

      // Input area
      VStack(spacing: DesignTokens.spacing12) {
        HStack(spacing: DesignTokens.spacing8) {
          TextField("Ask " + twin.name + "...", text: $viewModel.messageInput)
            .font(.system(size: 14))
            .foregroundColor(DesignTokens.textPrimary)
            .padding(DesignTokens.spacing12)
            .background(DesignTokens.surface2)
            .cornerRadius(DesignTokens.radiusSmall)

          Button(action: {
            viewModel.sendMessage(twinType: twin.type)
          }) {
            Image(systemName: "arrow.up.circle.fill")
              .font(.system(size: 24))
              .foregroundColor(viewModel.messageInput.isEmpty ? DesignTokens.textSecondary : DesignTokens.brandBlue)
          }
          .disabled(viewModel.messageInput.isEmpty || viewModel.isLoading)
        }

        if viewModel.isLoading {
          HStack(spacing: 4) {
            ForEach(0..<3, id: \.self) { _ in
              Circle()
                .fill(DesignTokens.brandBlue)
                .frame(width: 4, height: 4)
                .animation(.easeInOut(duration: 0.6).repeatForever(), value: viewModel.isLoading)
            }
          }
          .frame(maxWidth: .infinity, alignment: .leading)
          .padding(.horizontal, DesignTokens.spacing12)
        }
      }
      .padding(DesignTokens.spacing16)
      .background(DesignTokens.surface1)
    }
    .alert("Error", isPresented: $viewModel.showError, presenting: viewModel.error) { _ in
      Button("OK") { viewModel.showError = false }
    } message: { error in
      Text(error)
    }
  }
}

struct ChatBubble: View {
  let message: ChatMessage

  var body: some View {
    HStack(spacing: DesignTokens.spacing8) {
      if message.role == "twin" {
        VStack(alignment: .leading, spacing: 4) {
          Text(message.content)
            .font(.system(size: 14, weight: .regular))
            .foregroundColor(DesignTokens.textPrimary)
            .lineLimit(nil)

          Text(message.timestamp.formatted(time: .shortened, date: .omitted))
            .font(.system(size: 11, weight: .regular))
            .foregroundColor(DesignTokens.textSecondary)
        }
        .padding(DesignTokens.spacing12)
        .background(DesignTokens.surface2)
        .cornerRadius(DesignTokens.radiusSmall)

        Spacer()
      } else {
        Spacer()

        VStack(alignment: .trailing, spacing: 4) {
          Text(message.content)
            .font(.system(size: 14, weight: .regular))
            .foregroundColor(.white)
            .lineLimit(nil)

          Text(message.timestamp.formatted(time: .shortened, date: .omitted))
            .font(.system(size: 11, weight: .regular))
            .foregroundColor(DesignTokens.textSecondary)
        }
        .padding(DesignTokens.spacing12)
        .background(DesignTokens.brandBlue)
        .cornerRadius(DesignTokens.radiusSmall)
      }
    }
    .frame(maxWidth: .infinity, alignment: message.role == "user" ? .trailing : .leading)
  }
}

#Preview {
  TwinsCarouselView()
    .preferredColorScheme(.dark)
}
