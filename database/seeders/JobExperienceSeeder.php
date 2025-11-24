<?php

namespace Database\Seeders;

use App\Models\JobExperiences;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class JobExperienceSeeder extends Seeder
{
    public function run(): void
    {
        $experiences = [
            ['level' => 'Internship', 'min_years' => 0, 'max_years' => 0],
            ['level' => 'Entry Level', 'min_years' => 0, 'max_years' => 1],
            ['level' => 'Junior', 'min_years' => 1, 'max_years' => 3],
            ['level' => 'Mid Level', 'min_years' => 3, 'max_years' => 6],
            ['level' => 'Senior', 'min_years' => 6, 'max_years' => 10],
            ['level' => 'Lead', 'min_years' => 10, 'max_years' => 15],
            ['level' => 'Director', 'min_years' => 15, 'max_years' => 20],
        ];

        foreach ($experiences as $exp) {
            JobExperiences::firstOrCreate($exp);
        }
    }
}
