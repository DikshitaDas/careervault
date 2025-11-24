<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Education extends Model
{
    protected $fillable = [
        'resume_id',
        'degree',
        'field_of_study',
        'school',
        'graduation_year',
        'order'
    ];
    protected $table = 'educations';

    public function resume(): BelongsTo
    {
        return $this->belongsTo(Resume::class);
    }
}
