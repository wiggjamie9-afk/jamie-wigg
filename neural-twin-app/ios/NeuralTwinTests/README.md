# NeuralTwin iOS Test Suite

Comprehensive XCTest snapshot and integration tests for the NeuralTwin iOS app.

## Test Structure

```
NeuralTwinTests/
├── Mocks/
│   ├── MockURLSession.swift      # Network request mocking
│   ├── MockTokenStore.swift      # Authentication token simulation
│   └── MockData.swift            # Test fixtures and JSON responses
├── Tests/
│   ├── APIClientTests.swift      # Network layer integration tests
│   ├── AuthViewTests.swift       # Authentication UI & flows
│   ├── VoiceRecordingViewTests.swift  # Audio capture & emotion analysis
│   ├── DecisionLoggingViewTests.swift # Form submission & validation
│   ├── TwinChatViewTests.swift   # Chat messaging & streaming
│   └── CoherenceViewTests.swift  # 8-layer coherence display
├── XCTestCase+Helpers.swift      # Test utilities & assertions
└── README.md                     # This file
```

## Coverage Overview

### 1. AuthView (36 test methods)
- **Login Flow**: Credentials validation, error handling, token persistence
- **Signup Flow**: Form validation, duplicate email detection, success transitions
- **Error Recovery**: Network errors, retry logic, error dismissal
- **Toggle States**: Switching between login/signup modes
- **Accessibility**: Form labels, error announcements

### 2. VoiceRecordingView (40 test methods)
- **Recording State**: Start/stop, timer display, maximum duration
- **Audio Upload**: Success/failure, progress display, validation
- **Emotion Display**: Primary emotion, confidence scores, multiple emotions
- **Context Input**: Decision title, planning clarity, context selection
- **Previous Recordings**: List display, playback, deletion
- **Error Handling**: Permission denied, corrupted files, network retry

### 3. DecisionLoggingView (37 test methods)
- **Form Validation**: Required fields, character limits, category selection
- **Input Fields**: Title, description, category, chosen option, reasoning
- **Coherence Sliders**: Planning clarity (1-10), monitoring comprehension, effectiveness
- **Form Submission**: Validation, success states, error handling
- **Auto-save**: Draft saving/restoration, form persistence
- **Accessibility**: Label associations, keyboard navigation

### 4. TwinChatView (38 test methods)
- **Message Display**: User/twin messages, timestamps, formatting
- **Chat Input**: Validation, multiline support, character limits
- **Message Sending**: Clearing after send, disabled state during loading
- **Streaming Responses**: Progressive updates, chunk handling, error recovery
- **Chat History**: Chronological sorting, pagination, loading more
- **Twin Types**: Selector, context preservation across switches
- **Contextual Awareness**: Integration with decisions and voice data

### 5. CoherenceView (42 test methods)
- **8-Layer Display**:
  - Emotional Coherence (mood stability, emotional awareness)
  - Cognitive Coherence (clarity, focus)
  - Decision Coherence (consistency, alignment)
  - Narrative Coherence (story consistency, identity)
  - Social Coherence (relationship alignment, social harmony)
  - Value Coherence (value alignment, integrity)
  - Temporal Coherence (past connection, future vision)
  - Existential Coherence (purpose, meaning)
- **Overall Score**: Calculation, visualization, percentage formatting
- **History Chart**: Trend analysis, timeframe selection, interactivity
- **Insights**: Actionable recommendations, categorized findings

### 6. APIClient (31 test methods)
- **Authentication**: Login/signup success/failure, token persistence
- **Voice Endpoints**: Upload, list, detail retrieval
- **Decision Endpoints**: Logging, listing, pattern analysis
- **Twin Endpoints**: Chat, history, streaming responses
- **Coherence Endpoints**: Current state, historical trends
- **Error Handling**: HTTP status codes, decoding errors, network failures

## Test Fixtures

All mock data is centralized in `MockData.swift` for consistency:

```swift
// JSON response fixtures
MockData.validAuthResponse
MockData.voiceRecordingResponse
MockData.decisionResponse
MockData.twinInteractionResponse
MockData.coherenceResponse

// Helper methods for dynamic data
MockData.createAuthResponse(userId:email:name:token:)
MockData.createVoiceRecordingResponse(id:primaryEmotion:confidence:)
MockData.jsonData(_:)  // String → Data conversion
```

## Mock Objects

