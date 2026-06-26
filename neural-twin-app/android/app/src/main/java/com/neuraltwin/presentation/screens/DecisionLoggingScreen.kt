package com.neuraltwin.presentation.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import com.neuraltwin.app.viewmodel.DecisionViewModel
import com.neuraltwin.presentation.theme.BrandBlue
import com.neuraltwin.presentation.theme.Surface1
import com.neuraltwin.presentation.theme.Surface2
import com.neuraltwin.presentation.theme.TextSecondary
import com.neuraltwin.presentation.theme.SuccessGreen
import com.neuraltwin.presentation.theme.ErrorRed

@Composable
fun DecisionLoggingScreen(
    userId: String = "current_user",
    viewModel: DecisionViewModel = hiltViewModel()
) {
    // Form state
    var decisionTitle by remember { mutableStateOf("") }
    var description by remember { mutableStateOf("") }
    var selectedCategory by remember { mutableStateOf("general") }
    var chosenOption by remember { mutableStateOf("") }
    var reasoning by remember { mutableStateOf("") }
    var planningClarity by remember { mutableStateOf(5f) }
    var monitoringComprehension by remember { mutableStateOf(5f) }
    var evaluationEffectiveness by remember { mutableStateOf(5f) }
    var reflectionInsights by remember { mutableStateOf("") }

    // Category dropdown state
    var categoryExpanded by remember { mutableStateOf(false) }

    // ViewModel state collection
    val isLoading by viewModel.isLoading.collectAsState()
    val error by viewModel.error.collectAsState()
    val decisionResponse by viewModel.decisionResponse.collectAsState()

    // Show success state
    val showSuccess = remember { mutableStateOf(false) }
    val successMessage = remember { mutableStateOf("Decision logged successfully!") }

    // Auto-hide success message after 3 seconds
    LaunchedEffect(showSuccess.value) {
        if (showSuccess.value) {
            kotlinx.coroutines.delay(3000)
            showSuccess.value = false
            // Clear form
            decisionTitle = ""
            description = ""
            selectedCategory = "general"
            chosenOption = ""
            reasoning = ""
            planningClarity = 5f
            monitoringComprehension = 5f
            evaluationEffectiveness = 5f
            reflectionInsights = ""
        }
    }

    // Monitor decision response
    LaunchedEffect(decisionResponse) {
        if (decisionResponse != null) {
            showSuccess.value = true
            viewModel.resetResponse()
        }
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.Black)
    ) {
        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            // Header
            item {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text(
                        "Log Decision",
                        fontSize = 28.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.White
                    )
                    Text(
                        "Document your decision-making process",
                        fontSize = 13.sp,
                        color = TextSecondary
                    )
                }
            }

            // Success message
            if (showSuccess.value) {
                item {
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        colors = CardDefaults.cardColors(
                            containerColor = Surface1.copy(alpha = 0.8f)
                        ),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(12.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(12.dp)
                        ) {
                            Text(
                                "✓",
                                fontSize = 20.sp,
                                color = SuccessGreen,
                                fontWeight = FontWeight.Bold
                            )
                            Text(
                                successMessage.value,
                                fontSize = 13.sp,
                                color = SuccessGreen,
                                fontWeight = FontWeight.Medium
                            )
                        }
                    }
                }
            }

            // Error message
            if (error != null) {
                item {
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        colors = CardDefaults.cardColors(
                            containerColor = Surface1.copy(alpha = 0.8f)
                        ),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(12.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(12.dp)
                        ) {
                            Text(
                                "!",
                                fontSize = 20.sp,
                                color = ErrorRed,
                                fontWeight = FontWeight.Bold
                            )
                            Text(
                                error ?: "An error occurred",
                                fontSize = 13.sp,
                                color = ErrorRed,
                                fontWeight = FontWeight.Medium
                            )
                        }
                    }
                }
            }

            // Decision Title (Required)
            item {
                FormFieldLabel("Decision Title", isRequired = true)
                TextField(
                    value = decisionTitle,
                    onValueChange = { decisionTitle = it },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(48.dp),
                    placeholder = {
                        Text("e.g., Career change decision", color = TextSecondary)
                    },
                    colors = TextFieldDefaults.colors(
                        focusedContainerColor = Surface1,
                        unfocusedContainerColor = Surface1,
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Color.White,
                        focusedIndicatorColor = BrandBlue,
                        unfocusedIndicatorColor = Surface2
                    ),
                    shape = RoundedCornerShape(8.dp),
                    singleLine = true,
                    textStyle = androidx.compose.material3.LocalTextStyle.current.copy(
                        fontSize = 14.sp
                    )
                )
            }

            // Description (Optional, multiline)
            item {
                FormFieldLabel("Description", isRequired = false)
                TextField(
                    value = description,
                    onValueChange = { description = it },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(100.dp),
                    placeholder = {
                        Text("Add context or background information...", color = TextSecondary)
                    },
                    colors = TextFieldDefaults.colors(
                        focusedContainerColor = Surface1,
                        unfocusedContainerColor = Surface1,
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Color.White,
                        focusedIndicatorColor = BrandBlue,
                        unfocusedIndicatorColor = Surface2
                    ),
                    shape = RoundedCornerShape(8.dp),
                    textStyle = androidx.compose.material3.LocalTextStyle.current.copy(
                        fontSize = 14.sp
                    )
                )
            }

            // Category Dropdown
            item {
                FormFieldLabel("Category", isRequired = true)
                Box {
                    Button(
                        onClick = { categoryExpanded = !categoryExpanded },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(48.dp),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = Surface1
                        ),
                        shape = RoundedCornerShape(8.dp),
                        border = androidx.compose.foundation.BorderStroke(
                            1.dp,
                            Surface2
                        )
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                selectedCategory.replaceFirstChar { it.uppercase() },
                                fontSize = 14.sp,
                                color = Color.White,
                                fontWeight = FontWeight.Medium
                            )
                            Text("▼", color = TextSecondary, fontSize = 12.sp)
                        }
                    }

                    DropdownMenu(
                        expanded = categoryExpanded,
                        onDismissRequest = { categoryExpanded = false },
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(Surface1)
                    ) {
                        listOf("general", "financial", "career", "health", "relationship", "other")
                            .forEach { category ->
                                DropdownMenuItem(
                                    text = {
                                        Text(
                                            category.replaceFirstChar { it.uppercase() },
                                            color = Color.White,
                                            fontSize = 14.sp
                                        )
                                    },
                                    onClick = {
                                        selectedCategory = category
                                        categoryExpanded = false
                                    }
                                )
                            }
                    }
                }
            }

            // Chosen Option
            item {
                FormFieldLabel("What Did You Choose?", isRequired = true)
                TextField(
                    value = chosenOption,
                    onValueChange = { chosenOption = it },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(48.dp),
                    placeholder = {
                        Text("Describe the option you selected...", color = TextSecondary)
                    },
                    colors = TextFieldDefaults.colors(
                        focusedContainerColor = Surface1,
                        unfocusedContainerColor = Surface1,
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Color.White,
                        focusedIndicatorColor = BrandBlue,
                        unfocusedIndicatorColor = Surface2
                    ),
                    shape = RoundedCornerShape(8.dp),
                    singleLine = true,
                    textStyle = androidx.compose.material3.LocalTextStyle.current.copy(
                        fontSize = 14.sp
                    )
                )
            }

            // Reasoning (Multiline)
            item {
                FormFieldLabel("Reasoning", isRequired = true)
                TextField(
                    value = reasoning,
                    onValueChange = { reasoning = it },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(100.dp),
                    placeholder = {
                        Text("Why did you choose this option?", color = TextSecondary)
                    },
                    colors = TextFieldDefaults.colors(
                        focusedContainerColor = Surface1,
                        unfocusedContainerColor = Surface1,
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Color.White,
                        focusedIndicatorColor = BrandBlue,
                        unfocusedIndicatorColor = Surface2
                    ),
                    shape = RoundedCornerShape(8.dp),
                    textStyle = androidx.compose.material3.LocalTextStyle.current.copy(
                        fontSize = 14.sp
                    )
                )
            }

            // Planning Clarity Slider (1-10)
            item {
                SliderField(
                    label = "Planning Clarity",
                    value = planningClarity,
                    onValueChange = { planningClarity = it },
                    description = "How clear was your plan?"
                )
            }

            // Monitoring Comprehension Slider (1-10)
            item {
                SliderField(
                    label = "Monitoring Comprehension",
                    value = monitoringComprehension,
                    onValueChange = { monitoringComprehension = it },
                    description = "How well did you track outcomes?"
                )
            }

            // Evaluation Effectiveness Slider (1-10)
            item {
                SliderField(
                    label = "Evaluation Effectiveness",
                    value = evaluationEffectiveness,
                    onValueChange = { evaluationEffectiveness = it },
                    description = "How effective was your evaluation?"
                )
            }

            // Reflection Insights (Multiline, Optional)
            item {
                FormFieldLabel("Reflection Insights", isRequired = false)
                TextField(
                    value = reflectionInsights,
                    onValueChange = { reflectionInsights = it },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(100.dp),
                    placeholder = {
                        Text("What did you learn from this decision?", color = TextSecondary)
                    },
                    colors = TextFieldDefaults.colors(
                        focusedContainerColor = Surface1,
                        unfocusedContainerColor = Surface1,
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Color.White,
                        focusedIndicatorColor = BrandBlue,
                        unfocusedIndicatorColor = Surface2
                    ),
                    shape = RoundedCornerShape(8.dp),
                    textStyle = androidx.compose.material3.LocalTextStyle.current.copy(
                        fontSize = 14.sp
                    )
                )
            }

            // Submit Button
            item {
                Button(
                    onClick = {
                        // Validate required fields
                        if (decisionTitle.isNotBlank() && chosenOption.isNotBlank() && reasoning.isNotBlank()) {
                            viewModel.logDecision(
                                userId = userId,
                                title = decisionTitle,
                                description = description,
                                chosenOption = chosenOption,
                                reasoning = reasoning,
                                category = selectedCategory,
                                planningClarity = planningClarity.toInt(),
                                monitoringComprehension = monitoringComprehension.toInt(),
                                evaluationEffectiveness = evaluationEffectiveness.toInt(),
                                reflectionInsights = reflectionInsights.ifBlank { null }
                            )
                        }
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(50.dp),
                    enabled = !isLoading && decisionTitle.isNotBlank() && chosenOption.isNotBlank() && reasoning.isNotBlank(),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = BrandBlue,
                        disabledContainerColor = Surface2
                    ),
                    shape = RoundedCornerShape(8.dp)
                ) {
                    if (isLoading) {
                        CircularProgressIndicator(
                            modifier = Modifier.size(20.dp),
                            color = Color.White,
                            strokeWidth = 2.dp
                        )
                    } else {
                        Text(
                            "Log Decision",
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color.White
                        )
                    }
                }
            }

            // Bottom spacing
            item {
                Spacer(modifier = Modifier.height(16.dp))
            }
        }
    }
}

