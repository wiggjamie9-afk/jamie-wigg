import Foundation
@testable import HumApp

extension HumSession {
    static func stub(
        id: UUID = UUID(),
        timestamp: Date = Date(),
        durationSeconds: Int = 300,
        averagePitch: Float = 220.0,
        pitchVariability: Float = 12.0,
        steadinessScore: Float = 0.8,
        moodBefore: Int = 3,
        moodAfter: Int = 4,
        focusBefore: Int = 3,
        focusAfter: Int = 4,
        goals: [String] = ["anxiety"]
    ) -> HumSession {
        HumSession(
            id: id,
            timestamp: timestamp,
            durationSeconds: durationSeconds,
            averagePitch: averagePitch,
            pitchVariability: pitchVariability,
            steadinessScore: steadinessScore,
            moodBefore: moodBefore,
            moodAfter: moodAfter,
            focusBefore: focusBefore,
            focusAfter: focusAfter,
            goals: goals
        )
    }
}
