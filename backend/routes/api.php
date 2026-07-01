<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\CompanyController;
use App\Http\Controllers\Api\V1\ProjectController;
use App\Http\Controllers\Api\V1\LandController;
use App\Http\Controllers\Api\V1\HouseController;
use App\Http\Controllers\Api\V1\ConstructionController;
use App\Http\Controllers\Api\V1\DashboardController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {
    // Public/Auth routes
    Route::post('/auth/login', [AuthController::class, 'login']);

    // Authenticated & Tenant-Scoped routes
    Route::middleware(['auth:sanctum', 'tenant'])->group(function () {
        // Auth profile & logout
        Route::get('/auth/profile', [AuthController::class, 'profile']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);

        // Dashboard
        Route::get('/dashboard', [DashboardController::class, 'index']);

        // Company Settings
        Route::get('/company', [CompanyController::class, 'show']);
        Route::put('/company', [CompanyController::class, 'update']);

        // Projects
        Route::apiResource('projects', ProjectController::class);
        Route::post('projects/{project}/milestones', [ProjectController::class, 'addMilestone']);
        Route::post('projects/{project}/risks', [ProjectController::class, 'addRisk']);

        // Land & Subdivision
        Route::apiResource('lands', LandController::class);
        Route::post('lands/{land}/subdivide', [LandController::class, 'subdivide']);
        Route::post('blocks/{block}/lots', [LandController::class, 'addLot']);

        // Houses
        Route::get('house-types', [HouseController::class, 'indexHouseTypes']);
        Route::post('house-types', [HouseController::class, 'storeHouseType']);
        Route::apiResource('houses', HouseController::class);

        // Construction Stage-based progress
        Route::put('construction/stages/{stage}/progress', [ConstructionController::class, 'updateStageProgress']);
        Route::post('construction/stages/{stage}/workers', [ConstructionController::class, 'assignWorkers']);
        Route::post('construction/stages/{stage}/materials', [ConstructionController::class, 'logMaterials']);
        Route::post('construction/stages/{stage}/media', [ConstructionController::class, 'uploadMedia']);
        Route::post('construction/stages/{stage}/inspections', [ConstructionController::class, 'addInspection']);
    });
});

