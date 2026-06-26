package com.neuraltwin.presentation.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.viewmodel.compose.viewModel
import com.neuraltwin.app.viewmodel.SettingsViewModel
import com.neuraltwin.presentation.theme.BrandBlue
import com.neuraltwin.presentation.theme.Surface1
import com.neuraltwin.presentation.theme.Surface2
import com.neuraltwin.presentation.theme.TextSecondary

@Composable
fun SettingsScreen(
  viewModel: SettingsViewModel = hiltViewModel(),
  onLogout: () -> Unit = {}
) {
  var showLogoutAlert by remember { mutableStateOf(false) }
  val user by viewModel.user.collectAsState()

  Box(
    modifier = Modifier
      .fillMaxSize()
      .background(Color.Black)
  ) {
    LazyColumn(
      modifier = Modifier.fillMaxSize(),
      contentPadding = PaddingValues(16.dp),
      verticalArrangement = Arrangement.spacedBy(24.dp)
    ) {
      item {
        Text(
          "Settings",
          fontSize = 28.sp,
          fontWeight = FontWeight.Bold,
          color = Color.White
        )
      }

      // Profile Section
      item {
        user?.let { userData ->
          Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
            Text(
              "Profile",
              fontSize = 14.sp,
              fontWeight = FontWeight.SemiBold,
              color = TextSecondary
            )

            Card(
              modifier = Modifier.fillMaxWidth(),
              colors = CardDefaults.cardColors(containerColor = Surface1),
              shape = RoundedCornerShape(16.dp)
            ) {
              Column(
                modifier = Modifier
                  .fillMaxWidth()
                  .padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp),
                horizontalAlignment = Alignment.CenterHorizontally
              ) {
                // Avatar
                Box(
                  modifier = Modifier
                    .size(80.dp)
                    .clip(CircleShape)
                    .background(
                      brush = Brush.linearGradient(
                        colors = listOf(BrandBlue, Color(0xFFB000FF))
                      )
                    ),
                  contentAlignment = Alignment.Center
                ) {
                  Text(
                    userData.name.take(1),
                    fontSize = 36.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.White
                  )
                }

                Column(
                  horizontalAlignment = Alignment.CenterHorizontally,
                  verticalArrangement = Arrangement.spacedBy(4.dp)
                ) {
                  Text(
                    userData.name,
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.White
                  )

                  Text(
                    userData.email,
                    fontSize = 13.sp,
                    color = TextSecondary
                  )
                }
              }
            }
          }
        }
      }

      // App Settings
      item {
        Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
          Text(
            "App",
            fontSize = 14.sp,
            fontWeight = FontWeight.SemiBold,
            color = TextSecondary
          )

          Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(containerColor = Surface1),
            shape = RoundedCornerShape(12.dp)
          ) {
            Column {
              SettingRow(
                icon = Icons.Default.Settings,
                label = "Dark Mode",
                value = "On",
                color = Color(0xFFB000FF)
              )

              Divider(
                modifier = Modifier
                  .fillMaxWidth()
                  .padding(horizontal = 12.dp),
                color = Surface2,
                thickness = 1.dp
              )

              SettingRow(
                icon = Icons.Default.NotificationsActive,
                label = "Notifications",
                value = "On",
                color = Color(0xFFFF9500)
              )

              Divider(
                modifier = Modifier
                  .fillMaxWidth()
                  .padding(horizontal = 12.dp),
                color = Surface2,
                thickness = 1.dp
              )

              SettingRow(
                icon = Icons.Default.Public,
                label = "Language",
                value = "English",
                color = BrandBlue
              )
            }
          }
        }
      }

      // Data & Privacy
      item {
        Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
          Text(
            "Data & Privacy",
            fontSize = 14.sp,
            fontWeight = FontWeight.SemiBold,
            color = TextSecondary
          )

          Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(containerColor = Surface1),
            shape = RoundedCornerShape(12.dp)
          ) {
            Column {
              SettingNavigationRow(
                icon = Icons.Default.Lock,
                label = "Privacy Policy",
                color = Color(0xFF34C759)
              )

              Divider(
                modifier = Modifier
                  .fillMaxWidth()
                  .padding(horizontal = 12.dp),
                color = Surface2,
                thickness = 1.dp
              )

              SettingNavigationRow(
                icon = Icons.Default.Description,
                label = "Terms of Service",
                color = BrandBlue
              )

              Divider(
                modifier = Modifier
                  .fillMaxWidth()
                  .padding(horizontal = 12.dp),
                color = Surface2,
                thickness = 1.dp
              )

              SettingNavigationRow(
                icon = Icons.Default.Delete,
                label = "Delete Account",
                color = Color(0xFFFF3B30)
              )
            }
          }
        }
      }

      // About
      item {
        Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
          Text(
            "About",
            fontSize = 14.sp,
            fontWeight = FontWeight.SemiBold,
            color = TextSecondary
          )

          Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(containerColor = Surface1),
            shape = RoundedCornerShape(12.dp)
          ) {
            Column(
              modifier = Modifier
                .fillMaxWidth()
                .padding(12.dp),
              verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
              Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
              ) {
                Text(
                  "Version",
                  fontSize = 13.sp,
                  color = Color.White
                )

                Text(
                  "1.0.0",
                  fontSize = 13.sp,
                  fontWeight = FontWeight.SemiBold,
                  color = TextSecondary
                )
              }

              Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
              ) {
                Text(
                  "Build",
                  fontSize = 13.sp,
                  color = Color.White
                )

                Text(
                  "2026.06.26",
                  fontSize = 13.sp,
                  fontWeight = FontWeight.SemiBold,
                  color = TextSecondary
                )
              }
            }
          }
        }
      }

      // Sign Out Button
      item {
        Button(
          onClick = { showLogoutAlert = true },
          modifier = Modifier
            .fillMaxWidth()
            .height(56.dp),
          colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFFF3B30)),
          shape = RoundedCornerShape(12.dp)
        ) {
          Icon(
            Icons.Default.ExitToApp,
            contentDescription = null,
            modifier = Modifier.size(18.dp),
            tint = Color.White
          )

          Spacer(modifier = Modifier.width(8.dp))

          Text(
            "Sign Out",
            fontSize = 16.sp,
            fontWeight = FontWeight.SemiBold,
            color = Color.White
          )
        }
      }

      item {
        Spacer(modifier = Modifier.height(24.dp))
      }
    }

    // Logout confirmation dialog
    if (showLogoutAlert) {
      AlertDialog(
        onDismissRequest = { showLogoutAlert = false },
        title = { Text("Sign Out?") },
        text = { Text("Are you sure you want to sign out?") },
        confirmButton = {
          Button(
            onClick = {
              showLogoutAlert = false
              viewModel.logout()
              onLogout()
            }
          ) {
            Text("Sign Out")
          }
        },
        dismissButton = {
          Button(onClick = { showLogoutAlert = false }) {
            Text("Cancel")
          }
        }
      )
    }
  }
}

