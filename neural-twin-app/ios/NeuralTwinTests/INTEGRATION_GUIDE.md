# Integration Guide — Adding NeuralTwinTests to Your Project

## Step 1: Add Test Target to Xcode

### Option A: GUI (Recommended)
1. Open `NeuralTwin.xcodeproj` in Xcode
2. File → New → Target
3. Choose "Unit Testing Bundle" (iOS)
4. Product name: `NeuralTwinTests`
5. Select `NeuralTwin` as the target to test
6. Finish

### Option B: Command Line
```bash
cd /path/to/NeuralTwin.xcodeproj
xcodebuild -project NeuralTwin.xcodeproj -createXCTestTarget NeuralTwinTests
```

## Step 2: Copy Test Files

### Copy Directory Structure
```bash
cp -r NeuralTwinTests/* NeuralTwin.xcodeproj/NeuralTwinTests/
```

### Files to Add:
```
NeuralTwinTests/
├── Mocks/
│   ├── MockURLSession.swift
│   ├── MockTokenStore.swift
│   └── MockData.swift
├── Tests/
│   ├── APIClientTests.swift
│   ├── AuthViewTests.swift
│   ├── VoiceRecordingViewTests.swift
│   ├── DecisionLoggingViewTests.swift
│   ├── TwinChatViewTests.swift
│   └── CoherenceViewTests.swift
├── XCTestCase+Helpers.swift
├── README.md
├── TEST_SUMMARY.md
└── INTEGRATION_GUIDE.md (this file)
```

## Step 3: Update Test Target Settings

### Build Settings
1. Select `NeuralTwinTests` target
2. Build Settings tab
3. Search & update:

```
Bundle Identifier: com.example.neuraltwin.tests
iOS Deployment Target: 14.0 (or your min version)
Swift Language Version: 5.5+
```

### Build Phases
1. Link Binary With Libraries:
   - Add `NeuralTwin` (app target)
   - Add any dependencies

## Step 4: Import Configuration

### In Each Test File
Ensure imports are correct:

```swift
import XCTest
import SwiftUI
@testable import NeuralTwin
```

### Create Bridging Header (if needed)
If using Objective-C dependencies:

1. File → New → Header File
2. Name: `NeuralTwinTests-Bridging-Header.h`
3. Add to test target build settings:

```
Bridging Header = NeuralTwinTests/NeuralTwinTests-Bridging-Header.h
```

## Step 5: Fix Module Dependencies

### Expose Testable APIs
In your app target's `Info.plist` or Swift files, ensure these are `public`:

```swift
// AuthModels.swift
public struct AuthResponse: Codable { ... }
public struct LoginRequest: Codable { ... }
public struct RegisterRequest: Codable { ... }

// AppModels.swift
public struct VoiceRecordingResponse: Codable { ... }
public struct DecisionResponse: Codable { ... }
// ... all model types

// APIClient.swift
public class APIClient { ... }
public enum APIError: Error { ... }

// TokenStore.swift
public class TokenStore { ... }
```

### Check Access Levels
Ensure classes/structs needed by tests have public access:

```bash
grep -r "^class " NeuralTwin/*.swift | grep -v "public\|internal"
# Review each, make public if test-needed
```

## Step 6: Build & Run Tests

### Initial Build
```bash
xcodebuild build-for-testing \
  -scheme NeuralTwin \
  -derivedDataPath /tmp/NeuralTwin.build
```

### Run Tests
```bash
xcodebuild test \
  -scheme NeuralTwin \
  -destination 'platform=iOS Simulator,name=iPhone 15' \
  -enableCodeCoverage YES
```

### In Xcode
1. Product → Test (⌘U)
2. Tests Navigator (⌘5) shows test progress
3. Click test name to jump to source

## Step 7: Fix Import Errors

### "No module named 'NeuralTwin'"
**Solution**: Ensure `@testable import NeuralTwin` is used:

