package com.neuraltwin.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.gestures.detectVerticalDrag
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.ArrowForward
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.MoreVert
import androidx.compose.material.icons.filled.Send
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.neuraltwin.app.data.database.TwinChatEntity
import com.neuraltwin.app.ui.composables.TwinCard
import com.neuraltwin.app.ui.theme.DesignTokens
import com.neuraltwin.app.viewmodel.TwinViewModel

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
            verticalAlignment = Alignment.CenterVertically
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
fun TwinChatScreen(
    twin: Twin,
    userId: String = "default-user",
    onBack: () -> Unit = {},
    viewModel: TwinViewModel = viewModel()
) {
    val chatMessages by viewModel.chatMessages.collectAsState()
    val isLoading by viewModel.isLoading.collectAsState()
    val isStreaming by viewModel.isStreaming.collectAsState()
    val streamingMessage by viewModel.currentStreamingMessage.collectAsState()
    val error by viewModel.error.collectAsState()

    var messageText by remember { mutableStateOf("") }
    var showMenu by remember { mutableStateOf(false) }
    val lazyListState = rememberLazyListState()

    LaunchedEffect(twin.id) {
        viewModel.loadChatHistory(twin.id, userId)
    }

    LaunchedEffect(chatMessages.size) {
        if (chatMessages.isNotEmpty()) {
            lazyListState.animateScrollToItem(chatMessages.size - 1)
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DesignTokens.Background)
    ) {
        // Header with Twin Info
        ChatHeader(
            twin = twin,
            onBack = onBack,
            onMenuClick = { showMenu = true }
        )

        if (showMenu) {
            DropdownMenu(
                expanded = showMenu,
                onDismissRequest = { showMenu = false }
            ) {
                DropdownMenuItem(
                    text = { Text("Clear History") },
                    onClick = {
                        viewModel.clearChatHistory(twin.id, userId)
                        showMenu = false
                    },
                    leadingIcon = {
                        Icon(Icons.Default.Delete, contentDescription = "Clear")
                    }
                )
            }
        }

        // Pull-to-refresh indicator
        if (isLoading && chatMessages.isEmpty()) {
            Box(
                modifier = Modifier
                    .weight(1f)
                    .fillMaxWidth(),
                contentAlignment = Alignment.Center
            ) {
                CircularProgressIndicator(color = DesignTokens.BrandBlue)
            }
        } else {
            // Chat Messages with Pull-to-Refresh
            ChatMessageList(
                messages = chatMessages,
                streamingMessage = streamingMessage,
                isStreaming = isStreaming,
                lazyListState = lazyListState,
                modifier = Modifier.weight(1f),
                onRefresh = { viewModel.refreshChatHistory(twin.id, userId) }
            )
        }

        // Error display
        if (error != null) {
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(8.dp),
                colors = CardDefaults.cardColors(
                    containerColor = androidx.compose.ui.graphics.Color(0xFFFFEBEE)
                )
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(12.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        error ?: "Error",
                        style = MaterialTheme.typography.labelMedium,
                        color = androidx.compose.ui.graphics.Color(0xFFC62828)
                    )
                    IconButton(
                        onClick = { viewModel.clearError() },
                        modifier = Modifier.size(24.dp)
                    ) {
                        Icon(
                            Icons.Default.Close,
                            contentDescription = "Close",
                            modifier = Modifier.size(16.dp),
                            tint = androidx.compose.ui.graphics.Color(0xFFC62828)
                        )
                    }
                }
            }
        }

        // Message Input
        ChatInputField(
            messageText = messageText,
            onMessageChange = { messageText = it },
            onSend = {
                if (messageText.isNotEmpty()) {
                    viewModel.chatWithTwin(
                        userId = userId,
                        twinType = twin.id,
                        twinName = twin.name,
                        twinEmoji = twin.emoji,
                        userMessage = messageText
                    )
                    messageText = ""
                }
            },
            isLoading = isStreaming,
            placeholder = "Message ${twin.name}..."
        )
    }
}

@Composable
private fun ChatHeader(
    twin: Twin,
    onBack: () -> Unit = {},
    onMenuClick: () -> Unit = {}
) {
    Surface(
        modifier = Modifier
            .fillMaxWidth()
            .padding(top = 8.dp),
        color = DesignTokens.Background,
        shadowElevation = 4.dp
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(12.dp),
                modifier = Modifier.weight(1f)
            ) {
                IconButton(onClick = onBack, modifier = Modifier.size(40.dp)) {
                    Icon(
                        Icons.Default.ArrowBack,
                        contentDescription = "Back",
                        modifier = Modifier.size(24.dp),
                        tint = DesignTokens.TextPrimary
                    )
                }

                Text(twin.emoji, fontSize = 32.sp)

                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        twin.name,
                        style = MaterialTheme.typography.titleMedium,
                        color = DesignTokens.TextPrimary,
                        fontWeight = FontWeight.Bold
                    )
                    Text(
                        twin.subtitle,
                        style = MaterialTheme.typography.labelSmall,
                        color = DesignTokens.SuccessGreen
                    )
                }
            }

            IconButton(onClick = onMenuClick, modifier = Modifier.size(40.dp)) {
                Icon(
                    Icons.Default.MoreVert,
                    contentDescription = "More",
                    modifier = Modifier.size(24.dp),
                    tint = DesignTokens.TextPrimary
                )
            }
        }
    }
}

