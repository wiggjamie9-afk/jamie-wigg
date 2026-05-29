import Foundation

/// Persists HumSession records as a JSON file.
/// Foundation-only; wrap in HumSessionViewModel for SwiftUI observation.
public final class HumSessionStore {
    public private(set) var sessions: [HumSession]
    private let storageURL: URL

    public init(storageURL: URL) {
        self.storageURL = storageURL
        sessions = Self.load(from: storageURL)
    }

    // MARK: - Mutations

    public func add(_ session: HumSession) {
        sessions.append(session)
        persist()
    }

    public func delete(_ session: HumSession) {
        sessions.removeAll { $0.id == session.id }
        persist()
    }

    public func delete(at offsets: IndexSet) {
        sessions.remove(atOffsets: offsets)
        persist()
    }

    // MARK: - Persistence

    private func persist() {
        guard let data = try? JSONEncoder().encode(sessions) else { return }
        try? data.write(to: storageURL, options: .atomic)
    }

    private static func load(from url: URL) -> [HumSession] {
        guard let data = try? Data(contentsOf: url) else { return [] }
        return (try? JSONDecoder().decode([HumSession].self, from: data)) ?? []
    }
}

public extension HumSessionStore {
    /// Default URL for production use.
    static var defaultURL: URL {
        FileManager.default
            .urls(for: .documentDirectory, in: .userDomainMask)[0]
            .appendingPathComponent("hum-sessions.json")
    }
}
