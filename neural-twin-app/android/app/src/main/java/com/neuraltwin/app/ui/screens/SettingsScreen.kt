package com.neuraltwin.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.neuraltwin.app.ui.theme.DesignTokens
import com.neuraltwin.app.viewmodel.AuthViewModel

@Composable
fun SettingsScreen(
    authViewModel: AuthViewModel = hiltViewModel()
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DesignTokens.Background)
            .verticalScroll(rememberScrollState())
            .padding(16.dp)
    ) {
        Text(
            "Settings",
            style = MaterialTheme.typography.headlineSmall,
            color = DesignTokens.TextPrimary,
            modifier = Modifier.padding(bottom = 24.dp)
        )

        // Account Section
        SettingSection("Account") {
            SettingRow(
                icon = Icons.Default.Person,
                title = "Profile",
                subtitle = "View and edit your profile",
                onClick = { /* Navigate to profile */ }
            )

            SettingRow(
                icon = Icons.Default.Email,
                title = "Email",
                subtitle = "Manage your email address",
                onClick = { /* Navigate to email settings */ }
            )

            SettingRow(
                icon = Icons.Default.Lock,
                title = "Password",
                subtitle = "Change your password",
                onClick = { /* Navigate to password settings */ }
            )
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Privacy Section
        SettingSection("Privacy & Data") {
            SettingRow(
                icon = Icons.Default.Shield,
                title = "Privacy Settings",
                subtitle = "Control data sharing",
                onClick = { /* Navigate to privacy settings */ }
            )

            SettingRow(
                icon = Icons.Default.GetApp,
                title = "Data Export",
                subtitle = "Download your data",
                onClick = { /* Trigger data export */ }
            )

            SettingRow(
                icon = Icons.Default.Delete,
                title = "Delete Account",
                subtitle = "Permanently delete your account",
                onClick = { /* Confirm deletion */ }
            )
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Accessibility Section
        SettingSection("Accessibility") {
            SettingRow(
                icon = Icons.Default.TextFields,
                title = "Text Size",
                subtitle = "Adjust text size",
                onClick = { /* Navigate to text size */ }
            )

            SettingRow(
                icon = Icons.Default.Contrast,
                title = "High Contrast",
                subtitle = "Enable high contrast mode",
                onClick = { /* Toggle high contrast */ }
            )

            SettingRow(
                icon = Icons.Default.Hearing,
                title = "Screen Reader",
                subtitle = "Optimize for accessibility",
                onClick = { /* Navigate to a11y */ }
            )
        }

        Spacer(modifier = Modifier.height(24.dp))

        // About Section
        SettingSection("About") {
            SettingRow(
                icon = Icons.Default.Info,
                title = "About Neural Twin",
                subtitle = "Version 0.1.0",
                onClick = { /* Navigate to about */ }
            )

            SettingRow(
                icon = Icons.Default.Description,
                title = "Terms of Service",
                subtitle = "Read our terms",
                onClick = { /* Open terms */ }
            )

            SettingRow(
                icon = Icons.Default.PrivacyTip,
                title = "Privacy Policy",
                subtitle = "Read our policy",
                onClick = { /* Open privacy */ }
            )
        }

        Spacer(modifier = Modifier.height(32.dp))

        // Sign Out Button
        Button(
            onClick = { authViewModel.logout() },
            modifier = Modifier
                .fillMaxWidth()
                .height(48.dp),
            colors = ButtonDefaults.buttonColors(
                containerColor = DesignTokens.ErrorRed
            ),
            shape = androidx.compose.foundation.shape.RoundedCornerShape(12.dp)
        ) {
            Icon(
                imageVector = Icons.Default.Logout,
                contentDescription = null,
                modifier = Modifier.size(20.dp),
                tint = androidx.compose.ui.graphics.Color.White
            )
            Spacer(modifier = Modifier.width(8.dp))
            Text("Sign Out")
        }

        Spacer(modifier = Modifier.height(24.dp))
    }
}

@Composable
fun SettingSection(
    title: String,
    content: @Composable ColumnScope.() -> Unit
) {
    Column {
        Text(
            title,
            style = MaterialTheme.typography.labelMedium,
            color = DesignTokens.TextSecondary,
            fontWeight = FontWeight.SemiBold,
            modifier = Modifier.padding(bottom = 8.dp)
        )

        Card(
            modifier = Modifier
                .fillMaxWidth(),
            shape = androidx.compose.foundation.shape.RoundedCornerShape(12.dp),
            colors = CardDefaults.cardColors(
                containerColor = DesignTokens.Surface1
            )
        ) {
            Column(
                content = content
            )
        }
    }
}

@Composable
fun ColumnScope.SettingRow(
    icon: ImageVector,
    title: String,
    subtitle: String,
    onClick: () -> Unit
) {
    Surface(
        modifier = Modifier
            .fillMaxWidth()
            .height(56.dp)
            .androidx.compose.foundation.clickable(
                interactionSource = androidx.compose.foundation.interaction.MutableInteractionSource(),
                indication = null,
                onClick = onClick
            ),
        color = DesignTokens.Surface1
    ) {
        Row(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 16.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(
                modifier = Modifier.weight(1f),
                horizontalArrangement = Arrangement.spacedBy(12.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = icon,
                    contentDescription = null,
                    modifier = Modifier.size(20.dp),
                    tint = DesignTokens.BrandBlue
                )

                Column {
                    Text(
                        title,
                        style = MaterialTheme.typography.labelMedium,
                        color = DesignTokens.TextPrimary,
                        fontWeight = FontWeight.SemiBold
                    )
                    Text(
                        subtitle,
                        style = MaterialTheme.typography.labelSmall,
                        color = DesignTokens.TextSecondary
                    )
                }
            }

            Icon(
                imageVector = Icons.Default.ChevronRight,
                contentDescription = null,
                modifier = Modifier.size(20.dp),
                tint = DesignTokens.TextSecondary
            )
        }
    }
}
