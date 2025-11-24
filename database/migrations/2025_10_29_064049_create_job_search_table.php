<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('job_search', function (Blueprint $table) {
            $table->id();
            
            $table->foreignId('job_type_id')->constrained()->cascadeOnDelete();
            $table->foreignId('job_location_id')->constrained()->cascadeOnDelete();
            $table->foreignId('job_site_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('job_experience_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('job_salary_id')->nullable()->constrained()->nullOnDelete();

            //Core job fields
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('company_name');
            $table->string('employment_type')->nullable(); 
            $table->string('status')->default('active');   
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('jobs');
    }
};
