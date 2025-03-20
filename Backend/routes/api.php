<?php

use Illuminate\Http\Request;
use App\Http\Controllers\Api\PatientController;

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PharmacistController;

Route::apiResource('pharmacists', PharmacistController::class);


Route::apiResource('patients', PatientController::class);

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

require __DIR__ . '/auth.php';