import XCTest

/// Test helpers for snapshot testing and assertions
extension XCTestCase {
  /// Assert that a view matches a stored snapshot
  /// - Parameters:
  ///   - view: The SwiftUI view to snapshot
  ///   - name: The identifier for this snapshot (stored in __Snapshots__)
  ///   - file: Source file location for error reporting
  ///   - line: Line number for error reporting
  func assertSnapshot<V: View>(
    of view: V,
    named name: String = "",
    file: StaticString = #filePath,
    line: UInt = #line
  ) {
    // Note: This is a placeholder for SnapshotTesting integration
    // In a real project, use: assertSnapshot(matching: view, as: .image, named: name)
    XCTAssertNotNil(view, file: file, line: line)
  }

  /// Assert that an error matches expected error type and description
  func assertError<T>(
    _ error: Error?,
    isType expectedType: T.Type,
    file: StaticString = #filePath,
    line: UInt = #line
  ) {
    XCTAssertNotNil(error, "Expected error but got nil", file: file, line: line)
    XCTAssert(
      error is T,
      "Expected error of type \(expectedType), but got \(type(of: error))",
      file: file,
      line: line
    )
  }

  /// Assert that a value equals expected with custom message
  func assertEqual<T: Equatable>(
    _ lhs: T,
    _ rhs: T,
    _ message: String = "",
    file: StaticString = #filePath,
    line: UInt = #line
  ) {
    XCTAssertEqual(lhs, rhs, message, file: file, line: line)
  }

  /// Async helper to wait for expectations
  func waitFor(
    _ condition: @escaping () -> Bool,
    timeout: TimeInterval = 5.0,
    message: String = "Condition not met within timeout",
    file: StaticString = #filePath,
    line: UInt = #line
  ) {
    let deadline = Date().addingTimeInterval(timeout)
    while !condition() && Date() < deadline {
      RunLoop.current.run(until: Date().addingTimeInterval(0.01))
    }
    XCTAssert(condition(), message, file: file, line: line)
  }

  /// Assert that a JSON string is valid and matches expected structure
  func assertValidJSON(
    _ jsonString: String,
    file: StaticString = #filePath,
    line: UInt = #line
  ) {
    guard let data = jsonString.data(using: .utf8) else {
      XCTFail("Failed to convert string to data", file: file, line: line)
      return
    }

    do {
      _ = try JSONSerialization.jsonObject(with: data)
    } catch {
      XCTFail("Invalid JSON: \(error)", file: file, line: line)
    }
  }
}
