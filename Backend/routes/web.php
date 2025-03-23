<?php

use Illuminate\Support\Facades\Route;
use App\Events\PersonMoved;
use App\Http\Controllers\Api\PlaceController;

Route::get('/', function () {
    return view('welcome');
});
Route::get('/app',function(){
    return view('app');
});

Route::get('/move',function(){
    event(new PersonMoved(40.7128, -74.0060));
    
});


Route::post('/save-place', [PlaceController::class, 'store']);
Route::get('/places', [PlaceController::class, 'index']);
Route::get('/places/nearby', [PlaceController::class, 'nearby']);