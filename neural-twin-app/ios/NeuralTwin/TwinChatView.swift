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
  @Published var isStreaming = false
  @Published var error: String?
  @Published var showError = false
  @Published var currentStreamingText = ""

  private let apiClient = APIClient.shared
  private let persistenceService = TwinChatPersistence.shared
  private var streamingTask: Task<Void, Never>?

  func sendMessage(twinType: String, useStreaming: Bool = true) {
    guard !messageInput.isEmpty else { return }

    let userMessage = messageInput
    messageInput = ""
    isLoading = true
    error = nil
    currentStreamingText = ""

    // Add user message to display
    let userMsg = ChatMessage(
      id: UUID().uuidString,
      role: "user",
      content: userMessage,
      timestamp: Date()
    )
    messages.append(userMsg)

    // Persist user message
    persistenceService.saveMessage(userMsg, twinType: twinType)

    Task {
      if useStreaming {
        await streamTwinResponse(twinType: twinType, userMessage: userMessage)
      } else {
        await fetchTwinResponse(twinType: twinType, userMessage: userMessage)
      }
    }
  }

  private func streamTwinResponse(twinType: String, userMessage: String) async {
    isStreaming = true
    var fullResponse = ""
    let responseId = UUID().uuidString

    do {
      let stream = try await apiClient.streamTwinResponse(twinType: twinType, userMessage: userMessage)

      for try await chunk in stream {
        currentStreamingText += chunk
        fullResponse += chunk

        // Update last message if it exists and is streaming, otherwise create new one
        if messages.last?.role == "twin" && messages.last?.id == responseId {
          messages[messages.count - 1].content = fullResponse
        }
      }

      // Finalize the streaming message
      let twinMsg = ChatMessage(
        id: responseId,
        role: "twin",
        content: fullResponse,
        timestamp: Date()
      )

      if messages.last?.id == responseId {
        messages[messages.count - 1] = twinMsg
      } else {
        messages.append(twinMsg)
      }

      // Persist twin response
      persistenceService.saveMessage(twinMsg, twinType: twinType)

    } catch {
      self.error = "Failed to stream Twin response: \(error.localizedDescription)"
      self.showError = true

      // Remove user message if sending failed
      if let lastIdx = messages.lastIndex(where: { $0.role == "user" }) {
        messages.remove(at: lastIdx)
      }
    }

    isLoading = false
    isStreaming = false
    currentStreamingText = ""
  }

  private func fetchTwinResponse(twinType: String, userMessage: String) async {
    do {
      let response = try await apiClient.chatWithTwin(
        twinType: twinType,
        userMessage: userMessage
      )

      // Add Twin response
      let twinMsg = ChatMessage(
        id: response.id,
        role: "twin",
        content: response.twinResponse,
        timestamp: response.timestamp
      )
      messages.append(twinMsg)

      // Persist twin response
      persistenceService.saveMessage(twinMsg, twinType: twinType)

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

  func loadTwinHistory(twinType: String) {
    isLoading = true
    error = nil

    Task {
      do {
        // Try to load from local persistence first
        let localMessages = persistenceService.loadMessages(twinType: twinType)
        if !localMessages.isEmpty {
          messages = localMessages
          isLoading = false
          return
        }

        // Fallback to remote API
        let response = try await apiClient.getTwinHistory(twinType: twinType)
        messages = response.interactions.flatMap { interaction in
          [
            ChatMessage(
              id: interaction.id + "-user",
              role: "user",
              content: interaction.userMessage,
              timestamp: interaction.createdAt
            ),
            ChatMessage(
              id: interaction.id,
              role: "twin",
              content: interaction.twinResponse,
              timestamp: interaction.createdAt
            )
          ]
        }

        // Cache locally
        messages.forEach { persistenceService.saveMessage($0, twinType: twinType) }

      } catch {
        self.error = "Failed to load history: \(error.localizedDescription)"
        self.showError = true
      }

      isLoading = false
    }
  }

  func refreshHistory(twinType: String) {
    // Pull-to-refresh: clear local cache and reload from server
    persistenceService.clearMessages(twinType: twinType)
    loadTwinHistory(twinType: twinType)
  }

  func cancelStreaming() {
    streamingTask?.cancel()
    isStreaming = false
    isLoading = false
  }
}

struct ChatMessage: Identifiable {
  let id: String
  let role: String // "user" or "twin"
  var content: String
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
  @State private var showRefreshIndicator = false

  var body: some View {
    VStack(spacing: 0) {
      // Header with twin info
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

        // Connection status indicator
        HStack(spacing: 4) {
          Circle()
            .fill(Color.green)
            .frame(width: 8, height: 8)
          Text("Online")
            .font(.system(size: 11, weight: .regular))
            .foregroundColor(DesignTokens.textSecondary)
        }
      }
      .padding(DesignTokens.spacing16)
      .background(DesignTokens.surface1)

      // Messages with pull-to-refresh
      ScrollViewReader { proxy in
        ScrollView {
          RefreshControl(isRefreshing: $showRefreshIndicator) {
            viewModel.refreshHistory(twinType: twin.type)
          }

          if viewModel.messages.isEmpty && !viewModel.isLoading {
            VStack(spacing: DesignTokens.spacing12) {
              Text(twin.emoji)
                .font(.system(size: 48))
              Text("Start a conversation")
                .font(.system(size: 16, weight: .semibold))
                .foregroundColor(.white)
              Text("Ask \(twin.name) a question to begin")
                .font(.system(size: 13, weight: .regular))
                .foregroundColor(DesignTokens.textSecondary)
                .multilineTextAlignment(.center)
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .center)
            .padding(DesignTokens.spacing24)
          } else {
            LazyVStack(spacing: DesignTokens.spacing12, pinnedViews: []) {
              ForEach(viewModel.messages, id: \.id) { message in
                ChatBubble(message: message)
                  .id(message.id)
              }
            }
            .padding(DesignTokens.spacing16)
          }

          // Scroll anchor
          Color.clear
            .frame(height: 1)
            .id("bottom")
            .onChange(of: viewModel.messages.count) { _ in
              withAnimation {
                proxy.scrollTo("bottom", anchor: .bottom)
              }
            }
        }
      }

      // Input area with message field & send button
      VStack(spacing: DesignTokens.spacing12) {
        HStack(spacing: DesignTokens.spacing8) {
          // Message input field
          TextField("Ask " + twin.name + "...", text: $viewModel.messageInput)
            .font(.system(size: 14))
            .foregroundColor(DesignTokens.textPrimary)
            .padding(DesignTokens.spacing12)
            .background(DesignTokens.surface2)
            .cornerRadius(DesignTokens.radiusSmall)

          // Send button
          Button(action: {
            viewModel.sendMessage(twinType: twin.type, useStreaming: true)
          }) {
            Image(systemName: "arrow.up.circle.fill")
              .font(.system(size: 24))
              .foregroundColor(viewModel.messageInput.isEmpty || viewModel.isLoading ? DesignTokens.textSecondary : DesignTokens.brandBlue)
          }
          .disabled(viewModel.messageInput.isEmpty || viewModel.isLoading)
        }

        // Loading indicator during streaming
        if viewModel.isLoading || viewModel.isStreaming {
          HStack(spacing: 4) {
            ForEach(0..<3, id: \.self) { index in
              Circle()
                .fill(DesignTokens.brandBlue)
                .frame(width: 4, height: 4)
                .animation(
                  .easeInOut(duration: 0.6)
                    .repeatForever()
                    .delay(Double(index) * 0.15),
                  value: viewModel.isLoading || viewModel.isStreaming
                )
            }
            Text(viewModel.isStreaming ? "Twin is thinking..." : "Sending...")
              .font(.system(size: 12, weight: .regular))
              .foregroundColor(DesignTokens.textSecondary)
            Spacer()
          }
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
            .textSelection(.enabled)

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
            .textSelection(.enabled)

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

// MARK: - Refresh Control (Pull-to-Refresh)
struct RefreshControl: View {
  @Binding var isRefreshing: Bool
  let action: () -> Void

  var body: some View {
    VStack {
      HStack {
        Spacer()
        if isRefreshing {
          ProgressView()
            .tint(DesignTokens.brandBlue)
        }
        Spacer()
      }
      .padding(DesignTokens.spacing12)
      .frame(height: 50)
    }
    .onAppear {
      // Triggered when pulled to top
      if isRefreshing {
        action()
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
          isRefreshing = false
        }
      }
    }
  }
}

#Preview {
  TwinsCarouselView()
    .preferredColorScheme(.dark)
}
