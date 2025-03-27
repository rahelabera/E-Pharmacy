<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegistraationRequest;
use App\Http\Requests\VerifyEmailRequest;
use App\Http\Requests\ForgotPasswordRequest;
use App\Http\Requests\ResetPasswordRequest;
use App\Http\Requests\ResendEmailVerificationLinkRequest;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Carbon;
use App\Customs\Services\EmailVerificationService;

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

        return response()->json(['status' => 'failed', 'message' => 'An error occurred while creating the user.'], 500);
    }

    /**
     * User Login (Only Allowed If Email Is Verified)
     */
    public function login(LoginRequest $request)
    {
        $credentials = $request->validated();

        if (!Auth::attempt($credentials)) {
            return response()->json(['status' => 'failed', 'message' => 'Invalid credentials'], 401);
        }

        $user = Auth::user();

        if (!$user->email_verified_at) {
            return response()->json(['status' => 'failed', 'message' => 'Please verify your email before logging in.'], 403);
        }

        $accessToken = Auth::login($user);
        $refreshToken = Hash::make(now());
        DB::table('refresh_tokens')->updateOrInsert(
            ['user_id' => $user->id],
            ['token' => $refreshToken, 'expires_at' => now()->addDay()]
        );
        $expiresIn = Carbon::now()->addMinutes(60)->timestamp;
        $roleRedirects = ['0' => 'admin/dashboard', '1' => 'patient/dashboard', '2' => 'pharmacist/dashboard'];

        return response()->json([
            'status' => 'success',
            'redirect_url' => $roleRedirects[$user->is_role] ?? null,
            'access_token' => $accessToken,
            'refresh_token' => $refreshToken,
            'expires_in' => $expiresIn,
        ]);
    }

    public function refreshToken(Request $request)
    {
        $user = Auth::user();
        $refreshToken = $request->input('refresh_token');

        $storedToken = DB::table('refresh_tokens')->where('user_id', $user->id)->first();

        if (!$storedToken || !Hash::check($refreshToken, $storedToken->token)) {
            return response()->json(['status' => 'failed', 'message' => 'Invalid refresh token.'], 401);
        }

        if (Carbon::parse($storedToken->expires_at)->isPast()) {
            return response()->json(['status' => 'failed', 'message' => 'Refresh token expired. Please log in again.'], 401);
        }

        $newAccessToken = Auth::login($user);
        $newRefreshToken = Hash::make(now());

        DB::table('refresh_tokens')->where('user_id', $user->id)->update([
            'token' => $newRefreshToken, 'expires_at' => now()->addDay()
        ]);

        return response()->json([
            'status' => 'success',
            'access_token' => $newAccessToken,
            'refresh_token' => $newRefreshToken,
            'token_type' => 'bearer'
        ]);
    }

    public function verifyUserEmail(VerifyEmailRequest $request)
    {
        return $this->service->verifyEmail($request->email, $request->token);
    }

    public function resendEmailVerificationLink(ResendEmailVerificationLinkRequest $request)
    {
        return $this->service->resendLink($request->email);
    }

    public function forgotPassword(ForgotPasswordRequest $request)
    {
        $status = Password::sendResetLink($request->only('email'));
        return response()->json(['status' => $status === Password::RESET_LINK_SENT ? 'success' : 'failed', 'message' => __($status)]);
    }

    public function resetPassword(ResetPasswordRequest $request)
    {
        $status = Password::reset(
            $request->only('email', 'token', 'password', 'password_confirmation'),
            function ($user, $password) {
                $user->update(['password' => Hash::make($password)]);
            }
        );

        return response()->json(['status' => $status === Password::PASSWORD_RESET ? 'success' : 'failed', 'message' => __($status)]);
    }

    public function profile()
    {
        return response()->json(['status' => true, 'message' => 'Profile data', 'user' => Auth::user()]);
    }

    public function logout()
    {
        Auth::logout();
        return response()->json(['status' => 'success', 'message' => 'User has been logged out successfully']);
    }

    public function getAllPharmacists()
    {
        return response()->json(['status' => 'success', 'pharmacists' => User::where('is_role', 2)->get()]);
    }

    public function getAllPatients()
    {
        return response()->json(['status' => 'success', 'patients' => User::where('is_role', 1)->get()]);
    }

    public function deleteUser($id)
    {
        User::findOrFail($id)->delete();
        return response()->json(['status' => 'success', 'message' => 'User deleted successfully']);
    }
}
