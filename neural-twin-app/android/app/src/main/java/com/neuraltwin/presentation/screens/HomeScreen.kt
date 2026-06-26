package com.neuraltwin.presentation.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.viewmodel.compose.viewModel
import com.neuraltwin.app.data.models.VoiceRecordingItem
import com.neuraltwin.app.data.models.DecisionItem
import com.neuraltwin.app.viewmodel.HomeViewModel
import com.neuraltwin.app.viewmodel.CoherenceViewModel
import com.neuraltwin.app.data.network.TokenStore
import com.neuraltwin.presentation.theme.BrandBlue
import com.neuraltwin.presentation.theme.Surface1
import com.neuraltwin.presentation.theme.Surface2
import com.neuraltwin.presentation.theme.TextSecondary

@Composable
fun HomeScreen(
  viewModel: HomeViewModel = hiltViewModel(),
  coherenceViewModel: CoherenceViewModel = hiltViewModel()
) {
  val userName by viewModel.userName.collectAsState()
  val coherenceScore by coherenceViewModel.coherenceScore.collectAsState(initial = 0)
  val coherenceLoading by coherenceViewModel.isLoading.collectAsState()
  val coherenceError by coherenceViewModel.error.collectAsState()
  val recordingCount by viewModel.recordingCount.collectAsState()
  val decisionCount by viewModel.decisionCount.collectAsState()
  val recentRecordings by viewModel.recentRecordings.collectAsState()
  val recentDecisions by viewModel.recentDecisions.collectAsState()

  LaunchedEffect(Unit) {
    TokenStore.userId?.let { userId ->
      coherenceViewModel.getCoherence(userId)
    }
  }

  Box(
    modifier = Modifier
      .fillMaxSize()
      .background(Color.Black)
  ) {
    LazyColumn(
      modifier = Modifier.fillMaxSize(),
      contentPadding = PaddingValues(16.dp),
      verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
      item {
        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
          Text(
            "Welcome back",
            fontSize = 14.sp,
            color = TextSecondary
          )
          Text(
            userName,
            fontSize = 28.sp,
            fontWeight = FontWeight.Bold,
            color = Color.White
          )
        }
      }

      // Coherence score card
      item {
        Card(
          modifier = Modifier.fillMaxWidth(),
          colors = CardDefaults.cardColors(containerColor = Surface1),
          shape = RoundedCornerShape(16.dp)
        ) {
          Column(
            modifier = Modifier
              .fillMaxWidth()
              .padding(20.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
          ) {
            Text(
              "Overall Coherence",
              fontSize = 13.sp,
              color = TextSecondary,
              fontWeight = FontWeight.SemiBold
            )

            if (coherenceLoading) {
              Box(
                modifier = Modifier
                  .fillMaxWidth()
                  .height(120.dp),
                contentAlignment = Alignment.Center
              ) {
                CircularProgressIndicator()
              }
            } else if (coherenceError != null) {
              Box(
                modifier = Modifier
                  .fillMaxWidth()
                  .height(120.dp),
                contentAlignment = Alignment.Center
              ) {
                Text(
                  coherenceError ?: "Error loading coherence",
                  fontSize = 12.sp,
                  color = Color(0xFFFF3B30),
                  textAlign = TextAlign.Center
                )
              }
            } else {
              Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
              ) {
                Text(
                  "$coherenceScore%",
                  fontSize = 48.sp,
                  fontWeight = FontWeight.Bold,
                  color = when {
                    coherenceScore >= 80 -> Color(0xFF34C759)
                    coherenceScore >= 60 -> Color(0xFFFF9500)
                    else -> Color(0xFFFF3B30)
                  }
                )

                Box(
                  modifier = Modifier
                    .size(100.dp),
                  contentAlignment = Alignment.Center
                ) {
                  CircularProgressIndicator(
                    progress = { (coherenceScore / 100f).coerceIn(0f, 1f) },
                    modifier = Modifier.size(100.dp),
                    color = when {
                      coherenceScore >= 80 -> Color(0xFF34C759)
                      coherenceScore >= 60 -> Color(0xFFFF9500)
                      else -> Color(0xFFFF3B30)
                    },
                    trackColor = Surface2,
                    strokeWidth = 6.dp
                  )
                }
              }
            }
          }
        }
      }

      // Activity cards
      item {
        Row(
          modifier = Modifier.fillMaxWidth(),
          horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
          StatCard(
            title = "Recordings",
            value = recordingCount.toString(),
            icon = "🎤",
            modifier = Modifier.weight(1f)
          )

          StatCard(
            title = "Decisions",
            value = decisionCount.toString(),
            icon = "📋",
            modifier = Modifier.weight(1f)
          )
        }
      }

      // Recent recordings
      if (recentRecordings.isNotEmpty()) {
        item {
          Text(
            "Recent Recordings",
            fontSize = 14.sp,
            fontWeight = FontWeight.SemiBold,
            color = Color.White
          )
        }

        items(recentRecordings.take(3)) { recording ->
          RecentRecordingCard(recording)
        }
      }

      // Recent decisions
      if (recentDecisions.isNotEmpty()) {
        item {
          Text(
            "Recent Decisions",
            fontSize = 14.sp,
            fontWeight = FontWeight.SemiBold,
            color = Color.White
          )
        }

        items(recentDecisions.take(3)) { decision ->
          RecentDecisionCard(decision)
        }
      }

      item {
        Spacer(modifier = Modifier.height(16.dp))
      }
    }
  }
}

