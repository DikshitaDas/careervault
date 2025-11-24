<?php


use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\SkillController;
use App\Http\Controllers\Api\ConfigController;
use App\Http\Controllers\Api\ResumeController;
use App\Http\Controllers\Api\ProjectController;
    use App\Http\Controllers\Api\JobSearchController;
use App\Http\Controllers\Api\EducationController;
use App\Http\Controllers\Api\ExperienceController;
use App\Http\Controllers\Api\CertificationController;
use App\Http\Controllers\Api\JobMasterDataController;

Route::get('/config', [ConfigController::class, 'index']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Public job search endpoints
Route::get('/job-search', [JobSearchController::class, 'index']);
Route::get('/job-master-data', [JobMasterDataController::class, 'index']);





Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::apiResource('resumes', ResumeController::class);
    Route::get('/resumes/{resume}/export-docx', [ResumeController::class, 'exportDocx']);
    Route::apiResource('experiences', ExperienceController::class)->only(['store', 'update', 'destroy']);
    Route::apiResource('projects', ProjectController::class)->only(['store', 'update', 'destroy']);
    Route::apiResource('skills', SkillController::class)->only(['store', 'update', 'destroy']);
    Route::apiResource('educations', EducationController::class)->only(['store', 'update', 'destroy']);
    Route::apiResource('certifications', CertificationController::class)->only(['store', 'update', 'destroy']);   
    Route::post('/logout', [AuthController::class, 'logout']);
});
