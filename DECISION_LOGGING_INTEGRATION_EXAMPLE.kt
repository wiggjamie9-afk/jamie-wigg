// Example: How to integrate DecisionLoggingScreen into your app navigation

package com.neuraltwin.app.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import com.neuraltwin.presentation.screens.DecisionLoggingScreen
import com.neuraltwin.presentation.screens.HomeScreen
import com.neuraltwin.presentation.screens.CoherenceScreen

// Example 1: Basic Integration in NavHost
@Composable
fun AppNavigation(navController: NavHostController, userId: String) {
    NavHost(
        navController = navController,
        startDestination = "home"
    ) {
        composable("home") {
            HomeScreen()
        }

        composable("coherence") {
            CoherenceScreen(userId = userId)
        }

        // Add DecisionLoggingScreen route
        composable("decision_logging") {
            DecisionLoggingScreen(userId = userId)
        }
    }
}

// Example 2: Navigation from HomeScreen or other screens
// Add this to your screen or ViewModel:

/*
// In your screen composable:
val navController = LocalNavController.current

Button(
    onClick = {
        navController.navigate("decision_logging")
    }
) {
    Text("Log Decision")
}

// Or from a ViewModel:
fun navigateToDecisionLogging() {
    navigationEventChannel.send(NavigationEvent.NavigateTo("decision_logging"))
}
*/

// Example 3: Setup if using Hilt Navigation Compose
// Make sure your MainActivity or compose setup has:

/*
setContent {
    NeuralTwinTheme {
        val navController = rememberNavController()
        AppNavigation(navController, userId = "current_user_id")
    }
}
*/

// Example 4: Full Screen Implementation with Bottom Sheet Alternative
@Composable
fun DecisionLoggingSheet(
    userId: String,
    onDismiss: () -> Unit
) {
    // Use DecisionLoggingScreen in a ModalBottomSheet if preferred
    DecisionLoggingScreen(userId = userId)
}

// Example 5: Testing the Screen in Preview
@androidx.compose.ui.tooling.preview.Preview(
    showBackground = true,
    backgroundColor = 0xFF000000
)
@Composable
fun DecisionLoggingScreenPreview() {
    DecisionLoggingScreen(userId = "preview_user")
}

// Example 6: Passing from Activity
/*
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            NeuralTwinTheme {
                Surface(modifier = Modifier.fillMaxSize()) {
                    val navController = rememberNavController()
                    val userId = "user_123"
                    AppNavigation(navController, userId)
                }
            }
        }
    }
}
*/

// Example 7: Error handling customization
/*
// If you want custom error handling, extend the screen:
@Composable
fun DecisionLoggingScreenWithCustomHandler(
    userId: String,
    onSuccess: (decisionId: String) -> Unit = {},
    onError: (message: String) -> Unit = {}
) {
    DecisionLoggingScreen(
        userId = userId,
        viewModel = hiltViewModel()
    )

    // Could add custom LaunchedEffect here for additional handling
}
*/

// Example 8: Fullscreen Dialog Variant
/*
@Composable
fun DecisionLoggingDialog(
    userId: String,
    onDismiss: () -> Unit
) {
    Dialog(
        onDismissRequest = onDismiss,
        properties = DialogProperties(
            usePlatformDefaultWidth = false,
            dismissOnBackPress = true,
            dismissOnClickOutside = false
        )
    ) {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(Color.Black)
        ) {
            DecisionLoggingScreen(userId = userId)

            IconButton(
                onClick = onDismiss,
                modifier = Modifier
                    .align(Alignment.TopEnd)
                    .padding(16.dp)
            ) {
                Icon(
                    Icons.Default.Close,
                    contentDescription = "Close",
                    tint = Color.White
                )
            }
        }
    }
}
*/

// Example 9: FAB Navigation (from Home/Coherence screens)
/*
FloatingActionButton(
    onClick = {
        navController.navigate("decision_logging")
    },
    containerColor = BrandBlue,
    contentColor = Color.White,
    modifier = Modifier
        .align(Alignment.BottomEnd)
        .padding(16.dp)
) {
    Icon(Icons.Default.Add, contentDescription = "Log Decision")
}
*/

// Example 10: DeepLink Support (optional)
/*
// In your NavHost:
composable(
    "decision_logging?userId={userId}",
    arguments = listOf(
        navArgument("userId") {
            type = NavType.StringType
            defaultValue = "current_user"
        }
    )
) { backStackEntry ->
    DecisionLoggingScreen(
        userId = backStackEntry.arguments?.getString("userId") ?: "current_user"
    )
}

// Then navigate with:
navController.navigate("decision_logging?userId=some_user_id")
*/
