<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\DrugConroller;
use App\Http\Controllers\Api\Profile\PasswordController;
use App\Http\Controllers\Api\DrugLikeController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\PatientController; 
use App\Http\Controllers\Api\PharmacistController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\GoogleAuthController;

use App\Http\Controllers\Api\ForgotPasswordController;
use App\Http\Controllers\Api\ResetPasswordController;



// Profile Picture Routes
Route::post('/profile-picture', [ImageController::class, 'store']);  
Route::get('/profile-picture/{userId}', [ImageController::class, 'show']); 
Route::delete('/profile-picture', [ImageController::class, 'destroy']); 



// Authentication Routes
Route::post('auth/register', [AuthController::class, 'register']);
Route::post('auth/login', [AuthController::class, 'login']);
Route::post('auth/refresh_token', [AuthController::class, 'refreshToken']);
Route::post('auth/verify_user_email', [AuthController::class, 'verifyUserEmail']);
Route::post('auth/resend_email_verification_link', [AuthController::class, 'resendEmailVerificationLink']);
Route::post('/forgot-password', [PasswordController::class, 'sendResetLink']);

Route::apiResource('carts', CartController::class);

Route::middleware(['auth'])->group(function () {
    // Authenticated User Routes
    Route::post('auth/logout', [AuthController::class, 'logout']);
    Route::get('auth/profile', [AuthController::class, 'profile']);
    Route::post('auth/change_password', [PasswordController::class, 'changeUserPassword']);

    // Drug Like Routes
    Route::post('togglelike', [DrugLikeController::class, 'togglelike']);

    // Cart Routes
    
    
    // Drug Routes
    Route::put('drug/{id}', [DrugConroller::class, 'update']); 
    Route::post('drugs', [DrugConroller::class, 'store']); 
    Route::delete('drug/{id}', [DrugConroller::class, 'delete']); 
    

    // Pharmacist Routes
    Route::get('/pharmacists', [PharmacistController::class, 'index']); 

    // Patient Routes
    Route::get('/patients', [PatientController::class, 'getAllPatients']); 
    Route::get('/patients/search', [PatientController::class, 'index']); 

    // Admin Routes (Restricted)
    Route::middleware(['admin'])->group(function () {
        Route::get('admin/pharmacists', [PharmacistController::class, 'index']); 
        Route::get('admin/patients', [PatientController::class, 'getAllPatients']); 
        Route::get('admin/patients/{id}', [PatientController::class, 'show']); 
        Route::put('admin/patients/{id}', [PatientController::class, 'update']); 
        Route::delete('admin/patients/{id}', [PatientController::class, 'destroy']); 

        Route::get('pharmacists/{id}/license-image', [AdminController::class, 'viewLicenseImage']);
        Route::put('pharmacists/{id}/approve', [AdminController::class, 'approvePharmacist']);
        Route::put('pharmacists/{id}/reject', [AdminController::class, 'rejectPharmacist']);

        Route::post('admin/pharmacists', [PharmacistController::class, 'store']); 
        Route::put('admin/pharmacists/{pharmacist}', [PharmacistController::class, 'update']); 
        Route::delete('admin/pharmacists/{pharmacist}', [PharmacistController::class, 'destroy']); 
    });

    // Pharmacist Routes
    Route::middleware(['pharmacist'])->group(function () {
        Route::post('pharmacist/drug/{id}', [PharmacistController::class, 'updateDrug']);
        Route::delete('pharmacist/drug/{id}', [PharmacistController::class, 'deleteDrug']);
    });

    // Patient Routes
    Route::middleware(['patient'])->group(function () {
        Route::put('patient/cart/{id}', [CartController::class, 'update']);
    });
});

// Public Drug Routes
Route::get('drugs', [DrugConroller::class, 'index']); 
Route::get('drugs/{id}', [DrugConroller::class, 'show']); 




