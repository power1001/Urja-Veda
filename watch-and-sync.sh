#!/bin/bash
# Urja Veda — Background Auto Sync Watcher for GitHub
# This script monitors changes and automatically commits & pushes them to GitHub.

cd "$(dirname "$0")"

echo "👀 Starting Urja Veda GitHub Auto-Sync Watcher..."
echo "📁 Monitoring folder: $(pwd)"
echo "🔗 Remote: $(git remote get-url origin 2>/dev/null || echo 'Not configured')"
echo "--------------------------------------------------------"

while true; do
  # Check if there are modified, added, or deleted files
  CHANGES=$(git status --porcelain 2>/dev/null)
  
  if [ -n "$CHANGES" ]; then
    echo "🔔 Changes detected at $(date '+%Y-%m-%d %H:%M:%S'):"
    echo "$CHANGES"
    
    # Stage all changes
    git add -A
    
    # Commit changes
    COMMIT_MSG="Auto update Urja Veda website - $(date '+%Y-%m-%d %H:%M:%S')"
    git commit -m "$COMMIT_MSG"
    
    # Push to GitHub
    echo "📤 Pushing updates to GitHub (origin main)..."
    if git push origin main 2>/dev/null; then
      echo "✅ Successfully synced to GitHub!"
    else
      echo "⚠️ Push failed (ensure repo is created on GitHub). Will retry on next change."
    fi
    echo "--------------------------------------------------------"
  fi
  
  # Check every 10 seconds
  sleep 10
done
