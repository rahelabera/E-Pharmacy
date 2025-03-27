<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\DrugConroller;
use App\Http\Controllers\Api\DrugLikeController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\PatientController; 
use App\Http\Controllers\Api\PharmacistController;
use App\Http\Controllers\Api\PaymentController;

Route::get('success',[PaymentController::class,'success']);
Route::get('error',[PaymentController::class,'error']);
Route::post('pay',[PaymentController::class,'pay']);
Route::post('auth/register', [AuthController::class, 'register']);
Route::post('auth/login', [AuthController::class, 'login']);
Route::post('auth/verify_user_email', [AuthController::class, 'verifyUserEmail']);
Route::post('auth/resend_email_verification_link', [AuthController::class, 'resendEmailVerificationLink']);
Route::get('/app', function () {
    return view('app');
});


Route::post('togglelike', [DrugLikeController::class, 'togglelike']);


Route::middleware('auth:api')->delete('user/{id}', [AuthController::class, 'deleteUser']);

// Drug-related routes (No auth required)
Route::get('drugs', [DrugConroller::class, 'index']); // List all drugs
Route::get('drugs/{id}', [DrugConroller::class, 'show']); // Show a specific drug

// Authenticated routes (requires auth)
Route::middleware(['auth'])->group(function () {
    // Password change route
    Route::post('/change_password', [AuthController::class, 'changeUserPassword']);
    
    // User profile route
    Route::post('auth/logout', [AuthController::class, 'logout']);
    Route::post('auth/profile', [AuthController::class, 'profile']);

    // Cart routes
    Route::apiResource('carts', CartController::class);
    
    // Drug-related routes (CRUD)
    Route::apiResource('drugs', DrugConroller::class);

    // Pharmacists and Patients Routes
    Route::get('/pharmacists', [PharmacistController::class, 'index']); // Get all pharmacists
    Route::get('/patients', [PatientController::class, 'getAllPatients']); // Get all patients

    // Patient search route
    Route::get('/patients/search', [PatientController::class, 'index']); // Search patients

    // Admin-specific routes (with permissions checks)
    Route::group(['middleware' => 'admin'], function () {
        Route::get('admin/pharmacists', [PharmacistController::class, 'index']); // Get all pharmacists (admin view)
        Route::get('admin/patients', [PatientController::class, 'getAllPatients']); // Get all patients (admin view)
        Route::get('admin/patients/{id}', [PatientController::class, 'show']); // Show a specific patient
        Route::put('admin/patients/{id}', [PatientController::class, 'update']); // Update patient address
        Route::delete('admin/patients/{id}', [PatientController::class, 'destroy']); // Delete a patient

        // Pharmacist-specific routes
        Route::get('admin/pharmacists', [PharmacistController::class, 'index']); // List all pharmacists
        Route::post('admin/pharmacists', [PharmacistController::class, 'store']); // Store a new pharmacis   Route::get('admin/pharmacists/{pharmacist}', [PharmacistController::class, 'show']); // Get a single pharmacist by ID
        Route::put('admin/pharmacists/{pharmacist}', [PharmacistController::class, 'update']); // Update pharmacist's details
        Route::delete('admin/pharmacists/{pharmacist}', [PharmacistController::class, 'destroy']); // Delete a pharmacist
    });

    // Pharmacist-specific routes (with permissions checks)
    Route::group(['middleware' => 'pharmacist'], function () {
        Route::post('pharmacist/drug/update/{id}', [PharmacistController::class, 'updateDrug']);
        Route::delete('pharmacist/drug/delete/{id}', [PharmacistController::class, 'deleteDrug']);
    });

    // Patient-specific routes (with permissions checks)
    Route::group(['middleware' => 'patient'], function () {
        Route::put('patient/cart/update/{id}', [CartController::class, 'update']);
        Route::put('patient/cart/{id}/update', [CartController::class, 'update']);
    });

});
