package com.neuraltwin.app.ui.composables

import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowForward
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
import com.neuraltwin.app.ui.theme.DesignTokens

@Composable
fun StatCard(
    title: String,
    value: String,
    valueColor: Color = DesignTokens.BrandBlue,
    icon: @Composable (() -> Unit)? = null,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier
            .width(200.dp)
            .height(120.dp)
            .glassmorphism()
            .padding(16.dp),
        verticalArrangement = Arrangement.SpaceBetween,
        horizontalAlignment = Alignment.Start
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.Top
        ) {
            Text(
                text = title,
                style = MaterialTheme.typography.labelMedium,
                color = DesignTokens.TextSecondary,
                fontSize = 12.sp
            )
            icon?.invoke()
        }
        Text(
            text = value,
            style = MaterialTheme.typography.headlineMedium,
            color = valueColor,
            fontWeight = FontWeight.Bold
        )
    }
}

@Composable
fun ActionButton(
    title: String,
    icon: @Composable (() -> Unit)? = null,
    onClick: () -> Unit = {},
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier
            .clip(RoundedCornerShape(16.dp))
            .background(
                brush = Brush.linearGradient(
                    colors = listOf(DesignTokens.BrandBlue, DesignTokens.AccentPurple)
                )
            )
            .clickable(
                interactionSource = remember { MutableInteractionSource() },
                indication = null,
                onClick = onClick
            )
            .padding(16.dp)
            .size(100.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        icon?.invoke()
        Spacer(modifier = Modifier.height(8.dp))
        Text(
            text = title,
            style = MaterialTheme.typography.labelSmall,
            color = Color.White,
            fontSize = 12.sp,
            textAlign = TextAlign.Center,
            maxLines = 2
        )
    }
}

@Composable
fun TwinCard(
    emoji: String,
    name: String,
    subtitle: String,
    onClick: () -> Unit = {},
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier
            .width(200.dp)
            .height(160.dp)
            .glassmorphism()
            .clickable(
                interactionSource = remember { MutableInteractionSource() },
                indication = null,
                onClick = onClick
            )
            .padding(16.dp),
        verticalArrangement = Arrangement.SpaceBetween,
        horizontalAlignment = Alignment.Start
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.Top
        ) {
            Column {
                Text(
                    text = name,
                    style = MaterialTheme.typography.titleMedium,
                    color = DesignTokens.TextPrimary,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    text = subtitle,
                    style = MaterialTheme.typography.bodySmall,
                    color = DesignTokens.TextSecondary
                )
            }
            Text(
                text = emoji,
                fontSize = 32.sp
            )
        }
    }
}

@Composable
fun CoherenceMetricCard(
    name: String,
    percentage: Float,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier
            .width(160.dp)
            .height(100.dp)
            .glassmorphism()
            .padding(12.dp),
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        Text(
            text = name,
            style = MaterialTheme.typography.labelSmall,
            color = DesignTokens.TextSecondary,
            fontSize = 12.sp
        )
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.Bottom
        ) {
            Text(
                text = "$percentage%",
                style = MaterialTheme.typography.titleMedium,
                color = DesignTokens.BrandBlue,
                fontWeight = FontWeight.Bold
            )
        }
        LinearProgressIndicator(
            progress = { percentage / 100f },
            modifier = Modifier
                .fillMaxWidth()
                .height(4.dp)
                .clip(RoundedCornerShape(2.dp)),
            color = DesignTokens.BrandBlue,
            trackColor = DesignTokens.TextSecondary.copy(alpha = 0.2f)
        )
    }
}

@Composable
fun MessageBubble(
    text: String,
    isUser: Boolean = true,
    modifier: Modifier = Modifier
) {
    Row(
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 8.dp),
        horizontalArrangement = if (isUser) Arrangement.End else Arrangement.Start
    ) {
        Surface(
            modifier = Modifier
                .widthIn(max = 280.dp)
                .clip(
                    RoundedCornerShape(
                        topStart = 16.dp,
                        topEnd = 16.dp,
                        bottomStart = if (isUser) 16.dp else 0.dp,
                        bottomEnd = if (isUser) 0.dp else 16.dp
                    )
                ),
            color = if (isUser) {
                DesignTokens.BrandBlue
            } else {
                DesignTokens.Surface1
            }
        ) {
            Text(
                text = text,
                modifier = Modifier.padding(12.dp),
                style = MaterialTheme.typography.bodyMedium,
                color = DesignTokens.TextPrimary
            )
        }
    }
}

@Composable
fun CircularProgressIndicator(
    percentage: Float,
    size: Int = 200,
    strokeWidth: Int = 16,
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier
            .size(size.dp),
        contentAlignment = Alignment.Center
    ) {
        Canvas(
            modifier = Modifier.size(size.dp),
        ) {
            drawArc(
                color = DesignTokens.TextSecondary.copy(alpha = 0.2f),
                startAngle = -90f,
                sweepAngle = 360f,
                useCenter = false,
                style = androidx.compose.ui.graphics.drawscope.Stroke(strokeWidth.dp.toPx())
            )
            drawArc(
                brush = Brush.linearGradient(
                    colors = listOf(DesignTokens.BrandBlue, DesignTokens.AccentPurple)
                ),
                startAngle = -90f,
                sweepAngle = (percentage / 100f) * 360f,
                useCenter = false,
                style = androidx.compose.ui.graphics.drawscope.Stroke(strokeWidth.dp.toPx())
            )
        }
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Text(
                text = "${percentage.toInt()}%",
                style = MaterialTheme.typography.displaySmall,
                color = DesignTokens.TextPrimary,
                fontWeight = FontWeight.Bold
            )
            Text(
                text = "out of 100",
                style = MaterialTheme.typography.labelSmall,
                color = DesignTokens.TextSecondary
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
