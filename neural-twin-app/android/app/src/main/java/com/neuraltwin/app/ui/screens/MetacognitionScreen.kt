package com.neuraltwin.app.ui.screens

import androidx.compose.animation.animateContentSize
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.TrendingUp
import androidx.compose.material.icons.filled.Lightbulb
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import com.neuraltwin.app.ui.composables.glassmorphism
import com.neuraltwin.app.ui.theme.DesignTokens
import com.neuraltwin.app.viewmodel.MetacognitionViewModel

@Composable
fun MetacognitionScreen(
  viewModel: MetacognitionViewModel = hiltViewModel()
) {
  val metrics by viewModel.metacognitiveMetrics.collectAsState()
  val currentPhase by viewModel.currentPhase.collectAsState()
  val phasePrompt by viewModel.phasePrompt.collectAsState()
  val patterns by viewModel.thinkingPatterns.collectAsState()
  val cognitiveLoad by viewModel.cognitiveLoad.collectAsState()

  LazyColumn(
    modifier = Modifier
      .fillMaxSize()
      .background(DesignTokens.Background)
      .padding(16.dp),
    verticalArrangement = Arrangement.spacedBy(16.dp)
  ) {
    // Header
    item {
      Column(modifier = Modifier.fillMaxWidth()) {
        Text(
          text = "Thinking About Your Thinking",
          fontSize = 28.sp,
          fontWeight = FontWeight.Bold,
          color = Color.White
        )
        Text(
          text = "Metacognitive awareness",
          fontSize = 14.sp,
          color = Color.Gray,
          modifier = Modifier.padding(top = 4.dp)
        )
      }
    }

    // Metacognitive Coherence (8th Layer)
    item {
      MetacognitiveCoherenceCard(
        coherence = metrics.metacognitiveCoherence,
        modifier = Modifier.fillMaxWidth()
      )
    }

    // 4 Pillars of Metacognition
    item {
      Column(modifier = Modifier.fillMaxWidth()) {
        Text(
          text = "4 Pillars of Thinking",
          fontSize = 16.sp,
          fontWeight = FontWeight.SemiBold,
          color = Color.White,
          modifier = Modifier.padding(bottom = 12.dp)
        )
        LazyRow(
          horizontalArrangement = Arrangement.spacedBy(12.dp),
          modifier = Modifier.fillMaxWidth()
        ) {
          item {
            MetacognitiveScoreCard(
              title = "Planning",
              emoji = "🎯",
              score = metrics.planningScore,
              description = "Goal clarity & strategy",
              phase = "planning",
              isActive = currentPhase == "planning",
              onPhaseSelect = { viewModel.updatePhase("planning") }
            )
          }
          item {
            MetacognitiveScoreCard(
              title = "Monitoring",
              emoji = "👁️",
              score = metrics.monitoringScore,
              description = "Awareness during thinking",
              phase = "monitoring",
              isActive = currentPhase == "monitoring",
              onPhaseSelect = { viewModel.updatePhase("monitoring") }
            )
          }
          item {
            MetacognitiveScoreCard(
              title = "Evaluating",
              emoji = "⚖️",
              score = metrics.evaluatingScore,
              description = "Critical assessment",
              phase = "evaluating",
              isActive = currentPhase == "evaluating",
              onPhaseSelect = { viewModel.updatePhase("evaluating") }
            )
          }
          item {
            MetacognitiveScoreCard(
              title = "Reflecting",
              emoji = "🪞",
              score = metrics.reflectingScore,
              description = "Learning integration",
              phase = "reflecting",
              isActive = currentPhase == "reflecting",
              onPhaseSelect = { viewModel.updatePhase("reflecting") }
            )
          }
        }
      }
    }

    // Current Phase Guidance
    item {
      phasePrompt?.let { prompt ->
        PhaseGuidanceCard(
          phase = prompt.phase,
          prompt = prompt.prompt,
          examples = prompt.examples,
          focusAreas = prompt.focusAreas,
          modifier = Modifier.fillMaxWidth()
        )
      }
    }

    // Cognitive Load
    item {
      CognitiveLoadCard(
        load = cognitiveLoad,
        onLoadChange = { viewModel.updateCognitiveLoad(it) },
        modifier = Modifier.fillMaxWidth()
      )
    }

    // Thinking Patterns
    if (patterns.isNotEmpty()) {
      item {
        ThinkingPatternsCard(patterns = patterns, modifier = Modifier.fillMaxWidth())
      }
    }

    // Growth Areas & Recommendations
    item {
      GrowthAreasCard(modifier = Modifier.fillMaxWidth())
    }

    item { Spacer(modifier = Modifier.height(20.dp)) }
  }
}

