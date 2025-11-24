<?php

namespace App\Providers;

use App\Models\Resume;
use App\Policies\ResumePolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        Resume::class => ResumePolicy::class,
    ];

    public function boot(): void
    {
        //
    }
}