@Composable
fun StatCard(
  title: String,
  value: String,
  icon: String,
  modifier: Modifier = Modifier
) {
  Card(
    modifier = modifier
      .height(120.dp),
    colors = CardDefaults.cardColors(containerColor = Surface1),
    shape = RoundedCornerShape(16.dp)
  ) {
    Column(
      modifier = Modifier
        .fillMaxSize()
        .padding(16.dp),
      verticalArrangement = Arrangement.SpaceBetween,
      horizontalAlignment = Alignment.Start
    ) {
      Text(
        icon,
        fontSize = 24.sp
      )

      Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
        Text(
          value,
          fontSize = 28.sp,
          fontWeight = FontWeight.Bold,
          color = Color.White
        )

        Text(
          title,
          fontSize = 12.sp,
          color = TextSecondary,
          fontWeight = FontWeight.SemiBold
        )
      }
    }
  }
}

@Composable
fun RecentRecordingCard(recording: VoiceRecordingItem) {
  Card(
    modifier = Modifier.fillMaxWidth(),
    colors = CardDefaults.cardColors(containerColor = Surface1),
    shape = RoundedCornerShape(12.dp)
  ) {
    Row(
      modifier = Modifier
        .fillMaxWidth()
        .padding(12.dp),
      verticalAlignment = Alignment.CenterVertically,
      horizontalArrangement = Arrangement.spacedBy(12.dp)
    ) {
      Box(
        modifier = Modifier
          .size(40.dp)
          .clip(CircleShape)
          .background(
            brush = Brush.linearGradient(
              colors = listOf(BrandBlue, Color(0xFFB000FF))
            )
          ),
        contentAlignment = Alignment.Center
      ) {
        Text(
          "🎤",
          fontSize = 20.sp
        )
      }

      Column(modifier = Modifier.weight(1f)) {
        Text(
          "Recording",
          fontSize = 13.sp,
          fontWeight = FontWeight.SemiBold,
          color = Color.White
        )

        Text(
          recording.createdAt.toString(),
          fontSize = 11.sp,
          color = TextSecondary
        )
      }

      Text(
        "${String.format("%.0f%%", recording.emotionScore * 100)}",
        fontSize = 14.sp,
        fontWeight = FontWeight.Bold,
        color = Color(0xFF34C759)
      )
    }
  }
}

@Composable
fun RecentDecisionCard(decision: DecisionItem) {
  Card(
    modifier = Modifier.fillMaxWidth(),
    colors = CardDefaults.cardColors(containerColor = Surface1),
    shape = RoundedCornerShape(12.dp)
  ) {
    Row(
      modifier = Modifier
        .fillMaxWidth()
        .padding(12.dp),
      verticalAlignment = Alignment.CenterVertically,
      horizontalArrangement = Arrangement.spacedBy(12.dp)
    ) {
      Box(
        modifier = Modifier
          .size(40.dp)
          .clip(CircleShape)
          .background(
            brush = Brush.linearGradient(
              colors = listOf(BrandBlue, Color(0xFFB000FF))
            )
          ),
        contentAlignment = Alignment.Center
      ) {
        Text(
          "📋",
          fontSize = 20.sp
        )
      }

      Column(modifier = Modifier.weight(1f)) {
        Text(
          decision.title,
          fontSize = 13.sp,
          fontWeight = FontWeight.SemiBold,
          color = Color.White,
          maxLines = 1
        )

        Text(
          decision.category,
          fontSize = 11.sp,
          color = TextSecondary
        )
      }

      val scoreColor = when {
        decision.metacognitiveScore >= 80 -> Color(0xFF34C759)
        decision.metacognitiveScore >= 60 -> Color(0xFFFF9500)
        else -> Color(0xFFFF3B30)
      }

      Text(
        "${decision.metacognitiveScore.toInt()}",
        fontSize = 14.sp,
        fontWeight = FontWeight.Bold,
        color = scoreColor
      )
    }
  }
}
