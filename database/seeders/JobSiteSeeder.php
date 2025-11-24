<?php

namespace Database\Seeders;

use App\Models\JobSites;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class JobSiteSeeder extends Seeder
{
 public function run(): void
    {
        $sites = [
            ['name' => 'LinkedIn', 'url' => 'https://linkedin.com'],
            ['name' => 'Indeed', 'url' => 'https://indeed.com'],
            ['name' => 'Glassdoor', 'url' => 'https://glassdoor.com'],
            ['name' => 'Naukri', 'url' => 'https://naukri.com'],
            ['name' => 'Remotive','url' => 'https://remotive.com'],
            ['name' => 'ArbeitNow','url' => 'https://www.arbeitnow.com']
        ];

        foreach ($sites as $site) {
            JobSites::firstOrCreate($site);
        }

    }
}
