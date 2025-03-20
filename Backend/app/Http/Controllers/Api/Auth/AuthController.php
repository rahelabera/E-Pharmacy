<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegistraationRequest;
use App\Http\Requests\VerifyEmailRequest;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use App\Customs\Services\EmailVerificationService;
use App\Http\Requests\ResendEmailVerificationLinkRequest;

class AuthController extends Controller
{
    public function __construct(private EmailVerificationService $service){}
    

    public function login(LoginRequest $request){
        $token = Auth::attempt($request->validated());
        return $token ? $this->responseWithToken($token, Auth::user()) : response()->json([
            'status' =>'failed',
            'message'=>'Invalid credentials'
        ], 401);
    }
    
    public function register(RegistraationRequest $request){
        $user = User::create($request->validated());
        if($user){
            $this->service->sendVerificationLink($user);
            $token = Auth::login($user);
            return response()->json([
                'status'=>'success',
                'user'=>$user,
                'access_token'=>$token,
                'type'=>'bearer'
            ]);
        }
        return response()->json([
            'status'=>'failed',
            'message'=>'An error occurred while trying to create user'
        ], 500);
    }
    
    public function responseWithToken($token, $user){
        return response()->json([
            'status'=>'success',
            'user'=>$user,
            'access_token'=>$token,
            'type'=>'bearer'
        ]);
    }
    
    public function verifyUserEmail(VerifyEmailRequest $request){
        return $this->service->verifyEmail($request->email, $request->token);
    }
    
    public function resendEmailVerificationLink(ResendEmailVerificationLinkRequest $request){
        return $this->service->resendLink($request->email);
    }
    
    public function profile(){
        return response()->json([
            "status" => true,
            "message" => "Profile data",
            "user" => Auth::user()
        ]);
    }
    
    public function logout(){
        Auth::logout();
        return response()->json([
            'status'=>'success',
            'message'=>'User has been logged out successfully'
        ]);
    }
}
