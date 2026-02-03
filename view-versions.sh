#!/bin/bash

# Version History Viewer
# Shows git commit history in a nice table format

# Colors
BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

clear

echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                                                                        ║${NC}"
echo -e "${BLUE}║           📋 Martek Group Website - Version History 📋                 ║${NC}"
echo -e "${BLUE}║                                                                        ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Get total number of commits
TOTAL_COMMITS=$(git rev-list --count HEAD)

echo -e "${CYAN}Total Versions: $TOTAL_COMMITS${NC}"
echo -e "${CYAN}Current Branch: $(git branch --show-current)${NC}"
echo -e "${CYAN}Repository: https://github.com/git-jainamshah/martek-group-website${NC}"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Table header
printf "${GREEN}%-5s %-12s %-20s %-50s${NC}\n" "Sr#" "Commit" "Date" "Summary"
echo "───────────────────────────────────────────────────────────────────────────────────────────────────"

# Get git log and format as table
git log --pretty=format:"%h|%ar|%s" --reverse | nl -w1 -s'|' | while IFS='|' read -r num hash date message; do
    # Truncate message if too long
    if [ ${#message} -gt 50 ]; then
        message="${message:0:47}..."
    fi
    
    printf "${YELLOW}%-5s${NC} ${CYAN}%-12s${NC} %-20s %-50s\n" "$num" "$hash" "$date" "$message"
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${GREEN}Commands:${NC}"
echo "  View detailed commit:  git show <commit-hash>"
echo "  See file changes:      git diff <commit-hash>"
echo "  Rollback to version:   git checkout <commit-hash>"
echo "  View changelog:        cat CHANGELOG.md"
echo ""
