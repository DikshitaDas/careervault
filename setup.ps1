# CareerFlow Resume Builder - PowerShell Setup Script

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "CareerVault Resume Builder - Setup Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Function to check if command exists
function Test-Command($cmdname) {
    return [bool](Get-Command -Name $cmdname -ErrorAction SilentlyContinue)
}

# Function to print status
function Write-Status($step, $message) {
    Write-Host "[$step/6] $message" -ForegroundColor Blue
}

# Function to print success
function Write-Success($message) {
    Write-Host "✓ $message" -ForegroundColor Green
}

# Function to print error
function Write-Error($message) {
    Write-Host "✗ $message" -ForegroundColor Red
}

Write-Status "1" "Checking PHP..."
if (Test-Command "php") {
    php --version
    Write-Success "PHP found"
} else {
    Write-Error "PHP not found! Please install PHP or use Laragon."
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Status "2" "Checking Composer..."
if (Test-Command "composer") {
    composer --version
    Write-Success "Composer found"
} else {
    Write-Error "Composer not found! Please install Composer."
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Status "3" "Checking Node.js..."
if (Test-Command "node") {
    node --version
    Write-Success "Node.js found"
} else {
    Write-Error "Node.js not found! Please install Node.js."
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Status "4" "Installing PHP dependencies..."
try {
    composer install
    Write-Success "PHP dependencies installed"
} catch {
    Write-Error "Composer install failed!"
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Status "5" "Running Laravel installation..."
try {
    php artisan app:install
    Write-Success "Laravel installation completed"
} catch {
    Write-Error "Laravel installation failed!"
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Status "6" "Starting development servers..."
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Setup Complete! Starting servers..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Starting Laravel server on http://localhost:8000" -ForegroundColor Yellow
Write-Host "Starting Vite dev server for hot reloading" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press Ctrl+C to stop both servers" -ForegroundColor Yellow
Write-Host ""

# Start Laravel server
Start-Process -FilePath "php" -ArgumentList "artisan", "serve" -WindowStyle Normal

# Wait a moment
Start-Sleep -Seconds 3

# Start Vite dev server
Start-Process -FilePath "npm" -ArgumentList "run", "dev" -WindowStyle Normal

Write-Host "Both servers are starting..." -ForegroundColor Green
Write-Host "Laravel: http://localhost:8000" -ForegroundColor Cyan
Write-Host "Vite: http://localhost:5173 (for hot reloading)" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to exit this window (servers will continue running)" -ForegroundColor Yellow
Read-Host
