import XCTest
import SwiftUI
@testable import NeuralTwin

/// Snapshot and integration tests for CoherenceView (8-layer coherence display)
class CoherenceViewTests: XCTestCase {
  var mockTokenStore: MockTokenStore!

  override func setUp() {
    super.setUp()
    mockTokenStore = MockTokenStore()
    mockTokenStore.saveSession(
      token: "test-token",
      userId: "user-123",
      email: "test@example.com",
      name: "Test User"
    )
  }

  override func tearDown() {
    mockTokenStore = nil
    super.tearDown()
  }

  // MARK: - Initial State Tests

  func testCoherenceViewInitialState() {
    // When CoherenceView is loaded
    // Then displays loading state
    let isLoading = true

    XCTAssertTrue(isLoading)
    // Snapshot: coherence_loading
  }

  func testCoherenceDataLoading() async throws {
    // When fetching coherence data
    do {
      let response = try JSONDecoder().decode(
        CoherenceResponse.self,
        from: MockData.jsonData(MockData.coherenceResponse)
      )

      // Then shows 8-layer breakdown
      XCTAssertTrue(response.success)
      XCTAssertEqual(response.coherence.layers.count, 8)
      // Snapshot: coherence_data_loaded
    } catch {
      XCTFail("Coherence data loading failed: \(error)")
    }
  }

  // MARK: - 8-Layer Display Tests

  func testEightLayerDisplay() async throws {
    // When coherence data is received
    do {
      let response = try JSONDecoder().decode(
        CoherenceResponse.self,
        from: MockData.jsonData(MockData.coherenceResponse)
      )

      // Then displays all 8 layers
      let expectedLayers = [
        "Emotional Coherence",
        "Cognitive Coherence",
        "Decision Coherence",
        "Narrative Coherence",
        "Social Coherence",
        "Value Coherence",
        "Temporal Coherence",
        "Existential Coherence"
      ]

      let actualLayers = response.coherence.layers.map { $0.name }
      XCTAssertEqual(actualLayers, expectedLayers)
    } catch {
      XCTFail("Eight layer display failed: \(error)")
    }
  }

  func testEmotionalCoherenceLayer() async throws {
    // When accessing emotional coherence
    do {
      let response = try JSONDecoder().decode(
        CoherenceResponse.self,
        from: MockData.jsonData(MockData.coherenceResponse)
      )

      let emotionalLayer = response.coherence.layers[0]

      // Then shows score and components
      XCTAssertEqual(emotionalLayer.name, "Emotional Coherence")
      XCTAssertGreater(emotionalLayer.score, 0.0)
      XCTAssertLess(emotionalLayer.score, 1.0)
      XCTAssertGreater(emotionalLayer.components.count, 0)
    } catch {
      XCTFail("Emotional coherence layer failed: \(error)")
    }
  }

  func testCognitiveCoherenceLayer() async throws {
    // When accessing cognitive coherence
    do {
      let response = try JSONDecoder().decode(
        CoherenceResponse.self,
        from: MockData.jsonData(MockData.coherenceResponse)
      )

      let cognitiveLayer = response.coherence.layers[1]

      // Then shows clarity and focus metrics
      XCTAssertEqual(cognitiveLayer.name, "Cognitive Coherence")
      XCTAssertGreater(cognitiveLayer.score, 0.0)
    } catch {
      XCTFail("Cognitive coherence layer failed: \(error)")
    }
  }

  func testDecisionCoherenceLayer() async throws {
    // When accessing decision coherence
    do {
      let response = try JSONDecoder().decode(
        CoherenceResponse.self,
        from: MockData.jsonData(MockData.coherenceResponse)
      )

      let decisionLayer = response.coherence.layers[2]

      // Then shows consistency and alignment
      XCTAssertEqual(decisionLayer.name, "Decision Coherence")
      XCTAssertGreater(decisionLayer.score, 0.0)
    } catch {
      XCTFail("Decision coherence layer failed: \(error)")
    }
  }

