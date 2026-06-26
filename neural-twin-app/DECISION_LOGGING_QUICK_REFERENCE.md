# DecisionLoggingScreen - Quick Reference

## TL;DR - 3 Files, Ready to Use

### File 1: Theme Colors
**Location:** `android/app/src/main/java/com/neuraltwin/presentation/theme/Color.kt`
```kotlin
val BrandBlue = Color(0xFF0A84FF)
val Surface1 = Color(0xFF1A1A1A)
val TextSecondary = Color(0xFFA0A0A0)
// ... 9 more tokens
```

### File 2: Main Screen
**Location:** `android/app/src/main/java/com/neuraltwin/presentation/screens/DecisionLoggingScreen.kt`
- 450+ lines of production-ready Compose code
- Fully typed, null-safe, state-managed
- Material Design 3 components

### File 3: Helper Composable
Included in DecisionLoggingScreen.kt:
- `FormFieldLabel()` - Reusable field headers with required indicator
- `SliderField()` - Custom slider with badges and labels

---

## Screen Anatomy

```
┌─────────────────────────────────┐
│  Log Decision                   │  Header
│  Document your decision...      │
├─────────────────────────────────┤
│  ✓ Decision logged!             │  Success Card (auto-dismiss)
├─────────────────────────────────┤
│  ! Error message                │  Error Card (persistent)
├─────────────────────────────────┤
│  Decision Title *               │
│  [                            ] │  Required TextField
├─────────────────────────────────┤
│  Description                    │
│  [                            ] │  Optional TextArea
│  [                            ] │
├─────────────────────────────────┤
│  Category *                     │
│  [general ▼]                    │  Dropdown (6 options)
├─────────────────────────────────┤
│  What Did You Choose? *         │
│  [                            ] │  Required TextField
├─────────────────────────────────┤
│  Reasoning *                    │
│  [                            ] │  Required TextArea
│  [                            ] │
├─────────────────────────────────┤
│  Planning Clarity       7/10    │  Slider 1-10
│  ┌──────●──────────┐            │
│  Low      High                  │
├─────────────────────────────────┤
│  Monitoring Comprehension 5/10  │  Slider 1-10
│  ┌─────●───────────┐            │
│  Low      High                  │
├─────────────────────────────────┤
│  Evaluation Effectiveness 5/10  │  Slider 1-10
│  ┌─────●───────────┐            │
│  Low      High                  │
├─────────────────────────────────┤
│  Reflection Insights            │
│  [                            ] │  Optional TextArea
│  [                            ] │
├─────────────────────────────────┤
│  [  Log Decision  ]             │  Submit Button
│  [ ○ Loading... ]  (disabled)   │  OR spinner on click
└─────────────────────────────────┘
```

---

## Required Fields
- ✓ **Decision Title** — Cannot be empty
- ✓ **Chosen Option** — Cannot be empty
- ✓ **Reasoning** — Cannot be empty
- ✓ **Category** — Dropdown, defaults to "general"

## Optional Fields
- Description
- Reflection Insights

## Auto-Set Fields
- Planning Clarity: 5
- Monitoring Comprehension: 5
- Evaluation Effectiveness: 5

---

## Copy-Paste Navigation Example

Add to your `NavHost`:
```kotlin
composable("decision_logging") {
    DecisionLoggingScreen(userId = getCurrentUserId())
}
```

Navigate to screen:
```kotlin
navController.navigate("decision_logging")
```

---

## Colors Used

| Token | Hex | Usage |
|-------|-----|-------|
| BrandBlue | #0A84FF | Buttons, active indicators, sliders |
| Surface1 | #1A1A1A | Card backgrounds, input fields |
| Surface2 | #2A2A2A | Borders, disabled states |
| TextSecondary | #A0A0A0 | Helper text, labels |
| SuccessGreen | #34C759 | Success message, good scores |
| ErrorRed | #FF3B30 | Error message, required indicator |
| White | #FFFFFF | Primary text |
| Black | #000000 | Page background |

---

## Form Validation

**Submit Button:**
- ✗ Disabled if: any required field empty
- ✗ Disabled if: isLoading = true
- ✓ Enabled if: all required fields filled

**What Happens on Submit:**
1. Validates all required fields
2. Calls `viewModel.logDecision()` with form data
3. Shows spinner in button
4. On success: Green card appears → Auto-dismisses in 3s → Form clears
5. On error: Red card appears → Persists until next attempt

---

## State Variables (Can Be Customized)

```kotlin
val decisionTitle: String           // Empty by default
val description: String             // Empty
val selectedCategory: String        // "general"
val chosenOption: String            // Empty
val reasoning: String               // Empty
val planningClarity: Float          // 5f (1-10 range)
val monitoringComprehension: Float  // 5f (1-10 range)
val evaluationEffectiveness: Float  // 5f (1-10 range)
val reflectionInsights: String      // Empty
```

---

## ViewModel Methods Called

