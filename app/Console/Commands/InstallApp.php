<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;

class InstallApp extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:install {--force : Force installation even if app is already configured}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Install and setup the CareerVault Resume Builder application';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🚀 Starting CareerVault Resume Builder Installation...');
        $this->newLine();

        // Check if already installed
        if (File::exists('.env') && !$this->option('force')) {
            if ($this->confirm('App appears to be already configured. Continue anyway?')) {
                $this->warn('Proceeding with reinstallation...');
            } else {
                $this->info('Installation cancelled.');
                return 0;
            }
        }

        try {
            $this->step1_EnvironmentSetup();
            $this->step2_DatabaseSetup();
            $this->step3_ApplicationKey();
            $this->step4_DatabaseMigration();
            $this->step5_StorageSetup();
            $this->step6_NodeDependencies();
            $this->step7_BuildAssets();
            $this->step8_Optimization();
            $this->step9_Verification();

            $this->newLine();
            $this->info('✅ Installation completed successfully!');
            $this->newLine();
            $this->displayNextSteps();
        } catch (\Exception $e) {
            $this->error('❌ Installation failed: ' . $e->getMessage());
            return 1;
        }

        return 0;
    }

    private function step1_EnvironmentSetup()
    {
        $this->info('📝 Step 1: Setting up environment...');

        if (!File::exists('.env')) {
            if (File::exists('.env.example')) {
                File::copy('.env.example', '.env');
                $this->info('   ✓ Created .env file from .env.example');
            } else {
                $this->error('   ❌ .env.example file not found!');
                throw new \Exception('Missing .env.example file');
            }
        } else {
            $this->info('   ✓ .env file already exists');
        }

        // Set basic environment variables
        $envContent = File::get('.env');
        $envContent = $this->updateEnvValue($envContent, 'APP_NAME', 'CareerVault Resume Builder');
        $envContent = $this->updateEnvValue($envContent, 'APP_ENV', 'local');
        $envContent = $this->updateEnvValue($envContent, 'APP_DEBUG', 'true');
        $envContent = $this->updateEnvValue($envContent, 'APP_URL', 'http://localhost:8000');

        // Database configuration for MySQL
        $envContent = $this->updateEnvValue($envContent, 'DB_CONNECTION', 'mysql');
        $envContent = $this->updateEnvValue($envContent, 'DB_HOST', '127.0.0.1');
        $envContent = $this->updateEnvValue($envContent, 'DB_PORT', '3306');
        $envContent = $this->updateEnvValue($envContent, 'DB_DATABASE', 'careervault');
        $envContent = $this->updateEnvValue($envContent, 'DB_USERNAME', 'root');
        $envContent = $this->updateEnvValue($envContent, 'DB_PASSWORD', '');

        // Sanctum configuration
        $envContent = $this->updateEnvValue($envContent, 'SANCTUM_STATEFUL_DOMAINS', 'localhost,127.0.0.1');

        File::put('.env', $envContent);
        $this->info('   ✓ Environment variables configured for MySQL');
    }

    private function step2_DatabaseSetup()
    {
        $this->info('🗄️  Step 2: Setting up MySQL database...');

        try {
            // Test MySQL connection
            $host = config('database.connections.mysql.host', '127.0.0.1');
            $port = config('database.connections.mysql.port', '3306');
            $username = config('database.connections.mysql.username', 'root');
            $password = config('database.connections.mysql.password', '');
            $database = config('database.connections.mysql.database', 'careervault');

            // Connect to MySQL without specifying database
            $pdo = new \PDO("mysql:host={$host};port={$port}", $username, $password);
            $pdo->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);

            // Create database if it doesn't exist
            $pdo->exec("CREATE DATABASE IF NOT EXISTS `{$database}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
            $this->info("   ✓ MySQL database '{$database}' created/verified");
        } catch (\Exception $e) {
            $this->error("   ❌ MySQL connection failed: " . $e->getMessage());
            $this->warn("   💡 Make sure MySQL is running and credentials are correct");
            throw new \Exception('MySQL database setup failed: ' . $e->getMessage());
        }
    }

    private function step3_ApplicationKey()
    {
        $this->info('🔑 Step 3: Generating application key...');

        Artisan::call('key:generate');
        $this->info('   ✓ Application key generated');
    }

    private function step4_DatabaseMigration()
    {
        $this->info('📊 Step 4: Running database migrations...');

        try {
            // Run migrations
            Artisan::call('migrate', ['--force' => true]);
            $this->info('   ✓ Database migrations completed');

            // Show migration status
            $output = Artisan::output();
            if (strpos($output, 'Migrating') !== false) {
                $this->info('   ✓ Tables created successfully');
            }
        } catch (\Exception $e) {
            $this->error("   ❌ Migration failed: " . $e->getMessage());
            throw new \Exception('Database migration failed: ' . $e->getMessage());
        }
    }

    private function step5_StorageSetup()
    {
        $this->info('📁 Step 5: Setting up storage...');

        // Create storage directories
        $directories = [
            'storage/app/public',
            'storage/framework/cache',
            'storage/framework/sessions',
            'storage/framework/views',
            'storage/logs',
        ];

        foreach ($directories as $dir) {
            if (!File::exists($dir)) {
                File::makeDirectory($dir, 0755, true);
            }
        }

        // Create storage link
        if (!File::exists('public/storage')) {
            Artisan::call('storage:link');
            $this->info('   ✓ Storage link created');
        }

        $this->info('   ✓ Storage directories created');
    }

    private function step6_NodeDependencies()
    {
        $this->info('📦 Step 6: Installing Node.js dependencies...');

        if (!$this->commandExists('npm')) {
            $this->error('   ❌ npm not found! Please install Node.js first.');
            throw new \Exception('npm command not found');
        }

        $this->info('   Installing npm packages...');
        exec('npm install', $output, $returnCode);

        if ($returnCode !== 0) {
            $this->error('   ❌ npm install failed');
            throw new \Exception('Failed to install npm dependencies');
        }

        $this->info('   ✓ Node.js dependencies installed');
    }

    private function step7_BuildAssets()
    {
        $this->info('🏗️  Step 7: Building frontend assets...');

        $this->info('   Building assets for production...');
        exec('npm run build', $output, $returnCode);

        if ($returnCode !== 0) {
            $this->warn('   ⚠️  Production build failed, trying development build...');
            exec('npm run dev', $output, $returnCode);

            if ($returnCode !== 0) {
                $this->error('   ❌ Asset building failed');
                throw new \Exception('Failed to build frontend assets');
            }
        }

        $this->info('   ✓ Frontend assets built');
    }

    private function step8_Optimization()
    {
        $this->info('⚡ Step 8: Optimizing application...');

        Artisan::call('config:cache');
        Artisan::call('route:cache');
        Artisan::call('view:cache');

        $this->info('   ✓ Application optimized');
    }

    private function step9_Verification()
    {
        $this->info('🔍 Step 9: Verifying installation...');

        // Check if key exists
        if (empty(config('app.key'))) {
            throw new \Exception('Application key not set');
        }

        // Check database connection
        try {
            DB::connection()->getPdo();
            $this->info('   ✓ MySQL database connection successful');
        } catch (\Exception $e) {
            throw new \Exception('MySQL database connection failed: ' . $e->getMessage());
        }

        // Check if migrations ran
        $migrationCount = DB::table('migrations')->count();
        if ($migrationCount === 0) {
            throw new \Exception('No migrations found in database');
        }

        // Show created tables
        $tables = DB::select('SHOW TABLES');
        $tableNames = array_map(function ($table) {
            return array_values((array)$table)[0];
        }, $tables);

        $this->info('   ✓ Database tables created: ' . implode(', ', $tableNames));

        $this->info('   ✓ Installation verification passed');
    }

    private function updateEnvValue($content, $key, $value)
    {
        $pattern = "/^{$key}=.*/m";
        $replacement = "{$key}={$value}";

        if (preg_match($pattern, $content)) {
            return preg_replace($pattern, $replacement, $content);
        } else {
            return $content . "\n{$replacement}";
        }
    }

    private function commandExists($command)
    {
        $return = shell_exec(sprintf("which %s", escapeshellarg($command)));
        return !empty($return);
    }

    private function displayNextSteps()
    {
        $this->info('🎉 CareerVault Resume Builder is ready!');
        $this->newLine();

        $this->info('📋 Next Steps:');
        $this->line('   1. Start the Laravel server:');
        $this->line('      <comment>php artisan serve</comment>');
        $this->newLine();

        $this->line('   2. (Optional) Start the development server:');
        $this->line('      <comment>npm run dev</comment>');
        $this->newLine();

        $this->line('   3. Open your browser and visit:');
        $this->line('      <comment>http://localhost:8000</comment>');
        $this->newLine();

        $this->info('🗄️  Database Information:');
        $this->line('   • Database: MySQL');
        $this->line('   • Database Name: careervault');
        $this->line('   • Host: 127.0.0.1:3306');
        $this->line('   • Tables: users, resumes, experiences, projects, skills, educations, certifications');
        $this->newLine();

        $this->info('🔧 Development Commands:');
        $this->line('   • Run both servers: <comment>composer run dev</comment>');
        $this->line('   • Run tests: <comment>php artisan test</comment>');
        $this->line('   • Clear cache: <comment>php artisan cache:clear</comment>');
        $this->line('   • Reset database: <comment>php artisan migrate:fresh</comment>');
        $this->newLine();

        $this->info('📚 Documentation:');
        $this->line('   • Laravel: https://laravel.com/docs');
        $this->line('   • React: https://react.dev');
        $this->line('   • Tailwind CSS: https://tailwindcss.com/docs');
    }
}
