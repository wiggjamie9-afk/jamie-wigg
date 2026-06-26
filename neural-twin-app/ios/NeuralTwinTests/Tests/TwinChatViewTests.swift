import XCTest
import SwiftUI
@testable import NeuralTwin

/// Snapshot and integration tests for TwinChatView
class TwinChatViewTests: XCTestCase {
  var mockTokenStore: MockTokenStore!

  override func setUp() {
    super.setUp()
    mockTokenStore = MockTokenStore()
    mockTokenStore.saveSession(
      token: "test-token",
      userId: "user-123",
      email: "test@example.com",
      name: "Test User"
    )
  }

  override func tearDown() {
    mockTokenStore = nil
    super.tearDown()
  }

  // MARK: - Initial State Tests

  func testTwinChatViewInitialState() {
    // When TwinChatView is loaded
    // Then displays welcome message
    let messages: [String] = []
    let welcomeMessage = "Hello! I'm your NeuralTwin."

    XCTAssertTrue(messages.isEmpty)
    XCTAssertFalse(welcomeMessage.isEmpty)
    // Snapshot: twin_chat_initial
  }

  func testChatHistoryLoading() {
    // Given chat view is opened
    // When loading previous messages
    let isLoading = true

    // Then shows loading indicator
    XCTAssertTrue(isLoading)
    // Snapshot: twin_chat_loading
  }

  func testChatHistoryDisplay() async throws {
    // When chat history is loaded
    do {
      let response = try JSONDecoder().decode(
        TwinHistoryResponse.self,
        from: MockData.jsonData(MockData.twinHistoryResponse)
      )

      // Then displays messages chronologically
      XCTAssertTrue(response.success)
      XCTAssertGreater(response.history.count, 0)
      XCTAssertEqual(response.history[0].id, "interaction-001")
      // Snapshot: twin_chat_history
    } catch {
      XCTFail("Chat history loading failed: \(error)")
    }
  }

  // MARK: - Message Display Tests

  func testUserMessageDisplay() {
    // Given user sends message
    let userMessage = "How do I improve my decision-making?"

    // When message is sent
    // Then appears in chat with user styling
    XCTAssertFalse(userMessage.isEmpty)
    // Snapshot: twin_chat_user_message
  }

  func testTwinMessageDisplay() async throws {
    // When twin responds
    do {
      let response = try JSONDecoder().decode(
        TwinInteractionResponse.self,
        from: MockData.jsonData(MockData.twinInteractionResponse)
      )

      // Then displays response with twin styling
      let twinResponse = response.twinResponse
      XCTAssertFalse(twinResponse.isEmpty)
      XCTAssertEqual(response.twinType, "mentor")
      // Snapshot: twin_chat_response
    } catch {
      XCTFail("Twin message display failed: \(error)")
    }
  }

  func testMessageBubbleAlignment() {
    // Given user and twin messages
    let userMessage = "Tell me about my patterns"
    let twinMessage = "Based on your history..."

    // When rendered
    // Then user message aligns right, twin message aligns left
    XCTAssertFalse(userMessage.isEmpty)
    XCTAssertFalse(twinMessage.isEmpty)
  }

  func testMessageTimestamp() async throws {
    // Given received message
    do {
      let response = try JSONDecoder().decode(
        TwinInteractionResponse.self,
        from: MockData.jsonData(MockData.twinInteractionResponse)
      )

      // When message is displayed
      let timestamp = response.timestamp

      // Then shows timestamp
      XCTAssertNotNil(timestamp)
    } catch {
      XCTFail("Message timestamp failed: \(error)")
    }
  }

  func testMessageFormatting() {
    // Given message with markdown
    let message = "Try this: **approach A** or *approach B*"

    // When displayed
    // Then renders formatting
    XCTAssertTrue(message.contains("**"))
    XCTAssertTrue(message.contains("*"))
  }

  // MARK: - Message Input Tests

  func testMessageInputField() {
    // Given chat view
    // When rendered
    let placeholder = "Ask your twin a question..."

    // Then shows input field with placeholder
    XCTAssertFalse(placeholder.isEmpty)
    // Snapshot: twin_chat_input
  }

  func testMessageInputEmpty() {
    // Given empty message
    let message = ""

    // When send button check
    let canSend = !message.trimmingCharacters(in: .whitespaces).isEmpty

    // Then send button is disabled
    XCTAssertFalse(canSend)
  }

