#!/bin/bash
# Urja Veda — Auto Sync to GitHub Script

# Navigate to script directory
cd "$(dirname "$0")"

MSG="${1:-Update Urja Veda website - $(date '+%Y-%m-%d %H:%M:%S')}"

echo "🔄 Checking git status..."
git add .

if git diff-index --quiet HEAD --; then
  echo "✅ No changes to commit."
else
  git commit -m "$MSG"
  echo "🚀 Changes committed: $MSG"
fi

echo "📤 Pushing to GitHub (origin main)..."
if git push -u origin main; then
  echo "🎉 Successfully synced to GitHub!"
else
  echo "⚠️ Push failed. Please verify remote repository access."
fi
