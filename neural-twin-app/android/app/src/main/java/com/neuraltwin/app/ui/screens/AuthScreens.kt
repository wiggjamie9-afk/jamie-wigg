package com.neuraltwin.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Brain
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.neuraltwin.app.ui.theme.DesignTokens
import com.neuraltwin.app.viewmodel.AuthViewModel

@Composable
fun LoginScreen(viewModel: AuthViewModel) {
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    val isLoading by viewModel.isLoading.collectAsState()
    val error by viewModel.error.collectAsState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DesignTokens.Background)
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Icon(
            imageVector = Icons.Default.Brain,
            contentDescription = "Neural Twin",
            modifier = Modifier.size(64.dp),
            tint = DesignTokens.BrandBlue
        )

        Spacer(modifier = Modifier.height(24.dp))

        Text(
            "Neural Twin",
            style = MaterialTheme.typography.displaySmall,
            color = DesignTokens.TextPrimary
        )

        Text(
            "Your personal AI companion",
            style = MaterialTheme.typography.bodyMedium,
            color = DesignTokens.TextSecondary
        )

        Spacer(modifier = Modifier.height(48.dp))

        OutlinedTextField(
            value = email,
            onValueChange = { email = it },
            label = { Text("Email") },
            modifier = Modifier
                .fillMaxWidth()
                .height(56.dp),
            shape = RoundedCornerShape(12.dp),
            singleLine = true,
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
            colors = OutlinedTextFieldDefaults.colors(
                unfocusedBorderColor = DesignTokens.Border,
                focusedBorderColor = DesignTokens.BrandBlue,
                unfocusedContainerColor = DesignTokens.Surface1,
                focusedContainerColor = DesignTokens.Surface1,
                unfocusedTextColor = DesignTokens.TextPrimary,
                focusedTextColor = DesignTokens.TextPrimary,
            )
        )

        Spacer(modifier = Modifier.height(12.dp))

        OutlinedTextField(
            value = password,
            onValueChange = { password = it },
            label = { Text("Password") },
            modifier = Modifier
                .fillMaxWidth()
                .height(56.dp),
            shape = RoundedCornerShape(12.dp),
            singleLine = true,
            visualTransformation = PasswordVisualTransformation(),
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
            colors = OutlinedTextFieldDefaults.colors(
                unfocusedBorderColor = DesignTokens.Border,
                focusedBorderColor = DesignTokens.BrandBlue,
                unfocusedContainerColor = DesignTokens.Surface1,
                focusedContainerColor = DesignTokens.Surface1,
                unfocusedTextColor = DesignTokens.TextPrimary,
                focusedTextColor = DesignTokens.TextPrimary,
            )
        )

        Spacer(modifier = Modifier.height(24.dp))

        Button(
            onClick = { viewModel.login(email, password) },
            modifier = Modifier
                .fillMaxWidth()
                .height(50.dp),
            shape = RoundedCornerShape(12.dp),
            colors = ButtonDefaults.buttonColors(
                containerColor = DesignTokens.BrandBlue
            ),
            enabled = !isLoading && email.isNotEmpty() && password.isNotEmpty()
        ) {
            if (isLoading) {
                CircularProgressIndicator(
                    modifier = Modifier.size(20.dp),
                    color = Color.White,
                    strokeWidth = 2.dp
                )
            } else {
                Text("Sign In", fontSize = 16.sp)
            }
        }

        error?.let { message ->
            Spacer(modifier = Modifier.height(12.dp))
            Text(
                text = message,
                color = Color(0xFFEF4444),
                style = MaterialTheme.typography.bodySmall,
                modifier = Modifier.fillMaxWidth()
            )
        }

        Spacer(modifier = Modifier.height(16.dp))

        TextButton(onClick = { /* Navigate to signup */ }) {
            Text(
                "Don't have an account? Sign up",
                color = DesignTokens.BrandBlue,
                style = MaterialTheme.typography.bodyMedium
            )
        }
    }
}