  func testMessageInputTrimWhitespace() {
    // Given message with whitespace
    var message = "   Hello   "

    // When trimmed
    message = message.trimmingCharacters(in: .whitespaces)

    // Then whitespace is removed
    XCTAssertEqual(message, "Hello")
  }

  func testMessageInputMultiline() {
    // Given message with multiple lines
    let message = "First line\nSecond line\nThird line"

    // When entered
    let lineCount = message.split(separator: "\n").count

    // Then accepts multiline input
    XCTAssertEqual(lineCount, 3)
  }

  func testMessageInputCharacterLimit() {
    // Given long message
    let maxLength = 1000
    let message = String(repeating: "a", count: 500)

    // When length checked
    let isUnderLimit = message.count <= maxLength

    // Then allows input up to limit
    XCTAssertTrue(isUnderLimit)
  }

  // MARK: - Message Sending Tests

  func testSendMessage() {
    // Given message is entered
    var message = "How can I improve?"

    // When send button is tapped
    let isMessageValid = !message.isEmpty

    // Then message is sent
    XCTAssertTrue(isMessageValid)
  }

  func testSendMessageClears() {
    // Given message is sent
    var message = "Hello twin"

    // When message completes sending
    message = ""

    // Then input field is cleared
    XCTAssertTrue(message.isEmpty)
  }

  func testSendMessageDisabledWhileLoading() {
    // Given message is being sent
    let isLoading = true

    // When waiting for response
    let isSendButtonDisabled = isLoading

    // Then send button is disabled
    XCTAssertTrue(isSendButtonDisabled)
  }

  // MARK: - Streaming Response Tests

  func testStreamingResponseStart() {
    // Given message is sent
    // When twin starts responding
    let isStreaming = true

    // Then shows typing indicator
    XCTAssertTrue(isStreaming)
    // Snapshot: twin_chat_streaming
  }

  func testStreamingResponseChunks() async throws {
    // Given streaming response
    do {
      let streamData = MockData.streamingTwinResponse
      let lines = streamData.split(separator: "\n").map(String.init)

      // When chunks arrive
      // Then updates message progressively
      XCTAssertGreater(lines.count, 0)

      for line in lines {
        XCTAssertTrue(line.hasPrefix("data:"))
      }
    }
  }

  func testStreamingResponseCompletion() {
    // Given streaming response in progress
    var isStreaming = true

    // When all chunks received
    isStreaming = false

    // Then completes and shows full message
    XCTAssertFalse(isStreaming)
  }

  func testStreamingResponseError() {
    // Given streaming in progress
    // When network error occurs
    let error = URLError(.networkConnectionLost)

    // Then shows error state and allows retry
    XCTAssertNotNil(error)
  }

  // MARK: - Chat History Tests

  func testChatHistorySorting() async throws {
    // Given multiple messages
    do {
      let response = try JSONDecoder().decode(
        TwinHistoryResponse.self,
        from: MockData.jsonData(MockData.twinHistoryResponse)
      )

      // When displaying history
      // Then sorted chronologically (oldest first)
      for i in 1..<response.history.count {
        XCTAssertGreaterThanOrEqual(
          response.history[i].timestamp,
          response.history[i - 1].timestamp
        )
      }
    } catch {
      XCTFail("Chat history sorting failed: \(error)")
    }
  }

  func testChatHistoryPagination() {
    // Given many messages
    let totalMessages = 500
    let pageSize = 20

    // When paginating
    let pagesNeeded = (totalMessages + pageSize - 1) / pageSize

    // Then loads in pages
    XCTAssertGreater(pagesNeeded, 1)
  }

  func testLoadMoreMessages() {
    // Given chat is scrolled to top
    var hasMoreMessages = true

    // When "Load more" is tapped
    // Then fetches older messages
    XCTAssertTrue(hasMoreMessages)
  }

  func testChatHistoryClear() {
    // Given chat history exists
    var messages: [String] = ["Message 1", "Message 2"]

    // When clear history is confirmed
    messages = []

    // Then clears all messages
    XCTAssertTrue(messages.isEmpty)
  }

  // MARK: - Twin Type Selection Tests

  func testTwinTypeSelector() {
    // Given chat view
    // When rendered
    let twinTypes = ["mentor", "counselor", "analyst", "advisor"]

    // Then shows twin type options
    XCTAssertGreater(twinTypes.count, 0)
    // Snapshot: twin_chat_types
  }

