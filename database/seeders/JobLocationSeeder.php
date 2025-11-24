<?php

namespace Database\Seeders;

use App\Models\JobLocations;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class JobLocationSeeder extends Seeder
{
 public function run(): void
    {
        $locations = [
            ['city' => 'Bengaluru', 'state' => 'Karnataka', 'country' => 'India'],
            ['city' => 'Hyderabad', 'state' => 'Telangana', 'country' => 'India'],
            ['city' => 'Pune', 'state' => 'Maharashtra', 'country' => 'India'],
            ['city' => 'Mumbai', 'state' => 'Maharashtra', 'country' => 'India'],
            ['city' => 'Chennai', 'state' => 'Tamil Nadu', 'country' => 'India'],
            ['city' => 'Gurugram', 'state' => 'Haryana', 'country' => 'India'],
            ['city' => 'Noida', 'state' => 'Uttar Pradesh', 'country' => 'India'],
            ['city' => 'New Delhi', 'state' => 'Delhi', 'country' => 'India'],
            ['city' => 'Kolkata', 'state' => 'West Bengal', 'country' => 'India'],
            ['city' => 'Ahmedabad', 'state' => 'Gujarat', 'country' => 'India'],
            ['city' => 'Jaipur', 'state' => 'Rajasthan', 'country' => 'India'],
            ['city' => 'Mohali', 'state' => 'Punjab', 'country' => 'India'],
            ['city' => 'Chandigarh', 'state' => 'Chandigarh', 'country' => 'India'],
            ['city' => 'Indore', 'state' => 'Madhya Pradesh', 'country' => 'India'],
            ['city' => 'Kochi', 'state' => 'Kerala', 'country' => 'India'],
            ['city' => 'Thiruvananthapuram', 'state' => 'Kerala', 'country' => 'India'],
            ['city' => 'Coimbatore', 'state' => 'Tamil Nadu', 'country' => 'India'],
            ['city' => 'Mysuru', 'state' => 'Karnataka', 'country' => 'India'],
            ['city' => 'Nagpur', 'state' => 'Maharashtra', 'country' => 'India'],
            ['city' => 'Surat', 'state' => 'Gujarat', 'country' => 'India'],
        ];

        foreach ($locations as $loc) {
            JobLocations::firstOrCreate($loc);
        }
    }
}
