#!/bin/bash
#
# RHYTHMIX Multi-App APK Builder
# Builds release APKs for all Rhythmix apps using Capacitor + Android Gradle
#
# Prerequisites:
#   - Java 11+ (OpenJDK recommended)
#   - Android SDK with build tools
#   - Gradle (bundled with Capacitor Android)
#   - Node.js 20+ and npm
#   - Capacitor CLI: npm install -g @capacitor/cli
#
# Usage: ./build-apks.sh [--dry-run] [--skip-signing] [--only app-name]
#

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
REPO_ROOT="/home/user/jamie-wigg"
APPS_DIR="${REPO_ROOT}/apps"
BUILDS_DIR="${REPO_ROOT}/builds"
BUILD_LOG="${REPO_ROOT}/BUILD_LOG.txt"
KEYSTORE="${REPO_ROOT}/rhythmix.jks"
KEYSTORE_ALIAS="rhythmix-release-key"
KEYSTORE_PASSWORD="${KEYSTORE_PASSWORD:-rhythmix2024}"
KEY_PASSWORD="${KEY_PASSWORD:-rhythmix2024}"

# Parse arguments
DRY_RUN=false
SKIP_SIGNING=false
ONLY_APP=""

while [[ $# -gt 0 ]]; do
  case $1 in
    --dry-run)
      DRY_RUN=true
      shift
      ;;
    --skip-signing)
      SKIP_SIGNING=true
      shift
      ;;
    --only)
      ONLY_APP="$2"
      shift 2
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

# App manifest: name -> (filename, package-suffix, display-name)
declare -A APPS=(
  [blood-pressure-buddy]="blood-pressure-buddy.html|bloodpressure|Blood Pressure Buddy"
  [budget-tracker]="budget-tracker.html|budgettracker|Budget Tracker"
  [calorie-counter]="calorie-counter.html|caloriecounter|Calorie Counter"
  [daily-planner]="daily-planner.html|dailyplanner|Daily Planner"
  [dreams]="dreams.html|dreams|Dreams"
  [english-pocket]="english-pocket.html|englishpocket|English Pocket"
  [expense-tracker]="expense-tracker.html|expensetracker|Expense Tracker"
  [goal-tracker]="goal-tracker.html|goaltracker|Goal Tracker"
  [habit-streak]="habit-streak.html|habitstreak|Habit Streak"
  [heartbeat]="heartbeat.html|heartbeat|Heartbeat"
  [hum]="hum.html|hum|Hum"
  [lifeaudit]="lifeaudit.html|lifeaudit|Life Audit"
  [live]="live.html|live|Live"
  [loan-calculator]="loan-calculator.html|loancalculator|Loan Calculator"
  [math-helper]="math-helper.html|mathhelper|Math Helper"
  [medicine-companion]="medicine-companion.html|medicinecompanion|Medicine Companion"
  [meditation-guide]="meditation-guide.html|meditationguide|Meditation Guide"
  [mood-journal]="mood-journal.html|moodjournal|Mood Journal"
  [notes]="notes.html|notes|Notes"
  [period-tracker]="period-tracker.html|periodtracker|Period Tracker"
  [pomodoro-timer]="pomodoro-timer.html|pomodorotimer|Pomodoro Timer"
  [quick-recipes]="quick-recipes.html|quickrecipes|Quick Recipes"
  [reminders]="reminders.html|reminders|Reminders"
  [resonate]="resonate.html|resonate|Resonate"
  [savings-challenge]="savings-challenge.html|savingschallenge|Savings Challenge"
  [study-planner]="study-planner.html|studyplanner|Study Planner"
  [water-tracker]="water-tracker.html|watertracker|Water Tracker"
)

# Buildable apps (excludes index, test-suite, get-apps, thumbnails, test/utility files)
declare -a BUILDABLE_APPS=(
  "blood-pressure-buddy"
  "budget-tracker"
  "calorie-counter"
  "daily-planner"
  "dreams"
  "english-pocket"
  "expense-tracker"
  "goal-tracker"
  "habit-streak"
  "heartbeat"
  "hum"
  "lifeaudit"
  "live"
  "loan-calculator"
  "math-helper"
  "medicine-companion"
  "meditation-guide"
  "mood-journal"
  "notes"
  "period-tracker"
  "pomodoro-timer"
  "quick-recipes"
  "reminders"
  "resonate"
  "savings-challenge"
  "study-planner"
  "water-tracker"
)

# Helper functions
log() {
  echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$BUILD_LOG"
}

success() {
  echo -e "${GREEN}[✓]${NC} $1" | tee -a "$BUILD_LOG"
}

error() {
  echo -e "${RED}[✗]${NC} $1" | tee -a "$BUILD_LOG"
}

warning() {
  echo -e "${YELLOW}[!]${NC} $1" | tee -a "$BUILD_LOG"
}

