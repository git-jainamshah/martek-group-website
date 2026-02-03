#!/bin/bash

# Interactive Customization Script for Version Viewer
# Makes it easy to customize without editing config files

# Colors
BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
RED='\033[0;31m'
PURPLE='\033[0;35m'
NC='\033[0m'

clear

echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                                                                        ║${NC}"
echo -e "${BLUE}║           🎨 Version Viewer Customization Tool 🎨                      ║${NC}"
echo -e "${BLUE}║                                                                        ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${CYAN}This tool helps you customize how your version history looks!${NC}"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Function to show preview
show_preview() {
    echo ""
    echo -e "${GREEN}📋 Preview:${NC}"
    echo ""
    ./view-versions.sh -n 3
}

# ===== MAIN MENU =====
while true; do
    echo ""
    echo -e "${YELLOW}What would you like to customize?${NC}"
    echo ""
    echo "  1) Change table style (default/compact/detailed/minimal)"
    echo "  2) Change color scheme (blue/green/purple/rainbow)"
    echo "  3) Toggle author display (on/off)"
    echo "  4) Change default number of commits shown"
    echo "  5) 👀 Preview current settings"
    echo "  6) ✅ Save and exit"
    echo "  7) ❌ Exit without saving"
    echo ""
    read -p "Enter your choice (1-7): " choice
    
    case $choice in
        1)
            echo ""
            echo -e "${CYAN}Choose a table style:${NC}"
            echo ""
            echo "  1) default  - Standard table with all info"
            echo "  2) compact  - Minimal table (just hash & summary)"
            echo "  3) detailed - Extended with author & stats"
            echo "  4) minimal  - Super simple (just number & summary)"
            echo ""
            read -p "Enter choice (1-4): " style_choice
            
            case $style_choice in
                1) NEW_STYLE="default" ;;
                2) NEW_STYLE="compact" ;;
                3) NEW_STYLE="detailed" ;;
                4) NEW_STYLE="minimal" ;;
                *) echo -e "${RED}Invalid choice${NC}"; continue ;;
            esac
            
            # Update the script
            sed -i '' "s/^TABLE_STYLE=.*/TABLE_STYLE=\"$NEW_STYLE\"/" view-versions.sh
            echo -e "${GREEN}✓ Table style changed to: $NEW_STYLE${NC}"
            ;;
            
        2)
            echo ""
            echo -e "${CYAN}Choose a color scheme:${NC}"
            echo ""
            echo -e "  1) ${BLUE}blue${NC}    - Professional blue/cyan"
            echo -e "  2) ${GREEN}green${NC}   - Fresh green theme"
            echo -e "  3) ${PURPLE}purple${NC}  - Modern purple/magenta"
            echo -e "  4) ${YELLOW}rainbow${NC} - Colorful multi-color"
            echo ""
            read -p "Enter choice (1-4): " color_choice
            
            case $color_choice in
                1) NEW_COLOR="blue" ;;
                2) NEW_COLOR="green" ;;
                3) NEW_COLOR="purple" ;;
                4) NEW_COLOR="rainbow" ;;
                *) echo -e "${RED}Invalid choice${NC}"; continue ;;
            esac
            
            sed -i '' "s/^COLOR_SCHEME=.*/COLOR_SCHEME=\"$NEW_COLOR\"/" view-versions.sh
            echo -e "${GREEN}✓ Color scheme changed to: $NEW_COLOR${NC}"
            ;;
            
        3)
            echo ""
            read -p "Show author names? (y/n): " author_choice
            
            if [[ $author_choice == "y" || $author_choice == "Y" ]]; then
                sed -i '' "s/^SHOW_AUTHOR=.*/SHOW_AUTHOR=true/" view-versions.sh
                echo -e "${GREEN}✓ Author display enabled${NC}"
            else
                sed -i '' "s/^SHOW_AUTHOR=.*/SHOW_AUTHOR=false/" view-versions.sh
                echo -e "${GREEN}✓ Author display disabled${NC}"
            fi
            ;;
            
        4)
            echo ""
            echo "Current default: 20 commits"
            echo ""
            read -p "How many commits to show by default? (0 = all): " limit
            
            if [[ $limit =~ ^[0-9]+$ ]]; then
                sed -i '' "s/^DEFAULT_LIMIT=.*/DEFAULT_LIMIT=$limit/" view-versions.sh
                echo -e "${GREEN}✓ Default limit changed to: $limit${NC}"
            else
                echo -e "${RED}Invalid number${NC}"
            fi
            ;;
            
        5)
            show_preview
            ;;
            
        6)
            echo ""
            echo -e "${GREEN}✓ Settings saved!${NC}"
            echo ""
            echo "Run './view-versions.sh' to see your customized version history"
            echo ""
            exit 0
            ;;
            
        7)
            echo ""
            echo -e "${YELLOW}Exiting without changes${NC}"
            echo ""
            exit 0
            ;;
            
        *)
            echo -e "${RED}Invalid choice. Please enter 1-7.${NC}"
            ;;
    esac
done
