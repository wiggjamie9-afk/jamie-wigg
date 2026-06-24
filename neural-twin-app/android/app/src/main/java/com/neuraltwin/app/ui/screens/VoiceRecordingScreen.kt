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
import com.neuraltwin.app.viewmodel.MetacognitionViewModel
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.TextField
import androidx.compose.material3.TextFieldDefaults
import androidx.compose.material3.Slider

@Composable
fun VoiceRecordingScreen(
    viewModel: VoiceRecorderViewModel = hiltViewModel(),
    metacognitionViewModel: MetacognitionViewModel = hiltViewModel()
) {
    val isRecording by viewModel.isRecording.collectAsState()
    val recordingTime by viewModel.recordingTime.collectAsState()
    val waveProgress by viewModel.waveProgress.collectAsState()
    val emotionResult by viewModel.emotionResult.collectAsState()
    var showMetacognitivePrompt by remember { mutableStateOf(false) }
    var decisionTitle by remember { mutableStateOf("") }
    var planningClarity by remember { mutableStateOf(5) }

    val animatedWaveProgress by animateFloatAsState(
        targetValue = waveProgress,
        animationSpec = tween(300)
    )

    if (showMetacognitivePrompt) {
        MetacognitivePromptDialog(
            onClose = { showMetacognitivePrompt = false },
            onConfirm = { title, clarity ->
                decisionTitle = title
                planningClarity = clarity
                metacognitionViewModel.updateDecisionMetacognition(title = title, planningClarity = clarity)
                showMetacognitivePrompt = false
                viewModel.startRecording()
            }
        )
    } else {
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
                modifier = Modifier.padding(bottom = 16.dp)
            )

            // Metacognitive context hint
            if (!isRecording && emotionResult == null) {
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(bottom = 16.dp),
                    shape = RoundedCornerShape(12.dp),
                    colors = CardDefaults.cardColors(
                        containerColor = DesignTokens.Surface1.copy(alpha = 0.6f)
                    )
                ) {
                    Column(
                        modifier = Modifier.padding(12.dp)
                    ) {
                        Text(
                            "💭 Thinking about your thinking",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = DesignTokens.BrandBlue,
                            modifier = Modifier.padding(bottom = 4.dp)
                        )
                        Text(
                            "Name the decision or thought you're about to express",
                            fontSize = 11.sp,
                            color = Color.Gray
                        )
                    }
                }
            }

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
                onClick = { showMetacognitivePrompt = true },
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
                "Tap to name your thought, then record",
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

                // Post-recording metacognitive reflection
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp),
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(
                        containerColor = DesignTokens.Surface1.copy(alpha = 0.8f)
                    )
                ) {
                    Column(
                        modifier = Modifier.padding(16.dp)
                    ) {
                        Text(
                            "Reflection",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = DesignTokens.BrandBlue,
                            modifier = Modifier.padding(bottom = 8.dp)
                        )
                        Text(
                            "How clear was your thinking during this recording?",
                            fontSize = 11.sp,
                            color = Color.Gray,
                            modifier = Modifier.padding(bottom = 12.dp)
                        )

                        var evaluationScore by remember { mutableStateOf(5) }
                        Slider(
                            value = evaluationScore.toFloat(),
                            onValueChange = { evaluationScore = it.toInt() },
                            valueRange = 1f..10f,
                            steps = 8,
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(bottom = 8.dp)
                        )
                        Text(
                            "$evaluationScore/10 - ${when {
                                evaluationScore <= 3 -> "Unclear"
                                evaluationScore <= 6 -> "Moderate"
                                else -> "Very clear"
                            }}",
                            fontSize = 11.sp,
                            color = DesignTokens.BrandBlue
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
}

@Composable
fun MetacognitivePromptDialog(
    onClose: () -> Unit,
    onConfirm: (String, Int) -> Unit
) {
    var decisionTitle by remember { mutableStateOf("") }
    var planningClarity by remember { mutableStateOf(5) }

    AlertDialog(
        onDismissRequest = onClose,
        title = {
            Text(
                "What are you thinking about?",
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                color = Color.White
            )
        },
        text = {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .verticalScroll(rememberScrollState())
            ) {
                Text(
                    "Name the decision or thought you're about to express",
                    fontSize = 12.sp,
                    color = Color.Gray,
                    modifier = Modifier.padding(bottom = 12.dp)
                )

                TextField(
                    value = decisionTitle,
                    onValueChange = { decisionTitle = it },
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(bottom = 16.dp),
                    placeholder = { Text("E.g., Career change, health decision", color = Color.Gray) },
                    colors = TextFieldDefaults.colors(
                        focusedContainerColor = DesignTokens.Surface1,
                        unfocusedContainerColor = DesignTokens.Surface1,
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Color.White
                    )
                )

                Text(
                    "How clear is your thinking right now? (1-10)",
                    fontSize = 12.sp,
                    color = Color.Gray,
                    modifier = Modifier.padding(bottom = 8.dp)
                )

                Slider(
                    value = planningClarity.toFloat(),
                    onValueChange = { planningClarity = it.toInt() },
                    valueRange = 1f..10f,
                    steps = 8,
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(bottom = 8.dp)
                )

                Text(
                    String.format("Clarity: %d/10", planningClarity),
                    fontSize = 12.sp,
                    color = DesignTokens.BrandBlue,
                    fontWeight = FontWeight.SemiBold
                )
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    if (decisionTitle.isNotEmpty()) {
                        onConfirm(decisionTitle, planningClarity)
                    }
                },
                colors = ButtonDefaults.buttonColors(
                    containerColor = DesignTokens.BrandBlue
                )
            ) {
                Text("Start Recording")
            }
        },
        dismissButton = {
            Button(
                onClick = onClose,
                colors = ButtonDefaults.buttonColors(
                    containerColor = DesignTokens.Surface1
                )
            ) {
                Text("Cancel")
            }
        },
        containerColor = DesignTokens.Surface2,
        textContentColor = Color.White
    )
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
