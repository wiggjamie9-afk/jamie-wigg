package com.neuraltwin.presentation.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Canvas
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.neuraltwin.presentation.theme.BrandBlue
import com.neuraltwin.presentation.theme.Surface1
import com.neuraltwin.presentation.theme.Surface2
import com.neuraltwin.presentation.theme.TextSecondary
import kotlin.math.PI
import kotlin.math.cos
import kotlin.math.sin

/**
 * Circular pie chart for displaying 8-layer coherence breakdown.
 * Each layer gets a slice proportional to its score.
 */
@Composable
fun CoherencePieChart(
  layers: List<Pair<String, Float>>,
  modifier: Modifier = Modifier,
  onSliceTap: (String) -> Unit = {}
) {
  Box(
    modifier = modifier
      .size(200.dp)
      .background(Surface1, RoundedCornerShape(16.dp))
      .clip(RoundedCornerShape(16.dp)),
    contentAlignment = Alignment.Center
  ) {
    Canvas(
      modifier = Modifier
        .fillMaxSize()
        .padding(16.dp)
    ) {
      val centerX = size.width / 2
      val centerY = size.height / 2
      val radius = minOf(size.width, size.height) / 2

      val total = layers.sumOf { it.second.toDouble() }
      var currentAngle = -PI / 2 // Start at top

      layers.forEach { (name, value) ->
        val sliceAngle = (value / total) * 2 * PI

        // Draw slice
        drawArc(
          color = colorForLayer(name),
          startAngle = currentAngle.toFloat() * 180 / PI.toFloat(),
          sweepAngle = sliceAngle.toFloat() * 180 / PI.toFloat(),
          useCenter = true,
          topLeft = Offset(centerX - radius, centerY - radius),
          size = androidx.compose.ui.geometry.Size(radius * 2, radius * 2)
        )

        currentAngle += sliceAngle
      }
    }
  }
}

/**
 * Multi-point line chart for coherence trends over time.
 * Supports 24h, 7d, 30d, all timeframes.
 */
@Composable
fun CoherenceLineChart(
  timePoints: List<Pair<String, Float>>, // timestamp label, score
  modifier: Modifier = Modifier,
  minValue: Float = 0f,
  maxValue: Float = 100f
) {
  if (timePoints.isEmpty()) {
    Box(
      modifier = modifier
        .fillMaxWidth()
        .height(150.dp)
        .background(Surface1, RoundedCornerShape(16.dp)),
      contentAlignment = Alignment.Center
    ) {
      Text(
        "No data available",
        fontSize = 12.sp,
        color = TextSecondary,
        textAlign = TextAlign.Center
      )
    }
    return
  }

  Canvas(
    modifier = modifier
      .fillMaxWidth()
      .height(150.dp)
      .background(Surface1, RoundedCornerShape(16.dp))
      .clip(RoundedCornerShape(16.dp))
      .padding(12.dp)
  ) {
    val chartWidth = size.width
    val chartHeight = size.height
    val padding = 8.dp.toPx()

    // Draw grid background
    drawRect(
      color = Surface2,
      topLeft = Offset(padding, padding),
      size = androidx.compose.ui.geometry.Size(
        chartWidth - 2 * padding,
        chartHeight - 2 * padding
      )
    )

    val valueRange = maxValue - minValue
    val points = timePoints.mapIndexed { index, (_, value) ->
      val x = padding + (index / (timePoints.size - 1).coerceAtLeast(1)) * (chartWidth - 2 * padding)
      val normalizedY = (value - minValue) / valueRange
      val y = chartHeight - padding - (normalizedY * (chartHeight - 2 * padding))
      Offset(x, y)
    }

    // Draw line connecting points
    for (i in 0 until points.size - 1) {
      drawLine(
        color = BrandBlue,
        start = points[i],
        end = points[i + 1],
        strokeWidth = 2f
      )
    }

    // Draw gradient fill under the line
    if (points.size > 1) {
      val fillPoints = mutableListOf<Offset>()
      fillPoints.addAll(points)
      fillPoints.add(Offset(points.last().x, chartHeight - padding))
      fillPoints.add(Offset(points.first().x, chartHeight - padding))

      drawPath(
        androidx.compose.ui.graphics.Path().apply {
          fillPoints.forEachIndexed { index, offset ->
            if (index == 0) moveTo(offset.x, offset.y)
            else lineTo(offset.x, offset.y)
          }
          close()
        },
        color = Color(0xFFB000FF).copy(alpha = 0.2f)
      )
    }

    // Draw point circles
    points.forEach { point ->
      drawCircle(
        color = Color(0xFFB000FF),
        radius = 3.5f,
        center = point
      )
    }
  }
}

/**
 * Radial/radar chart for visualizing all 8 coherence dimensions.
 * Useful for comparing layer performance at a glance.
 */
