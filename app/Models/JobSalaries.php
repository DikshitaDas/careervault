<?php

namespace App\Models;

use App\Models\Jobs;
use Illuminate\Database\Eloquent\Model;

class JobSalaries extends Model
{
     protected $fillable = ['min_salary', 'max_salary', 'currency'];

    public function jobs()
    {
        return $this->hasMany(JobSearch::class, 'job_salary_id');
    }

    public function getFormattedRangeAttribute()
    {
        return "{$this->currency} {$this->min_salary} - {$this->max_salary}";
    }
}
