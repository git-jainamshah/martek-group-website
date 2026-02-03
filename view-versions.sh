#!/bin/bash

# Version History Viewer - Enhanced Edition
# Shows git commit history in a beautiful table format with customization options

# ===== CUSTOMIZATION SETTINGS =====
# You can modify these to customize the output

# Table Style (options: "default", "compact", "detailed", "minimal")
TABLE_STYLE="default"

# Color Scheme (options: "blue", "green", "purple", "rainbow")
COLOR_SCHEME="blue"

# Show Options
SHOW_AUTHOR=false        # Show commit author in table
SHOW_FILES_CHANGED=false # Show number of files changed
SHOW_LINES_CHANGED=false # Show +/- lines changed
MAX_MESSAGE_LENGTH=60    # Maximum length of commit message
DEFAULT_LIMIT=20         # Default number of commits to show (0 = all)

# ===== COLOR DEFINITIONS =====
case "$COLOR_SCHEME" in
    "blue")
        HEADER='\033[1;34m'     # Bright Blue
        PRIMARY='\033[0;36m'    # Cyan
        SECONDARY='\033[1;33m'  # Yellow
        SUCCESS='\033[0;32m'    # Green
        ;;
    "green")
        HEADER='\033[1;32m'     # Bright Green
        PRIMARY='\033[0;32m'    # Green
        SECONDARY='\033[1;36m'  # Cyan
        SUCCESS='\033[1;32m'    # Bright Green
        ;;
    "purple")
        HEADER='\033[1;35m'     # Bright Magenta
        PRIMARY='\033[0;35m'    # Magenta
        SECONDARY='\033[1;33m'  # Yellow
        SUCCESS='\033[0;36m'    # Cyan
        ;;
    "rainbow")
        HEADER='\033[1;35m'     # Magenta
        PRIMARY='\033[1;36m'    # Cyan
        SECONDARY='\033[1;33m'  # Yellow
        SUCCESS='\033[1;32m'    # Green
        ;;
esac
NC='\033[0m' # No Color
RED='\033[0;31m'

# ===== PARSE COMMAND LINE ARGUMENTS =====
LIMIT=$DEFAULT_LIMIT
SHOW_HELP=false

while [[ $# -gt 0 ]]; do
    case $1 in
        -n|--number)
            LIMIT="$2"
            shift 2
            ;;
        -a|--all)
            LIMIT=0
            shift
            ;;
        --author)
            SHOW_AUTHOR=true
            shift
            ;;
        --stats)
            SHOW_FILES_CHANGED=true
            SHOW_LINES_CHANGED=true
            shift
            ;;
        --compact)
            TABLE_STYLE="compact"
            shift
            ;;
        --detailed)
            TABLE_STYLE="detailed"
            SHOW_AUTHOR=true
            SHOW_FILES_CHANGED=true
            shift
            ;;
        -h|--help)
            SHOW_HELP=true
            shift
            ;;
        *)
            shift
            ;;
    esac
done

# ===== SHOW HELP =====
if [ "$SHOW_HELP" = true ]; then
    echo ""
    echo -e "${HEADER}📋 Version History Viewer - Help${NC}"
    echo ""
    echo "Usage: ./view-versions.sh [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -n, --number N     Show last N commits (default: $DEFAULT_LIMIT)"
    echo "  -a, --all          Show all commits"
    echo "  --author           Show commit author"
    echo "  --stats            Show file and line change statistics"
    echo "  --compact          Compact table view"
    echo "  --detailed         Detailed view with author and stats"
    echo "  -h, --help         Show this help message"
    echo ""
    echo "Examples:"
    echo "  ./view-versions.sh              # Show last $DEFAULT_LIMIT commits"
    echo "  ./view-versions.sh -n 5         # Show last 5 commits"
    echo "  ./view-versions.sh --all        # Show all commits"
    echo "  ./view-versions.sh --detailed   # Show detailed view"
    echo ""
    exit 0
fi

clear

# ===== HEADER =====
echo ""
echo -e "${HEADER}╔════════════════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${HEADER}║                                                                                ║${NC}"
echo -e "${HEADER}║              📋 Martek Group Website - Version History 📋                       ║${NC}"
echo -e "${HEADER}║                                                                                ║${NC}"
echo -e "${HEADER}╚════════════════════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# ===== REPOSITORY INFO =====
TOTAL_COMMITS=$(git rev-list --count HEAD)
CURRENT_BRANCH=$(git branch --show-current)
REPO_URL="https://github.com/git-jainamshah/martek-group-website"
LATEST_COMMIT=$(git log -1 --pretty=format:"%h - %s (%ar)")

echo -e "${PRIMARY}📊 Repository Information:${NC}"
echo -e "   Total Versions: ${SUCCESS}$TOTAL_COMMITS${NC}"
echo -e "   Current Branch: ${SUCCESS}$CURRENT_BRANCH${NC}"
echo -e "   Repository: ${PRIMARY}$REPO_URL${NC}"
echo -e "   Latest: ${SECONDARY}$LATEST_COMMIT${NC}"

if [ $LIMIT -gt 0 ] && [ $LIMIT -lt $TOTAL_COMMITS ]; then
    echo -e "   ${SECONDARY}Showing last $LIMIT commits (use --all to see all)${NC}"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# ===== BUILD TABLE HEADER =====
