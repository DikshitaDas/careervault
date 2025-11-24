#!/bin/bash

echo "========================================"
echo "CareerVault Resume Builder - Setup Script"
echo "========================================"
echo

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[$1/6]${NC} $2"
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

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

print_status "1" "Checking PHP..."
if command_exists php; then
    php --version
    print_success "PHP found"
else
    print_error "PHP not found! Please install PHP."
    exit 1
fi

print_status "2" "Checking Composer..."
if command_exists composer; then
    composer --version
    print_success "Composer found"
else
    print_error "Composer not found! Please install Composer."
    exit 1
fi

print_status "3" "Checking Node.js..."
if command_exists node; then
    node --version
    print_success "Node.js found"
else
    print_error "Node.js not found! Please install Node.js."
    exit 1
fi

print_status "4" "Installing PHP dependencies..."
if composer install; then
    print_success "PHP dependencies installed"
else
    print_error "Composer install failed!"
    exit 1
fi

print_status "5" "Running Laravel installation..."
if php artisan app:install; then
    print_success "Laravel installation completed"
else
    print_error "Laravel installation failed!"
    exit 1
fi

print_status "6" "Starting development servers..."
echo
echo "========================================"
echo "Setup Complete! Starting servers..."
echo "========================================"
echo
echo "Starting Laravel server on http://localhost:8000"
echo "Starting Vite dev server for hot reloading"
echo
echo "Press Ctrl+C to stop both servers"
echo

# Start Laravel server in background
php artisan serve &
LARAVEL_PID=$!

# Wait a moment for Laravel to start
sleep 3

# Start Vite dev server in background
npm run dev &
VITE_PID=$!

echo "Both servers are starting..."
echo "Laravel: http://localhost:8000"
echo "Vite: http://localhost:5173 (for hot reloading)"
echo
echo "Press Ctrl+C to stop both servers"

# Function to cleanup on exit
cleanup() {
    echo
    echo "Stopping servers..."
    kill $LARAVEL_PID 2>/dev/null
    kill $VITE_PID 2>/dev/null
    echo "Servers stopped."
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for user to stop
wait
