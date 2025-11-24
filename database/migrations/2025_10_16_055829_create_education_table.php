<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('educations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('resume_id')->constrained('resumes')->onDelete('cascade');
            $table->string('degree')->nullable();
            $table->string('field_of_study')->nullable();
            $table->string('school')->nullable();
            $table->year('graduation_year')->nullable();
            $table->enum('grading_type', ['percentage', 'cgpa'])->nullable()->after('graduation_year');
            $table->decimal('grade', 5, 2)->nullable()->after('grading_type');
            $table->integer('order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('educations');
    }
};
