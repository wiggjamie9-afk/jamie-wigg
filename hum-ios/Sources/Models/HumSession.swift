import Foundation

struct HumSession: Identifiable, Codable {
    let id: UUID
    let timestamp: Date
    let durationSeconds: Int
    let averagePitch: Float
    let pitchVariability: Float
    let steadinessScore: Float
    let moodBefore: Int // 1-5
    let moodAfter: Int // 1-5
    let focusBefore: Int // 1-5
    let focusAfter: Int // 1-5
    let goals: [String] // ["anxiety", "ADHD", "depression"]
}