### MockURLSession
Intercepts `URLSession.data(for:)` calls for testing without network:

```swift
let mockSession = MockURLSession()
mockSession.setMockResponse(data: MockData.jsonData(MockData.validAuthResponse), statusCode: 200)
mockSession.setMockError(URLError(.networkConnectionLost))
```

### MockTokenStore
In-memory token storage for auth testing:

```swift
let mockStore = MockTokenStore()
mockStore.saveSession(token: "token", userId: "user-123", email: "test@example.com", name: "Test")
XCTAssertTrue(mockStore.isLoggedIn)
mockStore.clear()
XCTAssertFalse(mockStore.isLoggedIn)
```

## Running Tests

### Run All Tests
```bash
xcodebuild test -scheme NeuralTwin
```

### Run Specific Test Class
```bash
xcodebuild test -scheme NeuralTwin -only-testing NeuralTwinTests/AuthViewTests
```

### Run Individual Test
```bash
xcodebuild test -scheme NeuralTwin -only-testing NeuralTwinTests/AuthViewTests/testLoginSuccess
```

### Run with Coverage
```bash
xcodebuild test -scheme NeuralTwin -enableCodeCoverage YES
```

### Run Tests from Xcode
1. Product → Test (⌘U)
2. Click specific test method to run individually
3. View results in Test Navigator (⌘5)

## Snapshot Testing

Tests include placeholders for snapshot testing with the `SnapshotTesting` library:

```swift
func testSnapshotAuthLoginInitial() {
  assertSnapshot(of: AuthView(isSignup: false), named: "auth_login_initial")
}
```

### Setting Up Snapshots

Install `SnapshotTesting`:
```bash
swift package add https://github.com/pointfreeco/swift-snapshot-testing.git
```

Record initial snapshots:
```bash
xcodebuild test -scheme NeuralTwin -defaultTestExecutionTimeAllowance 120 -enableCodeCoverage NO
```

Update snapshots after intentional UI changes:
```bash
# Uncomment in test target
// isRecording = true
xcodebuild test -scheme NeuralTwin
// Then restore isRecording = false
```

Snapshots are stored in `__Snapshots__/` directories alongside test files.

## Test Categories

### Unit Tests
- Form validation logic
- Error enum handling
- Data transformation
- TokenStore operations

### Integration Tests
- APIClient request/response cycles
- Authentication flow (login → token persistence)
- Voice recording upload → emotion display
- Decision logging → response display
- Twin chat message → response streaming
- Coherence fetch → 8-layer visualization

### Snapshot Tests
- Initial states (all views)
- Loading states
- Success states
- Error states
- Edge cases (long text, many items)

## Assertion Helpers

Custom test helpers in `XCTestCase+Helpers.swift`:

```swift
// View snapshot assertion
assertSnapshot(of: view, named: "test_name")

// Error type checking
assertError(error, isType: APIError.self)

// Value equality
assertEqual(actual, expected, "Custom message")

// Wait for async conditions
waitFor({ isReady }, timeout: 5.0, message: "Not ready")

// JSON validation
assertValidJSON(jsonString)
```

## Example Test Pattern

```swift
func testLoginSuccess() async throws {
  // GIVEN: Valid credentials
  let email = "test@example.com"
  let password = "password123"

  // WHEN: Attempting login
  mockSession.setMockResponse(
    data: MockData.jsonData(MockData.validAuthResponse),
    statusCode: 200
  )

  // THEN: Token is persisted and user is logged in
  XCTAssertTrue(mockTokenStore.isLoggedIn)
  XCTAssertNotNil(mockTokenStore.token)
  
  // SNAPSHOT: Login success state
  // assertSnapshot(of: AuthView(state: .loggedIn), named: "auth_login_success")
}
```

## Common Failure Scenarios Tested

### Authentication
- ✅ Empty email/password
- ✅ Invalid email format
- ✅ Password too short
- ✅ Duplicate email on signup
- ✅ Invalid credentials on login
- ✅ Network error during auth
- ✅ Server error responses

### Voice Recording
- ✅ Microphone permission denied
- ✅ Audio file too short
- ✅ Corrupted audio
- ✅ Upload network error
- ✅ Emotion analysis confidence scores
- ✅ Multiple emotion detection

### Decision Logging
- ✅ Missing required fields
- ✅ Text exceeding limits
- ✅ Slider value boundaries
- ✅ Form validation failures
- ✅ Auto-save draft restoration
- ✅ Duplicate submissions

