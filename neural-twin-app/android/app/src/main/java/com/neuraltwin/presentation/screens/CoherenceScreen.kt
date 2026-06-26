package com.neuraltwin.presentation.screens

import androidx.compose.animation.animateColorAsState
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Canvas
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import com.neuraltwin.app.data.models.CoherenceLayer
import com.neuraltwin.app.viewmodel.CoherenceViewModel
import com.neuraltwin.presentation.theme.BrandBlue
import com.neuraltwin.presentation.theme.Surface1
import com.neuraltwin.presentation.theme.Surface2
import com.neuraltwin.presentation.theme.TextSecondary

@Composable
fun CoherenceScreen(
  userId: String? = null,
  viewModel: CoherenceViewModel = hiltViewModel()
) {
  var selectedTimeframe by remember { mutableStateOf("7d") }
  val isLoading by viewModel.isLoading.collectAsState()
  val isHistoryLoading by viewModel.isHistoryLoading.collectAsState()
  val isDetailLoading by viewModel.isDetailLoading.collectAsState()
  val coherence by viewModel.coherenceData.collectAsState()
  val history by viewModel.coherenceHistory.collectAsState()
  val selectedLayerId by viewModel.selectedLayerId.collectAsState()
  val metric by viewModel.coherenceMetric.collectAsState()

  // Load coherence on screen appear
  LaunchedEffect(Unit) {
    userId?.let {
      viewModel.getCoherence(it)
      viewModel.getCoherenceHistory(it, selectedTimeframe)
    }
  }

  // Reload history on timeframe change
  LaunchedEffect(selectedTimeframe) {
    userId?.let {
      viewModel.getCoherenceHistory(it, selectedTimeframe)
    }
  }

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
      }

      // 8-layer circular indicators
      coherence?.let { data ->
        Card(
          modifier = Modifier
            .padding(16.dp)
            .fillMaxWidth()
            .height(280.dp),
          colors = CardDefaults.cardColors(containerColor = Surface1),
          shape = RoundedCornerShape(16.dp)
        ) {
          Column(
            modifier = Modifier
              .fillMaxSize()
              .padding(16.dp)
          ) {
            Text(
              "Coherence Layers",
              fontSize = 14.sp,
              fontWeight = FontWeight.SemiBold,
              color = TextSecondary,
              modifier = Modifier.padding(bottom = 12.dp)
            )

            CoherenceLayersGrid(
              layers = data.layers,
              selectedLayerId = selectedLayerId,
              onLayerTap = { layerId ->
                viewModel.selectLayer(layerId)
              }
            )
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

      // Trend chart
      if (isHistoryLoading) {
        Box(
          modifier = Modifier
            .fillMaxWidth()
            .height(200.dp)
            .padding(16.dp)
            .background(Surface1, RoundedCornerShape(16.dp)),
          contentAlignment = Alignment.Center
        ) {
          CircularProgressIndicator()
        }
      } else {
        history?.let { historyData ->
          Card(
            modifier = Modifier
              .padding(16.dp)
              .fillMaxWidth()
              .height(220.dp),
            colors = CardDefaults.cardColors(containerColor = Surface1),
            shape = RoundedCornerShape(16.dp)
          ) {
            Column(
              modifier = Modifier
                .fillMaxSize()
                .padding(16.dp)
            ) {
              Text(
                "Coherence Trend",
                fontSize = 14.sp,
                fontWeight = FontWeight.SemiBold,
                color = TextSecondary,
                modifier = Modifier.padding(bottom = 12.dp)
              )

              CoherenceTrendChart(
                dataPoints = historyData.history,
                modifier = Modifier
                  .fillMaxWidth()
                  .weight(1f)
              )
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

      // Metric detail (tap overlay)
      if (metric != null && isDetailLoading) {
        Box(
          modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp)
            .background(Surface1, RoundedCornerShape(16.dp))
            .padding(16.dp)
        ) {
          CircularProgressIndicator(
            modifier = Modifier.align(Alignment.Center)
          )
        }
      } else {
        metric?.let { detail ->
          CoherenceMetricDetail(
            metric = detail,
            onDismiss = { viewModel.selectLayer(null) }
          )
        }
      }

      Spacer(modifier = Modifier.height(32.dp))
    }
  }
}

@Composable
fun CoherenceLayersGrid(
  layers: List<CoherenceLayer>,
  selectedLayerId: String?,
  onLayerTap: (String) -> Unit,
  modifier: Modifier = Modifier
) {
  // 2x4 grid layout
  Column(
    modifier = modifier.fillMaxWidth(),
    verticalArrangement = Arrangement.spacedBy(12.dp)
  ) {
    for (row in 0..3) {
      Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(12.dp)
      ) {
        for (col in 0..1) {
          val index = row * 2 + col
          if (index < layers.size) {
            CoherenceLayerCircle(
              layer = layers[index],
              isSelected = selectedLayerId == layers[index].name,
              onTap = { onLayerTap(layers[index].name) },
              modifier = Modifier.weight(1f)
            )
          } else {
            Spacer(modifier = Modifier.weight(1f))
          }
        }
      }
    }
  }
}

@Composable
fun CoherenceLayerCircle(
  layer: CoherenceLayer,
  isSelected: Boolean,
  onTap: () -> Unit,
  modifier: Modifier = Modifier
) {
  val score = layer.value.toFloatOrNull() ?: 0f
  val progress = (score / 100f).coerceIn(0f, 1f)
  val color = when {
    score >= 80 -> Color(0xFF34C759)
    score >= 60 -> Color(0xFFFF9500)
    else -> Color(0xFFFF3B30)
  }
  val scale by animateColorAsState(
    targetValue = if (isSelected) 1.1f else 1f
  )

  Column(
    modifier = modifier
      .clickable { onTap() }
      .scale(1f),
    horizontalAlignment = Alignment.CenterHorizontally
  ) {
    Box(
      modifier = Modifier
        .size(80.dp)
        .background(Surface2, CircleShape)
        .clip(CircleShape),
      contentAlignment = Alignment.Center
    ) {
      CircularProgressIndicator(
        progress = { progress },
        modifier = Modifier
          .size(72.dp)
          .padding(4.dp),
        color = color,
        trackColor = Surface2,
        strokeWidth = 3.dp
      )

      Text(
        String.format("%.0f%%", score),
        fontSize = 16.sp,
        fontWeight = FontWeight.SemiBold,
        color = Color.White,
        textAlign = TextAlign.Center
      )
    }

    Text(
      layer.name,
      fontSize = 11.sp,
      fontWeight = FontWeight.Medium,
      color = TextSecondary,
      textAlign = TextAlign.Center,
      modifier = Modifier
        .padding(top = 8.dp)
        .fillMaxWidth()
    )
  }
}

@Composable
fun CoherenceTrendChart(
  dataPoints: List<com.neuraltwin.app.data.models.CoherencePoint>,
  modifier: Modifier = Modifier
) {
  if (dataPoints.isEmpty()) {
    Box(
      modifier = modifier,
      contentAlignment = Alignment.Center
    ) {
      Text(
        "No data available",
        color = TextSecondary,
        fontSize = 12.sp
      )
    }
    return
  }

  Canvas(
    modifier = modifier
      .fillMaxWidth()
      .height(150.dp)
  ) {
    val canvasWidth = size.width
    val canvasHeight = size.height
    val padding = 16.dp.toPx()
    val chartWidth = canvasWidth - 2 * padding
    val chartHeight = canvasHeight - 2 * padding

    // Find min/max for scaling
    val values = dataPoints.map { it.overall }
    val minVal = values.minOrNull() ?: 0f
    val maxVal = values.maxOrNull() ?: 100f
    val range = if (maxVal > minVal) maxVal - minVal else 1f

    // Draw grid lines
    drawLine(
      color = Surface2,
      start = Offset(padding, padding),
      end = Offset(canvasWidth - padding, padding),
      strokeWidth = 1f
    )
    drawLine(
      color = Surface2,
      start = Offset(padding, canvasHeight - padding),
      end = Offset(canvasWidth - padding, canvasHeight - padding),
      strokeWidth = 1f
    )

    // Draw data points and line
    val points = dataPoints.mapIndexed { index, point ->
      val x = padding + (index / (dataPoints.size - 1).coerceAtLeast(1)) * chartWidth
      val normalizedValue = (point.overall - minVal) / range
      val y = canvasHeight - padding - (normalizedValue * chartHeight)
      Offset(x, y)
    }

    // Draw connecting line
    for (i in 0 until points.size - 1) {
      drawLine(
        color = BrandBlue,
        start = points[i],
        end = points[i + 1],
        strokeWidth = 2f
      )
    }

    // Draw point circles
    points.forEach { point ->
      drawCircle(
        color = Color(0xFFB000FF),
        radius = 4f,
        center = point
      )
    }
  }
}

@Composable
fun CoherenceMetricDetail(
  metric: com.neuraltwin.app.data.models.CoherenceMetricDetail,
  onDismiss: () -> Unit,
  modifier: Modifier = Modifier
) {
  Card(
    modifier = modifier
      .padding(16.dp)
      .fillMaxWidth(),
    colors = CardDefaults.cardColors(containerColor = Surface1),
    shape = RoundedCornerShape(16.dp)
  ) {
    Column(
      modifier = Modifier
        .fillMaxWidth()
        .padding(16.dp),
      verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
      Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
      ) {
        Text(
          "Detailed Metrics",
          fontSize = 14.sp,
          fontWeight = FontWeight.SemiBold,
          color = TextSecondary
        )

        Button(
          onClick = onDismiss,
          modifier = Modifier.size(32.dp),
          colors = ButtonDefaults.buttonColors(containerColor = Surface2),
          shape = CircleShape,
          contentPadding = PaddingValues(0.dp)
        ) {
          Text("✕", fontSize = 16.sp, color = Color.White)
        }
      }

      Divider(
        modifier = Modifier
          .padding(vertical = 8.dp)
          .background(Surface2),
        color = Surface2,
        thickness = 1.dp
      )

      listOf(
        "Heart-Brain" to metric.heartBrainCoh,
        "Breath" to metric.breathCoh,
        "Brain" to metric.brainCoh,
        "Vagal Tone" to metric.vagalTone,
        "Circadian" to metric.circadianAlign,
        "Biofield" to metric.biofieldCoh,
        "Decision" to metric.decisionCoh
      ).forEach { (label, value) ->
        if (value != null) {
          MetricRow(label, value)
        }
      }

      Text(
        "State: ${metric.coherenceState}",
        fontSize = 12.sp,
        color = TextSecondary,
        modifier = Modifier.padding(top = 8.dp)
      )
    }
  }
}

@Composable
fun MetricRow(
  label: String,
  value: Float,
  modifier: Modifier = Modifier
) {
  val percentage = (value * 100).toInt().coerceIn(0, 100)
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
        fontWeight = FontWeight.Medium,
        color = Color.White
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
        .height(4.dp)
        .background(Surface2, shape = RoundedCornerShape(2.dp))
        .clip(RoundedCornerShape(2.dp))
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
