import SwiftUI

// ============================================================================
// DECISION LOGGING VIEW - Log decisions, track metacognitive pillars
// ============================================================================

@MainActor
class DecisionLoggingViewModel: ObservableObject {
  // Form fields
  @Published var title = ""
  @Published var description = ""
  @Published var category = "general"
  @Published var chosenOption = ""
  @Published var reasoning = ""

  // Metacognitive sliders (1-10 scale)
  @Published var planningClarity: Double = 5
  @Published var monitoringComprehension: Double = 5
  @Published var evaluationEffectiveness: Double = 5
  @Published var reflectionInsights = ""

  // UI state
  @Published var decisions: [DecisionItem] = []
  @Published var selectedDecision: DecisionResponse?
  @Published var isLoading = false
  @Published var isSaving = false
  @Published var error: String?
  @Published var showError = false
  @Published var showSuccessMessage = false
  @Published var successMessage = ""

  private let apiClient = APIClient.shared

  let categories = ["general", "career", "personal", "health", "financial", "relationship", "creative"]

  // MARK: - Decision Submission with Full Data
  func submitDecision() {
    // Validate required fields
    guard !title.isEmpty else {
      error = "Decision title is required"
      showError = true
      return
    }

    guard !chosenOption.isEmpty else {
      error = "Please specify what you decided"
      showError = true
      return
    }

    guard !reasoning.isEmpty else {
      error = "Please explain why you chose this option"
      showError = true
      return
    }

    isSaving = true
    error = nil

    Task {
      do {
        let response = try await apiClient.logDecision(
          title: title,
          description: description.isEmpty ? title : description,
          category: category,
          chosenOption: chosenOption,
          reasoning: reasoning,
          planningClarity: Int(planningClarity),
          monitoringComprehension: Int(monitoringComprehension),
          evaluationEffectiveness: Int(evaluationEffectiveness),
          reflectionInsights: reflectionInsights.isEmpty ? nil : reflectionInsights
        )

        // Display the response with metacognitive breakdown
        selectedDecision = response
        successMessage = "Decision logged successfully! Score: \(String(format: "%.0f%%", response.metacognitiveScore))"
        showSuccessMessage = true

        // Reset form
        resetForm()

        // Reload decisions list
        await loadDecisions()

      } catch {
        self.error = "Failed to log decision: \(error.localizedDescription)"
        self.showError = true
      }

      isSaving = false
    }
  }

  // MARK: - Load Decisions from Cache
  func loadDecisions() async {
    isLoading = true

    Task {
      do {
        let response = try await apiClient.getDecisions()
        decisions = response.decisions
      } catch {
        self.error = "Failed to load decisions: \(error.localizedDescription)"
        self.showError = true
      }

      isLoading = false
    }
  }

  // MARK: - Form Reset
  func resetForm() {
    title = ""
    description = ""
    category = "general"
    chosenOption = ""
    reasoning = ""
    planningClarity = 5
    monitoringComprehension = 5
    evaluationEffectiveness = 5
    reflectionInsights = ""
  }

  // MARK: - Calculate Metacognitive Score
  /// Weighted score calculation:
  /// - Planning (25%): how clear was thinking before deciding
  /// - Monitoring (25%): comprehension during decision process
  /// - Evaluation (25%): thoroughness of option evaluation
  /// - Reflection (25%): bonus if reflection provided
  func calculateMetacognitiveScore() -> Double {
    let planning = planningClarity / 10.0 * 0.25
    let monitoring = monitoringComprehension / 10.0 * 0.25
    let evaluation = evaluationEffectiveness / 10.0 * 0.25
    let reflection = reflectionInsights.isEmpty ? 0.0 : 0.25
    return (planning + monitoring + evaluation + reflection) * 100
  }

  // MARK: - Get Metacognitive Breakdown per Pillar
  func getMetacognitiveBreakdown() -> (planning: Double, monitoring: Double, evaluation: Double) {
    return (
      planning: planningClarity / 10.0 * 100,
      monitoring: monitoringComprehension / 10.0 * 100,
      evaluation: evaluationEffectiveness / 10.0 * 100
    )
  }

