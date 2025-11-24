<?php

namespace App\Models;

use App\Models\JobSearch;
use Illuminate\Database\Eloquent\Model;

class JobExperiences extends Model
{
    protected $fillable = ['level', 'min_years', 'max_years'];

    public function jobs()
    {
        return $this->hasMany(JobSearch::class, 'job_experience_id');
    }

    public function getExperienceRangeAttribute()
    {
        return "{$this->min_years}-{$this->max_years} years";
    }
}
