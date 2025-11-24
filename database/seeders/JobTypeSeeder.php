<?php

namespace Database\Seeders;

use App\Models\JobTypes;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class JobTypeSeeder extends Seeder
{
 public function run(): void
    {
        $types = [
            'Full-time',
            'Part-time',
            'Internship',
            'Freelance',
            'Contract',
            'Temporary',
            'Remote',
            'Hybrid',
        ];

        foreach ($types as $type) {
            JobTypes::firstOrCreate(['name' => $type]);
        }
    }
}
