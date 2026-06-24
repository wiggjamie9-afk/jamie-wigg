package com.neuraltwin.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.neuraltwin.app.ui.theme.DesignTokens

@Composable
fun BookScannerScreen() {
    var scanMode by remember { mutableStateOf<String?>(null) }
    var scannedText by remember { mutableStateOf("") }
    var simplifiedText by remember { mutableStateOf("") }
    var readingTime by remember { mutableStateOf(0) }
    var sections by remember { mutableStateOf(emptyList<String>()) }
    var wordCount by remember { mutableStateOf(0) }
    var ttsSpeed by remember { mutableStateOf(1.0f) }
    var isPlaying by remember { mutableStateOf(false) }

    if (scanMode == null) {
        BookScanMenuScreen(
            onScanBook = { scanMode = "scan" },
            onUploadImage = { scanMode = "upload" },
            onAccessibilitySettings = { scanMode = "settings" }
        )
    } else if (scanMode == "scan") {
        BookScanCameraScreen(
            onScan = { text, simplified, time, sects, words ->
                scannedText = text
                simplifiedText = simplified
                readingTime = time
                sections = sects
                wordCount = words
                scanMode = "result"
            },
            onBack = { scanMode = null }
        )
    } else if (scanMode == "result") {
        BookScanResultScreen(
            simplifiedText = simplifiedText,
            readingTime = readingTime,
            wordCount = wordCount,
            sections = sections,
            ttsSpeed = ttsSpeed,
            isPlaying = isPlaying,
            onTtsSpeedChange = { ttsSpeed = it },
            onToggleTts = { isPlaying = !isPlaying },
            onBack = { scanMode = null }
        )
    } else if (scanMode == "settings") {
        AccessibilitySettingsScreen(
            onBack = { scanMode = null }
        )
    }
}

@Composable
fun BookScanMenuScreen(
    onScanBook: () -> Unit,
    onUploadImage: () -> Unit,
    onAccessibilitySettings: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DesignTokens.Background)
            .padding(16.dp)
            .verticalScroll(rememberScrollState()),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            "Book Scanner",
            style = MaterialTheme.typography.headlineSmall,
            color = DesignTokens.TextPrimary,
            modifier = Modifier.padding(bottom = 8.dp)
        )

        Text(
            "Dyslexia & ADHD Friendly Reading",
            style = MaterialTheme.typography.bodySmall,
            color = DesignTokens.TextSecondary,
            modifier = Modifier.padding(bottom = 32.dp)
        )

        // Scan Book Option
        BookScanOptionCard(
            emoji = "📖",
            title = "Scan with Camera",
            description = "Use your camera to scan a book page",
            onClick = onScanBook
        )

        // Upload Image Option
        BookScanOptionCard(
            emoji = "🖼️",
            title = "Upload from Gallery",
            description = "Select a book image from your device",
            onClick = onUploadImage
        )

        Spacer(modifier = Modifier.height(24.dp))

        // Accessibility Features
        Text(
            "Accessibility Features",
            style = MaterialTheme.typography.titleMedium,
            color = DesignTokens.TextPrimary,
            modifier = Modifier
                .align(Alignment.Start)
                .padding(bottom = 16.dp)
        )

        Column(
            modifier = Modifier
                .fillMaxWidth()
                .background(
                    color = DesignTokens.Surface1.copy(alpha = 0.5f),
                    shape = androidx.compose.foundation.shape.RoundedCornerShape(12.dp)
                )
                .padding(16.dp)
        ) {
            AccessibilityFeature("🧠", "Dyslexia Mode", "OpenDyslexic font, increased spacing")
            Divider(modifier = Modifier.padding(vertical = 8.dp), color = DesignTokens.Border)
            AccessibilityFeature("⚡", "ADHD Mode", "Focus mode, minimal distractions")
            Divider(modifier = Modifier.padding(vertical = 8.dp), color = DesignTokens.Border)
            AccessibilityFeature("🔊", "Text-to-Speech", "Listen while reading along")
            Divider(modifier = Modifier.padding(vertical = 8.dp), color = DesignTokens.Border)
            AccessibilityFeature("📋", "Simplified Text", "Shorter sentences, clearer structure")
        }

        Spacer(modifier = Modifier.height(24.dp))

        Button(
            onClick = onAccessibilitySettings,
            modifier = Modifier
                .fillMaxWidth()
                .height(44.dp),
            colors = ButtonDefaults.buttonColors(
                containerColor = DesignTokens.Surface1
            )
        ) {
            Text(
                "⚙️ Accessibility Settings",
                color = DesignTokens.TextPrimary
            )
        }
    }
}

