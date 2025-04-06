<?php

use Illuminate\Support\Facades\Route;
use App\Events\PersonMoved;
use App\Http\Controllers\Api\PlaceController;
use App\Http\Controllers\Api\TelebirrController;
use App\Http\Controllers\Api\GoogleAuthController;
use Illuminate\Http\Request;

Route::get('/', function () {
    return view('welcome');
});
Route::get('/app',function(){
    return view('app');
});

Route::get('/move',function(){
    event(new PersonMoved(40.7128, -74.0060));
    
});

Route::get('/register', function () {
    return view('register');
})->name('register');

Route::get('/login', function () {
    return view('login');
})->name('login');

Route::get('/email/verify', function () {
    return view('email_verification');
})->name('verification.notice');

Route::get('/forgot-password', function () {
    return view('forgot_password');
})->name('password.request');

Route::get('/email/verified', function () {
    return view('auth.verified');
})->name('verification.success');
Route::get('/password/reset/', function () {
    return view('emails.password_reset');
})->name('password.request');

Route::get('/email/verification-failed', function () {
    return "Verification failed. Invalid or expired link.";
})->name('verification.failed');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

Route::post('/save-place', [PlaceController::class, 'store']);
Route::get('/places', [PlaceController::class, 'index']);
Route::get('/auth/google/callback', [GoogleAuthController::class, 'callback']);
Route::get('/auth/google/redirect', [GoogleAuthController::class ,'redirect']);


Route::resource('', TelebirrController::class);
Route::post('getjson', [TelebirrController::class, 'getJson']);
Route::post('requestTele', [TelebirrController::class, 'requestTele']);