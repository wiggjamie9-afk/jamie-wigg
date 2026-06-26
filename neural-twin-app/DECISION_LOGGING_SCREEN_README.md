# DecisionLoggingScreen Implementation

## Overview
Complete Jetpack Compose UI for logging and documenting decisions with metacognitive assessment. Integrates seamlessly with the existing `DecisionViewModel`.

## Files Created

### 1. **DecisionLoggingScreen.kt**
Location: `neural-twin-app/android/app/src/main/java/com/neuraltwin/presentation/screens/DecisionLoggingScreen.kt`

Main composable screen with full form for decision logging.

**Key Features:**
- ✓ Hilt ViewModel injection via `hiltViewModel<DecisionViewModel>()`
- ✓ Real-time state collection using `collectAsState()`
- ✓ Loading state with `CircularProgressIndicator`
- ✓ Error message display in card UI
- ✓ Success message that auto-dismisses after 3 seconds
- ✓ Form validation for required fields

### 2. **Color.kt** (Theme Support)
Location: `neural-twin-app/android/app/src/main/java/com/neuraltwin/presentation/theme/Color.kt`

Design tokens matching the dark theme used across HomeScreen and CoherenceScreen.

**Tokens:**
- `BrandBlue`: Primary blue (#0A84FF)
- `Surface1` / `Surface2`: Card backgrounds
- `TextSecondary`: Secondary text color
- `SuccessGreen` / `ErrorRed`: Status colors

---

## Form Fields

### 1. **Decision Title** (Required)
- TextField with single line
- Placeholder: "e.g., Career change decision"
- Validation: Prevents submit if empty

### 2. **Description** (Optional)
- TextField with 4-line height
- Supports multiline text
- Placeholder: "Add context or background information..."

### 3. **Category Dropdown** (Required)
- Material 3 dropdown menu
- Options: general, financial, career, health, relationship, other
- Default: "general"
- Custom styled button with dropdown arrow

### 4. **Chosen Option** (Required)
- TextField describing the selected option
- Validation: Required for submit

### 5. **Reasoning** (Required)
- Multiline TextField (100.dp height)
- Placeholder: "Why did you choose this option?"
- Validation: Required for submit

### 6. **Planning Clarity Slider** (1-10)
- Horizontal slider with 10-step range
- Shows "X/10" badge
- Label: "How clear was your plan?"
- Custom `SliderField` component

### 7. **Monitoring Comprehension Slider** (1-10)
- Same style as Planning Clarity
- Label: "How well did you track outcomes?"
- Default: 5

### 8. **Evaluation Effectiveness Slider** (1-10)
- Same style as above sliders
- Label: "How effective was your evaluation?"
- Default: 5

### 9. **Reflection Insights** (Optional)
- Multiline TextField (100.dp height)
- Placeholder: "What did you learn from this decision?"

---

## State Management

### Local State
```kotlin
var decisionTitle by remember { mutableStateOf("") }
var description by remember { mutableStateOf("") }
var selectedCategory by remember { mutableStateOf("general") }
var chosenOption by remember { mutableStateOf("") }
var reasoning by remember { mutableStateOf("") }
var planningClarity by remember { mutableStateOf(5f) }
var monitoringComprehension by remember { mutableStateOf(5f) }
var evaluationEffectiveness by remember { mutableStateOf(5f) }
var reflectionInsights by remember { mutableStateOf("") }
```

### ViewModel State Collection
```kotlin
val isLoading by viewModel.isLoading.collectAsState()
val error by viewModel.error.collectAsState()
val decisionResponse by viewModel.decisionResponse.collectAsState()
```

### Success/Error UI
- **Success**: Green card with checkmark, auto-dismisses after 3 seconds
- **Error**: Red card with error message, persists until new attempt
- Form clears automatically on success

---

## Behavior & Interactions

### Submit Button
- **Disabled states:**
  - `isLoading == true` (shows spinner)
  - Any required field is empty
  - `decisionTitle.isBlank() || chosenOption.isBlank() || reasoning.isBlank()`

- **On click:**
  ```kotlin
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
  ```

### Dropdown Category
- Expands/collapses on click
- Reflects current selection in button label
- Dismisses on selection

### Sliders
- Range: 1-10
- Step size: 0.2 (8 steps between 1-10)
- Real-time display of current value
- Custom styling with brand colors

---

## Design & Styling

### Dark Theme (Black Background)
```kotlin
Box(modifier = Modifier
    .fillMaxSize()
    .background(Color.Black)
)
```

### Spacing
- Page padding: 16.dp
- Section spacing: 12.dp
- Internal card padding: 16.dp
- Field height: 48-100.dp (TextField), 12.dp (Sliders)

### Colors
- **Containers:** `Surface1` (#1A1A1A)
- **Borders:** `Surface2` (#2A2A2A)
- **Primary text:** `Color.White`
- **Secondary text:** `TextSecondary` (#A0A0A0)
- **Accents:** `BrandBlue` (#0A84FF)
- **Status:** `SuccessGreen`, `ErrorRed`

### Components
- All TextFields: 8.dp `RoundedCornerShape`
- Cards: 12.dp `RoundedCornerShape` (sliders), 16.dp (larger cards)
- Buttons: 8.dp rounded corners
- Consistent `Material3` text field styling

---

## Helper Composables

### `FormFieldLabel(label: String, isRequired: Boolean)`
Reusable field label with optional red asterisk for required fields.

```kotlin
FormFieldLabel("Decision Title", isRequired = true)
```

### `SliderField(label: String, value: Float, onValueChange: (Float) -> Unit, description: String)`
Custom slider component with:
- Title + description
- Current value badge (e.g., "7/10")
- Min/max labels ("Low" / "High")
- Brand blue styling

```kotlin
SliderField(
    label = "Planning Clarity",
    value = planningClarity,
    onValueChange = { planningClarity = it },
    description = "How clear was your plan?"
)
```

---

## Navigation & Usage

### From Your App Navigation
```kotlin
// In your NavHost or navigation composable
composable("decision_logging") {
    DecisionLoggingScreen(
        userId = currentUserId,  // Pass your user ID
        viewModel = hiltViewModel()  // Hilt auto-provides
    )
}
```

### Default Parameters
- `userId`: Defaults to `"current_user"` (override in your navigation)
- `viewModel`: Auto-injected via Hilt

---

## Data Flow

```
User Input
    ↓
[Form State Variables]
    ↓
Submit Button Click
    ↓
viewModel.logDecision() - Calls Repository
    ↓
API Response
    ↓
isLoading → false
decisionResponse → populated
    ↓
success UI (green card)
Form clears automatically
LaunchedEffect → dismiss after 3s
```

---

## Required Dependencies

All dependencies are already in your `build.gradle.kts`:
- `androidx.compose.material3:material3` (Material Design 3)
- `androidx.hilt:hilt-navigation-compose` (Hilt ViewModel injection)
- `androidx.lifecycle:lifecycle-runtime-compose` (StateFlow collection)

**No additional dependencies needed!**

---

## Testing Tips

### Test Cases
1. **Required field validation** - Try submitting with empty title
2. **Category selection** - Tap dropdown, verify options display
3. **Slider interaction** - Drag sliders, verify 1-10 range
4. **Success flow** - Fill all fields, submit, verify success card appears
5. **Success auto-dismiss** - Wait 3 seconds, verify form clears
6. **Error handling** - Mock API failure, verify error card shows
7. **Loading state** - Verify spinner shows on submit

### Mock Data
```kotlin
DecisionLoggingScreen(
    userId = "test_user_123",
    viewModel = hiltViewModel()
)
```

---

## Customization

### Change Colors
Edit `Color.kt`:
```kotlin
val BrandBlue = Color(0xYOUR_HEX)
```

### Change Slider Range
In `SliderField()`:
```kotlin
Slider(
    value = value,
    onValueChange = onValueChange,
    valueRange = 1f..100f,  // Change range
    steps = 99  // Adjust step count
)
```

### Change Success Message Duration
In `LaunchedEffect`:
```kotlin
kotlinx.coroutines.delay(5000)  // 5 seconds instead of 3
```

### Add Optional Fields as Required
Remove `.ifBlank { null }` in submit logic:
```kotlin
reflectionInsights = reflectionInsights  // Now required
```

---

## File Summary

| File | Path | Purpose |
|------|------|---------|
| `DecisionLoggingScreen.kt` | `presentation/screens/` | Main UI composable |
| `Color.kt` | `presentation/theme/` | Design tokens |
| `DecisionViewModel.kt` | `viewmodel/` | (Existing) State & API calls |

---

## Integration Checklist

- [x] Copy `DecisionLoggingScreen.kt` to `presentation/screens/`
- [x] Copy `Color.kt` to `presentation/theme/` (create folder if needed)
- [x] Ensure `DecisionViewModel` is injected in your navigation
- [x] Add route to your NavHost
- [x] Test form submission with a live or mock API
- [x] Customize colors/spacing as needed
- [x] Verify Material 3 dependencies in `build.gradle.kts`

---

## Notes

- Form uses `LazyColumn` for smooth scrolling on smaller screens
- All sliders default to 5 (middle of 1-10 range)
- Category dropdown is Material 3 styled with custom button appearance
- Submit button shows spinner while loading and is disabled
- Error messages persist until next interaction; success auto-clears
- All text fields support copy/paste and standard keyboard interactions
- Theme colors automatically adapt to your existing design system

**Ready to integrate!** 🚀
