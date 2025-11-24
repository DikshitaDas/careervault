<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\JobDesignation;
use App\Models\JobDesignations;

class JobDesignationSeeder extends Seeder
{
    public function run(): void
    {
        $designations = [
            //Development Roles
            'Frontend Developer',
            'Backend Developer',
            'Full Stack Developer',
            'Laravel Developer',
            'PHP Developer',
            'React Developer',
            'Node.js Developer',
            'Python Developer',
            'Java Developer',
            'Mobile App Developer',
            'Android Developer',
            'iOS Developer',

            //Data & AI
            'Data Analyst',
            'Data Scientist',
            'Machine Learning Engineer',
            'AI Engineer',

            //Design & Creative
            'UI/UX Designer',
            'Graphic Designer',
            'Product Designer',
            'Video Editor',

            //Management & Leadership
            'Project Manager',
            'Product Manager',
            'Team Lead',
            'Technical Lead',
            'Engineering Manager',

            // IT & Infrastructure
            'DevOps Engineer',
            'Cloud Engineer',
            'System Administrator',
            'Network Engineer',
            'Cybersecurity Specialist',

            //Business & Marketing
            'Business Analyst',
            'Digital Marketing Specialist',
            'SEO Executive',
            'Content Writer',
            'Sales Executive',
            'Customer Support Specialist',
            'HR Executive',
            'Recruiter',

            //Internship Roles
            'Software Intern',
            'Design Intern',
            'Marketing Intern',
            'HR Intern',
        ];

        foreach ($designations as $name) {
            JobDesignations::firstOrCreate(['name' => $name]);
        }
    }
}