@Composable
fun BookScanOptionCard(
    emoji: String,
    title: String,
    description: String,
    onClick: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 8.dp),
        shape = androidx.compose.foundation.shape.RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = DesignTokens.Surface1),
        onClick = onClick
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            horizontalArrangement = Arrangement.spacedBy(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(emoji, fontSize = 32.sp)
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    title,
                    style = MaterialTheme.typography.titleMedium,
                    color = DesignTokens.TextPrimary,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    description,
                    style = MaterialTheme.typography.bodySmall,
                    color = DesignTokens.TextSecondary
                )
            }
        }
    }
}

@Composable
fun AccessibilityFeature(
    emoji: String,
    title: String,
    description: String
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp),
        horizontalArrangement = Arrangement.spacedBy(12.dp),
        verticalAlignment = Alignment.Top
    ) {
        Text(emoji, fontSize = 20.sp)
        Column {
            Text(
                title,
                style = MaterialTheme.typography.titleSmall,
                color = DesignTokens.TextPrimary,
                fontWeight = FontWeight.Bold
            )
            Text(
                description,
                style = MaterialTheme.typography.bodySmall,
                color = DesignTokens.TextSecondary
            )
        }
    }
}

@Composable
fun BookScanCameraScreen(
    onScan: (String, String, Int, List<String>, Int) -> Unit,
    onBack: () -> Unit
) {
    Box(modifier = Modifier.fillMaxSize()) {
        // Camera preview placeholder
        Surface(
            modifier = Modifier.fillMaxSize(),
            color = DesignTokens.Background
        ) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(16.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.Center
            ) {
                Text(
                    "📷 Camera Preview",
                    style = MaterialTheme.typography.headlineSmall,
                    color = DesignTokens.TextPrimary
                )
                Text(
                    "Position book page in frame",
                    style = MaterialTheme.typography.bodyMedium,
                    color = DesignTokens.TextSecondary,
                    modifier = Modifier.padding(top = 8.dp)
                )

                Button(
                    onClick = {
                        // Simulate scan result
                        onScan(
                            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                            "Lorem ipsum is placeholder text.\n\nUsed in design to show how text looks.",
                            2,
                            listOf("Introduction", "Details"),
                            20
                        )
                    },
                    modifier = Modifier.padding(top = 32.dp)
                ) {
                    Text("Scan Text")
                }
            }
        }

        // Back button
        IconButton(
            onClick = onBack,
            modifier = Modifier
                .align(Alignment.TopStart)
                .padding(8.dp)
        ) {
            Icon(
                Icons.Default.Close,
                contentDescription = "Back",
                tint = DesignTokens.TextPrimary
            )
        }
    }
}

@Composable
fun BookScanResultScreen(
    simplifiedText: String,
    readingTime: Int,
    wordCount: Int,
    sections: List<String>,
    ttsSpeed: Float,
    isPlaying: Boolean,
    onTtsSpeedChange: (Float) -> Unit,
    onToggleTts: () -> Unit,
    onBack: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DesignTokens.Background)
            .verticalScroll(rememberScrollState())
    ) {
        // Header with back button
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                "Scanned Content",
                style = MaterialTheme.typography.headlineSmall,
                color = DesignTokens.TextPrimary
            )
            IconButton(onClick = onBack) {
                Icon(
                    Icons.Default.Close,
                    contentDescription = "Close",
                    tint = DesignTokens.TextPrimary
                )
            }
        }

        // Reading Stats
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 8.dp),
            horizontalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            StatCard("⏱️", "$readingTime min", "Reading Time")
            StatCard("📝", wordCount.toString(), "Words")
        }

        Spacer(modifier = Modifier.height(16.dp))

        // TTS Controls
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp),
            shape = androidx.compose.foundation.shape.RoundedCornerShape(12.dp),
            colors = CardDefaults.cardColors(containerColor = DesignTokens.Surface1)
        ) {
            Column(
                modifier = Modifier.padding(16.dp)
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(bottom = 12.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        "🔊 Listen & Read",
                        style = MaterialTheme.typography.titleSmall,
                        color = DesignTokens.TextPrimary,
                        fontWeight = FontWeight.Bold
                    )
                    Button(
                        onClick = onToggleTts,
                        modifier = Modifier.height(32.dp),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = if (isPlaying) DesignTokens.BrandBlue else DesignTokens.Surface1
                        )
                    ) {
                        Text(
                            if (isPlaying) "⏸ Pause" else "▶ Play",
                            fontSize = 12.sp
                        )
                    }
                }

                Text(
                    "Speed: ${String.format("%.1f", ttsSpeed)}x",
                    style = MaterialTheme.typography.bodySmall,
                    color = DesignTokens.TextSecondary,
                    modifier = Modifier.padding(bottom = 8.dp)
                )

                Slider(
                    value = ttsSpeed,
                    onValueChange = onTtsSpeedChange,
                    valueRange = 0.5f..2.0f,
                    steps = 5,
                    modifier = Modifier.fillMaxWidth()
                )
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Simplified Text Content
        Text(
            "Simplified & Formatted",
            style = MaterialTheme.typography.titleMedium,
            color = DesignTokens.TextPrimary,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(horizontal = 16.dp)
        )

        Card(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            shape = androidx.compose.foundation.shape.RoundedCornerShape(12.dp),
            colors = CardDefaults.cardColors(containerColor = Color(0xFFFAF7F2))
        ) {
            Text(
                simplifiedText,
                style = MaterialTheme.typography.bodyMedium.copy(
                    fontSize = 18.sp,
                    lineHeight = 28.sp
                ),
                color = Color(0xFF333333),
                modifier = Modifier.padding(16.dp)
            )
        }

        Spacer(modifier = Modifier.height(32.dp))
    }
}

