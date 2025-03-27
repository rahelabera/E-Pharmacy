<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use ILLuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Illuminate\Support\Str;

class GoogleAuthController extends Controller
{
    //
    public function redirect(){
        return Socialite::driver("google")->redirect();
    }
    public function callback(){
        $googleUser =Socialite::driver("google")->user();
        $user= User::updateOrCreate(
            ['google_id'=>$googleUser->id],
            [
                'name'=>$googleUser->name,
                'email'=>$googleUser->email,
                'password'=>Str::password(12),
                'email_verified_at'=>now()
            ]
            );
        Auth::login($user);
        return redirect(config("app.frontend_url")."/dashboard");
        dd($user);
    }
}