```kotlin
viewModel.logDecision(
    userId: String,
    title: String,
    description: String,
    chosenOption: String,
    reasoning: String,
    category: String,
    planningClarity: Int,
    monitoringComprehension: Int,
    evaluationEffectiveness: Int,
    reflectionInsights: String?
)
```

**Returns:**
- `isLoading: Flow<Boolean>` — Turns on during API call
- `error: Flow<String?>` — Error message if request fails
- `decisionResponse: Flow<DecisionLoggingResponse?>` — Success response

---

## Keyboard & UX

- **Title field:** Single-line text input, auto-close keyboard
- **Description field:** 4 lines, multiline enabled
- **Reasoning field:** 4 lines, multiline enabled
- **Reflection field:** 4 lines, multiline enabled
- **Category dropdown:** Tap to expand, tap option to select
- **Sliders:** Drag to adjust 1-10 scale
- **Submit button:** Shows spinner while loading

---

## Styling Details

| Element | Value |
|---------|-------|
| Corner radius (inputs) | 8.dp |
| Corner radius (cards) | 12-16.dp |
| Page padding | 16.dp |
| Field spacing | 12.dp |
| TextField height (single) | 48.dp |
| TextField height (multi) | 100.dp |
| Button height | 50.dp |
| Slider card height | Auto (content-based) |

---

## Imports Required

Add to your file (auto-complete should find these):
```kotlin
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
import com.neuraltwin.presentation.theme.* // All colors
```

---

## Common Customizations

### Change success message duration
```kotlin
// Line ~70 in DecisionLoggingScreen.kt
kotlinx.coroutines.delay(5000)  // Instead of 3000
```

### Change slider range (e.g., 1-5 instead of 1-10)
```kotlin
// In SliderField() composable
Slider(
    value = value,
    onValueChange = onValueChange,
    valueRange = 1f..5f,  // Changed
    steps = 3  // Changed
)
// Also update display: "${value.toInt()}/5"
```

### Make reflection mandatory
```kotlin
// Line ~360 (submit logic)
reflectionInsights = reflectionInsights  // Remove .ifBlank { null }
// Add to validation: && reflectionInsights.isNotBlank()
```

### Add another slider
```kotlin
// Copy-paste any SliderField, change label and variable
var newMetric by remember { mutableStateOf(5f) }

SliderField(
    label = "New Metric",
    value = newMetric,
    onValueChange = { newMetric = it },
    description = "Your description here"
)

// Add to logDecision call:
newMetric = newMetric.toInt()
```

---

## Testing Checklist

- [ ] Submit with empty title → Submit disabled ❌
- [ ] Submit with empty reasoning → Submit disabled ❌
- [ ] Fill all required fields → Submit enabled ✓
- [ ] Click submit → Spinner shows
- [ ] Success response → Green card + form clears
- [ ] Error response → Red card stays visible
- [ ] Slider dragging → Value updates 1-10
- [ ] Category dropdown → Opens/closes, selections work
- [ ] Success auto-dismiss → Card gone in ~3s

---

## Deployment Checklist

- [ ] Copy `DecisionLoggingScreen.kt` to `presentation/screens/`
- [ ] Create `presentation/theme/` folder if needed
- [ ] Copy `Color.kt` to `presentation/theme/`
- [ ] Verify `DecisionViewModel` exists in `viewmodel/`
- [ ] Add route to your `NavHost`
- [ ] Run `./gradlew build` — Should compile without errors
- [ ] Test navigation to screen
- [ ] Test form submission
- [ ] Verify loading spinner shows
- [ ] Verify success/error messages display

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Cannot find symbol: BrandBlue" | Create `presentation/theme/Color.kt` with all tokens |
| "hiltViewModel() not found" | Add dependency: `androidx.hilt:hilt-navigation-compose` |
| Spinner always visible | Check `DecisionViewModel.isLoading` — may be stuck true |
| Form not submitting | Check all required fields filled: title, chosenOption, reasoning |
| Colors look wrong | Import colors from correct theme package |
| Dropdown won't open | Check `categoryExpanded` state variable in scope |

---

## File Locations (Copy-Paste Ready)

```
neural-twin-app/
├── android/
│   └── app/
│       └── src/
│           └── main/
│               └── java/
│                   └── com/neuraltwin/
│                       ├── presentation/
│                       │   ├── theme/
│                       │   │   └── Color.kt                    ← CREATE THIS
│                       │   └── screens/
│                       │       ├── HomeScreen.kt              (existing)
│                       │       ├── CoherenceScreen.kt         (existing)
│                       │       ├── SettingsScreen.kt          (existing)
│                       │       └── DecisionLoggingScreen.kt   ← CREATE THIS
│                       └── app/
│                           └── viewmodel/
│                               └── DecisionViewModel.kt       (existing)
```

---

## Next Steps

1. **Copy files** → Theme + Screen into your project
2. **Add route** → `composable("decision_logging") { ... }`
3. **Navigate** → `navController.navigate("decision_logging")`
4. **Test** → Fill form, submit, verify API call
5. **Customize** → Adjust colors, text, validation as needed
6. **Deploy** → Build, test on device, release

**That's it! Screen is production-ready.** 🚀

