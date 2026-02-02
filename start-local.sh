#!/bin/bash

echo "🚀 Starting Martek Group Website Locally..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed yet."
    echo "Please complete the Node.js installer that opened, then run this script again."
    echo ""
    echo "Or download from: https://nodejs.org/"
    exit 1
fi

# Check Node version
echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo ""
echo "✅ Dependencies installed!"
echo ""

# Start dev server
echo "🌐 Starting development server..."
echo "Your site will be available at: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm run dev