@Composable
fun SettingRow(
  icon: ImageVector,
  label: String,
  value: String,
  color: Color,
  modifier: Modifier = Modifier
) {
  Row(
    modifier = modifier
      .fillMaxWidth()
      .padding(12.dp),
    horizontalArrangement = Arrangement.spacedBy(12.dp),
    verticalAlignment = Alignment.CenterVertically
  ) {
    Icon(
      imageVector = icon,
      contentDescription = null,
      tint = color,
      modifier = Modifier.size(16.dp)
    )

    Text(
      label,
      fontSize = 14.sp,
      color = Color.White,
      modifier = Modifier.weight(1f)
    )

    Text(
      value,
      fontSize = 13.sp,
      color = TextSecondary
    )

    Icon(
      Icons.Default.ChevronRight,
      contentDescription = null,
      tint = TextSecondary,
      modifier = Modifier.size(12.dp)
    )
  }
}

@Composable
fun SettingNavigationRow(
  icon: ImageVector,
  label: String,
  color: Color,
  modifier: Modifier = Modifier
) {
  Row(
    modifier = modifier
      .fillMaxWidth()
      .clickable { }
      .padding(12.dp),
    horizontalArrangement = Arrangement.spacedBy(12.dp),
    verticalAlignment = Alignment.CenterVertically
  ) {
    Icon(
      imageVector = icon,
      contentDescription = null,
      tint = color,
      modifier = Modifier.size(16.dp)
    )

    Text(
      label,
      fontSize = 14.sp,
      color = Color.White,
      modifier = Modifier.weight(1f)
    )

    Icon(
      Icons.Default.ChevronRight,
      contentDescription = null,
      tint = TextSecondary,
      modifier = Modifier.size(12.dp)
    )
  }
}
