package com.neuraltwin.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowForward
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.neuraltwin.app.ui.composables.TwinCard
import com.neuraltwin.app.ui.theme.DesignTokens

data class Twin(
    val id: String,
    val emoji: String,
    val name: String,
    val subtitle: String,
    val description: String
)

val TWINS_LIST = listOf(
    Twin("task", "✅", "Task Twin", "Productivity", "Master your workflows and goals"),
    Twin("coach", "🏆", "Coach Twin", "Guidance", "Voice-based coaching and mentoring"),
    Twin("growth", "📈", "Growth Twin", "Learning", "Optimize your growth trajectory"),
    Twin("health", "💪", "Health Twin", "Wellness", "Biometric coaching and insights"),
    Twin("relationship", "❤️", "Relationship Twin", "Connection", "Strengthen your relationships"),
    Twin("financial", "💰", "Financial Twin", "Money", "Transform your financial life"),
    Twin("creative", "🎨", "Creative Twin", "Expression", "Unlock your creative flow"),
    Twin("research", "🔬", "Research Twin", "Knowledge", "Synthesize and learn faster"),
    Twin("metacognition", "🪞", "Metacognition Twin", "Self-Awareness", "Master your thinking processes")
)

@Composable
fun TwinsListScreen() {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DesignTokens.Background)
            .verticalScroll(rememberScrollState())
            .padding(16.dp)
    ) {
        Text(
            "Your Twins",
            style = MaterialTheme.typography.headlineSmall,
            color = DesignTokens.TextPrimary,
            modifier = Modifier.padding(bottom = 16.dp)
        )

        Text(
            "9 specialist AI companions",
            style = MaterialTheme.typography.bodySmall,
            color = DesignTokens.TextSecondary,
            modifier = Modifier.padding(bottom = 20.dp)
        )

        // Twins Carousel
        LazyRow(
            horizontalArrangement = Arrangement.spacedBy(12.dp),
            modifier = Modifier.padding(bottom = 24.dp)
        ) {
            items(TWINS_LIST) { twin ->
                TwinCard(
                    emoji = twin.emoji,
                    name = twin.name,
                    subtitle = twin.subtitle,
                    onClick = { /* Navigate to TwinChatView */ }
                )
            }
        }

        // Twin Details List
        Text(
            "Twin Details",
            style = MaterialTheme.typography.titleMedium,
            color = DesignTokens.TextPrimary,
            modifier = Modifier.padding(vertical = 16.dp)
        )

        LazyColumn(
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            items(TWINS_LIST) { twin ->
                TwinDetailItem(twin)
            }
        }
    }
}

@Composable
fun TwinDetailItem(twin: Twin) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 8.dp),
        shape = androidx.compose.foundation.shape.RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(
            containerColor = DesignTokens.Surface1
        )
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.Center
        ) {
            Row(
                modifier = Modifier.weight(1f),
                horizontalArrangement = Arrangement.spacedBy(12.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = twin.emoji,
                    fontSize = 32.sp
                )

                Column {
                    Text(
                        twin.name,
                        style = MaterialTheme.typography.titleMedium,
                        color = DesignTokens.TextPrimary,
                        fontWeight = FontWeight.Bold
                    )
                    Text(
                        twin.description,
                        style = MaterialTheme.typography.bodySmall,
                        color = DesignTokens.TextSecondary
                    )
                }
            }

            Icon(
                imageVector = Icons.Default.ArrowForward,
                contentDescription = "Open",
                modifier = Modifier.size(20.dp),
                tint = DesignTokens.BrandBlue
            )
        }
    }
}

@Composable
fun TwinChatView(twin: Twin) {
    var messageText by androidx.compose.runtime.remember { mutableStateOf("") }
    val messages = remember {
        mutableListOf(
            Pair("Hi! I'm ${twin.name}", false),
            Pair("How can I help you today?", false)
        )
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DesignTokens.Background)
    ) {
        // Header
        Surface(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            color = DesignTokens.Background
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 16.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Text(
                        twin.emoji,
                        fontSize = 32.sp
                    )

                    Column {
                        Text(
                            twin.name,
                            style = MaterialTheme.typography.titleMedium,
                            color = DesignTokens.TextPrimary,
                            fontWeight = FontWeight.Bold
                        )
                        Text(
                            "Online",
                            style = MaterialTheme.typography.labelSmall,
                            color = DesignTokens.SuccessGreen
                        )
                    }
                }
            }
        }

        // Messages
        LazyColumn(
            modifier = Modifier
                .weight(1f)
                .fillMaxWidth()
                .padding(8.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            items(messages) { (message, isUser) ->
                MessageBubble(
                    text = message,
                    isUser = isUser
                )
            }
        }

        // Input Field
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            OutlinedTextField(
                value = messageText,
                onValueChange = { messageText = it },
                modifier = Modifier
                    .weight(1f)
                    .height(44.dp),
                placeholder = { Text("Message ${twin.name}...") },
                shape = androidx.compose.foundation.shape.RoundedCornerShape(22.dp),
                singleLine = true,
                colors = OutlinedTextFieldDefaults.colors(
                    unfocusedBorderColor = DesignTokens.Border,
                    focusedBorderColor = DesignTokens.BrandBlue,
                    unfocusedContainerColor = DesignTokens.Surface1,
                    focusedContainerColor = DesignTokens.Surface1,
                    unfocusedTextColor = DesignTokens.TextPrimary,
                    focusedTextColor = DesignTokens.TextPrimary,
                )
            )

            Button(
                onClick = {
                    if (messageText.isNotEmpty()) {
                        messages.add(Pair(messageText, true))
                        messageText = ""
                    }
                },
                modifier = Modifier
                    .size(44.dp),
                shape = androidx.compose.foundation.shape.CircleShape,
                colors = ButtonDefaults.buttonColors(
                    containerColor = DesignTokens.BrandBlue
                ),
                contentPadding = PaddingValues(0.dp)
            ) {
                Icon(
                    imageVector = Icons.Default.ArrowForward,
                    contentDescription = "Send",
                    modifier = Modifier.size(20.dp),
                    tint = androidx.compose.ui.graphics.Color.White
                )
            }
        }
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
            .padding(horizontal = 16.dp, vertical = 4.dp),
        horizontalArrangement = if (isUser) androidx.compose.foundation.layout.Arrangement.End else androidx.compose.foundation.layout.Arrangement.Start
    ) {
        Surface(
            modifier = Modifier
                .widthIn(max = 280.dp),
            shape = androidx.compose.foundation.shape.RoundedCornerShape(
                topStart = 16.dp,
                topEnd = 16.dp,
                bottomStart = if (isUser) 16.dp else 0.dp,
                bottomEnd = if (isUser) 0.dp else 16.dp
            ),
            color = if (isUser) DesignTokens.BrandBlue else DesignTokens.Surface1
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
