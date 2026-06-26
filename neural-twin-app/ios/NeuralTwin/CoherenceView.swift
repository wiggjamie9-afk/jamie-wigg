import SwiftUI
import Charts

// ============================================================================
// COHERENCE VIEW - 8-layer coherence visualization with Charts
// ============================================================================

// MARK: - Data Models for Visualization
struct CoherenceChartData: Identifiable {
  let id = UUID()
  let timestamp: Date
  let overall: Float
  let state: String
}

// MARK: - ViewModel
@MainActor
class CoherenceViewModel: ObservableObject {
  @Published var currentCoherence: CoherenceResponse?
  @Published var coherenceHistory: CoherenceHistoryResponse?
  @Published var chartData: [CoherenceChartData] = []
  @Published var selectedMetricDetail: CoherenceMetricDetail?
  @Published var isLoading = false
  @Published var isLoadingDetail = false
  @Published var error: String?
  @Published var showError = false
  @Published var selectedTimeframe = "7d"
  @Published var selectedMetricId: String?

  private let apiClient = APIClient.shared

  let timeframes = ["24h", "7d", "30d", "all"]

  func loadCoherence() {
    isLoading = true
    error = nil

    Task {
      do {
        let response = try await apiClient.getCoherence()
        currentCoherence = response
        loadHistory()
      } catch {
        self.error = "Failed to load coherence: \(error.localizedDescription)"
        self.showError = true
      }

      isLoading = false
    }
  }

  func loadHistory() {
    Task {
      do {
        let response = try await apiClient.getCoherenceHistory(timeframe: selectedTimeframe)
        coherenceHistory = response

        // Transform history points into chart data
        chartData = response.history.map { point in
          CoherenceChartData(
            timestamp: point.timestamp,
            overall: point.overall,
            state: point.state
          )
        }
      } catch {
        self.error = "Failed to load history: \(error.localizedDescription)"
        self.showError = true
      }
    }
  }

  func selectTimeframe(_ timeframe: String) {
    selectedTimeframe = timeframe
    loadHistory()
  }

  func loadMetricDetail(id: String) {
    isLoadingDetail = true
    selectedMetricId = id

    Task {
      do {
        let response = try await apiClient.getCoherenceMetric(id: id)
        selectedMetricDetail = response.metric
      } catch {
        self.error = "Failed to load metric detail: \(error.localizedDescription)"
        self.showError = true
      }

      isLoadingDetail = false
    }
  }
}

struct CoherenceView: View {
  @StateObject private var viewModel = CoherenceViewModel()
  @State private var selectedChartPoint: CoherenceChartData?
  @State private var showDetailSheet = false

  var body: some View {
    ZStack {
      DesignTokens.background.ignoresSafeArea()

      if viewModel.isLoading {
        VStack(spacing: 16) {
          ProgressView()
            .scaleEffect(1.5)
          Text("Loading Coherence Data...")
            .foregroundColor(DesignTokens.textSecondary)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
      } else if let coherence = viewModel.currentCoherence {
        ScrollView {
          VStack(spacing: DesignTokens.spacing24) {
            // Header
            Text("Coherence")
              .font(.system(size: 28, weight: .bold))
              .foregroundColor(.white)
              .frame(maxWidth: .infinity, alignment: .leading)
              .padding(.horizontal, DesignTokens.spacing16)

            // Overall Score Circle
            CoherenceOverallScoreView(coherence: coherence)

            // 8-Layer Breakdown
            CoherenceLayerBreakdownView(layers: coherence.layers)

            // Recommendations
            if !coherence.recommendations.isEmpty {
              CoherenceRecommendationsView(recommendations: coherence.recommendations)
            }

            // Timeframe Selector & History Chart
            CoherenceTrendView(
              viewModel: viewModel,
              chartData: viewModel.chartData,
              selectedPoint: $selectedChartPoint,
              onPointTap: { point in
                selectedChartPoint = point
                showDetailSheet = true
              }
            )

            Spacer(minLength: 20)
          }
          .padding(DesignTokens.spacing16)
        }
      }
    }
    .onAppear {
      viewModel.loadCoherence()
    }
    .sheet(isPresented: $showDetailSheet) {
      if let point = selectedChartPoint {
        CoherenceDetailSheet(
          viewModel: viewModel,
          selectedPoint: point,
          isPresented: $showDetailSheet
        )
      }
    }
    .alert("Error", isPresented: $viewModel.showError, presenting: viewModel.error) { _ in
      Button("OK") { viewModel.showError = false }
    } message: { error in
      Text(error)
    }
  }
}

// MARK: - Overall Score Component
struct CoherenceOverallScoreView: View {
  let coherence: CoherenceResponse