  // MARK: - Score Color Helper
  func scoreColor(_ score: Double) -> Color {
    if score >= 80 {
      return DesignTokens.successGreen
    } else if score >= 60 {
      return DesignTokens.warningOrange
    } else {
      return DesignTokens.errorRed
    }
  }
}

struct DecisionLoggingView: View {
  @StateObject private var viewModel = DecisionLoggingViewModel()
  @State private var showForm = false

  var body: some View {
    ZStack {
      DesignTokens.background.ignoresSafeArea()

      VStack(spacing: 0) {
        // Header with navigation
        HStack {
          VStack(alignment: .leading, spacing: DesignTokens.spacing4) {
            Text("Decision Log")
              .font(.system(size: 28, weight: .bold))
              .foregroundColor(.white)

            Text("Track your thinking & metacognitive progress")
              .font(.system(size: 12, weight: .regular))
              .foregroundColor(DesignTokens.textSecondary)
          }

          Spacer()

          Button(action: { withAnimation(.spring(response: 0.3, dampingFraction: 0.7)) { showForm.toggle() } }) {
            Image(systemName: showForm ? "xmark.circle.fill" : "plus.circle.fill")
              .font(.system(size: 24))
              .foregroundColor(DesignTokens.brandBlue)
          }
        }
        .padding(DesignTokens.spacing16)
        .background(DesignTokens.surface1)

        // Form or list view
        if showForm {
          DecisionForm(viewModel: viewModel, showForm: $showForm)
            .transition(.move(edge: .bottom).combined(with: .opacity))
        } else {
          DecisionsList(viewModel: viewModel)
            .transition(.move(edge: .top).combined(with: .opacity))
        }

        if let selectedDecision = viewModel.selectedDecision {
          Divider()
            .background(Color.white.opacity(0.1))

          DecisionDetailView(decision: selectedDecision, viewModel: viewModel)
            .frame(maxHeight: 240)
            .transition(.move(edge: .bottom).combined(with: .opacity))
        }
      }
    }
    .onAppear {
      Task {
        await viewModel.loadDecisions()
      }
    }
    .alert("Error", isPresented: $viewModel.showError, presenting: viewModel.error) { _ in
      Button("OK") { viewModel.showError = false }
    } message: { error in
      Text(error)
    }
    .alert("Success", isPresented: $viewModel.showSuccessMessage) {
      Button("OK") { viewModel.showSuccessMessage = false }
    } message: {
      Text(viewModel.successMessage)
    }
  }
}

struct DecisionForm: View {
  @ObservedObject var viewModel: DecisionLoggingViewModel
  @Binding var showForm: Bool

