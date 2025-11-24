<?php

namespace App\Models;

use App\Models\JobSearch;
use Illuminate\Database\Eloquent\Model;

class JobDesignations extends Model
{
    protected $fillable = ['name'];

    public function jobs()
    {
        return $this->hasMany(JobSearch::class, 'job_designation_id');
    }
}
