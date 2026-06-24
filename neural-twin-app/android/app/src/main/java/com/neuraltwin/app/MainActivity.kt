package com.neuraltwin.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.NavController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.neuraltwin.app.ui.screens.*
import com.neuraltwin.app.ui.theme.DesignTokens
import com.neuraltwin.app.ui.theme.NeuralTwinTheme
import com.neuraltwin.app.viewmodel.AuthViewModel
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            NeuralTwinTheme {
                NeuralTwinApp()
            }
        }
    }
}

@Composable
fun NeuralTwinApp() {
    val navController = rememberNavController()
    val authViewModel: AuthViewModel = hiltViewModel()
    val isAuthenticated by authViewModel.isAuthenticated.collectAsState()

    Surface(
        modifier = Modifier.fillMaxSize(),
        color = MaterialTheme.colorScheme.background
    ) {
        if (isAuthenticated) {
            MainNavigation(navController, authViewModel)
        } else {
            AuthNavigation(navController, authViewModel)
        }
    }
}

@Composable
fun MainNavigation(navController: NavController, authViewModel: AuthViewModel) {
    var selectedTab by remember { mutableIntStateOf(0) }

    Scaffold(
        bottomBar = {
            NavigationBar(
                containerColor = DesignTokens.Surface1,
                contentColor = DesignTokens.TextPrimary
            ) {
                NavigationBarItem(
                    selected = selectedTab == 0,
                    onClick = { selectedTab = 0 },
                    icon = { Icon(Icons.Default.Home, "Home") },
                    label = { Text("Home") }
                )
                NavigationBarItem(
                    selected = selectedTab == 1,
                    onClick = { selectedTab = 1 },
                    icon = { Icon(Icons.Default.Mic, "Voice") },
                    label = { Text("Voice") }
                )
                NavigationBarItem(
                    selected = selectedTab == 2,
                    onClick = { selectedTab = 2 },
                    icon = { Icon(Icons.Default.People, "Twins") },
                    label = { Text("Twins") }
                )
                NavigationBarItem(
                    selected = selectedTab == 3,
                    onClick = { selectedTab = 3 },
                    icon = { Icon(Icons.Default.Favorite, "Coherence") },
                    label = { Text("Coherence") }
                )
                NavigationBarItem(
                    selected = selectedTab == 4,
                    onClick = { selectedTab = 4 },
                    icon = { Icon(Icons.Default.Settings, "Settings") },
                    label = { Text("Settings") }
                )
            }
        }
    ) { paddingValues ->
        Box(
            modifier = Modifier.padding(paddingValues)
        ) {
            when (selectedTab) {
                0 -> HomeScreen()
                1 -> VoiceRecordingScreen()
                2 -> TwinsListScreen()
                3 -> CoherenceScreen()
                4 -> SettingsScreen(authViewModel)
            }
        }
    }
}

@Composable
fun AuthNavigation(navController: NavController, authViewModel: AuthViewModel) {
    var isSignUp by remember { mutableStateOf(false) }

    if (isSignUp) {
        SignupScreen(authViewModel)
    } else {
        LoginScreen(authViewModel)
    }
}
