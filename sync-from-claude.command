#!/bin/bash

# Sync-from-Claude: One-click pull from Claude Code session
# Double-click this file on Mac to sync latest changes

set -e

REPO_PATH="$HOME/jamie-wigg"
BRANCH="claude/vibecode-fartrun-readme-h6ubxk"
NOTIFICATION_TITLE="Sync from Claude"

# Function to send Mac notification
notify() {
  osascript -e "display notification \"$2\" with title \"$1\""
}

# Function to show dialog
dialog() {
  osascript -e "tell app \"System Events\" to display dialog \"$1\" buttons {\"OK\"} default button 1"
}

# Check if repo exists
if [ ! -d "$REPO_PATH" ]; then
  notify "$NOTIFICATION_TITLE" "❌ Repo not found at $REPO_PATH"
  exit 1
fi

cd "$REPO_PATH"

# Fetch latest
notify "$NOTIFICATION_TITLE" "⬇️ Fetching latest from cloud..."
git fetch origin "$BRANCH" 2>&1 | grep -v "^From" || true

# Pull changes
notify "$NOTIFICATION_TITLE" "📥 Pulling changes..."
git pull origin "$BRANCH" 2>&1 || {
  notify "$NOTIFICATION_TITLE" "⚠️ Pull failed. Check git status."
  exit 1
}

# Show what changed
CHANGED_FILES=$(git diff HEAD~1..HEAD --name-only 2>/dev/null | head -5)
if [ -z "$CHANGED_FILES" ]; then
  CHANGED_FILES="(No changes in last commit)"
fi

notify "$NOTIFICATION_TITLE" "✅ Synced! Latest files downloaded."

# Open repo in Finder
open "$REPO_PATH"

# Show summary dialog
osascript << EOF
tell app "System Events"
  display dialog "✅ Synced from Claude Code

Branch: $BRANCH
Location: $REPO_PATH

Latest changes:
$CHANGED_FILES" buttons {"Open in Finder", "Done"} default button 2 with icon 2
end tell
EOF

exit 0
