#if canImport(Combine)
import Combine
import Foundation

/// SwiftUI-facing observable wrapper around HumSessionStore.
@MainActor
public final class HumSessionViewModel: ObservableObject {
    @Published public private(set) var sessions: [HumSession] = []

    private let store: HumSessionStore

    public init(store: HumSessionStore = HumSessionStore(storageURL: HumSessionStore.defaultURL)) {
        self.store = store
        sessions = store.sessions
    }

    public func add(_ session: HumSession) {
        store.add(session)
        sessions = store.sessions
    }

    public func delete(_ session: HumSession) {
        store.delete(session)
        sessions = store.sessions
    }

    public func delete(at offsets: IndexSet) {
        store.delete(at: offsets)
        sessions = store.sessions
    }
}
#endif
