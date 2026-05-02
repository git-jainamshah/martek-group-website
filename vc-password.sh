#!/bin/bash

# Version Control Dashboard Password Manager
# Easy way to view or change your dashboard password

set -e

ENV_FILE=".env.local"
PASSWORD_KEY="VC_ADMIN_PASSWORD"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Version Control Dashboard Password Manager      ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════╝${NC}"
echo ""

# Function to get current password
get_password() {
    if [ -f "$ENV_FILE" ]; then
        PASSWORD=$(grep "^${PASSWORD_KEY}=" "$ENV_FILE" 2>/dev/null | cut -d '=' -f2- | tr -d '"' | tr -d "'")
        if [ -n "$PASSWORD" ]; then
            echo "$PASSWORD"
        else
            echo ""
        fi
    else
        echo ""
    fi
}

# Function to show password
show_password() {
    PASSWORD=$(get_password)
    
    if [ -n "$PASSWORD" ]; then
        echo -e "${GREEN}✓ Current Password:${NC}"
        echo ""
        echo -e "  ${YELLOW}$PASSWORD${NC}"
        echo ""
        echo -e "${BLUE}ℹ  Dashboard URL:${NC} http://localhost:3000/site-vc"
    else
        echo -e "${RED}✗ No password found in .env.local${NC}"
        echo ""
        echo "Run: $0 --set"
        echo "  to set a password"
    fi
}

# Function to set password
set_password() {
    echo -e "${BLUE}Enter new password for Version Control Dashboard:${NC}"
    read -p "> " NEW_PASSWORD
    
    if [ -z "$NEW_PASSWORD" ]; then
        echo -e "${RED}✗ Password cannot be empty${NC}"
        exit 1
    fi
    
    # Create or update .env.local
    if [ -f "$ENV_FILE" ]; then
        # Check if password key exists
        if grep -q "^${PASSWORD_KEY}=" "$ENV_FILE"; then
            # Update existing password
            if [[ "$OSTYPE" == "darwin"* ]]; then
                # macOS
                sed -i '' "s|^${PASSWORD_KEY}=.*|${PASSWORD_KEY}=\"${NEW_PASSWORD}\"|" "$ENV_FILE"
            else
                # Linux
                sed -i "s|^${PASSWORD_KEY}=.*|${PASSWORD_KEY}=\"${NEW_PASSWORD}\"|" "$ENV_FILE"
            fi
            echo -e "${GREEN}✓ Password updated in .env.local${NC}"
        else
            # Append password
            echo "" >> "$ENV_FILE"
            echo "# Version Control Dashboard Password" >> "$ENV_FILE"
            echo "${PASSWORD_KEY}=\"${NEW_PASSWORD}\"" >> "$ENV_FILE"
            echo -e "${GREEN}✓ Password added to .env.local${NC}"
        fi
    else
        # Create new .env.local file
        cat > "$ENV_FILE" << EOF
# Version Control Dashboard Password
${PASSWORD_KEY}="${NEW_PASSWORD}"
EOF
        echo -e "${GREEN}✓ Created .env.local with password${NC}"
    fi
    
    echo ""
    echo -e "${YELLOW}⚠  Important:${NC} Restart your dev server for changes to take effect"
    echo "   Run: npm run dev"
    echo ""
}

# Function to generate random password
generate_password() {
    # Generate a secure random password
    NEW_PASSWORD=$(openssl rand -base64 12 | tr -d "=+/" | cut -c1-16)
    
    echo -e "${GREEN}Generated secure password:${NC}"
    echo ""
    echo -e "  ${YELLOW}$NEW_PASSWORD${NC}"
    echo ""
    
    read -p "Use this password? (y/n): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        # Save password
        if [ -f "$ENV_FILE" ]; then
            if grep -q "^${PASSWORD_KEY}=" "$ENV_FILE"; then
                if [[ "$OSTYPE" == "darwin"* ]]; then
                    sed -i '' "s|^${PASSWORD_KEY}=.*|${PASSWORD_KEY}=\"${NEW_PASSWORD}\"|" "$ENV_FILE"
                else
                    sed -i "s|^${PASSWORD_KEY}=.*|${PASSWORD_KEY}=\"${NEW_PASSWORD}\"|" "$ENV_FILE"
                fi
                echo -e "${GREEN}✓ Password updated in .env.local${NC}"
            else
                echo "" >> "$ENV_FILE"
                echo "# Version Control Dashboard Password" >> "$ENV_FILE"
                echo "${PASSWORD_KEY}=\"${NEW_PASSWORD}\"" >> "$ENV_FILE"
                echo -e "${GREEN}✓ Password added to .env.local${NC}"
            fi
        else
            cat > "$ENV_FILE" << EOF
# Version Control Dashboard Password
${PASSWORD_KEY}="${NEW_PASSWORD}"
EOF
            echo -e "${GREEN}✓ Created .env.local with password${NC}"
        fi
        
        echo ""
        echo -e "${YELLOW}⚠  Important:${NC} Restart your dev server for changes to take effect"
        echo "   Run: npm run dev"
    else
        echo -e "${RED}✗ Password not saved${NC}"
    fi
    echo ""
}

# Show help
show_help() {
    echo "Usage: $0 [OPTION]"
    echo ""
    echo "Options:"
    echo "  (none)      Show current password"
    echo "  --show      Show current password"
    echo "  --set       Set a new password"
    echo "  --generate  Generate a secure random password"
    echo "  --help      Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0              # Show current password"
    echo "  $0 --set        # Set a new password"
    echo "  $0 --generate   # Generate random password"
    echo ""
}

# Main script logic
case "${1:-}" in
    --show)
        show_password
        ;;
    --set)
        set_password
        ;;
    --generate)
        generate_password
        ;;
    --help|-h)
        show_help
        ;;
    "")
        show_password
        ;;
    *)
        echo -e "${RED}✗ Unknown option: $1${NC}"
        echo ""
        show_help
        exit 1
        ;;
esac

echo ""