# Initialize build log
{
  echo "==============================================="
  echo "RHYTHMIX Multi-App APK Build Log"
  echo "Started: $(date)"
  echo "==============================================="
  echo ""
} > "$BUILD_LOG"

log "Initializing APK build process..."
log "Repository root: $REPO_ROOT"
log "Apps directory: $APPS_DIR"
log "Build output: $BUILDS_DIR"
log "Dry run: $DRY_RUN"
log "Skip signing: $SKIP_SIGNING"
if [ -n "$ONLY_APP" ]; then
  log "Building only: $ONLY_APP"
fi

# Pre-flight checks
log ""
log "Running pre-flight checks..."

if ! command -v node &> /dev/null; then
  error "Node.js not found. Please install Node.js 20+"
  exit 1
fi
success "Node.js found: $(node --version)"

if ! command -v npm &> /dev/null; then
  error "npm not found"
  exit 1
fi
success "npm found: $(npm --version)"

if ! command -v java &> /dev/null; then
  error "Java not found. Please install OpenJDK 11+"
  exit 1
fi
success "Java found: $(java -version 2>&1 | head -1)"

if ! command -v npx &> /dev/null; then
  error "npx not found"
  exit 1
fi
success "npx found"

# Check Capacitor CLI (global or local)
if ! npx cap --version &> /dev/null; then
  warning "Capacitor CLI not found globally. Will install locally."
fi

# Create builds directory
if [ "$DRY_RUN" = false ]; then
  mkdir -p "$BUILDS_DIR"
  success "Created builds directory: $BUILDS_DIR"
fi

# Generate/check keystore
if [ "$SKIP_SIGNING" = false ]; then
  log ""
  log "Setting up signing..."

  if [ ! -f "$KEYSTORE" ]; then
    if [ "$DRY_RUN" = false ]; then
      warning "Keystore not found. Generating new keystore..."
      # Generate keystore with 10-year validity
      keytool -genkey -v \
        -keystore "$KEYSTORE" \
        -keyalg RSA \
        -keysize 2048 \
        -validity 3650 \
        -alias "$KEYSTORE_ALIAS" \
        -storepass "$KEYSTORE_PASSWORD" \
        -keypass "$KEY_PASSWORD" \
        -dname "CN=RHYTHMIX Suite, OU=Product, O=RHYTHMIX, L=Sydney, S=NSW, C=AU" \
        2>&1 | tee -a "$BUILD_LOG"

      if [ -f "$KEYSTORE" ]; then
        success "Generated keystore: $KEYSTORE"
      else
        error "Failed to generate keystore"
        exit 1
      fi
    else
      warning "[DRY RUN] Would generate keystore at $KEYSTORE"
    fi
  else
    success "Keystore found: $KEYSTORE"
  fi

  # Verify keystore
  if [ "$DRY_RUN" = false ]; then
    if keytool -list -v -keystore "$KEYSTORE" -storepass "$KEYSTORE_PASSWORD" -alias "$KEYSTORE_ALIAS" &> /dev/null; then
      success "Keystore verified"
    else
      error "Keystore verification failed"
      exit 1
    fi
  fi
fi

# Build each app
log ""
log "Starting APK builds (total: ${#BUILDABLE_APPS[@]} apps)..."
log ""

SUCCESSFUL_BUILDS=0
FAILED_BUILDS=0
SKIPPED_BUILDS=0