@Composable
fun FormFieldLabel(
    label: String,
    isRequired: Boolean = false,
    modifier: Modifier = Modifier
) {
    Row(
        modifier = modifier.fillMaxWidth(),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(4.dp)
    ) {
        Text(
            label,
            fontSize = 13.sp,
            fontWeight = FontWeight.SemiBold,
            color = Color.White
        )
        if (isRequired) {
            Text(
                "*",
                fontSize = 13.sp,
                fontWeight = FontWeight.Bold,
                color = ErrorRed
            )
        }
    }
}

@Composable
fun SliderField(
    label: String,
    value: Float,
    onValueChange: (Float) -> Unit,
    description: String = "",
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = Surface1),
        shape = RoundedCornerShape(12.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(verticalArrangement = Arrangement.spacedBy(2.dp)) {
                    Text(
                        label,
                        fontSize = 13.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = Color.White
                    )
                    if (description.isNotEmpty()) {
                        Text(
                            description,
                            fontSize = 11.sp,
                            color = TextSecondary
                        )
                    }
                }
                Box(
                    modifier = Modifier
                        .background(Surface2, RoundedCornerShape(6.dp))
                        .padding(8.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        "${value.toInt()}/10",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = BrandBlue
                    )
                }
            }

            Slider(
                value = value,
                onValueChange = onValueChange,
                valueRange = 1f..10f,
                steps = 8,
                modifier = Modifier.fillMaxWidth(),
                colors = SliderDefaults.colors(
                    thumbColor = BrandBlue,
                    activeTrackColor = BrandBlue,
                    inactiveTrackColor = Surface2
                )
            )

            // Min/Max labels
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(
                    "Low",
                    fontSize = 10.sp,
                    color = TextSecondary
                )
                Text(
                    "High",
                    fontSize = 10.sp,
                    color = TextSecondary
                )
            }
        }
    }
}
