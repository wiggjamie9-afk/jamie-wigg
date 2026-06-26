package com.neuraltwin.presentation.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
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
import com.neuraltwin.app.data.models.CoherenceResponse
import com.neuraltwin.app.viewmodel.CoherenceViewModel
import com.neuraltwin.presentation.theme.BrandBlue
import com.neuraltwin.presentation.theme.Surface1
import com.neuraltwin.presentation.theme.Surface2
import com.neuraltwin.presentation.theme.TextSecondary

@Composable
fun CoherenceScreen(
  viewModel: CoherenceViewModel = hiltViewModel()
) {
  var selectedTimeframe by remember { mutableStateOf("24h") }
  val isLoading by viewModel.isLoading.collectAsState()
  val coherence by viewModel.coherenceData.collectAsState()

  Box(
    modifier = Modifier
      .fillMaxSize()
      .background(Color.Black)
  ) {
    Column(
      modifier = Modifier
        .fillMaxSize()
        .verticalScroll(rememberScrollState())
    ) {
      // Header
      Text(
        "Coherence",
        fontSize = 28.sp,
        fontWeight = FontWeight.Bold,
        color = Color.White,
        modifier = Modifier
          .padding(16.dp)
          .fillMaxWidth()
      )

      // Overall coherence circle
      if (isLoading) {
        CircularProgressIndicator(
          modifier = Modifier
            .align(Alignment.CenterHorizontally)
            .padding(32.dp)
        )
      } else {
        coherence?.let {
        Card(
          modifier = Modifier
            .align(Alignment.CenterHorizontally)
            .padding(16.dp)
            .size(220.dp),
          colors = CardDefaults.cardColors(containerColor = Surface1),
          shape = RoundedCornerShape(20.dp)
        ) {
          Box(
            modifier = Modifier.fillMaxSize(),
            contentAlignment = Alignment.Center
          ) {
            val score = it.overallCoherence.toFloatOrNull() ?: 0f
            CircularProgressIndicator(
              progress = { (score / 100f).coerceIn(0f, 1f) },
              modifier = Modifier
                .size(200.dp)
                .padding(16.dp),
              color = when {
                score >= 80 -> Color(0xFF34C759)
                score >= 60 -> Color(0xFFFF9500)
                else -> Color(0xFFFF3B30)
              },
              trackColor = Surface2,
              strokeWidth = 8.dp
            )

            Column(
              modifier = Modifier.fillMaxSize(),
              verticalArrangement = Arrangement.Center,
              horizontalAlignment = Alignment.CenterHorizontally
            ) {
              Text(
                String.format("%.0f%%", score),
                fontSize = 48.sp,
                fontWeight = FontWeight.Bold,
                color = Color.White,
                textAlign = TextAlign.Center
              )
              Text(
                "Overall",
                fontSize = 14.sp,
                color = TextSecondary,
                textAlign = TextAlign.Center
              )
            }
          }
        }
      }

      // Timeframe selector
      Row(
        modifier = Modifier
          .fillMaxWidth()
          .padding(horizontal = 16.dp, vertical = 8.dp),
        horizontalArrangement = Arrangement.spacedBy(8.dp)
      ) {
        listOf("24h", "7d", "30d", "all").forEach { timeframe ->
          Button(
            onClick = { selectedTimeframe = timeframe },
            modifier = Modifier
              .weight(1f)
              .height(40.dp),
            colors = ButtonDefaults.buttonColors(
              containerColor = if (selectedTimeframe == timeframe) BrandBlue else Surface2
            ),
            shape = RoundedCornerShape(8.dp)
          ) {
            Text(
              timeframe,
              fontSize = 12.sp,
              fontWeight = FontWeight.SemiBold
            )
          }
        }
      }

      // 8-layer breakdown
      coherence?.let { data ->
        Card(
          modifier = Modifier
            .padding(16.dp)
            .fillMaxWidth(),
          colors = CardDefaults.cardColors(containerColor = Surface1),
          shape = RoundedCornerShape(16.dp)
        ) {
          Column(
            modifier = Modifier.padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
          ) {
            Text(
              "Coherence Layers",
              fontSize = 14.sp,
              fontWeight = FontWeight.SemiBold,
              color = TextSecondary
            )

            data.layers.forEachIndexed { index, layer ->
              CoherenceLayerRow(layer.name, layer.value.toDoubleOrNull() ?: 0.0)
            }
          }
        }
      }

      // Recommendations
      coherence?.let { data ->
        if (data.recommendations.isNotEmpty()) {
          Card(
            modifier = Modifier
              .padding(16.dp)
              .fillMaxWidth(),
            colors = CardDefaults.cardColors(containerColor = Surface1),
            shape = RoundedCornerShape(16.dp)
          ) {
            Column(
              modifier = Modifier.padding(16.dp),
              verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
              Text(
                "Recommendations",
                fontSize = 14.sp,
                fontWeight = FontWeight.SemiBold,
                color = TextSecondary
              )

              Text(
                data.recommendations,
                fontSize = 13.sp,
                color = Color.White,
                lineHeight = 18.sp,
                modifier = Modifier
                  .fillMaxWidth()
                  .padding(8.dp)
              )
            }
          }
        }
      }
    }
  }
}

@Composable
fun CoherenceLayerRow(
  label: String,
  score: Double,
  modifier: Modifier = Modifier
) {
  val percentage = (score * 100).toInt().coerceIn(0, 100)
  val color = when {
    percentage >= 80 -> Color(0xFF34C759)
    percentage >= 60 -> Color(0xFFFF9500)
    else -> Color(0xFFFF3B30)
  }

  Column(
    modifier = modifier.fillMaxWidth(),
    verticalArrangement = Arrangement.spacedBy(4.dp)
  ) {
    Row(
      modifier = Modifier.fillMaxWidth(),
      horizontalArrangement = Arrangement.SpaceBetween,
      verticalAlignment = Alignment.CenterVertically
    ) {
      Text(
        label,
        fontSize = 12.sp,
        fontWeight = FontWeight.SemiBold,
        color = Color.White,
        modifier = Modifier.weight(1f)
      )

      Text(
        "$percentage%",
        fontSize = 12.sp,
        fontWeight = FontWeight.SemiBold,
        color = color
      )
    }

    Box(
      modifier = Modifier
        .fillMaxWidth()
        .height(6.dp)
        .background(Surface2, shape = RoundedCornerShape(3.dp))
        .clip(RoundedCornerShape(3.dp))
    ) {
      Box(
        modifier = Modifier
          .fillMaxHeight()
          .fillMaxWidth((percentage / 100f).coerceIn(0f, 1f))
          .background(
            brush = Brush.linearGradient(
              colors = listOf(BrandBlue, Color(0xFFB000FF))
            )
          )
      )
    }
  }
}