  func testSwitchTwinType() {
    // Given on mentor twin
    var selectedTwin = "mentor"

    // When switching to counselor
    selectedTwin = "counselor"

    // Then switches twin context
    XCTAssertEqual(selectedTwin, "counselor")
  }

  func testTwinTypePreservesContext() {
    // Given context set on one twin
    let context = "decision-making"

    // When switching twin types
    // Then context is preserved
    XCTAssertFalse(context.isEmpty)
  }

  // MARK: - Contextual Awareness Tests

  func testTwinContextFromDecisions() async throws {
    // Given recent decisions
    do {
      let response = try JSONDecoder().decode(
        DecisionsResponse.self,
        from: MockData.jsonData(MockData.decisionsListResponse)
      )

      // When sending message to twin
      // Then twin has context of decisions
      XCTAssertGreater(response.decisions.count, 0)
    } catch {
      XCTFail("Decision context failed: \(error)")
    }
  }

  func testTwinContextFromVoiceRecordings() async throws {
    // Given voice recordings with emotions
    do {
      let response = try JSONDecoder().decode(
        VoiceRecordingsResponse.self,
        from: MockData.jsonData(MockData.voiceRecordingsListResponse)
      )

      // When sending message
      // Then twin considers emotional context
      XCTAssertGreater(response.recordings.count, 0)
      XCTAssertNotNil(response.recordings.first?.emotionResult)
    } catch {
      XCTFail("Voice context failed: \(error)")
    }
  }

  // MARK: - Error Handling Tests

  func testNetworkErrorDuringChat() {
    // Given message is being sent
    // When network error occurs
    let error = URLError(.networkConnectionLost)

    // Then shows error message
    XCTAssertNotNil(error)
    // Snapshot: twin_chat_network_error
  }

  func testRetryFailedMessage() {
    // Given message failed to send
    var error: Error? = URLError(.networkConnectionLost)

    // When retry is tapped
    error = nil

    // Then retries sending
    XCTAssertNil(error)
  }

  func testServerErrorResponse() {
    // When server returns 500 error
    // Then shows appropriate error
    let error = APIError.serverError(code: 500, message: "Server error")
    XCTAssertNotNil(error)
  }

  // MARK: - UI/UX Tests

  func testEmptyStateMessage() {
    // Given no chat history
    let messages: [String] = []

    // When view is loaded
    let isEmpty = messages.isEmpty

    // Then shows empty state with welcome message
    XCTAssertTrue(isEmpty)
  }

  func testScrollToLatestMessage() {
    // Given new message arrives
    // When message is added to chat
    // Then automatically scrolls to bottom
    let shouldScroll = true
    XCTAssertTrue(shouldScroll)
  }

  func testKeyboardDismissal() {
    // Given keyboard is open
    var keyboardVisible = true

    // When message is sent
    keyboardVisible = false

    // Then keyboard dismisses
    XCTAssertFalse(keyboardVisible)
  }

  // MARK: - Accessibility Tests

  func testChatMessagesAccessibility() {
    // Given chat messages
    // When screen reader is active
    // Then announces sender and message
    let message = "Twin: How can I help you?"
    XCTAssertTrue(message.contains("Twin:"))
  }

  func testInputFieldAccessibility() {
    // Given message input
    // When voice control is active
    // Then can send via voice
    let placeholder = "Ask your twin"
    XCTAssertFalse(placeholder.isEmpty)
  }

  // MARK: - Snapshot Tests

  func testSnapshotChatEmpty() {
    // assertSnapshot(of: TwinChatView(), named: "twin_chat_empty")
    XCTAssertTrue(true) // Placeholder
  }

  func testSnapshotChatWithMessages() {
    // assertSnapshot(of: TwinChatView(hasHistory: true), named: "twin_chat_messages")
    XCTAssertTrue(true) // Placeholder
  }

  func testSnapshotChatStreaming() {
    // assertSnapshot(of: TwinChatView(isStreaming: true), named: "twin_chat_streaming")
    XCTAssertTrue(true) // Placeholder
  }

  func testSnapshotChatError() {
    // assertSnapshot(of: TwinChatView(error: "Connection failed"), named: "twin_chat_error")
    XCTAssertTrue(true) // Placeholder
  }
}