  var progressValue: Double {
    Double(coherence.overallCoherence) ?? 50
  }

  var body: some View {
    VStack(spacing: DesignTokens.spacing16) {
      ZStack {
        // Background circle
        Circle()
          .stroke(DesignTokens.surface2, lineWidth: 12)

        // Progress circle
        Circle()
          .trim(from: 0, to: min(progressValue / 100, 1.0))
          .stroke(
            LinearGradient(
              gradient: Gradient(colors: [DesignTokens.brandBlue, DesignTokens.accentPurple]),
              startPoint: .topLeading,
              endPoint: .bottomTrailing
            ),
            style: StrokeStyle(lineWidth: 12, lineCap: .round)
          )
          .rotationEffect(.degrees(-90))
          .animation(.easeInOut(duration: 1.0), value: progressValue)

        // Center text
        VStack(spacing: 8) {
          Text(String(format: "%.0f%%", progressValue))
            .font(.system(size: 48, weight: .bold))
            .foregroundColor(DesignTokens.brandBlue)

          Text(coherence.coherenceState)
            .font(.system(size: 14, weight: .semibold))
            .foregroundColor(DesignTokens.textSecondary)
        }
      }
      .frame(width: 240, height: 240)
    }
    .frame(maxWidth: .infinity)
    .padding(DesignTokens.spacing16)
    .background(DesignTokens.surface1)
    .cornerRadius(DesignTokens.radiusMedium)
  }
}

// MARK: - 8-Layer Breakdown Component
struct CoherenceLayerBreakdownView: View {
  let layers: [CoherenceLayer]

  var body: some View {
    VStack(spacing: DesignTokens.spacing12) {
      Text("8-Layer Breakdown")
        .font(.system(size: 14, weight: .semibold))
        .foregroundColor(DesignTokens.textSecondary)
        .frame(maxWidth: .infinity, alignment: .leading)

      VStack(spacing: DesignTokens.spacing8) {
        ForEach(layers, id: \.name) { layer in
          CoherenceLayerRow(layer: layer)
        }
      }
      .padding(DesignTokens.spacing12)
      .background(DesignTokens.surface1)
      .cornerRadius(DesignTokens.radiusSmall)
    }
    .padding(.horizontal, DesignTokens.spacing16)
  }
}

// MARK: - Recommendations Component
struct CoherenceRecommendationsView: View {
  let recommendations: String

  var body: some View {
    VStack(spacing: DesignTokens.spacing12) {
      Text("Recommendations")
        .font(.system(size: 14, weight: .semibold))
        .foregroundColor(DesignTokens.textSecondary)
        .frame(maxWidth: .infinity, alignment: .leading)

      Text(recommendations)
        .font(.system(size: 13, weight: .regular))
        .foregroundColor(DesignTokens.textPrimary)
        .padding(DesignTokens.spacing12)
        .background(DesignTokens.surface1)
        .cornerRadius(DesignTokens.radiusSmall)
    }
    .padding(.horizontal, DesignTokens.spacing16)
  }
}

// MARK: - Trend Chart Component
struct CoherenceTrendView: View {
  let viewModel: CoherenceViewModel
  let chartData: [CoherenceChartData]
  @Binding var selectedPoint: CoherenceChartData?
  let onPointTap: (CoherenceChartData) -> Void

