# CareerFlow Resume Builder - Installation Guide

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)

#### Windows (Laragon/XAMPP)

```bash
# Run the setup script
setup.bat
```

#### Linux/macOS

```bash
# Make executable and run
chmod +x setup.sh
./setup.sh
```

### Option 2: Manual Setup

## 📋 Prerequisites

### Required Software

-   **PHP 8.2+** (with extensions: BCMath, Ctype, cURL, DOM, Fileinfo, JSON, Mbstring, OpenSSL, PCRE, PDO, Tokenizer, XML)
-   **Composer** (PHP dependency manager)
-   **Node.js 18+** (with npm)
-   **Database** (SQLite, MySQL, or PostgreSQL)

### Recommended Development Environment

-   **Laragon** (Windows) - All-in-one PHP development environment
-   **XAMPP** (Cross-platform) - Apache, MySQL, PHP, Perl
-   **Docker** (Advanced users)

## 🛠️ Installation Steps

### Step 1: Clone/Download Project

```bash
# If using Git
git clone <repository-url>
cd careerflow

# Or download and extract ZIP
```

### Step 2: Install PHP Dependencies

```bash
composer install
```

### Step 3: Environment Setup

```bash
# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

### Step 4: Database Setup

```bash
# For MySQL (default) - Database will be created automatically
# Make sure MySQL is running on your system

# For SQLite (alternative)
# touch database/database.sqlite
# Update .env: DB_CONNECTION=sqlite

# For PostgreSQL (alternative)
# Update .env file with your database credentials
# DB_CONNECTION=pgsql
# DB_HOST=127.0.0.1
# DB_PORT=5432
# DB_DATABASE=careerflow
# DB_USERNAME=postgres
# DB_PASSWORD=

# Run migrations
php artisan migrate
```

### Step 5: Install Node.js Dependencies

```bash
npm install
```

### Step 6: Build Frontend Assets

```bash
# For development (with hot reloading)
npm run dev

# For production
npm run build
```

### Step 7: Start Development Servers

```bash
# Terminal 1: Laravel server
php artisan serve

# Terminal 2: Vite dev server (for hot reloading)
npm run dev
```

## 🔧 Configuration

### Environment Variables (.env)

```env
APP_NAME="CareerFlow Resume Builder"
APP_ENV=local
APP_KEY=base64:your-generated-key
APP_DEBUG=true
APP_URL=http://localhost:8000

# Database (MySQL - default)
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=careerflow
DB_USERNAME=root
DB_PASSWORD=

# Sanctum (for API authentication)
SANCTUM_STATEFUL_DOMAINS=localhost,127.0.0.1
```

### Database Options

#### MySQL (Default - Recommended)

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=careerflow
DB_USERNAME=root
DB_PASSWORD=
```

#### SQLite (Alternative - No setup required)

```env
DB_CONNECTION=sqlite
DB_DATABASE=/absolute/path/to/database/database.sqlite
```

#### PostgreSQL (Alternative)

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=careerflow
DB_USERNAME=postgres
DB_PASSWORD=
```

## 🚀 Development Commands

### Laravel Commands

```bash
# Start development server
php artisan serve

# Run migrations
php artisan migrate

# Clear cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Run tests
php artisan test

# Custom installation command
php artisan app:install
```

### Frontend Commands

```bash
# Install dependencies
npm install

# Development with hot reloading
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Combined Development

```bash
# Run both Laravel and Vite servers
composer run dev
```

## 🔍 Troubleshooting

### Common Issues

#### 1. "Insufficient Resources" Error

```bash
# Check PHP memory limit
php -i | grep memory_limit

# Increase memory in php.ini
memory_limit = 512M

# Or set in .env
PHP_MEMORY_LIMIT=512M
```

#### 2. Database Connection Issues

```bash
# Check MySQL service status
# Windows: Check if MySQL service is running in Services
# Linux: sudo systemctl status mysql
# macOS: brew services list | grep mysql

# Check database configuration
php artisan config:show database

# Test MySQL connection
mysql -u root -p -e "SHOW DATABASES;"

# Check if careerflow database exists
mysql -u root -p -e "USE careerflow; SHOW TABLES;"
```

#### 3. Node.js/npm Issues

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 4. Permission Issues (Linux/macOS)

```bash
# Fix storage permissions
chmod -R 775 storage bootstrap/cache

# Fix ownership
chown -R www-data:www-data storage bootstrap/cache
```

### Debug Mode

```bash
# Enable debug mode
php artisan config:clear
# Set APP_DEBUG=true in .env
```

## 📁 Project Structure

```
careerflow/
├── app/
│   ├── Console/Commands/     # Custom Artisan commands
│   ├── Http/Controllers/     # API controllers
│   └── Models/              # Eloquent models
├── database/
│   ├── migrations/          # Database migrations
│   └── database.sqlite      # SQLite database
├── resources/
│   ├── js/                  # React components
│   │   ├── components/      # Reusable components
│   │   ├── hooks/           # Custom hooks
│   │   ├── pages/           # Page components
│   │   └── store/           # State management
│   └── views/               # Blade templates
├── routes/
│   ├── api.php              # API routes
│   └── web.php              # Web routes
├── setup.bat                # Windows setup script
├── setup.sh                 # Unix setup script
└── INSTALL.md               # This file
```

## 🌐 Access Points

-   **Main App**: http://localhost:8000
-   **API Endpoints**: http://localhost:8000/api/\*
-   **Vite Dev Server**: http://localhost:5173 (hot reloading)

## 📚 Additional Resources

-   [Laravel Documentation](https://laravel.com/docs)
-   [React Documentation](https://react.dev)
-   [Tailwind CSS](https://tailwindcss.com/docs)
-   [Vite Documentation](https://vitejs.dev/guide/)

## 🆘 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Verify all prerequisites are installed
3. Check Laravel logs: `storage/logs/laravel.log`
4. Check browser console for JavaScript errors
5. Ensure all environment variables are set correctly

## 🎉 Success!

Once everything is running, you should see:

-   Laravel server running on http://localhost:8000
-   Vite dev server running on http://localhost:5173
-   Database migrations completed
-   Frontend assets built successfully

You can now start building resumes! 🚀
