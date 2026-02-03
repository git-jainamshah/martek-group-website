#!/bin/bash

# Martek Group Website - Automated Setup Script
# This script checks for dependencies and sets up the project automatically

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print functions
print_header() {
    echo ""
    echo -e "${BLUE}╔════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║                                                ║${NC}"
    echo -e "${BLUE}║       🚀 Martek Group Website Setup 🚀         ║${NC}"
    echo -e "${BLUE}║                                                ║${NC}"
    echo -e "${BLUE}╔════════════════════════════════════════════════╗${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Print header
print_header

# Step 1: Check Node.js
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📦 Checking Prerequisites..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if command_exists node; then
    NODE_VERSION=$(node --version)
    print_success "Node.js is installed: $NODE_VERSION"
    
    # Check if Node version is 18 or higher
    NODE_MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
    if [ "$NODE_MAJOR_VERSION" -lt 18 ]; then
        print_warning "Node.js version 18 or higher is recommended"
        print_info "Current version: $NODE_VERSION"
        print_info "Please consider upgrading: https://nodejs.org/"
    fi
else
    print_error "Node.js is not installed!"
    echo ""
    print_info "Please install Node.js to continue:"
    echo ""
    echo "   macOS:   brew install node"
    echo "            or visit https://nodejs.org/"
    echo ""
    echo "   Linux:   sudo apt install nodejs npm"
    echo "            or visit https://nodejs.org/"
    echo ""
    echo "   Windows: Download from https://nodejs.org/"
    echo ""
    exit 1
fi

# Step 2: Check npm
if command_exists npm; then
    NPM_VERSION=$(npm --version)
    print_success "npm is installed: v$NPM_VERSION"
else
    print_error "npm is not installed!"
    print_info "npm usually comes with Node.js. Please reinstall Node.js."
    exit 1
fi

echo ""

# Step 3: Check Git
if command_exists git; then
    GIT_VERSION=$(git --version)
    print_success "Git is installed: $GIT_VERSION"
else
    print_warning "Git is not installed (optional, but recommended)"
    print_info "Install from: https://git-scm.com/"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📥 Installing Dependencies..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if node_modules exists
if [ -d "node_modules" ]; then
    print_info "node_modules folder exists. Checking for updates..."
    npm install
else
    print_info "Installing all dependencies (this may take a few minutes)..."
    npm install
fi

if [ $? -eq 0 ]; then
    print_success "All dependencies installed successfully!"
else
    print_error "Failed to install dependencies"
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Project Information"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

print_info "Project Name: Martek Group Website"
print_info "Framework: Next.js 14.2"
print_info "Language: TypeScript 5.3"
print_info "Styling: Tailwind CSS 3.4"
print_info "Animations: Framer Motion 11.0"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 Starting Development Server..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

print_success "Setup completed successfully! 🎉"
echo ""
print_info "Your site will be available at: ${GREEN}http://localhost:3000${NC}"
echo ""
print_info "Press ${RED}Ctrl+C${NC} to stop the server"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Wait a moment for user to read
sleep 2

# Start the development server
npm run dev