case "$TABLE_STYLE" in
    "compact")
        printf "${SUCCESS}%-4s %-10s %-55s${NC}\n" "Sr#" "Commit" "Summary"
        echo "─────────────────────────────────────────────────────────────────────────"
        ;;
    "detailed")
        printf "${SUCCESS}%-4s %-9s %-12s %-18s %-15s %-40s${NC}\n" "Sr#" "Version" "Commit" "Date" "Author" "Summary"
        echo "──────────────────────────────────────────────────────────────────────────────────────────────────────────────"
        ;;
    "minimal")
        printf "${SUCCESS}%-4s %-50s${NC}\n" "Sr#" "Summary"
        echo "────────────────────────────────────────────────────────────────"
        ;;
    *)
        if [ "$SHOW_AUTHOR" = true ]; then
            printf "${SUCCESS}%-4s %-9s %-10s %-18s %-15s %-45s${NC}\n" "Sr#" "Version" "Commit" "Date" "Author" "Summary"
        else
            printf "${SUCCESS}%-4s %-9s %-10s %-20s %-55s${NC}\n" "Sr#" "Version" "Commit" "Date" "Summary"
        fi
        echo "────────────────────────────────────────────────────────────────────────────────────────────────────────────────"
        ;;
esac

# ===== BUILD GIT LOG COMMAND =====
if [ "$SHOW_FILES_CHANGED" = true ] || [ "$SHOW_LINES_CHANGED" = true ]; then
    FORMAT="%h|%ar|%an|%s"
else
    FORMAT="%h|%ar|%an|%s"
fi

# Build limit option
LIMIT_OPTION=""
if [ $LIMIT -gt 0 ]; then
    LIMIT_OPTION="-n $LIMIT"
fi

# ===== DISPLAY COMMITS =====
git log $LIMIT_OPTION --pretty=format:"$FORMAT" --reverse | nl -w1 -s'|' | while IFS='|' read -r num hash date author message; do
    # Calculate version number (v1.0.x)
    version="v1.0.$((num - 1))"
    
    # Truncate message if too long
    if [ ${#message} -gt $MAX_MESSAGE_LENGTH ]; then
        message="${message:0:$((MAX_MESSAGE_LENGTH - 3))}..."
    fi
    
    # Truncate author if too long
    if [ ${#author} -gt 12 ]; then
        author="${author:0:9}..."
    fi
    
    # Get stats if requested
    if [ "$SHOW_FILES_CHANGED" = true ] || [ "$SHOW_LINES_CHANGED" = true ]; then
        stats=$(git show --stat $hash | tail -1)
    fi
    
    # Print row based on style
    case "$TABLE_STYLE" in
        "compact")
            printf "${SECONDARY}%-4s${NC} ${PRIMARY}%-10s${NC} %-55s\n" "$num" "$hash" "$message"
            ;;
        "detailed")
            printf "${SECONDARY}%-4s${NC} ${PRIMARY}%-9s${NC} ${PRIMARY}%-12s${NC} %-18s %-15s %-40s\n" \
                "$num" "$version" "$hash" "$date" "$author" "$message"
            if [ "$SHOW_FILES_CHANGED" = true ]; then
                echo "       ${stats}"
            fi
            ;;
        "minimal")
            printf "${SECONDARY}%-4s${NC} %-50s\n" "$num" "$message"
            ;;
        *)
            if [ "$SHOW_AUTHOR" = true ]; then
                printf "${SECONDARY}%-4s${NC} ${PRIMARY}%-9s${NC} ${PRIMARY}%-10s${NC} %-18s %-15s %-45s\n" \
                    "$num" "$version" "$hash" "$date" "$author" "$message"
            else
                printf "${SECONDARY}%-4s${NC} ${PRIMARY}%-9s${NC} ${PRIMARY}%-10s${NC} %-20s %-55s\n" \
                    "$num" "$version" "$hash" "$date" "$message"
            fi
            ;;
    esac
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# ===== FOOTER WITH COMMANDS =====
echo -e "${SUCCESS}💡 Quick Commands:${NC}"
echo ""
echo -e "  ${PRIMARY}View detailed commit:${NC}  git show <commit-hash>"
echo -e "  ${PRIMARY}See file changes:${NC}      git diff <commit-hash>^ <commit-hash>"
echo -e "  ${PRIMARY}Rollback to version:${NC}   git checkout <commit-hash>"
echo -e "  ${PRIMARY}View changelog:${NC}        cat CHANGELOG.md"
echo -e "  ${PRIMARY}Push changes:${NC}          ./git-push.sh \"Your message\""
echo ""
echo -e "${SUCCESS}📖 View Options:${NC}"
echo ""
echo -e "  ${PRIMARY}Show last 5 commits:${NC}   ./view-versions.sh -n 5"
echo -e "  ${PRIMARY}Show all commits:${NC}      ./view-versions.sh --all"
echo -e "  ${PRIMARY}Detailed view:${NC}         ./view-versions.sh --detailed"
echo -e "  ${PRIMARY}Help & options:${NC}        ./view-versions.sh --help"
echo ""
