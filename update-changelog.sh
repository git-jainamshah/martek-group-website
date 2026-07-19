#!/bin/bash

# Auto-update CHANGELOG.md with latest commit

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo ""
echo -e "${BLUE}📝 Changelog Updater${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if CHANGELOG.md exists
if [ ! -f "CHANGELOG.md" ]; then
    echo -e "${YELLOW}⚠ CHANGELOG.md not found!${NC}"
    exit 1
fi

# Get latest commit info
LATEST_HASH=$(git log -1 --pretty=format:"%h")
LATEST_DATE=$(git log -1 --pretty=format:"%ai" | cut -d' ' -f1)
LATEST_MESSAGE=$(git log -1 --pretty=format:"%s")

# Count total commits
TOTAL_COMMITS=$(git rev-list --count HEAD)

# Calculate version (simple increment)
VERSION="v1.0.$((TOTAL_COMMITS - 1))"

echo -e "${GREEN}Latest Commit:${NC}"
echo "  Hash:    $LATEST_HASH"
echo "  Date:    $LATEST_DATE"
echo "  Version: $VERSION"
echo "  Message: $LATEST_MESSAGE"
echo ""

# Create temporary file with new entry
TEMP_FILE=$(mktemp)

# Read CHANGELOG.md and insert new entry
awk -v sr="$TOTAL_COMMITS" -v ver="$VERSION" -v date="$LATEST_DATE" -v msg="$LATEST_MESSAGE" '
BEGIN {
    inserted = 0
}
{
    print
    if (!inserted && /^\| Sr# \| Version \| Date \| Summary \|/) {
        # Print separator line
        getline
        print
        # Insert new entry
        printf "| %d | %s | %s | %s |\n", sr, ver, date, msg
        inserted = 1
    }
}
' CHANGELOG.md > "$TEMP_FILE"

# Replace old CHANGELOG.md
mv "$TEMP_FILE" CHANGELOG.md

echo -e "${GREEN}✓ CHANGELOG.md updated successfully!${NC}"
echo ""
echo "New entry added:"
echo "  Sr# $TOTAL_COMMITS | $VERSION | $LATEST_DATE | $LATEST_MESSAGE"
echo ""
