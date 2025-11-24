@echo off
echo ========================================
echo CareerVault Resume Builder - Setup Script
echo ========================================
echo.

echo [1/6] Checking PHP...
php --version
if %errorlevel% neq 0 (
    echo ERROR: PHP not found! Please install PHP or use Laragon.
    pause
    exit /b 1
)

echo [1.5/6] Checking MySQL...
mysql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo WARNING: MySQL not found in PATH. Make sure MySQL is running.
    echo If using Laragon, start MySQL from Laragon control panel.
) else (
    echo MySQL found and accessible.
)

echo [2/6] Checking Composer...
composer --version
if %errorlevel% neq 0 (
    echo ERROR: Composer not found! Please install Composer.
    pause
    exit /b 1
)

echo [3/6] Checking Node.js...
node --version
if %errorlevel% neq 0 (
    echo ERROR: Node.js not found! Please install Node.js.
    pause
    exit /b 1
)

echo [4/6] Installing PHP dependencies...
composer install
if %errorlevel% neq 0 (
    echo ERROR: Composer install failed!
    pause
    exit /b 1
)

echo [5/6] Running Laravel installation...
php artisan app:install
if %errorlevel% neq 0 (
    echo ERROR: Laravel installation failed!
    pause
    exit /b 1
)

echo [6/6] Starting development servers...
echo.
echo ========================================
echo Setup Complete! Starting servers...
echo ========================================
echo.
echo Starting Laravel server on http://localhost:8000
echo Starting Vite dev server for hot reloading
echo.
echo Press Ctrl+C to stop both servers
echo.

start "Laravel Server" cmd /k "php artisan serve"
timeout /t 3 /nobreak >nul
start "Vite Dev Server" cmd /k "npm run dev"

echo Both servers are starting...
echo Laravel: http://localhost:8000
echo Vite: http://localhost:5173 (for hot reloading)
echo.
echo Press any key to exit this window (servers will continue running)
pause >nul
