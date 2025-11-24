<?php

namespace Database\Seeders;

use App\Models\JobSalaries;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class JobSalarySeeder extends Seeder
{
  public function run(): void
    {
        // Salary ranges in INR per annum (LPA)
        // 1 LPA = 100,000 INR
        $L = 100000; // base for readability
        $salaries = [
            // ['min_salary' => 0 * $L,  'max_salary' => 2 * $L,  'currency' => 'INR'], // 0 - 2 LPA
            ['min_salary' => 2 * $L,  'max_salary' => 4 * $L,  'currency' => 'INR'], // 2 - 4 LPA
            ['min_salary' => 4 * $L,  'max_salary' => 6 * $L,  'currency' => 'INR'], // 4 - 6 LPA
            ['min_salary' => 6 * $L,  'max_salary' => 10 * $L, 'currency' => 'INR'], // 6 - 10 LPA
            ['min_salary' => 10 * $L, 'max_salary' => 15 * $L, 'currency' => 'INR'], // 10 - 15 LPA
            ['min_salary' => 15 * $L, 'max_salary' => 20 * $L, 'currency' => 'INR'], // 15 - 20 LPA
            ['min_salary' => 20 * $L, 'max_salary' => 30 * $L, 'currency' => 'INR'], // 20 - 30 LPA
            ['min_salary' => 30 * $L, 'max_salary' => 40 * $L, 'currency' => 'INR'], // 30 - 40 LPA
            ['min_salary' => 40 * $L, 'max_salary' => 50 * $L, 'currency' => 'INR'], // 40 - 50 LPA
            ['min_salary' => 50 * $L, 'max_salary' => 60 * $L, 'currency' => 'INR'], // 50 - 60 LPA
            ['min_salary' => 60 * $L, 'max_salary' => 80 * $L, 'currency' => 'INR'], // 60 - 80 LPA
            ['min_salary' => 80 * $L, 'max_salary' => 100 * $L, 'currency' => 'INR'], // 80 - 100 LPA
        ];

        foreach ($salaries as $sal) {
            JobSalaries::firstOrCreate($sal);
        }
    }
}
