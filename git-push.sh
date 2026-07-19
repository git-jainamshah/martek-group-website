#!/bin/bash

# Quick Git Push Script
# Usage: ./git-push.sh "Your commit message"

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo ""
echo -e "${BLUE}🔄 Git Auto-Push Script${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if commit message provided
if [ -z "$1" ]; then
    echo -e "${YELLOW}⚠ No commit message provided.${NC}"
    echo ""
    echo "Usage: ./git-push.sh \"Your commit message\""
    echo ""
    echo "Example: ./git-push.sh \"Update homepage styling\""
    echo ""
    exit 1
fi

COMMIT_MESSAGE="$1"

# Check git status
echo -e "${BLUE}📊 Checking for changes...${NC}"
if git diff-index --quiet HEAD --; then
    echo -e "${YELLOW}⚠ No changes to commit.${NC}"
    echo ""
    git status
    exit 0
fi

echo ""
echo -e "${GREEN}✓${NC} Changes detected!"
echo ""

# Show what will be committed
echo -e "${BLUE}📝 Files to be committed:${NC}"
git status --short
echo ""

# Stage all changes
echo -e "${BLUE}📦 Staging all changes...${NC}"
git add .
echo -e "${GREEN}✓${NC} Files staged"
echo ""

# Commit
echo -e "${BLUE}💾 Committing changes...${NC}"
git commit -m "$COMMIT_MESSAGE"
echo -e "${GREEN}✓${NC} Committed successfully"
echo ""

# Push
echo -e "${BLUE}🚀 Pushing to GitHub...${NC}"
git push
echo ""
echo -e "${GREEN}✓${NC} Successfully pushed to GitHub!"
echo ""

# Show latest commits
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}📜 Latest commits:${NC}"
echo ""
git log --oneline -5
echo ""
echo -e "${GREEN}✓ All done! Your changes are now on GitHub.${NC}"
echo ""
