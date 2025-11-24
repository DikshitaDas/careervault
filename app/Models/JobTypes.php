<?php

namespace App\Models;

use App\Models\JobSearch;
use Illuminate\Database\Eloquent\Model;

class JobTypes extends Model
{
    protected $fillable = ['name'];

    public function jobs()
    {
        return $this->hasMany(JobSearch::class, 'job_type_id');
    }
}