  var body: some View {
    ScrollView {
      VStack(spacing: DesignTokens.spacing16) {
        // MARK: - Decision Title (Required)
        FormField(
          label: "Decision Title",
          placeholder: "What decision are you making?",
          value: $viewModel.title,
          isRequired: true
        )

        // MARK: - Category Picker
        VStack(alignment: .leading, spacing: DesignTokens.spacing8) {
          HStack {
            Text("Category")
              .font(.system(size: 12, weight: .semibold))
              .foregroundColor(DesignTokens.textSecondary)

            Text("*")
              .foregroundColor(DesignTokens.errorRed)
          }

          Picker("Category", selection: $viewModel.category) {
            ForEach(viewModel.categories, id: \.self) { cat in
              Text(cat.capitalized).tag(cat)
            }
          }
          .pickerStyle(.segmented)
          .tint(DesignTokens.brandBlue)
        }

        // MARK: - Description (Optional)
        FormTextEditor(
          label: "Context",
          placeholder: "Additional context for this decision",
          value: $viewModel.description,
          height: 70
        )

        Divider()
          .background(Color.white.opacity(0.1))
          .padding(.vertical, DesignTokens.spacing8)

        // MARK: - Chosen Option (Required)
        FormField(
          label: "What did you decide?",
          placeholder: "The specific option you chose",
          value: $viewModel.chosenOption,
          isRequired: true
        )

        // MARK: - Reasoning (Required)
        FormTextEditor(
          label: "Why this choice?",
          placeholder: "Explain your reasoning and key factors",
          value: $viewModel.reasoning,
          height: 80,
          isRequired: true
        )

        Divider()
          .background(Color.white.opacity(0.1))
          .padding(.vertical, DesignTokens.spacing8)

        // MARK: - Metacognitive Pillars Section
        VStack(spacing: DesignTokens.spacing16) {
          VStack(alignment: .leading, spacing: DesignTokens.spacing4) {
            Text("Metacognitive Assessment")
              .font(.system(size: 14, weight: .semibold))
              .foregroundColor(DesignTokens.textPrimary)

            Text("Rate your thinking clarity on each pillar")
              .font(.system(size: 11, weight: .regular))
              .foregroundColor(DesignTokens.textSecondary)
          }
          .frame(maxWidth: .infinity, alignment: .leading)

          // Planning Clarity (1-10)
          MetacognitiveSlider(
            label: "Planning Clarity",
            value: $viewModel.planningClarity,
            description: "How clear was your thinking before deciding?",
            minValue: 1,
            maxValue: 10
          )

          // Monitoring Comprehension (1-10)
          MetacognitiveSlider(
            label: "Monitoring Comprehension",
            value: $viewModel.monitoringComprehension,
            description: "How well did you track the decision process?",
            minValue: 1,
            maxValue: 10
          )

          // Evaluation Effectiveness (1-10)
          MetacognitiveSlider(
            label: "Evaluation Effectiveness",
            value: $viewModel.evaluationEffectiveness,
            description: "How thoroughly did you evaluate options?",
            minValue: 1,
            maxValue: 10
          )
        }
        .padding(DesignTokens.spacing12)
        .background(DesignTokens.surface1)
        .cornerRadius(DesignTokens.radiusSmall)

        // MARK: - Reflection Insights (Optional)
        FormTextEditor(
          label: "Reflection",
          placeholder: "How might this decision affect future thinking?",
          value: $viewModel.reflectionInsights,
          height: 60
        )

        // MARK: - Score Preview Card
        DecisionScorePreview(viewModel: viewModel)

        // MARK: - Action Buttons
        VStack(spacing: DesignTokens.spacing12) {
          // Submit button
          Button(action: viewModel.submitDecision) {
            HStack(spacing: DesignTokens.spacing8) {
              if viewModel.isSaving {
                ProgressView()
                  .tint(.white)
              } else {
                Image(systemName: "checkmark.circle.fill")
                  .font(.system(size: 16, weight: .semibold))
              }
              Text(viewModel.isSaving ? "Logging..." : "Log Decision")
                .font(.system(size: 16, weight: .semibold))
            }
            .frame(maxWidth: .infinity)
            .frame(height: 56)
            .foregroundColor(.white)
            .background(DesignTokens.brandBlue)
            .cornerRadius(DesignTokens.radiusMedium)
          }
          .disabled(viewModel.isSaving)

          // Cancel button
          Button(action: {
            withAnimation(.spring(response: 0.3, dampingFraction: 0.7)) {
              showForm = false
            }
          }) {
            Text("Cancel")
              .font(.system(size: 14, weight: .semibold))
              .frame(maxWidth: .infinity)
              .frame(height: 44)
              .foregroundColor(DesignTokens.textSecondary)
              .background(DesignTokens.surface1)
              .cornerRadius(DesignTokens.radiusSmall)
          }
        }
      }
      .padding(DesignTokens.spacing16)
      .background(DesignTokens.background)
    }
  }
}

// MARK: - Helper Components

struct FormField: View {
  let label: String
  let placeholder: String
  @Binding var value: String
  var isRequired: Bool = false

  var body: some View {
    VStack(alignment: .leading, spacing: DesignTokens.spacing8) {
      HStack {
        Text(label)
          .font(.system(size: 12, weight: .semibold))
          .foregroundColor(DesignTokens.textSecondary)

        if isRequired {
          Text("*")
            .foregroundColor(DesignTokens.errorRed)
        }
      }

      TextField(placeholder, text: $value)
        .font(.system(size: 14, weight: .regular))
        .foregroundColor(DesignTokens.textPrimary)
        .padding(DesignTokens.spacing12)
        .background(DesignTokens.surface2)
        .cornerRadius(DesignTokens.radiusSmall)
    }
  }
}