@Composable
fun CoherenceRadarChart(
  layers: List<Pair<String, Float>>,
  modifier: Modifier = Modifier
) {
  Box(
    modifier = modifier
      .size(200.dp)
      .background(Surface1, RoundedCornerShape(16.dp))
      .clip(RoundedCornerShape(16.dp)),
    contentAlignment = Alignment.Center
  ) {
    Canvas(
      modifier = Modifier
        .fillMaxSize()
        .padding(16.dp)
    ) {
      val centerX = size.width / 2
      val centerY = size.height / 2
      val radius = minOf(size.width, size.height) / 2

      val numLayers = layers.size.coerceAtLeast(3)
      val angleStep = (2 * PI) / numLayers

      // Draw axis lines
      for (i in 0 until numLayers) {
        val angle = i * angleStep - PI / 2
        val endX = centerX + radius * cos(angle).toFloat()
        val endY = centerY + radius * sin(angle).toFloat()

        drawLine(
          color = Surface2,
          start = Offset(centerX, centerY),
          end = Offset(endX, endY),
          strokeWidth = 1f
        )
      }

      // Draw concentric circles (grid)
      for (ring in 1..3) {
        val ringRadius = (radius / 3) * ring
        drawCircle(
          color = Surface2,
          radius = ringRadius,
          center = Offset(centerX, centerY),
          style = androidx.compose.ui.graphics.Stroke(width = 0.5f)
        )
      }

      // Draw polygon for data
      val points = mutableListOf<Offset>()
      layers.forEachIndexed { index, (name, value) ->
        val angle = index * angleStep - PI / 2
        val normalizedValue = value / 100f
        val pointRadius = radius * normalizedValue
        val x = centerX + pointRadius * cos(angle).toFloat()
        val y = centerY + pointRadius * sin(angle).toFloat()
        points.add(Offset(x, y))
      }

      // Draw polygon
      for (i in points.indices) {
        val nextIndex = (i + 1) % points.size
        drawLine(
          color = BrandBlue,
          start = points[i],
          end = points[nextIndex],
          strokeWidth = 1.5f
        )
      }

      // Fill polygon
      if (points.size > 2) {
        drawPath(
          androidx.compose.ui.graphics.Path().apply {
            points.forEachIndexed { index, offset ->
              if (index == 0) moveTo(offset.x, offset.y)
              else lineTo(offset.x, offset.y)
            }
            close()
          },
          color = Color(0xFFB000FF).copy(alpha = 0.15f)
        )
      }

      // Draw point markers
      points.forEach { point ->
        drawCircle(
          color = Color(0xFFB000FF),
          radius = 3f,
          center = point
        )
      }
    }
  }
}

/**
 * Stacked bar chart for comparing coherence metrics across timeframes.
 */
@Composable
fun CoherenceBarChart(
  metrics: List<Pair<String, Float>>, // label, value
  modifier: Modifier = Modifier
) {
  Column(
    modifier = modifier
      .fillMaxWidth()
      .background(Surface1, RoundedCornerShape(16.dp))
      .clip(RoundedCornerShape(16.dp))
      .padding(16.dp)
  ) {
    val maxValue = metrics.maxOfOrNull { it.second } ?: 100f

    metrics.forEach { (label, value) ->
      val percentage = (value / maxValue).coerceIn(0f, 1f)

      Column(
        modifier = Modifier
          .fillMaxWidth()
          .padding(bottom = 12.dp),
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
            String.format("%.0f%%", value),
            fontSize = 12.sp,
            fontWeight = FontWeight.SemiBold,
            color = colorForScore(value)
          )
        }

        Box(
          modifier = Modifier
            .fillMaxWidth()
            .height(6.dp)
            .background(Surface2, RoundedCornerShape(3.dp))
            .clip(RoundedCornerShape(3.dp))
        ) {
          Box(
            modifier = Modifier
              .fillMaxHeight()
              .fillMaxWidth(percentage)
              .background(
                color = colorForScore(value)
              )
          )
        }
      }
    }
  }
}

/**
 * Helper function to determine color based on layer name.
 */
private fun colorForLayer(name: String): Color = when (name.lowercase()) {
  "physical" -> Color(0xFF34C759)
  "emotional" -> Color(0xFFFF9500)
  "mental" -> Color(0xFFAF0FFF)
  "spiritual" -> Color(0xFF0A84FF)
  "relational" -> Color(0xFFFF10AF)
  "financial" -> Color(0xFF34C759)
  "professional" -> Color(0xFFB000FF)
  "life-purpose" -> Color(0xFFFFFFA0)
  else -> Color(0xFF5E5CE6)
}

/**
 * Helper function to determine color based on score value.
 */
private fun colorForScore(score: Float): Color = when {
  score >= 80 -> Color(0xFF34C759)  // Green
  score >= 60 -> Color(0xFFFF9500)  // Orange
  else -> Color(0xFFFF3B30)          // Red
}
