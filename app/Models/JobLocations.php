<?php

namespace App\Models;

use App\Models\JobSearch;
use Illuminate\Database\Eloquent\Model;

class JobLocations extends Model
{
   protected $fillable = ['city', 'state', 'country'];

    public function jobs()
    {
        return $this->hasMany(JobSearch::class, 'job_location_id');
    }

    public function getFullLocationAttribute()
    {
        return trim("{$this->city}, {$this->state}, {$this->country}", ', ');
    }
}
