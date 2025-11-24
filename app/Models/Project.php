<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'resume_id',
        'name',
        'description',
        'technologies',
        'link',
    ];

    public function resume()
    {
        return $this->belongsTo(Resume::class);
    }
}