@Composable
fun MetacognitiveCoherenceCard(
  coherence: Float,
  modifier: Modifier = Modifier
) {
  Box(
    modifier = modifier
      .height(180.dp)
      .glassmorphism(),
    contentAlignment = Alignment.Center
  ) {
    Column(
      horizontalAlignment = Alignment.CenterHorizontally,
      modifier = Modifier
        .fillMaxSize()
        .padding(24.dp)
    ) {
      Text(
        text = "Metacognitive Coherence",
        fontSize = 14.sp,
        color = Color.Gray
      )
      Text(
        text = String.format("%.0f%%", coherence),
        fontSize = 48.sp,
        fontWeight = FontWeight.Bold,
        color = DesignTokens.BrandBlue,
        modifier = Modifier.padding(8.dp)
      )
      Text(
        text = "Your thinking clarity across all domains",
        fontSize = 12.sp,
        color = Color.Gray
      )
    }
  }
}

@Composable
fun MetacognitiveScoreCard(
  title: String,
  emoji: String,
  score: Float,
  description: String,
  phase: String,
  isActive: Boolean,
  onPhaseSelect: () -> Unit,
  modifier: Modifier = Modifier
) {
  Column(
    modifier = modifier
      .width(140.dp)
      .height(160.dp)
      .clip(shape = RoundedCornerShape(16.dp))
      .background(
        if (isActive) Color(0xFF1A4D7D) else DesignTokens.Surface1
      )
      .border(
        width = 1.5.dp,
        color = if (isActive) DesignTokens.BrandBlue else Color.White.copy(0.1f),
        shape = RoundedCornerShape(16.dp)
      )
      .clickable { onPhaseSelect() }
      .padding(12.dp),
    horizontalAlignment = Alignment.CenterHorizontally,
    verticalArrangement = Arrangement.SpaceEvenly
  ) {
    Text(text = emoji, fontSize = 28.sp)
    Text(
      text = title,
      fontSize = 14.sp,
      fontWeight = FontWeight.SemiBold,
      color = Color.White
    )
    Text(
      text = String.format("%.0f%%", score * 100),
      fontSize = 20.sp,
      fontWeight = FontWeight.Bold,
      color = if (score > 0.7f) Color(0xFF4ADE80) else DesignTokens.BrandBlue
    )
    Text(
      text = description,
      fontSize = 10.sp,
      color = Color.Gray,
      maxLines = 1
    )
  }
}

@Composable
fun PhaseGuidanceCard(
  phase: String,
  prompt: String,
  examples: List<String>,
  focusAreas: List<String>,
  modifier: Modifier = Modifier
) {
  var expanded by remember { mutableStateOf(false) }

  Card(
    modifier = modifier
      .clip(RoundedCornerShape(16.dp))
      .glassmorphism()
      .animateContentSize(),
    shape = RoundedCornerShape(16.dp)
  ) {
    Column(
      modifier = Modifier
        .fillMaxWidth()
        .padding(16.dp)
    ) {
      Row(
        modifier = Modifier
          .fillMaxWidth()
          .clickable { expanded = !expanded },
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
      ) {
        Column(modifier = Modifier.weight(1f)) {
          Text(
            text = "Focus: ${phase.replaceFirstChar { it.uppercase() }}",
            fontSize = 14.sp,
            fontWeight = FontWeight.SemiBold,
            color = Color.White
          )
          Text(
            text = prompt,
            fontSize = 12.sp,
            color = Color.Gray,
            modifier = Modifier.padding(top = 4.dp)
          )
        }
        Icon(
          imageVector = Icons.Default.TrendingUp,
          contentDescription = null,
          tint = DesignTokens.BrandBlue,
          modifier = Modifier.size(20.dp)
        )
      }

      if (expanded) {
        Divider(
          color = Color.White.copy(0.1f),
          modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 12.dp)
        )

        Text(
          text = "Examples:",
          fontSize = 12.sp,
          fontWeight = FontWeight.SemiBold,
          color = Color.White,
          modifier = Modifier.padding(bottom = 8.dp)
        )
        examples.forEach { example ->
          Text(
            text = "• $example",
            fontSize = 11.sp,
            color = Color.Gray,
            modifier = Modifier.padding(bottom = 4.dp)
          )
        }

        Text(
          text = "Focus Areas:",
          fontSize = 12.sp,
          fontWeight = FontWeight.SemiBold,
          color = Color.White,
          modifier = Modifier.padding(top = 12.dp, bottom = 8.dp)
        )
        focusAreas.forEach { area ->
          Text(
            text = "• $area",
            fontSize = 11.sp,
            color = Color.Gray,
            modifier = Modifier.padding(bottom = 4.dp)
          )
        }
      }
    }
  }
}

