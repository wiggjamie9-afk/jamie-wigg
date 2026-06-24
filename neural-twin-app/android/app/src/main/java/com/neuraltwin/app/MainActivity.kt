package com.neuraltwin.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.NavController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.neuraltwin.app.ui.screens.*
import com.neuraltwin.app.ui.theme.NeuralTwinTheme
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
            MainNavigation(navController)
        } else {
            AuthNavigation(navController, authViewModel)
        }
    }
}

@Composable
fun MainNavigation(navController: NavController) {
    var selectedTab by remember { mutableIntStateOf(0) }

    Scaffold(
        bottomBar = {
            NavigationBar {
                NavigationBarItem(
                    selected = selectedTab == 0,
                    onClick = { selectedTab = 0; navController.navigate("home") },
                    icon = { Icon(androidx.compose.material.icons.Icons.Default.Home, "Home") },
                    label = { Text("Home") }
                )
                NavigationBarItem(
                    selected = selectedTab == 1,
                    onClick = { selectedTab = 1; navController.navigate("voice") },
                    icon = { Icon(androidx.compose.material.icons.Icons.Default.Mic, "Voice") },
                    label = { Text("Voice") }
                )
                NavigationBarItem(
                    selected = selectedTab == 2,
                    onClick = { selectedTab = 2; navController.navigate("twins") },
                    icon = { Icon(androidx.compose.material.icons.Icons.Default.People, "Twins") },
                    label = { Text("Twins") }
                )
                NavigationBarItem(
                    selected = selectedTab == 3,
                    onClick = { selectedTab = 3; navController.navigate("coherence") },
                    icon = { Icon(androidx.compose.material.icons.Icons.Default.Favorite, "Coherence") },
                    label = { Text("Coherence") }
                )
                NavigationBarItem(
                    selected = selectedTab == 4,
                    onClick = { selectedTab = 4; navController.navigate("settings") },
                    icon = { Icon(androidx.compose.material.icons.Icons.Default.Settings, "Settings") },
                    label = { Text("Settings") }
                )
            }
        }
    ) { paddingValues ->
        NavHost(
            navController = navController,
            startDestination = "home",
            modifier = Modifier.padding(paddingValues)
        ) {
            composable("home") { HomeScreen() }
            composable("voice") { VoiceRecordingScreen() }
            composable("twins") { TwinsListScreen() }
            composable("coherence") { CoherenceScreen() }
            composable("settings") { SettingsScreen() }
        }
    }
}

@Composable
fun AuthNavigation(navController: NavController, authViewModel: AuthViewModel) {
    NavHost(
        navController = navController,
        startDestination = "login"
    ) {
        composable("login") { LoginScreen(authViewModel) }
        composable("signup") { SignupScreen(authViewModel) }
    }
}

// ============================================================================
// SCREENS - STUBS
// ============================================================================

@Composable
fun HomeScreen() {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        Text(
            "Welcome to Neural Twin",
            style = MaterialTheme.typography.headlineSmall
        )
        Text(
            "Your personal AI companion",
            style = MaterialTheme.typography.labelSmall
        )
        Spacer(modifier = Modifier.height(16.dp))
        Text("Home screen - Phase 1")
    }
}

@Composable
fun VoiceRecordingScreen() {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        Text("Voice Recording", style = MaterialTheme.typography.headlineSmall)
        Spacer(modifier = Modifier.height(16.dp))
        Button(onClick = {}) {
            Text("Start Recording")
        }
    }
}

@Composable
fun TwinsListScreen() {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        Text("Twins", style = MaterialTheme.typography.headlineSmall)
        Spacer(modifier = Modifier.height(16.dp))
        Text("Twin list - Phase 2")
    }
}

@Composable
fun CoherenceScreen() {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        Text("Coherence", style = MaterialTheme.typography.headlineSmall)
        Spacer(modifier = Modifier.height(16.dp))
        Text("Coherence dashboard - Phase 4")
    }
}

@Composable
fun SettingsScreen() {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        Text("Settings", style = MaterialTheme.typography.headlineSmall)
    }
}

@Composable
fun LoginScreen(viewModel: AuthViewModel) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = androidx.compose.ui.Alignment.CenterHorizontally
    ) {
        Text("Login - Phase 0")
    }
}

@Composable
fun SignupScreen(viewModel: AuthViewModel) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = androidx.compose.ui.Alignment.CenterHorizontally
    ) {
        Text("Sign up - Phase 0")
    }
}
