<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Resume extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'title',
        'email',
        'phone',
        'location',
        'linkedin',
        'github',
        'summary',
        'is_default'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function experiences(): HasMany
    {
        return $this->hasMany(Experience::class)->orderBy('order');
    }

    public function projects(): HasMany
    {
        return $this->hasMany(Project::class)->orderBy('order');
    }

    public function skills(): HasMany
    {
        return $this->hasMany(Skill::class)->orderBy('order');
    }

    public function educations(): HasMany
    {
        return $this->hasMany(Education::class)->orderBy('order');
    }

    public function certifications(): HasMany
    {
        return $this->hasMany(Certification::class)->orderBy('order');
    }
}
