package com.neuraltwin.app.ui.screens

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Mic
import androidx.compose.material.icons.filled.Stop
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import com.neuraltwin.app.ui.theme.DesignTokens
import com.neuraltwin.app.viewmodel.VoiceRecorderViewModel

@Composable
fun VoiceRecordingScreen(
    viewModel: VoiceRecorderViewModel = hiltViewModel()
) {
    val isRecording by viewModel.isRecording.collectAsState()
    val recordingTime by viewModel.recordingTime.collectAsState()
    val waveProgress by viewModel.waveProgress.collectAsState()
    val emotionResult by viewModel.emotionResult.collectAsState()

    val animatedWaveProgress by animateFloatAsState(
        targetValue = waveProgress,
        animationSpec = tween(300)
    )

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DesignTokens.Background)
            .verticalScroll(rememberScrollState())
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Top
    ) {
        Text(
            "Voice Recording",
            style = MaterialTheme.typography.headlineSmall,
            color = DesignTokens.TextPrimary,
            modifier = Modifier.padding(bottom = 32.dp)
        )

        // Waveform Visualization
        if (isRecording) {
            Box(
                modifier = Modifier
                    .size(200.dp)
                    .clip(CircleShape)
                    .background(
                        brush = Brush.radialGradient(
                            colors = listOf(
                                DesignTokens.BrandBlue.copy(alpha = 0.3f),
                                DesignTokens.BrandBlue.copy(alpha = 0.1f)
                            )
                        )
                    )
                    .padding(16.dp),
                contentAlignment = Alignment.Center
            ) {
                Canvas(
                    modifier = Modifier
                        .size(160.dp),
                    onDraw = {
                        val centerX = size.width / 2
                        val centerY = size.height / 2
                        val radius = size.width / 2

                        for (i in 0..8) {
                            val angle = (i * 45f - 90f) * Math.PI / 180f
                            val waveRadius = radius * (0.5f + 0.5f * animatedWaveProgress)
                            val x = centerX + (waveRadius * Math.cos(angle)).toFloat()
                            val y = centerY + (waveRadius * Math.sin(angle)).toFloat()

                            drawCircle(
                                color = DesignTokens.BrandBlue,
                                radius = 4.dp.toPx(),
                                center = androidx.compose.ui.geometry.Offset(x, y)
                            )
                        }

                        drawCircle(
                            color = DesignTokens.BrandBlue,
                            radius = 8.dp.toPx(),
                            center = androidx.compose.ui.geometry.Offset(centerX, centerY)
                        )
                    }
                )
            }

            Spacer(modifier = Modifier.height(32.dp))

            // Recording Time
            Text(
                recordingTime,
                style = MaterialTheme.typography.displaySmall,
                color = DesignTokens.BrandBlue,
                fontFamily = FontFamily.Monospace,
                fontWeight = FontWeight.Bold
            )

            Spacer(modifier = Modifier.height(48.dp))

            // Stop Button
            Button(
                onClick = { viewModel.stopRecording() },
                modifier = Modifier
                    .size(56.dp),
                shape = CircleShape,
                colors = ButtonDefaults.buttonColors(
                    containerColor = DesignTokens.ErrorRed
                )
            ) {
                Icon(
                    imageVector = Icons.Default.Stop,
                    contentDescription = "Stop",
                    modifier = Modifier.size(24.dp),
                    tint = Color.White
                )
            }
        } else {
            // Start Recording Button
            Button(
                onClick = { viewModel.startRecording() },
                modifier = Modifier
                    .size(120.dp),
                shape = CircleShape,
                colors = ButtonDefaults.buttonColors(
                    containerColor = DesignTokens.BrandBlue
                )
            ) {
                Icon(
                    imageVector = Icons.Default.Mic,
                    contentDescription = "Record",
                    modifier = Modifier.size(56.dp),
                    tint = Color.White
                )
            }

            Spacer(modifier = Modifier.height(24.dp))

            Text(
                "Tap to start recording",
                style = MaterialTheme.typography.bodyMedium,
                color = DesignTokens.TextSecondary
            )
        }

        // Emotion Result
        emotionResult?.let { result ->
            Spacer(modifier = Modifier.height(48.dp))

            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp),
                shape = androidx.compose.foundation.shape.RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(
                    containerColor = DesignTokens.Surface1
                )
            ) {
                Column(
                    modifier = Modifier.padding(20.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text(
                        "Detected Emotion",
                        style = MaterialTheme.typography.labelMedium,
                        color = DesignTokens.TextSecondary
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    Text(
                        result.emotion.toString(),
                        style = MaterialTheme.typography.headlineMedium,
                        color = DesignTokens.BrandBlue,
                        fontWeight = FontWeight.Bold
                    )

                    Spacer(modifier = Modifier.height(8.dp))

                    Text(
                        "${(result.confidence * 100).toInt()}% confidence",
                        style = MaterialTheme.typography.labelSmall,
                        color = DesignTokens.TextSecondary
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    LinearProgressIndicator(
                        progress = { result.confidence },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(6.dp)
                            .clip(androidx.compose.foundation.shape.RoundedCornerShape(3.dp)),
                        color = DesignTokens.SuccessGreen,
                        trackColor = DesignTokens.TextSecondary.copy(alpha = 0.2f)
                    )
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Button(
                    onClick = { viewModel.clearRecording() },
                    modifier = Modifier
                        .weight(1f)
                        .height(48.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = DesignTokens.Surface1
                    )
                ) {
                    Text("Clear")
                }

                Button(
                    onClick = { /* Upload to backend */ },
                    modifier = Modifier
                        .weight(1f)
                        .height(48.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = DesignTokens.BrandBlue
                    )
                ) {
                    Text("Save")
                }
            }
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