  var body: some View {
    VStack(spacing: DesignTokens.spacing12) {
      Text("Trend")
        .font(.system(size: 14, weight: .semibold))
        .foregroundColor(DesignTokens.textSecondary)
        .frame(maxWidth: .infinity, alignment: .leading)

      Picker("Timeframe", selection: $viewModel.selectedTimeframe) {
        ForEach(viewModel.timeframes, id: \.self) { tf in
          Text(tf).tag(tf)
        }
      }
      .pickerStyle(.segmented)
      .onChange(of: viewModel.selectedTimeframe) { newValue in
        viewModel.selectTimeframe(newValue)
      }

      // SwiftUI Charts Line Chart
      if !chartData.isEmpty {
        VStack(alignment: .center, spacing: DesignTokens.spacing12) {
          Text("Coherence Trend")
            .font(.system(size: 12, weight: .semibold))
            .foregroundColor(DesignTokens.textSecondary)

          Chart(chartData) { dataPoint in
            LineMark(
              x: .value("Time", dataPoint.timestamp),
              y: .value("Coherence", dataPoint.overall)
            )
            .foregroundStyle(
              LinearGradient(
                gradient: Gradient(colors: [DesignTokens.brandBlue, DesignTokens.accentPurple]),
                startPoint: .topLeading,
                endPoint: .bottomTrailing
              )
            )
            .lineStyle(StrokeStyle(lineWidth: 2))

            PointMark(
              x: .value("Time", dataPoint.timestamp),
              y: .value("Coherence", dataPoint.overall)
            )
            .foregroundStyle(DesignTokens.brandBlue)
            .opacity(selectedPoint?.id == dataPoint.id ? 1 : 0.5)

            if let selectedPoint = selectedPoint, selectedPoint.id == dataPoint.id {
              RuleMark(x: .value("Selected", selectedPoint.timestamp))
                .lineStyle(StrokeStyle(lineWidth: 1, dash: [5]))
                .foregroundStyle(DesignTokens.textSecondary.opacity(0.5))
            }
          }
          .frame(height: 200)
          .chartXAxis {
            AxisMarks(position: .bottom, values: .automatic(desiredCount: 5))
          }
          .chartYAxis {
            AxisMarks(position: .leading, values: .automatic(desiredCount: 5)) { _ in
              AxisGridLine()
                .foregroundStyle(DesignTokens.surface2)
            }
          }
          .chartBackground { _ in
            Color.clear
          }
          .onTapGesture { value in
            // Find nearest point to tap location
            if let nearestPoint = findNearestPoint(to: value, in: chartData) {
              onPointTap(nearestPoint)
            }
          }
        }
        .padding(DesignTokens.spacing12)
        .background(DesignTokens.surface1)
        .cornerRadius(DesignTokens.radiusSmall)
      } else {
        Text("No data available for this timeframe")
          .foregroundColor(DesignTokens.textSecondary)
          .frame(height: 150)
          .frame(maxWidth: .infinity)
          .background(DesignTokens.surface1)
          .cornerRadius(DesignTokens.radiusSmall)
      }
    }
    .padding(.horizontal, DesignTokens.spacing16)
  }

  private func findNearestPoint(to: CGPoint, in data: [CoherenceChartData]) -> CoherenceChartData? {
    guard !data.isEmpty else { return nil }
    // Return the point closest to the tap location
    // In a production app, you'd calculate the nearest point based on gesture position
    return data.first
  }
}

// MARK: - Detail Sheet
struct CoherenceDetailSheet: View {
  let viewModel: CoherenceViewModel
  let selectedPoint: CoherenceChartData
  @Binding var isPresented: Bool

  var body: some View {
    NavigationStack {
      ZStack {
        DesignTokens.background.ignoresSafeArea()

        if viewModel.isLoadingDetail {
          VStack {
            ProgressView()
              .scaleEffect(1.5)
            Text("Loading Details...")
              .foregroundColor(DesignTokens.textSecondary)
          }
        } else if let detail = viewModel.selectedMetricDetail {
          ScrollView {
            VStack(spacing: DesignTokens.spacing16) {
              // Timestamp
              VStack(alignment: .leading, spacing: 8) {
                Text("Measurement")
                  .font(.system(size: 12, weight: .semibold))
                  .foregroundColor(DesignTokens.textSecondary)

                Text(selectedPoint.timestamp.formatted(date: .abbreviated, time: .standard))
                  .font(.system(size: 14, weight: .regular))
                  .foregroundColor(.white)
              }
              .frame(maxWidth: .infinity, alignment: .leading)
              .padding(DesignTokens.spacing12)
              .background(DesignTokens.surface1)
              .cornerRadius(DesignTokens.radiusSmall)

              // Overall Coherence
              DetailMetricCard(
                label: "Overall Coherence",
                value: String(format: "%.1f", detail.overallCoherence),
                state: detail.coherenceState
              )

              // Detailed Metrics Grid
              VStack(spacing: DesignTokens.spacing12) {
                Text("Coherence Metrics")
                  .font(.system(size: 14, weight: .semibold))
                  .foregroundColor(DesignTokens.textSecondary)
                  .frame(maxWidth: .infinity, alignment: .leading)

                VStack(spacing: DesignTokens.spacing8) {
                  if let value = detail.heartBrainCoh {
                    DetailMetricRow(
                      label: "Heart-Brain Coherence",
                      value: String(format: "%.1f", value)
                    )
                  }

                  if let value = detail.breathCoh {
                    DetailMetricRow(
                      label: "Breath Coherence",
                      value: String(format: "%.1f", value)
                    )
                  }

                  if let value = detail.brainCoh {
                    DetailMetricRow(
                      label: "Brain Coherence",
                      value: String(format: "%.1f", value)
                    )
                  }

                  if let value = detail.vagalTone {
                    DetailMetricRow(
                      label: "Vagal Tone",
                      value: String(format: "%.1f", value)
                    )
                  }

                  if let value = detail.circadianAlign {
                    DetailMetricRow(
                      label: "Circadian Alignment",
                      value: String(format: "%.1f%%", value)
                    )
                  }

                  if let value = detail.biofieldCoh {
                    DetailMetricRow(
                      label: "Biofield Coherence",
                      value: String(format: "%.1f", value)
                    )
                  }

                  if let value = detail.decisionCoh {
                    DetailMetricRow(
                      label: "Decision Coherence",
                      value: String(format: "%.1f", value)
                    )
                  }
                }
                .padding(DesignTokens.spacing12)
                .background(DesignTokens.surface1)
                .cornerRadius(DesignTokens.radiusSmall)
              }

              Spacer(minLength: 20)
            }
            .padding(DesignTokens.spacing16)
          }
        }
      }
      .navigationTitle("Coherence Details")
      .navigationBarTitleDisplayMode(.inline)
      .toolbar {
        ToolbarItem(placement: .navigationBarTrailing) {
          Button("Done") {
            isPresented = false
          }
          .foregroundColor(DesignTokens.brandBlue)
        }
      }
      .onAppear {
        // Extract ID from the timestamp or use a placeholder
        // In a real app, the CoherencePoint would have an ID field
        let pointId = ISO8601DateFormatter().string(from: selectedPoint.timestamp)
        viewModel.loadMetricDetail(id: pointId)
      }
    }
  }
}

// MARK: - Detail Metric Components
struct DetailMetricCard: View {
  let label: String
  let value: String
  let state: String