@Composable
fun CognitiveLoadCard(
  load: Float,
  onLoadChange: (Float) -> Unit,
  modifier: Modifier = Modifier
) {
  Card(
    modifier = modifier
      .clip(RoundedCornerShape(16.dp))
      .glassmorphism(),
    shape = RoundedCornerShape(16.dp)
  ) {
    Column(
      modifier = Modifier
        .fillMaxWidth()
        .padding(16.dp)
    ) {
      Text(
        text = "Mental Effort Right Now",
        fontSize = 14.sp,
        fontWeight = FontWeight.SemiBold,
        color = Color.White,
        modifier = Modifier.padding(bottom = 8.dp)
      )
      Text(
        text = String.format("%.0f%% Engaged", load * 100),
        fontSize = 12.sp,
        color = Color.Gray,
        modifier = Modifier.padding(bottom = 12.dp)
      )
      Slider(
        value = load,
        onValueChange = onLoadChange,
        valueRange = 0f..1f,
        modifier = Modifier.fillMaxWidth()
      )
      Row(
        modifier = Modifier
          .fillMaxWidth()
          .padding(top = 8.dp),
        horizontalArrangement = Arrangement.SpaceBetween
      ) {
        Text("Low effort", fontSize = 10.sp, color = Color.Gray)
        Text("High effort", fontSize = 10.sp, color = Color.Gray)
      }
    }
  }
}

@Composable
fun ThinkingPatternsCard(
  patterns: Map<String, Any>,
  modifier: Modifier = Modifier
) {
  Card(
    modifier = modifier
      .clip(RoundedCornerShape(16.dp))
      .glassmorphism(),
    shape = RoundedCornerShape(16.dp)
  ) {
    Column(
      modifier = Modifier
        .fillMaxWidth()
        .padding(16.dp)
    ) {
      Row(
        verticalAlignment = Alignment.CenterVertically,
        modifier = Modifier.padding(bottom = 12.dp)
      ) {
        Icon(
          imageVector = Icons.Default.Lightbulb,
          contentDescription = null,
          tint = DesignTokens.AccentPurple,
          modifier = Modifier.size(20.dp)
        )
        Text(
          text = "Your Thinking Patterns",
          fontSize = 14.sp,
          fontWeight = FontWeight.SemiBold,
          color = Color.White,
          modifier = Modifier.padding(start = 8.dp)
        )
      }

      patterns["averagePlanning"]?.let {
        PatternRow("Planning avg", (it as? Double)?.toFloat() ?: 0f)
      }
      patterns["averageMonitoring"]?.let {
        PatternRow("Monitoring avg", (it as? Double)?.toFloat() ?: 0f)
      }
      patterns["reflectionDepth"]?.let {
        PatternRow("Reflection depth", (it as? Float) ?: 0f)
      }
    }
  }
}

@Composable
fun PatternRow(label: String, value: Float) {
  Row(
    modifier = Modifier
      .fillMaxWidth()
      .padding(vertical = 4.dp),
    horizontalArrangement = Arrangement.SpaceBetween,
    verticalAlignment = Alignment.CenterVertically
  ) {
    Text(label, fontSize = 12.sp, color = Color.Gray)
    Text(
      String.format("%.1f/10", value),
      fontSize = 12.sp,
      fontWeight = FontWeight.SemiBold,
      color = DesignTokens.BrandBlue
    )
  }
}

@Composable
fun GrowthAreasCard(modifier: Modifier = Modifier) {
  Card(
    modifier = modifier
      .clip(RoundedCornerShape(16.dp))
      .glassmorphism(),
    shape = RoundedCornerShape(16.dp)
  ) {
    Column(
      modifier = Modifier
        .fillMaxWidth()
        .padding(16.dp)
    ) {
      Text(
        text = "Growth Opportunities",
        fontSize = 14.sp,
        fontWeight = FontWeight.SemiBold,
        color = Color.White,
        modifier = Modifier.padding(bottom = 12.dp)
      )

      listOf(
        "Strengthen planning clarity exercises",
        "Practice real-time thought monitoring",
        "Develop systematic evaluation frameworks"
      ).forEach { area ->
        Row(
          modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp),
          verticalAlignment = Alignment.CenterVertically
        ) {
          Text("→", fontSize = 14.sp, color = DesignTokens.BrandBlue)
          Text(
            area,
            fontSize = 12.sp,
            color = Color.Gray,
            modifier = Modifier.padding(start = 8.dp)
          )
        }
      }
    }
  }
}
