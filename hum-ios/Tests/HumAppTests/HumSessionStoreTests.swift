import XCTest
@testable import HumApp

final class HumSessionStoreTests: XCTestCase {
    private var tempURL: URL!
    private var store: HumSessionStore!

    override func setUp() {
        super.setUp()
        tempURL = FileManager.default.temporaryDirectory
            .appendingPathComponent(UUID().uuidString + ".json")
        store = HumSessionStore(storageURL: tempURL)
    }

    override func tearDown() {
        try? FileManager.default.removeItem(at: tempURL)
        super.tearDown()
    }

    // MARK: - Add

    func testAddIncreasesCount() {
        store.add(.stub())
        XCTAssertEqual(store.sessions.count, 1)
    }

    func testAddedSessionIsRetrievable() {
        let session = HumSession.stub()
        store.add(session)
        XCTAssertEqual(store.sessions.first?.id, session.id)
    }

    // MARK: - Delete

    func testDeleteBySession() {
        let s1 = HumSession.stub()
        let s2 = HumSession.stub()
        store.add(s1)
        store.add(s2)
        store.delete(s1)
        XCTAssertEqual(store.sessions.count, 1)
        XCTAssertEqual(store.sessions.first?.id, s2.id)
    }

    func testDeleteAtOffsets() {
        store.add(.stub())
        store.add(.stub())
        store.delete(at: IndexSet(integer: 0))
        XCTAssertEqual(store.sessions.count, 1)
    }

    // MARK: - Persistence

    func testSessionsSurviveStoreReinit() {
        let session = HumSession.stub(goals: ["focus"])
        store.add(session)

        let reloaded = HumSessionStore(storageURL: tempURL)
        XCTAssertEqual(reloaded.sessions.count, 1)
        XCTAssertEqual(reloaded.sessions.first?.id, session.id)
        XCTAssertEqual(reloaded.sessions.first?.goals, ["focus"])
    }
}
