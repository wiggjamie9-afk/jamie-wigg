package com.neuraltwin.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.neuraltwin.app.ui.composables.CoherenceMetricCard
import com.neuraltwin.app.ui.theme.DesignTokens

data class CoherenceMetric(
    val name: String,
    val percentage: Float,
    val description: String
)

val COHERENCE_METRICS = listOf(
    CoherenceMetric("Heart-Brain", 78f, "Heart-brain synchronization"),
    CoherenceMetric("Breath", 72f, "Breathing coherence"),
    CoherenceMetric("Brain", 65f, "Brain wave coherence"),
    CoherenceMetric("Vagal Tone", 81f, "Parasympathetic tone"),
    CoherenceMetric("Circadian", 88f, "Sleep-wake alignment"),
    CoherenceMetric("Biofield", 71f, "Resonance frequency"),
    CoherenceMetric("Decision", 79f, "Decision coherence")
)

@Composable
fun CoherenceScreen() {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DesignTokens.Background)
            .verticalScroll(rememberScrollState())
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            "Coherence Dashboard",
            style = MaterialTheme.typography.headlineSmall,
            color = DesignTokens.TextPrimary,
            modifier = Modifier.padding(bottom = 24.dp)
        )

        // Overall Coherence Circle
        Box(
            modifier = Modifier
                .size(220.dp)
                .padding(16.dp),
            contentAlignment = Alignment.Center
        ) {
            Canvas(
                modifier = Modifier.size(220.dp),
                onDraw = {
                    val centerX = size.width / 2
                    val centerY = size.height / 2
                    val radius = size.width / 2 - 16.dp.toPx()

                    drawArc(
                        color = DesignTokens.TextSecondary.copy(alpha = 0.2f),
                        startAngle = -90f,
                        sweepAngle = 360f,
                        useCenter = false,
                        style = androidx.compose.ui.graphics.drawscope.Stroke(16.dp.toPx())
                    )

                    drawArc(
                        brush = Brush.linearGradient(
                            colors = listOf(DesignTokens.BrandBlue, DesignTokens.AccentPurple)
                        ),
                        startAngle = -90f,
                        sweepAngle = (73f / 100f) * 360f,
                        useCenter = false,
                        style = androidx.compose.ui.graphics.drawscope.Stroke(16.dp.toPx())
                    )
                }
            )

            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.Center
            ) {
                Text(
                    "73%",
                    style = MaterialTheme.typography.displaySmall,
                    color = DesignTokens.TextPrimary,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    "Overall",
                    style = MaterialTheme.typography.labelSmall,
                    color = DesignTokens.TextSecondary
                )
            }
        }

        Spacer(modifier = Modifier.height(32.dp))

        Text(
            "7-Layer Coherence Metrics",
            style = MaterialTheme.typography.titleMedium,
            color = DesignTokens.TextPrimary,
            modifier = Modifier
                .align(Alignment.Start)
                .padding(bottom = 12.dp)
        )

        // Metrics Carousel
        LazyRow(
            horizontalArrangement = Arrangement.spacedBy(12.dp),
            modifier = Modifier.padding(bottom = 24.dp)
        ) {
            items(COHERENCE_METRICS) { metric ->
                CoherenceMetricCard(
                    name = metric.name,
                    percentage = metric.percentage
                )
            }
        }

        // Coherence State
        Text(
            "Coherence State",
            style = MaterialTheme.typography.titleMedium,
            color = DesignTokens.TextPrimary,
            modifier = Modifier
                .align(Alignment.Start)
                .padding(vertical = 16.dp)
        )

        CoherenceStateCard()

        Spacer(modifier = Modifier.height(24.dp))

        // Coaching Recommendation
        Text(
            "Next Action",
            style = MaterialTheme.typography.titleMedium,
            color = DesignTokens.TextPrimary,
            modifier = Modifier
                .align(Alignment.Start)
                .padding(bottom = 12.dp)
        )

        Card(
            modifier = Modifier
                .fillMaxWidth(),
            shape = androidx.compose.foundation.shape.RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(
                containerColor = DesignTokens.Surface1
            )
        ) {
            Column(
                modifier = Modifier.padding(20.dp)
            ) {
                Text(
                    "Take 5 minutes to breathe",
                    style = MaterialTheme.typography.titleMedium,
                    color = DesignTokens.TextPrimary,
                    fontWeight = FontWeight.Bold
                )

                Spacer(modifier = Modifier.height(8.dp))

                Text(
                    "Your vagal tone is high. A few minutes of coherent breathing will optimize your nervous system state.",
                    style = MaterialTheme.typography.bodySmall,
                    color = DesignTokens.TextSecondary
                )

                Spacer(modifier = Modifier.height(16.dp))

                Button(
                    onClick = { /* Navigate to breathing exercise */ },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(44.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = DesignTokens.BrandBlue
                    )
                ) {
                    Text("Start Breathing Exercise")
                }
            }
        }
    }
}

@Composable
fun CoherenceStateCard() {
    Card(
        modifier = Modifier
            .fillMaxWidth(),
        shape = androidx.compose.foundation.shape.RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(
            containerColor = DesignTokens.Surface1
        )
    ) {
        Column(
            modifier = Modifier.padding(20.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            StateRow("Nervous System", "Ventral Vagal (Safe)", DesignTokens.SuccessGreen)
            StateRow("Energy Level", "Balanced", DesignTokens.BrandBlue)
            StateRow("Stress Level", "Low", DesignTokens.SuccessGreen)
            StateRow("Focus", "Strong", DesignTokens.BrandBlue)
        }
    }
}

@Composable
fun StateRow(label: String, value: String, color: Color) {
    Row(
        modifier = Modifier
            .fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(
            label,
            style = MaterialTheme.typography.labelMedium,
            color = DesignTokens.TextSecondary
        )

        Row(
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .size(8.dp)
                    .background(color = color, shape = androidx.compose.foundation.shape.CircleShape)
            )
            Text(
                value,
                style = MaterialTheme.typography.labelMedium,
                color = color,
                fontWeight = FontWeight.Bold
            )
        }
    }
}

@Composable
fun Canvas(
    modifier: Modifier = Modifier,
    onDraw: androidx.compose.ui.graphics.drawscope.DrawScope.() -> Unit = {}
) {
    androidx.compose.foundation.Canvas(
        modifier = modifier,
        onDraw = onDraw
    )
}