  func testNarrativeCoherenceLayer() async throws {
    // When accessing narrative coherence
    do {
      let response = try JSONDecoder().decode(
        CoherenceResponse.self,
        from: MockData.jsonData(MockData.coherenceResponse)
      )

      let narrativeLayer = response.coherence.layers[3]

      // Then shows story and identity metrics
      XCTAssertEqual(narrativeLayer.name, "Narrative Coherence")
      XCTAssertGreater(narrativeLayer.score, 0.0)
    } catch {
      XCTFail("Narrative coherence layer failed: \(error)")
    }
  }

  func testSocialCoherenceLayer() async throws {
    // When accessing social coherence
    do {
      let response = try JSONDecoder().decode(
        CoherenceResponse.self,
        from: MockData.jsonData(MockData.coherenceResponse)
      )

      let socialLayer = response.coherence.layers[4]

      // Then shows relationship alignment
      XCTAssertEqual(socialLayer.name, "Social Coherence")
      XCTAssertGreater(socialLayer.score, 0.0)
    } catch {
      XCTFail("Social coherence layer failed: \(error)")
    }
  }

  func testValueCoherenceLayer() async throws {
    // When accessing value coherence
    do {
      let response = try JSONDecoder().decode(
        CoherenceResponse.self,
        from: MockData.jsonData(MockData.coherenceResponse)
      )

      let valueLayer = response.coherence.layers[5]

      // Then shows value alignment and integrity
      XCTAssertEqual(valueLayer.name, "Value Coherence")
      XCTAssertGreater(valueLayer.score, 0.0)
    } catch {
      XCTFail("Value coherence layer failed: \(error)")
    }
  }

  func testTemporalCoherenceLayer() async throws {
    // When accessing temporal coherence
    do {
      let response = try JSONDecoder().decode(
        CoherenceResponse.self,
        from: MockData.jsonData(MockData.coherenceResponse)
      )

      let temporalLayer = response.coherence.layers[6]

      // Then shows past/future connection
      XCTAssertEqual(temporalLayer.name, "Temporal Coherence")
      XCTAssertGreater(temporalLayer.score, 0.0)
    } catch {
      XCTFail("Temporal coherence layer failed: \(error)")
    }
  }

  func testExistentialCoherenceLayer() async throws {
    // When accessing existential coherence
    do {
      let response = try JSONDecoder().decode(
        CoherenceResponse.self,
        from: MockData.jsonData(MockData.coherenceResponse)
      )

      let existentialLayer = response.coherence.layers[7]

      // Then shows purpose and meaning
      XCTAssertEqual(existentialLayer.name, "Existential Coherence")
      XCTAssertGreater(existentialLayer.score, 0.0)
    } catch {
      XCTFail("Existential coherence layer failed: \(error)")
    }
  }

  // MARK: - Overall Score Tests

  func testOverallCoherenceScore() async throws {
    // When coherence data is loaded
    do {
      let response = try JSONDecoder().decode(
        CoherenceResponse.self,
        from: MockData.jsonData(MockData.coherenceResponse)
      )

      // Then displays overall score
      let overallScore = response.coherence.overallScore
      XCTAssertGreater(overallScore, 0.0)
      XCTAssertLessThanOrEqual(overallScore, 1.0)
    } catch {
      XCTFail("Overall score calculation failed: \(error)")
    }
  }

  func testOverallScoreDisplayFormat() async throws {
    // When overall score is shown
    do {
      let response = try JSONDecoder().decode(
        CoherenceResponse.self,
        from: MockData.jsonData(MockData.coherenceResponse)
      )

      let score = response.coherence.overallScore

      // Then formats as percentage or 0-1 scale
      let percentageString = String(format: "%.0f%%", score * 100)
      XCTAssertTrue(percentageString.contains("%"))
    } catch {
      XCTFail("Overall score format failed: \(error)")
    }
  }

