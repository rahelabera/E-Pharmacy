<?php

use Illuminate\Support\Facades\Route;
use App\Events\PersonMoved;

use App\Http\Controllers\PaymentController;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Api\PatientController;




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



//PayPal Payment Route
Route::post('/paypal/process', [PaymentController::class, 'pay'])->name('paypal.process');
Route::get('/success', [PaymentController::class, 'success'])->name('payment.success');
Route::get('/error', [PaymentController::class, 'error'])->name('payment.error');


Route::get('/pay/{orderId}', function ($orderId) {
    $order = DB::table('orders')->where('id', $orderId)->first();

    if (!$order) {
        abort(404, 'Order not found');
    }

  
    return view('paypal', ['order_id' => $order->id]);
})->name('payment');