```swift
// ❌ Wrong
import NeuralTwin

// ✅ Correct
@testable import NeuralTwin
```

### "Cannot find 'APIError' in scope"
**Solution**: Make error enum public:

```swift
// In APIClient.swift
public enum APIError: Error, LocalizedError {
  case invalidURL
  // ...
}
```

### "Type 'AuthResponse' does not conform to protocol 'Codable'"
**Solution**: Verify model structures:

```swift
// In AuthModels.swift
public struct AuthResponse: Codable {
  public let user: AuthUser
  public let token: String
  
  // Add CodingKeys if property names differ from JSON
  enum CodingKeys: String, CodingKey {
    case user, token
  }
}
```

## Step 8: Configure Mock Objects

### Modify APIClient for Testing
Add optional session injection:

```swift
public class APIClient {
  private let session: URLSession
  
  // For testing
  init(session: URLSession? = nil) {
    if let session = session {
      self.session = session
    } else {
      let config = URLSessionConfiguration.default
      self.session = URLSession(configuration: config)
    }
  }
}
```

Then in tests:

```swift
let mockSession = MockURLSession()
let apiClient = APIClient(session: mockSession)
```

### Modify TokenStore for Testing
Add test mode:

```swift
public class TokenStore {
  private let defaults: UserDefaults
  
  // For testing
  init(userDefaults: UserDefaults = .standard) {
    self.defaults = userDefaults
  }
  
  // Or use separate test suite:
  public class func testInstance() -> TokenStore {
    TokenStore(userDefaults: UserDefaults(suiteName: "test.neuraltwin")!)
  }
}
```

Then in tests:

```swift
let mockTokenStore = TokenStore.testInstance()
```

## Step 9: Snapshot Testing (Optional)

### Install SnapshotTesting
```bash
# Add to Package.swift or Podfile
.package(url: "https://github.com/pointfreeco/swift-snapshot-testing.git", from: "1.15.0")
```

### Or CocoaPods
```bash
pod 'SnapshotTesting'
```

### Update XCTestCase+Helpers
Uncomment snapshot methods:

```swift
import SnapshotTesting

extension XCTestCase {
  func assertSnapshot<V: View>(
    of view: V,
    named name: String = "",
    file: StaticString = #filePath,
    line: UInt = #line
  ) {
    assertSnapshot(matching: view, as: .image, named: name, file: file, line: line)
  }
}
```

### Record Initial Snapshots
```bash
# Set isRecording = true in tests
xcodebuild test -scheme NeuralTwin -defaultTestExecutionTimeAllowance 120

# Commit __Snapshots__/ directory
git add "**/NeuralTwinTests/__Snapshots__"
git commit -m "test: initial snapshot recordings"

# Set isRecording = false
```

## Step 10: CI/CD Integration

### GitHub Actions
Create `.github/workflows/tests.yml`:

```yaml
name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: macos-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Select Xcode
        run: sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
      
      - name: Build
        run: |
          xcodebuild build-for-testing \
            -scheme NeuralTwin \
            -derivedDataPath /tmp/build
      
      - name: Test
        run: |
          xcodebuild test \
            -scheme NeuralTwin \
            -destination 'platform=iOS Simulator,name=iPhone 15' \
            -enableCodeCoverage YES
      
      - name: Upload Coverage
        uses: codecov/codecov-action@v3
        with:
          files: /tmp/build/Coverage.profdata
```

### GitLab CI
Create `.gitlab-ci.yml`:

```yaml
test:
  image: macos-latest
  script:
    - xcodebuild test -scheme NeuralTwin -enableCodeCoverage YES
  coverage: '/Coverage: \d+\.?\d*%/'
```

## Step 11: Troubleshooting Build Issues

### Duplicate Type Definitions
**Error**: "Type 'APIError' is ambiguous"
**Solution**: Ensure only one definition exists; check for duplicate imports

### Missing Public Declarations
**Error**: "Cannot find 'VoiceRecordingResponse' in scope"
**Solution**: Add `public` to type definition:

