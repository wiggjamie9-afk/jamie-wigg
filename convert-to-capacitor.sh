#!/bin/bash

# Day 1: Convert all 28 apps to Capacitor projects (lightweight)
# This creates the directory structure and config files

apps=(
  "english-pocket" "budget-tracker" "blood-pressure-buddy" "meditation-guide" "calorie-counter"
  "habit-streak" "water-tracker" "weight-tracker" "daily-planner" "expense-tracker"
  "math-helper" "loan-calculator" "goal-tracker" "notes" "reminders" "pomodoro-timer"
  "study-planner" "task-list" "medicine-companion" "quick-recipes" "period-tracker"
  "savings-challenge" "heartbeat" "mood-journal" "dreams" "hum" "live" "resonate" "vendor-tracker"
)

echo "🚀 CAPACITOR CONVERSION STARTED"
echo "Converting ${#apps[@]} apps to Capacitor projects..."
echo ""

success_count=0
skip_count=0

for app in "${apps[@]}"; do
  echo -n "Converting: $app ... "

  # Find the HTML file or directory
  html_file=""
  if [ -f "apps/${app}.html" ]; then
    html_file="apps/${app}.html"
  elif [ -d "apps/${app}" ] && [ -f "apps/${app}/index.html" ]; then
    html_file="apps/${app}/index.html"
  fi

  if [ -z "$html_file" ] || [ ! -f "$html_file" ]; then
    echo "⚠️  Skipped (HTML not found)"
    ((skip_count++))
    continue
  fi

  # Create app directory structure
  mkdir -p "apps/${app}/www"
  mkdir -p "apps/${app}/ios"
  mkdir -p "apps/${app}/android"

  # Copy HTML to www/index.html
  cp "$html_file" "apps/${app}/www/index.html" 2>/dev/null || true

  # Create package.json
  cat > "apps/${app}/package.json" << EOF
{
  "name": "com.rhythmix.${app}",
  "version": "1.0.0",
  "description": "${app}",
  "main": "index.js",
  "scripts": {
    "dev": "capacitor open ios",
    "build": "capacitor build"
  },
  "dependencies": {
    "@capacitor/core": "^5.0.0",
    "@capacitor/android": "^5.0.0",
    "@capacitor/ios": "^5.0.0"
  }
}
EOF

  # Create capacitor.config.json
  app_name=$(echo "$app" | sed 's/-/ /g' | sed 's/\b./\u&/g')
  cat > "apps/${app}/capacitor.config.json" << EOF
{
  "appId": "com.rhythmix.${app}",
  "appName": "${app_name}",
  "webDir": "www",
  "plugins": {}
}
EOF

  echo "✅"
  ((success_count++))
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ CONVERSION COMPLETE"
echo "   Success: $success_count / ${#apps[@]}"
if [ $skip_count -gt 0 ]; then
  echo "   Skipped: $skip_count"
fi
echo ""
