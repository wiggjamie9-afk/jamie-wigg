package com.neuraltwin.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.neuraltwin.app.ui.composables.ActionButton
import com.neuraltwin.app.ui.composables.StatCard
import com.neuraltwin.app.ui.theme.DesignTokens

@Composable
fun HomeScreen() {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DesignTokens.Background)
            .verticalScroll(rememberScrollState())
            .padding(16.dp)
    ) {
        // Header
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(bottom = 24.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(
                    "Welcome back!",
                    style = MaterialTheme.typography.headlineSmall,
                    color = DesignTokens.TextPrimary
                )
                Text(
                    "Coherence: 73%",
                    style = MaterialTheme.typography.bodyMedium,
                    color = DesignTokens.SuccessGreen
                )
            }
            Icon(
                imageVector = Icons.Default.Notifications,
                contentDescription = "Notifications",
                modifier = Modifier.size(24.dp),
                tint = DesignTokens.BrandBlue
            )
        }

        // Stats Carousel
        Text(
            "Your Stats",
            style = MaterialTheme.typography.titleMedium,
            color = DesignTokens.TextPrimary,
            modifier = Modifier.padding(bottom = 12.dp)
        )

        LazyRow(
            horizontalArrangement = Arrangement.spacedBy(12.dp),
            modifier = Modifier.padding(bottom = 24.dp)
        ) {
            item {
                StatCard(
                    title = "Overall Coherence",
                    value = "73%",
                    valueColor = DesignTokens.SuccessGreen,
                    icon = {
                        Icon(
                            imageVector = Icons.Default.Favorite,
                            contentDescription = null,
                            modifier = Modifier.size(16.dp),
                            tint = DesignTokens.SuccessGreen
                        )
                    }
                )
            }
            item {
                StatCard(
                    title = "Interactions",
                    value = "12",
                    valueColor = DesignTokens.BrandBlue,
                    icon = {
                        Icon(
                            imageVector = Icons.Default.Message,
                            contentDescription = null,
                            modifier = Modifier.size(16.dp),
                            tint = DesignTokens.BrandBlue
                        )
                    }
                )
            }
            item {
                StatCard(
                    title = "Decisions",
                    value = "8",
                    valueColor = DesignTokens.AccentPurple,
                    icon = {
                        Icon(
                            imageVector = Icons.Default.CheckCircle,
                            contentDescription = null,
                            modifier = Modifier.size(16.dp),
                            tint = DesignTokens.AccentPurple
                        )
                    }
                )
            }
        }

        // Quick Actions
        Text(
            "Quick Actions",
            style = MaterialTheme.typography.titleMedium,
            color = DesignTokens.TextPrimary,
            modifier = Modifier.padding(bottom = 12.dp)
        )

        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(bottom = 12.dp),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            ActionButton(
                title = "Record Voice",
                icon = {
                    Icon(
                        imageVector = Icons.Default.Mic,
                        contentDescription = null,
                        modifier = Modifier.size(24.dp),
                        tint = androidx.compose.ui.graphics.Color.White
                    )
                },
                modifier = Modifier.weight(1f)
            )

            ActionButton(
                title = "Log Decision",
                icon = {
                    Icon(
                        imageVector = Icons.Default.Edit,
                        contentDescription = null,
                        modifier = Modifier.size(24.dp),
                        tint = androidx.compose.ui.graphics.Color.White
                    )
                },
                modifier = Modifier.weight(1f)
            )
        }

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            ActionButton(
                title = "View Patterns",
                icon = {
                    Icon(
                        imageVector = Icons.Default.BarChart,
                        contentDescription = null,
                        modifier = Modifier.size(24.dp),
                        tint = androidx.compose.ui.graphics.Color.White
                    )
                },
                modifier = Modifier.weight(1f)
            )

            ActionButton(
                title = "Talk to Twin",
                icon = {
                    Icon(
                        imageVector = Icons.Default.Person,
                        contentDescription = null,
                        modifier = Modifier.size(24.dp),
                        tint = androidx.compose.ui.graphics.Color.White
                    )
                },
                modifier = Modifier.weight(1f)
            )
        }
    }
}