for app_name in "${BUILDABLE_APPS[@]}"; do
  # Skip if --only specified and doesn't match
  if [ -n "$ONLY_APP" ] && [ "$app_name" != "$ONLY_APP" ]; then
    continue
  fi

  IFS='|' read -r filename package_suffix display_name <<< "${APPS[$app_name]}"

  log ""
  log "=========================================="
  log "Building: $display_name ($app_name)"
  log "=========================================="

  # Check if app file exists
  app_file="$APPS_DIR/$filename"
  if [ ! -f "$app_file" ]; then
    error "App file not found: $app_file"
    FAILED_BUILDS=$((FAILED_BUILDS + 1))
    continue
  fi
  success "Found app file: $filename"

  # Package name
  PACKAGE_NAME="com.rhythmix.$package_suffix"
  log "Package name: $PACKAGE_NAME"

  # Create app-specific Capacitor project
  APP_BUILD_DIR="$BUILDS_DIR/.tmp/$app_name"

  if [ "$DRY_RUN" = false ]; then
    mkdir -p "$APP_BUILD_DIR"

    log "Setting up Capacitor project in: $APP_BUILD_DIR"

    # Copy app HTML to www directory
    mkdir -p "$APP_BUILD_DIR/www"
    cp "$app_file" "$APP_BUILD_DIR/www/index.html"
    success "Copied app to web root"

    # Create minimal capacitor.config.json
    cat > "$APP_BUILD_DIR/capacitor.config.json" <<EOF
{
  "appId": "$PACKAGE_NAME",
  "appName": "$display_name",
  "webDir": "www",
  "android": {
    "buildOptions": {
      "keystorePath": "$KEYSTORE",
      "keystoreAlias": "$KEYSTORE_ALIAS",
      "keystorePassword": "$KEYSTORE_PASSWORD",
      "keyPassword": "$KEY_PASSWORD",
      "releaseType": "APK"
    }
  }
}
EOF
    success "Created capacitor.config.json"

    # Create minimal package.json
    cat > "$APP_BUILD_DIR/package.json" <<EOF
{
  "name": "$app_name",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "build": "npx cap build android --release",
    "sync": "npx cap sync",
    "add": "npx cap add android"
  },
  "dependencies": {
    "@capacitor/core": "^7.0.0",
    "@capacitor/android": "^7.0.0"
  },
  "devDependencies": {
    "@capacitor/cli": "^7.0.0"
  }
}
EOF
    success "Created package.json"

    cd "$APP_BUILD_DIR"

    # Install dependencies
    log "Installing npm dependencies..."
    if npm install 2>&1 | tee -a "$BUILD_LOG"; then
      success "npm install completed"
    else
      error "npm install failed"
      FAILED_BUILDS=$((FAILED_BUILDS + 1))
      cd "$REPO_ROOT"
      continue
    fi

    # Add Android platform
    if ! [ -d "android" ]; then
      log "Adding Android platform..."
      if npx cap add android 2>&1 | tee -a "$BUILD_LOG"; then
        success "Android platform added"
      else
        error "Failed to add Android platform"
        FAILED_BUILDS=$((FAILED_BUILDS + 1))
        cd "$REPO_ROOT"
        continue
      fi
    else
      success "Android platform already exists"
    fi

    # Sync web assets
    log "Syncing web assets..."
    if npx cap sync 2>&1 | tee -a "$BUILD_LOG"; then
      success "Web assets synced"
    else
      error "Failed to sync web assets"
      FAILED_BUILDS=$((FAILED_BUILDS + 1))
      cd "$REPO_ROOT"
      continue
    fi

    # Build APK
    log "Building release APK..."
    APK_BUILD_OUTPUT=$(npx cap build android --release 2>&1 | tee -a "$BUILD_LOG")

    # Find generated APK
    APK_PATH=$(find android/app/build/outputs/apk/release -name "*.apk" 2>/dev/null | head -1)

    if [ -n "$APK_PATH" ] && [ -f "$APK_PATH" ]; then
      # Copy APK to final output directory
      OUTPUT_APK="$BUILDS_DIR/${app_name}-release.apk"
      cp "$APK_PATH" "$OUTPUT_APK"
      success "APK built and copied to: $OUTPUT_APK"

      # Get APK size
      APK_SIZE=$(du -h "$OUTPUT_APK" | cut -f1)
      log "APK size: $APK_SIZE"

      # Sign APK if not skipping
      if [ "$SKIP_SIGNING" = false ]; then
        log "Signing APK..."
        jarsigner -verbose \
          -sigalg SHA256withRSA \
          -digestalg SHA-256 \
          -keystore "$KEYSTORE" \
          -storepass "$KEYSTORE_PASSWORD" \
          -keypass "$KEY_PASSWORD" \
          "$OUTPUT_APK" \
          "$KEYSTORE_ALIAS" 2>&1 | tee -a "$BUILD_LOG"

        if [ $? -eq 0 ]; then
          success "APK signed successfully"
        else
          warning "APK signing had warnings (may still be valid)"
        fi
      fi

      SUCCESSFUL_BUILDS=$((SUCCESSFUL_BUILDS + 1))
    else
      error "APK not found after build"
      FAILED_BUILDS=$((FAILED_BUILDS + 1))
    fi

    cd "$REPO_ROOT"

  else
    # DRY RUN
    warning "[DRY RUN] Would build: $display_name"
    warning "[DRY RUN] Package: $PACKAGE_NAME"
    warning "[DRY RUN] Output: $BUILDS_DIR/${app_name}-release.apk"
    SKIPPED_BUILDS=$((SKIPPED_BUILDS + 1))
  fi
done

# Summary
log ""
log "=========================================="
log "BUILD SUMMARY"
log "=========================================="
log "Total apps: ${#BUILDABLE_APPS[@]}"
log "Successful builds: $SUCCESSFUL_BUILDS"
log "Failed builds: $FAILED_BUILDS"
log "Skipped builds: $SKIPPED_BUILDS"
log ""

if [ "$DRY_RUN" = false ]; then
  log "Build outputs in: $BUILDS_DIR"
  ls -lh "$BUILDS_DIR"/*.apk 2>/dev/null | tee -a "$BUILD_LOG" || true
fi

log ""
log "Build log saved to: $BUILD_LOG"
log "Completed: $(date)"

if [ "$SUCCESSFUL_BUILDS" -eq 0 ] && [ "$DRY_RUN" = false ]; then
  exit 1
fi

exit 0