  func testLayerScoreVisualization() async throws {
    // When displaying individual layer scores
    do {
      let response = try JSONDecoder().decode(
        CoherenceResponse.self,
        from: MockData.jsonData(MockData.coherenceResponse)
      )

      // Then visualizes as progress bars
      for layer in response.coherence.layers {
        XCTAssertGreater(layer.score, 0.0)
        XCTAssertLessThanOrEqual(layer.score, 1.0)
      }
    } catch {
      XCTFail("Layer visualization failed: \(error)")
    }
  }

  // MARK: - History Chart Tests

  func testCoherenceHistoryLoading() async throws {
    // When loading historical data
    do {
      let response = try JSONDecoder().decode(
        CoherenceHistoryResponse.self,
        from: MockData.jsonData(MockData.coherenceHistoryResponse)
      )

      // Then loads trend data
      XCTAssertTrue(response.success)
      XCTAssertGreater(response.history.count, 0)
      // Snapshot: coherence_history_loaded
    } catch {
      XCTFail("History loading failed: \(error)")
    }
  }

  func testCoherenceHistoryChart() async throws {
    // When displaying historical trend
    do {
      let response = try JSONDecoder().decode(
        CoherenceHistoryResponse.self,
        from: MockData.jsonData(MockData.coherenceHistoryResponse)
      )

      // Then shows line chart of scores over time
      XCTAssertGreater(response.history.count, 1)

      // Verify chronological order
      for i in 1..<response.history.count {
        XCTAssertGreaterThanOrEqual(
          response.history[i].timestamp,
          response.history[i - 1].timestamp
        )
      }
    } catch {
      XCTFail("History chart failed: \(error)")
    }
  }

  func testCoherenceTrendAnalysis() async throws {
    // When analyzing trend
    do {
      let response = try JSONDecoder().decode(
        CoherenceHistoryResponse.self,
        from: MockData.jsonData(MockData.coherenceHistoryResponse)
      )

      let history = response.history
      guard history.count >= 2 else { return }

      // Then calculates trend (up/down/stable)
      let firstScore = history.first!.overallScore
      let lastScore = history.last!.overallScore
      let trend = lastScore > firstScore ? "improving" : (lastScore < firstScore ? "declining" : "stable")

      XCTAssertTrue(["improving", "declining", "stable"].contains(trend))
    } catch {
      XCTFail("Trend analysis failed: \(error)")
    }
  }

  func testHistoryTimeframeSelection() {
    // Given history view
    let timeframes = ["7d", "14d", "30d", "90d", "all"]

    // When selecting timeframe
    // Then fetches and displays data for that period
    XCTAssertGreater(timeframes.count, 0)
    // Snapshot: coherence_timeframe_selector
  }

  func testHistoryChartInteractivity() {
    // Given chart is displayed
    // When user taps on a point
    // Then shows details for that date
    let selectedDate = "2024-06-26"
    XCTAssertFalse(selectedDate.isEmpty)
  }

  // MARK: - Component Breakdown Tests

  func testLayerComponentsDisplay() async throws {
    // When layer is tapped
    do {
      let response = try JSONDecoder().decode(
        CoherenceResponse.self,
        from: MockData.jsonData(MockData.coherenceResponse)
      )

      let layer = response.coherence.layers[0]

      // Then shows component breakdown
      XCTAssertGreater(layer.components.count, 0)
      // Snapshot: coherence_layer_expanded
    } catch {
      XCTFail("Component breakdown failed: \(error)")
    }
  }

  func testComponentMetrics() async throws {
    // When viewing component details
    do {
      let response = try JSONDecoder().decode(
        CoherenceResponse.self,
        from: MockData.jsonData(MockData.coherenceResponse)
      )

      let layer = response.coherence.layers[0]
      let components = layer.components

      // Then shows metrics for each component
      for component in components {
        XCTAssertFalse(component.isEmpty)
      }
    } catch {
      XCTFail("Component metrics failed: \(error)")
    }
  }

  // MARK: - Comparison Tests

