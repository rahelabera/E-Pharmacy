<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CartController;


use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\Profile\PasswordController;
use App\Http\Controllers\Api\DrugConroller;
use App\Http\Controllers\Api\DrugLikeController;

Route::post('auth/register',[AuthController::class,'register']);
Route::post('auth/login',[AuthController::class,'login']);
Route::post('auth/verify_user_email',[AuthController::class,'verifyUserEmail']);
Route::post('auth/resend_email_verification_link',[AuthController::class,'resendEmailVerificationLink']);

Route::post('togglelike',[DrugLikeController::class, 'togglelike']);

Route::middleware(['auth'])->group(function(){
    Route::post('/change_password',[PasswordController::class,'changeUserPassword']);
    
    Route::post('auth/logout',[AuthController::class, 'logout']);
    Route::post('auth/Profile',[AuthController::class, 'profile']);
    Route::apiResource('carts',CartController::class);
    Route::apiResource('drugs',DrugConroller::class);
    
});