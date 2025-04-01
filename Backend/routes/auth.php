<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\DrugController;
use App\Http\Controllers\Api\Profile\PasswordController;
use App\Http\Controllers\Api\DrugLikeController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\PatientController; 
use App\Http\Controllers\Api\PharmacistController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\GoogleAuthController;

use App\Http\Controllers\Api\ForgotPasswordController;
use App\Http\Controllers\Api\ResetPasswordController;
Route::post('/forgot-password', [PasswordController::class, 'sendResetLink']);
Route::post('/reset-password', [PasswordController::class, 'resetUserPassword']);

Route::get('password/reset', [ForgotPasswordController::class, 'showLinkRequestForm'])->name('password.request');
Route::post('password/email', [ForgotPasswordController::class, 'sendResetLinkEmail'])->name('password.email');
Route::get('password/reset/{token}', [ResetPasswordController::class, 'showResetForm'])->name('password.reset');
Route::post('password/reset', [ResetPasswordController::class, 'reset'])->name('password.update');
// Google Authentication
Route::get('/auth/google/redirect', [GoogleAuthController::class, 'redirect'])->name('google.redirect');
Route::get('/auth/google/callback', [GoogleAuthController::class, 'callback'])->name('google.callback');

// Profile Picture Routes
Route::post('/profile-picture', [ImageController::class, 'store']);  
Route::get('/profile-picture/{userId}', [ImageController::class, 'show']); 
Route::delete('/profile-picture', [ImageController::class, 'destroy']); 

// Payment Routes
Route::get('success', [PaymentController::class, 'success']);
Route::get('error', [PaymentController::class, 'error']);
Route::post('pay', [PaymentController::class, 'pay']);

// Authentication Routes
Route::post('auth/register', [AuthController::class, 'register']);
Route::post('auth/login', [AuthController::class, 'login']);
Route::post('auth/refresh_token', [AuthController::class, 'refreshToken']);
Route::post('auth/verify_user_email', [AuthController::class, 'verifyUserEmail']);
Route::post('auth/resend_email_verification_link', [AuthController::class, 'resendEmailVerificationLink']);
Route::post('auth/forgot_password', [AuthController::class, 'forgotPassword']);


Route::middleware(['auth'])->group(function () {
    // Authenticated User Routes
    Route::post('auth/logout', [AuthController::class, 'logout']);
    Route::get('auth/profile', [AuthController::class, 'profile']);
    Route::post('auth/change_password', [PasswordController::class, 'changeUserPassword']);

    // Drug Like Routes
    Route::post('togglelike', [DrugLikeController::class, 'togglelike']);

    // Cart Routes
    Route::apiResource('carts', CartController::class);
    
    // Drug Routes
    Route::apiResource('drugs', DrugController::class);

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
        Route::post('pharmacist/drug/update/{id}', [PharmacistController::class, 'updateDrug']);
        Route::delete('pharmacist/drug/delete/{id}', [PharmacistController::class, 'deleteDrug']);
    });

    // Patient Routes
    Route::middleware(['patient'])->group(function () {
        Route::put('patient/cart/update/{id}', [CartController::class, 'update']);
        Route::put('patient/cart/{id}/update', [CartController::class, 'update']);
    });
});

// Public Drug Routes
Route::get('drugs', [DrugController::class, 'index']); 
Route::get('drugs/{id}', [DrugController::class, 'show']); 

// Public View
Route::get('/app', function () {
    return view('app');
});