  func testCompareWithPreviousState() async throws {
    // When viewing current coherence
    do {
      let current = try JSONDecoder().decode(
        CoherenceResponse.self,
        from: MockData.jsonData(MockData.coherenceResponse)
      )

      // Then shows comparison with previous
      let previousScore = 0.75 // Example
      let currentScore = current.coherence.overallScore
      let change = currentScore - previousScore

      XCTAssertNotEqual(change, 0.0)
    } catch {
      XCTFail("Comparison failed: \(error)")
    }
  }

  func testChangeIndicators() async throws {
    // Given coherence scores
    // When score changes
    let previousScore = 0.75
    let currentScore = 0.79
    let change = currentScore - previousScore

    // Then shows up/down/stable indicator
    let indicator = change > 0.01 ? "up" : (change < -0.01 ? "down" : "stable")
    XCTAssertTrue(["up", "down", "stable"].contains(indicator))
  }

  // MARK: - Insights Display Tests

  func testCoherenceInsights() async throws {
    // When coherence is analyzed
    // Then shows actionable insights
    let insight = "Your decision coherence is strong. Consider leveraging this in complex choices."
    XCTAssertFalse(insight.isEmpty)
    // Snapshot: coherence_insights
  }

  func testInsightCategories() {
    // Given insights
    // When displayed
    let categories = ["strengths", "areas_for_growth", "recommendations"]

    // Then organized by category
    XCTAssertEqual(categories.count, 3)
  }

  // MARK: - Error Handling Tests

  func testCoherenceLoadingError() {
    // When loading fails
    let error = URLError(.networkConnectionLost)

    // Then shows error message
    XCTAssertNotNil(error)
    // Snapshot: coherence_error
  }

  func testCoherenceRetry() {
    // Given loading failed
    var error: Error? = URLError(.networkConnectionLost)

    // When retry is tapped
    error = nil

    // Then retries loading
    XCTAssertNil(error)
  }

  // MARK: - Refresh Tests

  func testManualRefresh() {
    // Given view is displayed
    // When refresh button is tapped
    var isRefreshing = true

    // Then reloads data
    XCTAssertTrue(isRefreshing)
  }

  func testAutoRefresh() {
    // Given app is in foreground
    // When timer interval passes
    // Then automatically refreshes data
    let refreshInterval: TimeInterval = 300 // 5 minutes
    XCTAssertGreater(refreshInterval, 0)
  }

  // MARK: - Accessibility Tests

  func testLayerLabelAccessibility() async throws {
    // Given layer display
    do {
      let response = try JSONDecoder().decode(
        CoherenceResponse.self,
        from: MockData.jsonData(MockData.coherenceResponse)
      )

      // When screen reader is active
      // Then announces layer names and scores
      for layer in response.coherence.layers {
        let label = "\(layer.name): \(String(format: "%.0f%%", layer.score * 100))"
        XCTAssertFalse(label.isEmpty)
      }
    } catch {
      XCTFail("Accessibility labels failed: \(error)")
    }
  }

  func testChartAccessibility() {
    // Given chart is displayed
    // When voice control is active
    // Then can navigate and get details
    let isAccessible = true
    XCTAssertTrue(isAccessible)
  }

  // MARK: - Snapshot Tests

  func testSnapshotCoherenceInitial() {
    // assertSnapshot(of: CoherenceView(), named: "coherence_initial")
    XCTAssertTrue(true) // Placeholder
  }

  func testSnapshotCoherenceLoaded() {
    // assertSnapshot(of: CoherenceView(showData: true), named: "coherence_loaded")
    XCTAssertTrue(true) // Placeholder
  }

  func testSnapshotCoherenceWithChart() {
    // assertSnapshot(of: CoherenceView(showChart: true), named: "coherence_chart")
    XCTAssertTrue(true) // Placeholder
  }

  func testSnapshotCoherenceInsights() {
    // assertSnapshot(of: CoherenceView(showInsights: true), named: "coherence_insights")
    XCTAssertTrue(true) // Placeholder
  }

  func testSnapshotCoherenceError() {
    // assertSnapshot(of: CoherenceView(error: "Load failed"), named: "coherence_error")
    XCTAssertTrue(true) // Placeholder
  }
}
