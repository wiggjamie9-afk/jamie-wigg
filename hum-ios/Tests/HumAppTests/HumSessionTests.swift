import XCTest
@testable import HumApp

final class HumSessionTests: XCTestCase {

    // MARK: - Defaults

    func testDefaultIDIsSet() {
        let s = HumSession.stub()
        XCTAssertNotEqual(s.id, UUID(uuidString: "00000000-0000-0000-0000-000000000000")!)
    }

    func testDefaultTimestampIsNow() {
        let before = Date()
        let s = HumSession.stub()
        let after = Date()
        XCTAssertGreaterThanOrEqual(s.timestamp, before)
        XCTAssertLessThanOrEqual(s.timestamp, after)
    }

    // MARK: - Derived: moodDelta

    func testMoodDeltaPositive() {
        let s = HumSession.stub(moodBefore: 2, moodAfter: 5)
        XCTAssertEqual(s.moodDelta, 3)
    }

    func testMoodDeltaNegative() {
        let s = HumSession.stub(moodBefore: 4, moodAfter: 2)
        XCTAssertEqual(s.moodDelta, -2)
    }

    func testMoodDeltaZero() {
        let s = HumSession.stub(moodBefore: 3, moodAfter: 3)
        XCTAssertEqual(s.moodDelta, 0)
    }

    // MARK: - Derived: focusDelta

    func testFocusDeltaPositive() {
        let s = HumSession.stub(focusBefore: 1, focusAfter: 4)
        XCTAssertEqual(s.focusDelta, 3)
    }

    func testFocusDeltaNegative() {
        let s = HumSession.stub(focusBefore: 5, focusAfter: 2)
        XCTAssertEqual(s.focusDelta, -3)
    }

    // MARK: - Derived: formattedDuration

    func testFormattedDurationMinutesAndPaddedSeconds() {
        XCTAssertEqual(HumSession.stub(durationSeconds: 185).formattedDuration, "3:05")
    }

    func testFormattedDurationExactMinutes() {
        XCTAssertEqual(HumSession.stub(durationSeconds: 300).formattedDuration, "5:00")
    }

    func testFormattedDurationZero() {
        XCTAssertEqual(HumSession.stub(durationSeconds: 0).formattedDuration, "0:00")
    }

    // MARK: - Codable

    func testCodableRoundtrip() throws {
        let original = HumSession.stub(goals: ["anxiety", "ADHD", "depression"])
        let data = try JSONEncoder().encode(original)
        let decoded = try JSONDecoder().decode(HumSession.self, from: data)
        XCTAssertEqual(original, decoded)
    }

    func testGoalsArrayPreservedInCodable() throws {
        let goals = ["anxiety", "ADHD", "depression"]
        let data = try JSONEncoder().encode(HumSession.stub(goals: goals))
        let decoded = try JSONDecoder().decode(HumSession.self, from: data)
        XCTAssertEqual(decoded.goals, goals)
    }
}
