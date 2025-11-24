<?php

namespace App\Models;

use App\Models\JobSites;
use App\Models\JobTypes;
use App\Models\JobSalaries;
use App\Models\JobLocations;
use App\Models\JobExperiences;
use Illuminate\Database\Eloquent\Model;

class JobSearch extends Model
{
    protected $fillable = [
        'title',
        'description',
        'company_name',
        'employment_type',
        'status',
        'job_type_id',
        'job_location_id',
        'job_site_id',
        'job_experience_id',
        'job_salary_id',
        'job_designation_id',
    ];

    public function type()
    {
        return $this->belongsTo(JobTypes::class, 'job_type_id');
    }
    public function designation()
    {
        return $this->belongsTo(JobDesignations::class, 'job_designation_id');
    }
    public function location()
    {
        return $this->belongsTo(JobLocations::class, 'job_location_id');
    }
    public function site()
    {
        return $this->belongsTo(JobSites::class, 'job_site_id');
    }
    public function experience()
    {
        return $this->belongsTo(JobExperiences::class, 'job_experience_id');
    }
    public function salary()
    {
        return $this->belongsTo(JobSalaries::class, 'job_salary_id');
    }
}