@Composable
fun StatCard(emoji: String, value: String, label: String) {
    Card(
        modifier = Modifier
            .weight(1f)
            .height(80.dp),
        shape = androidx.compose.foundation.shape.RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = DesignTokens.Surface1)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(12.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Text(emoji, fontSize = 20.sp)
            Text(
                value,
                style = MaterialTheme.typography.titleMedium,
                color = DesignTokens.TextPrimary,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(vertical = 4.dp)
            )
            Text(
                label,
                style = MaterialTheme.typography.labelSmall,
                color = DesignTokens.TextSecondary
            )
        }
    }
}

@Composable
fun AccessibilitySettingsScreen(onBack: () -> Unit) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DesignTokens.Background)
            .padding(16.dp)
            .verticalScroll(rememberScrollState())
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(bottom = 16.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                "Accessibility Settings",
                style = MaterialTheme.typography.headlineSmall,
                color = DesignTokens.TextPrimary
            )
            IconButton(onClick = onBack) {
                Icon(
                    Icons.Default.Close,
                    contentDescription = "Close",
                    tint = DesignTokens.TextPrimary
                )
            }
        }

        SettingToggle("🧠 Dyslexia Mode", true)
        SettingToggle("⚡ ADHD Mode", true)
        SettingToggle("🔊 Text-to-Speech", true)
        SettingToggle("📋 Simplify Text", true)
        SettingToggle("⭐ High Contrast", false)

        Spacer(modifier = Modifier.height(16.dp))
        Divider()
        Spacer(modifier = Modifier.height(16.dp))

        Text(
            "Font Size",
            style = MaterialTheme.typography.titleSmall,
            color = DesignTokens.TextPrimary,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(bottom = 8.dp)
        )

        var fontSize by remember { mutableStateOf(18f) }
        Slider(
            value = fontSize,
            onValueChange = { fontSize = it },
            valueRange = 14f..32f,
            steps = 8,
            modifier = Modifier.fillMaxWidth()
        )

        Text(
            "Line Spacing",
            style = MaterialTheme.typography.titleSmall,
            color = DesignTokens.TextPrimary,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(top = 16.dp, bottom = 8.dp)
        )

        var lineSpacing by remember { mutableStateOf(1.8f) }
        Slider(
            value = lineSpacing,
            onValueChange = { lineSpacing = it },
            valueRange = 1.2f..2.4f,
            steps = 5,
            modifier = Modifier.fillMaxWidth()
        )
    }
}

@Composable
fun SettingToggle(label: String, initialValue: Boolean) {
    var enabled by remember { mutableStateOf(initialValue) }

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 12.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(label, color = DesignTokens.TextPrimary)
        Switch(
            checked = enabled,
            onCheckedChange = { enabled = it }
        )
    }
}

import androidx.compose.material.icons.filled.Close
import androidx.compose.material3.Slider
import androidx.compose.material3.Switch
import androidx.compose.ui.graphics.Color