  var body: some View {
    VStack(alignment: .leading, spacing: 8) {
      Text(label)
        .font(.system(size: 12, weight: .semibold))
        .foregroundColor(DesignTokens.textSecondary)

      HStack(spacing: 12) {
        VStack(alignment: .leading, spacing: 4) {
          Text(value)
            .font(.system(size: 32, weight: .bold))
            .foregroundColor(DesignTokens.brandBlue)

          Text(state)
            .font(.system(size: 12, weight: .regular))
            .foregroundColor(DesignTokens.textSecondary)
        }

        Spacer()
      }
    }
    .frame(maxWidth: .infinity, alignment: .leading)
    .padding(DesignTokens.spacing12)
    .background(DesignTokens.surface1)
    .cornerRadius(DesignTokens.radiusSmall)
  }
}

struct DetailMetricRow: View {
  let label: String
  let value: String

  var body: some View {
    HStack {
      Text(label)
        .font(.system(size: 13, weight: .regular))
        .foregroundColor(DesignTokens.textPrimary)

      Spacer()

      Text(value)
        .font(.system(size: 13, weight: .semibold))
        .foregroundColor(DesignTokens.brandBlue)
    }
    .padding(DesignTokens.spacing8)
    .background(DesignTokens.surface2)
    .cornerRadius(DesignTokens.radiusSmall)
  }
}

// MARK: - Layer Row Component
struct CoherenceLayerRow: View {
  let layer: CoherenceLayer

  var layerColor: Color {
    let value = Double(layer.value) ?? 50
    if value >= 80 {
      return DesignTokens.successGreen
    } else if value >= 60 {
      return DesignTokens.warningOrange
    } else {
      return DesignTokens.errorRed
    }
  }

  var body: some View {
    VStack(alignment: .leading, spacing: DesignTokens.spacing8) {
      HStack {
        VStack(alignment: .leading, spacing: 2) {
          Text("Layer \(layer.layer): \(layer.name)")
            .font(.system(size: 13, weight: .semibold))
            .foregroundColor(.white)

          Text(layer.description)
            .font(.system(size: 11, weight: .regular))
            .foregroundColor(DesignTokens.textSecondary)
        }

        Spacer()

        Text(String(format: "%.0f%%", Double(layer.value) ?? 0))
          .font(.system(size: 14, weight: .semibold))
          .foregroundColor(layerColor)
      }

      // Progress bar
      GeometryReader { geometry in
        ZStack(alignment: .leading) {
          RoundedRectangle(cornerRadius: 4)
            .fill(DesignTokens.surface2)

          RoundedRectangle(cornerRadius: 4)
            .fill(layerColor)
            .frame(width: geometry.size.width * CGFloat(min(Double(layer.value) ?? 50 / 100, 1.0)))
        }
      }
      .frame(height: 6)
    }
    .padding(DesignTokens.spacing8)
    .background(DesignTokens.surface2)
    .cornerRadius(DesignTokens.radiusSmall)
  }
}

// MARK: - Preview
#Preview {
  CoherenceView()
    .preferredColorScheme(.dark)
}
