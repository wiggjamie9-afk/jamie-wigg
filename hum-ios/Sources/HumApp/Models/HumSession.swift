import Foundation

public struct HumSession: Identifiable, Codable, Equatable {
    public let id: UUID
    public let timestamp: Date
    public let durationSeconds: Int
    public let averagePitch: Float
    public let pitchVariability: Float
    /// Normalised 0.0–1.0; higher is steadier.
    public let steadinessScore: Float
    public let moodBefore: Int    // 1–5
    public let moodAfter: Int     // 1–5
    public let focusBefore: Int   // 1–5
    public let focusAfter: Int    // 1–5
    public let goals: [String]    // e.g. ["anxiety", "ADHD", "depression"]

    public init(
        id: UUID = UUID(),
        timestamp: Date = Date(),
        durationSeconds: Int,
        averagePitch: Float,
        pitchVariability: Float,
        steadinessScore: Float,
        moodBefore: Int,
        moodAfter: Int,
        focusBefore: Int,
        focusAfter: Int,
        goals: [String]
    ) {
        self.id = id
        self.timestamp = timestamp
        self.durationSeconds = durationSeconds
        self.averagePitch = averagePitch
        self.pitchVariability = pitchVariability
        self.steadinessScore = steadinessScore
        self.moodBefore = moodBefore
        self.moodAfter = moodAfter
        self.focusBefore = focusBefore
        self.focusAfter = focusAfter
        self.goals = goals
    }

    // MARK: - Derived

    public var moodDelta: Int { moodAfter - moodBefore }
    public var focusDelta: Int { focusAfter - focusBefore }

    /// Duration formatted as "M:SS".
    public var formattedDuration: String {
        String(format: "%d:%02d", durationSeconds / 60, durationSeconds % 60)
    }
}