@Composable
private fun ChatMessageList(
    messages: List<TwinChatEntity>,
    streamingMessage: String,
    isStreaming: Boolean,
    lazyListState: androidx.compose.foundation.lazy.LazyListState,
    modifier: Modifier = Modifier,
    onRefresh: () -> Unit = {}
) {
    var isDragging by remember { mutableStateOf(false) }

    LazyColumn(
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = 8.dp, vertical = 4.dp)
            .pointerInput(Unit) {
                detectVerticalDrag(
                    onDrag = { _, dragAmount ->
                        if (dragAmount > 20) {
                            isDragging = true
                        }
                    },
                    onDragEnd = {
                        if (isDragging) {
                            onRefresh()
                            isDragging = false
                        }
                    }
                )
            },
        state = lazyListState,
        verticalArrangement = Arrangement.spacedBy(8.dp),
        contentPadding = PaddingValues(vertical = 8.dp)
    ) {
        if (messages.isEmpty()) {
            item {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(32.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Text(
                            "No messages yet",
                            style = MaterialTheme.typography.bodyMedium,
                            color = DesignTokens.TextSecondary
                        )
                        Text(
                            "Start a conversation",
                            style = MaterialTheme.typography.labelSmall,
                            color = DesignTokens.TextSecondary
                        )
                    }
                }
            }
        } else {
            items(messages.size) { index ->
                val message = messages[index]
                MessageBubble(
                    text = if (message.isUserMessage) message.userMessage else message.twinResponse,
                    isUser = message.isUserMessage
                )
            }
        }

        if (isStreaming && streamingMessage.isNotEmpty()) {
            item {
                MessageBubble(
                    text = streamingMessage,
                    isUser = false,
                    isStreaming = true
                )
            }
        }
    }
}

@Composable
private fun ChatInputField(
    messageText: String,
    onMessageChange: (String) -> Unit,
    onSend: () -> Unit,
    isLoading: Boolean = false,
    placeholder: String = "Type a message..."
) {
    Surface(
        modifier = Modifier
            .fillMaxWidth()
            .padding(8.dp),
        color = DesignTokens.Background,
        shadowElevation = 4.dp
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(12.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            OutlinedTextField(
                value = messageText,
                onValueChange = onMessageChange,
                modifier = Modifier
                    .weight(1f)
                    .heightIn(min = 44.dp, max = 120.dp),
                placeholder = { Text(placeholder) },
                shape = androidx.compose.foundation.shape.RoundedCornerShape(22.dp),
                colors = OutlinedTextFieldDefaults.colors(
                    unfocusedBorderColor = DesignTokens.Border,
                    focusedBorderColor = DesignTokens.BrandBlue,
                    unfocusedContainerColor = DesignTokens.Surface1,
                    focusedContainerColor = DesignTokens.Surface1,
                    unfocusedTextColor = DesignTokens.TextPrimary,
                    focusedTextColor = DesignTokens.TextPrimary,
                ),
                singleLine = false
            )

            Button(
                onClick = onSend,
                modifier = Modifier.size(44.dp),
                shape = androidx.compose.foundation.shape.CircleShape,
                colors = ButtonDefaults.buttonColors(
                    containerColor = DesignTokens.BrandBlue,
                    disabledContainerColor = DesignTokens.Border
                ),
                contentPadding = PaddingValues(0.dp),
                enabled = !isLoading && messageText.isNotEmpty()
            ) {
                if (isLoading) {
                    CircularProgressIndicator(
                        modifier = Modifier.size(20.dp),
                        color = androidx.compose.ui.graphics.Color.White,
                        strokeWidth = 2.dp
                    )
                } else {
                    Icon(
                        imageVector = Icons.Default.Send,
                        contentDescription = "Send",
                        modifier = Modifier.size(20.dp),
                        tint = androidx.compose.ui.graphics.Color.White
                    )
                }
            }
        }
    }
}

@Composable
fun MessageBubble(
    text: String,
    isUser: Boolean = true,
    isStreaming: Boolean = false,
    modifier: Modifier = Modifier
) {
    Row(
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = 8.dp, vertical = 4.dp),
        horizontalArrangement = if (isUser) androidx.compose.foundation.layout.Arrangement.End else androidx.compose.foundation.layout.Arrangement.Start
    ) {
        Surface(
            modifier = Modifier.widthIn(max = 280.dp),
            shape = androidx.compose.foundation.shape.RoundedCornerShape(
                topStart = 16.dp,
                topEnd = 16.dp,
                bottomStart = if (isUser) 16.dp else 0.dp,
                bottomEnd = if (isUser) 0.dp else 16.dp
            ),
            color = if (isUser) DesignTokens.BrandBlue else DesignTokens.Surface1
        ) {
            Box(modifier = Modifier.padding(12.dp)) {
                Text(
                    text = text,
                    style = MaterialTheme.typography.bodyMedium,
                    color = if (isUser) androidx.compose.ui.graphics.Color.White else DesignTokens.TextPrimary
                )

                if (isStreaming) {
                    Text(
                        text = "▌",
                        style = MaterialTheme.typography.bodyMedium,
                        color = if (isUser) androidx.compose.ui.graphics.Color.White else DesignTokens.BrandBlue,
                        modifier = Modifier.align(Alignment.BottomEnd)
                    )
                }
            }
        }
    }
}