struct FormTextEditor: View {
  let label: String
  let placeholder: String
  @Binding var value: String
  let height: CGFloat
  var isRequired: Bool = false

  var body: some View {
    VStack(alignment: .leading, spacing: DesignTokens.spacing8) {
      HStack {
        Text(label)
          .font(.system(size: 12, weight: .semibold))
          .foregroundColor(DesignTokens.textSecondary)

        if isRequired {
          Text("*")
            .foregroundColor(DesignTokens.errorRed)
        }
      }

      ZStack(alignment: .topLeading) {
        TextEditor(text: $value)
          .font(.system(size: 14, weight: .regular))
          .foregroundColor(DesignTokens.textPrimary)
          .frame(height: height)
          .padding(DesignTokens.spacing8)
          .background(DesignTokens.surface2)
          .cornerRadius(DesignTokens.radiusSmall)

        if value.isEmpty {
          Text(placeholder)
            .font(.system(size: 14, weight: .regular))
            .foregroundColor(DesignTokens.textSecondary)
            .padding(DesignTokens.spacing12)
            .pointer(enabled: false)
        }
      }
    }
  }
}

struct DecisionScorePreview: View {
  @ObservedObject var viewModel: DecisionLoggingViewModel

  var body: some View {
    let score = viewModel.calculateMetacognitiveScore()
    let breakdown = viewModel.getMetacognitiveBreakdown()

    VStack(spacing: DesignTokens.spacing12) {
      // Overall score
      VStack(spacing: DesignTokens.spacing8) {
        Text("Projected Metacognitive Score")
          .font(.system(size: 12, weight: .semibold))
          .foregroundColor(DesignTokens.textSecondary)
          .frame(maxWidth: .infinity, alignment: .leading)

        HStack(alignment: .center, spacing: DesignTokens.spacing16) {
          Text(String(format: "%.0f%%", score))
            .font(.system(size: 36, weight: .bold))
            .foregroundColor(viewModel.scoreColor(score))

          VStack(alignment: .leading, spacing: DesignTokens.spacing4) {
            ScoreBreakdownBadge(label: "Planning", value: Int(breakdown.planning), color: DesignTokens.accentPurple)
            ScoreBreakdownBadge(label: "Monitoring", value: Int(breakdown.monitoring), color: DesignTokens.accentPink)
            ScoreBreakdownBadge(label: "Evaluation", value: Int(breakdown.evaluation), color: DesignTokens.brandBlue)
          }

          Spacer()
        }
      }
      .padding(DesignTokens.spacing12)
      .background(DesignTokens.surface1)
      .cornerRadius(DesignTokens.radiusSmall)
    }
  }
}

struct ScoreBreakdownBadge: View {
  let label: String
  let value: Int
  let color: Color

  var body: some View {
    HStack(spacing: 6) {
      Text(label)
        .font(.system(size: 10, weight: .semibold))
        .foregroundColor(DesignTokens.textSecondary)

      Text("\(value)%")
        .font(.system(size: 11, weight: .semibold))
        .foregroundColor(.white)
        .padding(.horizontal, 6)
        .padding(.vertical, 2)
        .background(color.opacity(0.3))
        .border(color.opacity(0.5), width: 0.5)
        .cornerRadius(4)
    }
  }
}

struct DecisionsList: View {
  @ObservedObject var viewModel: DecisionLoggingViewModel