### Twin Chat
- ✅ Empty message validation
- ✅ Message sending while loading
- ✅ Streaming response chunking
- ✅ Chat history pagination
- ✅ Twin type switching
- ✅ Network errors during chat

### Coherence
- ✅ All 8 layers display
- ✅ Score ranges (0.0-1.0)
- ✅ Historical trend analysis
- ✅ Timeframe selection
- ✅ Component breakdown
- ✅ Change indicators (up/down/stable)

## Mocking Strategies

### Network Mocking
```swift
// Success response
mockSession.setMockResponse(
  data: MockData.jsonData(MockData.validAuthResponse),
  statusCode: 200
)

// Error response
mockSession.setMockError(URLError(.networkConnectionLost))

// Capture request
let request = mockSession.lastRequest
XCTAssertEqual(request?.httpMethod, "POST")
```

### Token Mocking
```swift
// Set authenticated state
mockTokenStore.saveSession(
  token: "test-token",
  userId: "user-123",
  email: "test@example.com",
  name: "Test User"
)

// Verify unauthenticated state
mockTokenStore.clear()
XCTAssertFalse(mockTokenStore.isLoggedIn)
```

### State Mocking
```swift
// Simulate loading state
var isLoading = true
XCTAssertTrue(isLoading)

// Simulate error state
var error: Error? = APIError.serverError(code: 500, message: "Error")
XCTAssertNotNil(error)

// Simulate recovered state
error = nil
XCTAssertNil(error)
```

## CI/CD Integration

### GitHub Actions Workflow
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3
      - run: xcodebuild test -scheme NeuralTwin -enableCodeCoverage YES
      - uses: codecov/codecov-action@v3
```

### Test Requirements
- ✅ All tests pass
- ✅ Code coverage ≥ 80%
- ✅ No deprecated API usage
- ✅ Snapshot diffs reviewed

## Best Practices

1. **Test One Concern**: Each test method tests one behavior
2. **Use Given-When-Then**: Organize test in setup-action-assertion
3. **Mock External Dependencies**: Never hit real APIs in tests
4. **Name Descriptively**: Test names clearly state what's being tested
5. **Avoid Test Interdependence**: Tests should run in any order
6. **Use Fixtures Consistently**: Centralize mock data in MockData.swift
7. **Keep Tests Fast**: Avoid long waits or sleep statements
8. **Test Error Paths**: Include negative test cases
9. **Document Complex Tests**: Add comments for non-obvious logic
10. **Update Snapshots Deliberately**: Review snapshot changes carefully

## Troubleshooting

### Tests Timeout
- Increase `XCTestCase` timeout in scheme settings
- Reduce number of async operations
- Mock network calls more aggressively

### Snapshot Diffs on CI
- Record snapshots locally: `xcodebuild test -scheme NeuralTwin`
- Commit `__Snapshots__` directories
- Review diffs before updating

### Flaky Tests
- Reduce reliance on timing (avoid sleep/delay)
- Increase timeout for async operations
- Mock time-dependent code

### Mock Data Issues
- Verify JSON structure matches API contract
- Check date formats (ISO 8601)
- Test with both success and error responses

## Adding New Tests

1. Create test class in `Tests/`
2. Import `XCTest` and `@testable import NeuralTwin`
3. Set up mocks in `setUp()`, tear down in `tearDown()`
4. Follow Given-When-Then pattern
5. Use MockData fixtures for consistency
6. Add snapshot placeholders for UI tests
7. Document complex test scenarios

Example template:
```swift
import XCTest
@testable import NeuralTwin

class MyFeatureViewTests: XCTestCase {
  var mockTokenStore: MockTokenStore!

  override func setUp() {
    super.setUp()
    mockTokenStore = MockTokenStore()
  }

  override func tearDown() {
    mockTokenStore = nil
    super.tearDown()
  }

  func testMyFeature() {
    // GIVEN
    let expected = "value"
    
    // WHEN
    let actual = "value"
    
    // THEN
    XCTAssertEqual(actual, expected)
  }
}
```

## Resources

- [XCTest Documentation](https://developer.apple.com/documentation/xctest)
- [SnapshotTesting GitHub](https://github.com/pointfreeco/swift-snapshot-testing)
- [Apple Testing Guide](https://developer.apple.com/documentation/xctest)
- [Swift Testing Best Practices](https://developer.apple.com/wwdc23/10149)