```swift
public struct VoiceRecordingResponse: Codable { ... }
```

### Test Target Not Found
**Error**: "No test target named 'NeuralTwinTests'"
**Solution**: Verify in Build Settings → Product → Name == "NeuralTwinTests"

### Compilation Errors
**Solution**: Clean build artifacts:

```bash
rm -rf ~/Library/Developer/Xcode/DerivedData/*NeuralTwin*
xcodebuild clean -scheme NeuralTwin
xcodebuild test -scheme NeuralTwin
```

## Step 12: Verify Integration

### Run Full Test Suite
```bash
xcodebuild test -scheme NeuralTwin -verbose
```

### Expected Output
```
Test Suite 'NeuralTwinTests' started at 2024-06-26 10:00:00
Test Suite 'APIClientTests' started...
  Test Case '-[NeuralTwinTests.APIClientTests testLoginSuccess]' started
  Test Case '-[NeuralTwinTests.APIClientTests testLoginSuccess]' passed
...
Test Suite 'NeuralTwinTests' finished at 2024-06-26 10:00:12
Total: 224 tests, 224 passed, 0 failed
```

### Code Coverage Report
```bash
# Generate coverage report
xcrun llvm-cov report \
  -instr-profile=/tmp/build/Coverage.profdata \
  /tmp/build/Products/Debug-iphonesimulator/NeuralTwin.app/NeuralTwin

# Expected: >80% coverage
```

## Step 13: Running Specific Tests

### Run Single Test Class
```bash
xcodebuild test \
  -scheme NeuralTwin \
  -only-testing NeuralTwinTests/AuthViewTests
```

### Run Single Test Method
```bash
xcodebuild test \
  -scheme NeuralTwin \
  -only-testing NeuralTwinTests/AuthViewTests/testLoginSuccess
```

### Run with Filtering
```bash
xcodebuild test \
  -scheme NeuralTwin \
  -only-testing NeuralTwinTests/AuthViewTests \
  -skip-testing NeuralTwinTests/AuthViewTests/testLoginWithEmptyPassword
```

## Step 14: Maintenance

### Keep Tests Updated
- When API contracts change → update MockData fixtures
- When view structures change → update snapshot tests
- When models change → update Codable conformances
- When adding features → add corresponding tests

### Review Patterns
- All tests follow Given-When-Then
- Mocks centralized in MockData.swift
- No test interdependencies
- Tests run in <15 seconds total

### Regular Checks
```bash
# Run monthly
xcodebuild test -scheme NeuralTwin -enableCodeCoverage YES
# Ensure coverage remains ≥80%
```

## Checklist

- [ ] Test target created in Xcode
- [ ] Test files copied to `/NeuralTwinTests/`
- [ ] All imports use `@testable import NeuralTwin`
- [ ] Public/internal access levels verified
- [ ] APIClient accepts optional URLSession
- [ ] TokenStore has test initializer
- [ ] MockURLSession compiles without errors
- [ ] MockTokenStore compiles without errors
- [ ] MockData fixtures are valid JSON
- [ ] XCTestCase+Helpers integrated
- [ ] Full test suite runs: `xcodebuild test -scheme NeuralTwin`
- [ ] Coverage ≥80%
- [ ] CI/CD workflows created
- [ ] Snapshots recorded (optional but recommended)
- [ ] Documentation reviewed

## Need Help?

1. Check `README.md` for detailed test documentation
2. Review `TEST_SUMMARY.md` for coverage overview
3. Examine mock object implementations
4. Run with verbose: `xcodebuild test -scheme NeuralTwin -verbose`
5. Check Xcode Test Navigator (⌘5) for detailed error messages

## Next Steps

1. ✅ Integrate test files
2. ✅ Configure test target
3. ✅ Run full test suite
4. ✅ Set up CI/CD
5. ✅ Record snapshots
6. ✅ Enforce test coverage in CI
7. ✅ Add tests for new features

Good luck! 🚀
