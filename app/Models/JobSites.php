<?php

namespace App\Models;

use App\Models\JobSearch;
use Illuminate\Database\Eloquent\Model;

class JobSites extends Model
{
    protected $fillable = ['name', 'url'];

    public function jobs()
    {
        return $this->hasMany(JobSearch::class, 'job_site_id');
    }
}