  var body: some View {
    VStack(spacing: DesignTokens.spacing12) {
      if viewModel.isLoading {
        VStack(spacing: DesignTokens.spacing12) {
          ProgressView()
            .tint(DesignTokens.brandBlue)

          Text("Loading your decisions...")
            .font(.system(size: 12, weight: .regular))
            .foregroundColor(DesignTokens.textSecondary)
        }
        .frame(maxWidth: .infinity)
        .frame(height: 200)
      } else if viewModel.decisions.isEmpty {
        VStack(spacing: DesignTokens.spacing12) {
          Image(systemName: "lightbulb.slash")
            .font(.system(size: 48, weight: .light))
            .foregroundColor(DesignTokens.brandBlue)

          Text("No decisions logged yet")
            .font(.system(size: 16, weight: .semibold))
            .foregroundColor(DesignTokens.textPrimary)

          Text("Start tracking your thinking & build metacognitive awareness")
            .font(.system(size: 13, weight: .regular))
            .foregroundColor(DesignTokens.textSecondary)
            .multilineTextAlignment(.center)
        }
        .frame(maxWidth: .infinity)
        .frame(height: 220)
        .background(DesignTokens.surface1)
        .cornerRadius(DesignTokens.radiusMedium)
        .padding(DesignTokens.spacing16)
      } else {
        ScrollView {
          VStack(spacing: DesignTokens.spacing12) {
            ForEach(viewModel.decisions, id: \.id) { decision in
              DecisionListItem(
                decision: decision,
                isSelected: viewModel.selectedDecision?.id == decision.id
              ) {
                withAnimation(.spring(response: 0.3, dampingFraction: 0.7)) {
                  viewModel.selectedDecision = decision
                }
              }
            }
          }
          .padding(DesignTokens.spacing16)
        }
      }
    }
    .frame(maxHeight: .infinity, alignment: .top)
  }
}

struct DecisionListItem: View {
  let decision: DecisionItem
  let isSelected: Bool
  let onSelect: () -> Void

  var body: some View {
    Button(action: onSelect) {
      VStack(alignment: .leading, spacing: DesignTokens.spacing8) {
        // Title and category
        HStack(spacing: DesignTokens.spacing8) {
          Text(decision.title)
            .font(.system(size: 14, weight: .semibold))
            .foregroundColor(DesignTokens.textPrimary)
            .lineLimit(2)

          Spacer()

          // Score badge
          VStack(alignment: .center, spacing: 2) {
            Text(String(format: "%.0f%%", decision.metacognitiveScore))
              .font(.system(size: 13, weight: .bold))
              .foregroundColor(.white)
          }
          .frame(width: 44, height: 44)
          .background(scoreColor(decision.metacognitiveScore).opacity(0.2))
          .border(scoreColor(decision.metacognitiveScore).opacity(0.5), width: 1)
          .cornerRadius(8)
        }

        // Metadata
        HStack(spacing: DesignTokens.spacing12) {
          Label(decision.category, systemImage: "tag.fill")
            .font(.system(size: 10, weight: .semibold))
            .foregroundColor(DesignTokens.textSecondary)

          Text("•")
            .foregroundColor(DesignTokens.textSecondary)

          Label(decision.createdAt.formatted(date: .abbreviated, time: .omitted), systemImage: "calendar")
            .font(.system(size: 10, weight: .semibold))
            .foregroundColor(DesignTokens.textSecondary)

          Spacer()

          // Mini pillar indicators
          HStack(spacing: 4) {
            MiniPillarIndicator(
              value: decision.planningClarity,
              color: DesignTokens.accentPurple
            )
            MiniPillarIndicator(
              value: decision.monitoringComprehension,
              color: DesignTokens.accentPink
            )
            MiniPillarIndicator(
              value: decision.evaluationEffectiveness,
              color: DesignTokens.brandBlue
            )
          }
        }
      }
      .padding(DesignTokens.spacing12)
      .background(isSelected ? DesignTokens.surface2 : DesignTokens.surface1)
      .cornerRadius(DesignTokens.radiusSmall)
      .overlay(
        isSelected ? RoundedRectangle(cornerRadius: DesignTokens.radiusSmall)
          .stroke(DesignTokens.brandBlue, lineWidth: 1)
          .opacity(0.5)
          : nil
      )
    }
  }

  private func scoreColor(_ score: Double) -> Color {
    if score >= 80 {
      return DesignTokens.successGreen
    } else if score >= 60 {
      return DesignTokens.warningOrange
    } else {
      return DesignTokens.errorRed
    }
  }
}

struct MiniPillarIndicator: View {
  let value: Int
  let color: Color

  var body: some View {
    VStack(spacing: 2) {
      RoundedRectangle(cornerRadius: 2)
        .fill(color)
        .frame(height: CGFloat(value) / 2)

      Spacer()
    }
    .frame(width: 6, height: 16)
    .background(Color.white.opacity(0.1))
    .cornerRadius(2)
  }
}

