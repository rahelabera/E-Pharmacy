<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegistraationRequest;
use App\Http\Requests\VerifyEmailRequest;
use App\Http\Requests\ForgotPasswordRequest;
use App\Http\Requests\ResetPasswordRequest;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use App\Customs\Services\EmailVerificationService;
use App\Http\Requests\ResendEmailVerificationLinkRequest;

class AuthController extends Controller
{
    public function __construct(private EmailVerificationService $service) {}

    /**
     * User Registration (No Access Token Until Email is Verified)
     */
    public function register(RegistraationRequest $request)
    {
        $data = $request->validated();
        $data['is_role'] = $request->input('is_role', 1);

        $user = User::create($data);

        if ($user) {
            $this->service->sendVerificationLink($user);
            return response()->json([
                'status' => 'success',
                'message' => 'User registered successfully. Please verify your email before logging in.'
            ]);
        }

        return response()->json([
            'status' => 'failed',
            'message' => 'An error occurred while creating the user.'
        ], 500);
    }

    /**
     * User Login (Only Allowed If Email Is Verified)
     */
    public function login(LoginRequest $request)
    {
        $credentials = $request->validated();

        if (!Auth::attempt($credentials)) {
            return response()->json([
                'status' => 'failed',
                'message' => 'Invalid credentials'
            ], 401);
        }

        $user = Auth::user();

        // Prevent login if email is not verified
        if (!$user->email_verified_at) {
            return response()->json([
                'status' => 'failed',
                'message' => 'Please verify your email before logging in.'
            ], 403);
        }

        $token = Auth::login($user);
        $roleRedirects = [
            '0' => 'admin/dashboard',
            '1' => 'patient/dashboard',
            '2' => 'pharmacist/dashboard'
        ];

        return response()->json([
            'status' => 'success',
            'redirect_url' => $roleRedirects[$user->is_role] ?? null,
            'user' => $user,
            'access_token' => $token,
            'token_type' => 'bearer'
        ]);
    }

    /**
     * Verify User Email
     */
    public function verifyUserEmail(VerifyEmailRequest $request)
    {
        return $this->service->verifyEmail($request->email, $request->token);
    }

    /**
     * Resend Email Verification Link
     */
    public function resendEmailVerificationLink(ResendEmailVerificationLinkRequest $request)
    {
        return $this->service->resendLink($request->email);
    }

    /**
     * Forgot Password - Send Reset Link
     */
    public function forgotPassword(ForgotPasswordRequest $request)
    {
        $status = Password::sendResetLink($request->only('email'));

        if ($status === Password::RESET_LINK_SENT) {
            return response()->json([
                'status' => 'success',
                'message' => 'Password reset link sent successfully.'
            ]);
        }

        return response()->json([
            'status' => 'failed',
            'message' => 'Unable to send reset link.'
        ], 500);
    }

    /**
     * Reset Password
     */
    public function resetPassword(ResetPasswordRequest $request)
    {
        $status = Password::reset(
            $request->only('email', 'token', 'password', 'password_confirmation'),
            function ($user, $password) {
                $user->forceFill([
                    'password' => Hash::make($password)
                ])->save();
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return response()->json([
                'status' => 'success',
                'message' => 'Password reset successfully. You can now log in.'
            ]);
        }

        return response()->json([
            'status' => 'failed',
            'message' => 'Invalid or expired token.'
        ], 400);
    }

    /**
     * Get Authenticated User Profile
     */
    public function profile()
    {
        return response()->json([
            "status" => true,
            "message" => "Profile data",
            "user" => Auth::user()
        ]);
    }

    /**
     * Logout User
     */
    public function logout()
    {
        Auth::logout();
        return response()->json([
            'status' => 'success',
            'message' => 'User has been logged out successfully'
        ]);
    }

    /**
     * Get All Pharmacists
     */
    public function getAllPharmacists()
    {
        $pharmacists = User::where('is_role', 2)->get();

        if ($pharmacists->isEmpty()) {
            return response()->json([
                'status' => 'error',
                'message' => 'No pharmacists found in the database'
            ]);
        }

        return response()->json([
            'status' => 'success',
            'pharmacists' => $pharmacists
        ]);
    }

    /**
     * Get All Patients
     */
    public function getAllPatients()
    {
        $patients = User::where('is_role', 1)->get();

        if ($patients->isEmpty()) {
            return response()->json([
                'status' => 'error',
                'message' => 'No patients found in the database'
            ]);
        }

        return response()->json([
            'status' => 'success',
            'patients' => $patients
        ]);
    }

    /**
     * Delete User by ID
     */
    public function deleteUser($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'User deleted successfully'
        ]);
    }
}