@Composable
fun SignupScreen(viewModel: AuthViewModel) {
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var name by remember { mutableStateOf("") }
    val isLoading by viewModel.isLoading.collectAsState()
    val error by viewModel.error.collectAsState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DesignTokens.Background)
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Icon(
            imageVector = Icons.Default.Brain,
            contentDescription = "Neural Twin",
            modifier = Modifier.size(64.dp),
            tint = DesignTokens.BrandBlue
        )

        Spacer(modifier = Modifier.height(24.dp))

        Text(
            "Neural Twin",
            style = MaterialTheme.typography.displaySmall,
            color = DesignTokens.TextPrimary
        )

        Text(
            "Create your AI companion",
            style = MaterialTheme.typography.bodyMedium,
            color = DesignTokens.TextSecondary
        )

        Spacer(modifier = Modifier.height(48.dp))

        OutlinedTextField(
            value = name,
            onValueChange = { name = it },
            label = { Text("Full Name") },
            modifier = Modifier
                .fillMaxWidth()
                .height(56.dp),
            shape = RoundedCornerShape(12.dp),
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

        Spacer(modifier = Modifier.height(12.dp))

        OutlinedTextField(
            value = email,
            onValueChange = { email = it },
            label = { Text("Email") },
            modifier = Modifier
                .fillMaxWidth()
                .height(56.dp),
            shape = RoundedCornerShape(12.dp),
            singleLine = true,
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
            colors = OutlinedTextFieldDefaults.colors(
                unfocusedBorderColor = DesignTokens.Border,
                focusedBorderColor = DesignTokens.BrandBlue,
                unfocusedContainerColor = DesignTokens.Surface1,
                focusedContainerColor = DesignTokens.Surface1,
                unfocusedTextColor = DesignTokens.TextPrimary,
                focusedTextColor = DesignTokens.TextPrimary,
            )
        )

        Spacer(modifier = Modifier.height(12.dp))

        OutlinedTextField(
            value = password,
            onValueChange = { password = it },
            label = { Text("Password") },
            modifier = Modifier
                .fillMaxWidth()
                .height(56.dp),
            shape = RoundedCornerShape(12.dp),
            singleLine = true,
            visualTransformation = PasswordVisualTransformation(),
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
            colors = OutlinedTextFieldDefaults.colors(
                unfocusedBorderColor = DesignTokens.Border,
                focusedBorderColor = DesignTokens.BrandBlue,
                unfocusedContainerColor = DesignTokens.Surface1,
                focusedContainerColor = DesignTokens.Surface1,
                unfocusedTextColor = DesignTokens.TextPrimary,
                focusedTextColor = DesignTokens.TextPrimary,
            )
        )

        Spacer(modifier = Modifier.height(24.dp))

        Button(
            onClick = { viewModel.signup(email, password, name) },
            modifier = Modifier
                .fillMaxWidth()
                .height(50.dp),
            shape = RoundedCornerShape(12.dp),
            colors = ButtonDefaults.buttonColors(
                containerColor = DesignTokens.BrandBlue
            ),
            enabled = !isLoading && email.isNotEmpty() && password.isNotEmpty() && name.isNotEmpty()
        ) {
            if (isLoading) {
                CircularProgressIndicator(
                    modifier = Modifier.size(20.dp),
                    color = Color.White,
                    strokeWidth = 2.dp
                )
            } else {
                Text("Create Account", fontSize = 16.sp)
            }
        }

        error?.let { message ->
            Spacer(modifier = Modifier.height(12.dp))
            Text(
                text = message,
                color = Color(0xFFEF4444),
                style = MaterialTheme.typography.bodySmall,
                modifier = Modifier.fillMaxWidth()
            )
        }

        Spacer(modifier = Modifier.height(16.dp))

        TextButton(onClick = { /* Navigate to login */ }) {
            Text(
                "Already have an account? Sign in",
                color = DesignTokens.BrandBlue,
                style = MaterialTheme.typography.bodyMedium
            )
        }
    }
}

