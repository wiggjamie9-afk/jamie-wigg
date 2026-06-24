package com.neuraltwin.app.ui.theme

import androidx.compose.foundation.isSystemInDarkMode
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

// Design tokens matching DESIGN-SYSTEM-2026.md
object DesignTokens {
    val BrandBlue = Color(0xFF0A84FF)
    val AccentPurple = Color(0xFFAF0FFF)
    val AccentPink = Color(0xFFFF10AF)
    val SuccessGreen = Color(0xFF34C759)
    val WarningOrange = Color(0xFFFF9500)
    val ErrorRed = Color(0xFFFF3B30)

    val Background = Color(0xFF000000)
    val Surface1 = Color(0xFF1A1A1A)
    val Surface2 = Color(0xFF2A2A2A)
    val TextPrimary = Color(0xFFFFFFFF)
    val TextSecondary = Color(0xFFA0A0A0)
    val Border = Color(0xFF333333)

    val Spacing4 = 4
    val Spacing8 = 8
    val Spacing12 = 12
    val Spacing16 = 16
    val Spacing24 = 24
    val Spacing32 = 32

    val RadiusSmall = 8
    val RadiusMedium = 12
    val RadiusLarge = 16
}

private val DarkColorScheme = darkColorScheme(
    primary = DesignTokens.BrandBlue,
    secondary = DesignTokens.AccentPurple,
    tertiary = DesignTokens.AccentPink,
    background = DesignTokens.Background,
    surface = DesignTokens.Surface1,
    error = DesignTokens.ErrorRed,
    onPrimary = DesignTokens.TextPrimary,
    onSecondary = DesignTokens.TextPrimary,
    onTertiary = DesignTokens.TextPrimary,
    onBackground = DesignTokens.TextPrimary,
    onSurface = DesignTokens.TextPrimary,
    onError = DesignTokens.TextPrimary,
)

@Composable
fun NeuralTwinTheme(
    darkTheme: Boolean = isSystemInDarkMode(),
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = DarkColorScheme,
        typography = NeuralTwinTypography,
        content = content
    )
}
