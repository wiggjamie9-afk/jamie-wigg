package com.neuraltwin.app.ui.composables

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.neuraltwin.app.ui.theme.DesignTokens

@Composable
fun Modifier.glassmorphism(): Modifier {
    return this
        .background(
            color = DesignTokens.Surface1.copy(alpha = 0.6f),
            shape = androidx.compose.foundation.shape.RoundedCornerShape(16.dp)
        )
        .border(
            width = 1.dp,
            color = Color.White.copy(alpha = 0.1f),
            shape = androidx.compose.foundation.shape.RoundedCornerShape(16.dp)
        )
}

@Composable
fun Modifier.glassmorphismSmall(): Modifier {
    return this
        .background(
            color = DesignTokens.Surface1.copy(alpha = 0.6f),
            shape = androidx.compose.foundation.shape.RoundedCornerShape(12.dp)
        )
        .border(
            width = 1.dp,
            color = Color.White.copy(alpha = 0.1f),
            shape = androidx.compose.foundation.shape.RoundedCornerShape(12.dp)
        )
}
