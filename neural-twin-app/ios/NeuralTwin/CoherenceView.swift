import SwiftUI
import Charts

// ============================================================================
// COHERENCE VIEW - 8-layer coherence visualization
// ============================================================================

@MainActor
class CoherenceViewModel: ObservableObject {
  @Published var currentCoherence: CoherenceResponse?
  @Published var coherenceHistory: [CoherenceHistoryResponse]?
  @Published var isLoading = false
  @Published var error: String?
  @Published var showError = false
  @Published var selectedTimeframe = "7d"

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
        coherenceHistory = [response]
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
}

struct CoherenceView: View {
  @StateObject private var viewModel = CoherenceViewModel()

  var body: some View {
    ZStack {
      DesignTokens.background.ignoresSafeArea()

      VStack(spacing: DesignTokens.spacing24) {
        // Header
        Text("Coherence")
          .font(.system(size: 28, weight: .bold))
          .foregroundColor(.white)
          .frame(maxWidth: .infinity, alignment: .leading)
          .padding(.horizontal, DesignTokens.spacing16)

        // Overall score
        if let coherence = viewModel.currentCoherence {
          VStack(spacing: DesignTokens.spacing16) {
            // Large circle visualization
            ZStack {
              Circle()
                .stroke(DesignTokens.surface2, lineWidth: 12)

              Circle()
                .trim(from: 0, to: min(Double(coherence.overallCoherence) ?? 50 / 100, 1.0))
                .stroke(
                  LinearGradient(
                    gradient: Gradient(colors: [DesignTokens.brandBlue, DesignTokens.accentPurple]),
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                  ),
                  style: StrokeStyle(lineWidth: 12, lineCap: .round)
                )
                .rotationEffect(.degrees(-90))
                .animation(.easeInOut(duration: 1.0), value: coherence.overallCoherence)

              VStack(spacing: 8) {
                Text(String(format: "%.0f%%", Double(coherence.overallCoherence) ?? 50))
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

          // 8 Layers
          VStack(spacing: DesignTokens.spacing12) {
            Text("8-Layer Breakdown")
              .font(.system(size: 14, weight: .semibold))
              .foregroundColor(DesignTokens.textSecondary)
              .frame(maxWidth: .infinity, alignment: .leading)

            VStack(spacing: DesignTokens.spacing8) {
              ForEach(coherence.layers, id: \.name) { layer in
                CoherenceLayerRow(layer: layer)
              }
            }
            .padding(DesignTokens.spacing12)
            .background(DesignTokens.surface1)
            .cornerRadius(DesignTokens.radiusSmall)
          }

          // Recommendations
          if !coherence.recommendations.isEmpty {
            VStack(spacing: DesignTokens.spacing12) {
              Text("Recommendations")
                .font(.system(size: 14, weight: .semibold))
                .foregroundColor(DesignTokens.textSecondary)
                .frame(maxWidth: .infinity, alignment: .leading)

              Text(coherence.recommendations)
                .font(.system(size: 13, weight: .regular))
                .foregroundColor(DesignTokens.textPrimary)
                .padding(DesignTokens.spacing12)
                .background(DesignTokens.surface1)
                .cornerRadius(DesignTokens.radiusSmall)
            }
          }

          // Timeframe selector
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

            // History chart placeholder
            VStack(alignment: .center, spacing: DesignTokens.spacing12) {
              Text("Coherence Trend")
                .font(.system(size: 12, weight: .semibold))
                .foregroundColor(DesignTokens.textSecondary)

              // Simple bar chart representation
              HStack(alignment: .bottom, spacing: 4) {
                ForEach(0..<7, id: \.self) { i in
                  VStack(spacing: 0) {
                    RoundedRectangle(cornerRadius: 2)
                      .fill(DesignTokens.brandBlue)
                      .frame(height: CGFloat.random(in: 20...60))

                    Text("D\(i+1)")
                      .font(.system(size: 10))
                      .foregroundColor(DesignTokens.textSecondary)
                  }
                }
              }
              .frame(maxWidth: .infinity)
              .frame(height: 100)
            }
            .padding(DesignTokens.spacing12)
            .background(DesignTokens.surface1)
            .cornerRadius(DesignTokens.radiusSmall)
          }

        } else if viewModel.isLoading {
          ProgressView()
            .frame(maxWidth: .infinity)
            .frame(height: 200)
        }

        Spacer()
      }
      .padding(DesignTokens.spacing16)
    }
    .onAppear {
      viewModel.loadCoherence()
    }
    .alert("Error", isPresented: $viewModel.showError, presenting: viewModel.error) { _ in
      Button("OK") { viewModel.showError = false }
    } message: { error in
      Text(error)
    }
  }
}

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

#Preview {
  CoherenceView()
    .preferredColorScheme(.dark)
}
