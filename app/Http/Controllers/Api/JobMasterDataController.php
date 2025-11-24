<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JobSites;
use App\Models\JobDesignations;
use App\Models\JobTypes;
use App\Models\JobExperiences;
use App\Models\JobLocations;
use App\Models\JobSalaries;

class JobMasterDataController extends Controller
{
    public function index()
    {
        return response()->json([
            'jobSites' => JobSites::select('id', 'name', 'url')->get(),
            'designations' => JobDesignations::select('id', 'name')->get(),
            'jobTypes' => JobTypes::select('id', 'name')->get(),
            'experiences' => JobExperiences::select('id', 'level', 'min_years', 'max_years')->get(),
            'locations' => JobLocations::select('id', 'city', 'state', 'country')->get(),
            'salaries' => JobSalaries::select('id', 'min_salary', 'max_salary', 'currency')->get(),
        ]);
    }
}