// MARK: - Decision Detail View
struct DecisionDetailView: View {
  let decision: DecisionResponse
  @ObservedObject var viewModel: DecisionLoggingViewModel

  var body: some View {
    ScrollView(.horizontal, showsIndicators: false) {
      VStack(alignment: .leading, spacing: DesignTokens.spacing12) {
        // Chosen option
        VStack(alignment: .leading, spacing: DesignTokens.spacing4) {
          Text("Your Decision")
            .font(.system(size: 11, weight: .semibold))
            .foregroundColor(DesignTokens.textSecondary)

          Text(decision.chosenOption)
            .font(.system(size: 13, weight: .semibold))
            .foregroundColor(DesignTokens.textPrimary)
            .lineLimit(2)
        }

        Divider()
          .background(Color.white.opacity(0.1))

        // Metacognitive breakdown
        VStack(alignment: .leading, spacing: DesignTokens.spacing8) {
          Text("Metacognitive Pillars")
            .font(.system(size: 11, weight: .semibold))
            .foregroundColor(DesignTokens.textSecondary)

          HStack(spacing: DesignTokens.spacing8) {
            PillarCard(
              label: "Planning",
              value: decision.planningClarity,
              color: DesignTokens.accentPurple
            )

            PillarCard(
              label: "Monitoring",
              value: decision.monitoringComprehension,
              color: DesignTokens.accentPink
            )

            PillarCard(
              label: "Evaluation",
              value: decision.evaluationEffectiveness,
              color: DesignTokens.brandBlue
            )
          }
        }

        Spacer()
      }
      .padding(DesignTokens.spacing12)
      .background(DesignTokens.surface1)
      .cornerRadius(DesignTokens.radiusSmall)
    }
  }
}

struct PillarCard: View {
  let label: String
  let value: Int
  let color: Color

  var body: some View {
    VStack(spacing: 4) {
      Text(String(value))
        .font(.system(size: 16, weight: .bold))
        .foregroundColor(color)

      Text(label)
        .font(.system(size: 10, weight: .semibold))
        .foregroundColor(DesignTokens.textSecondary)

      Text("/10")
        .font(.system(size: 9, weight: .regular))
        .foregroundColor(DesignTokens.textSecondary)
    }
    .frame(maxWidth: .infinity)
    .padding(DesignTokens.spacing8)
    .background(color.opacity(0.1))
    .border(color.opacity(0.3), width: 0.5)
    .cornerRadius(DesignTokens.radiusSmall)
  }
}

struct MetacognitiveSlider: View {
  let label: String
  @Binding var value: Double
  let description: String
  var minValue: Double = 1
  var maxValue: Double = 10

  var body: some View {
    VStack(alignment: .leading, spacing: DesignTokens.spacing8) {
      // Header with label and current value
      HStack {
        Text(label)
          .font(.system(size: 13, weight: .semibold))
          .foregroundColor(DesignTokens.textPrimary)

        Spacer()

        HStack(spacing: 4) {
          Text(String(format: "%.0f", value))
            .font(.system(size: 16, weight: .bold))
            .foregroundColor(DesignTokens.brandBlue)

          Text("/ \(Int(maxValue))")
            .font(.system(size: 12, weight: .semibold))
            .foregroundColor(DesignTokens.textSecondary)
        }
      }

      // Slider
      Slider(value: $value, in: minValue...maxValue, step: 1)
        .tint(DesignTokens.brandBlue)

      // Tick marks and labels
      HStack(spacing: 0) {
        ForEach([1, 5, 10], id: \.self) { tick in
          VStack(spacing: 2) {
            Text(String(tick))
              .font(.system(size: 9, weight: .semibold))
              .foregroundColor(DesignTokens.textSecondary)
          }
          .frame(maxWidth: .infinity)
        }
      }
      .font(.system(size: 9, weight: .regular))

      // Description
      Text(description)
        .font(.system(size: 11, weight: .regular))
        .foregroundColor(DesignTokens.textSecondary)
        .lineLimit(2)
    }
  }
}

#Preview {
  DecisionLoggingView()
    .preferredColorScheme(.dark)
}
