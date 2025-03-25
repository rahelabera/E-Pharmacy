<?php

namespace App\Customs\Services;

use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Password;
use Illuminate\Http\JsonResponse;
use App\Models\User;

class PasswordService
{
    private function validateCurrentPassword($current_password)
    {
        if (!password_verify($current_password, Auth::user()->password)) {
            response()->json([
                'status' => 'failed',
                'message' => 'Password did not match the current password'
            ])->send();
            exit;
        }
    }

    /**
     * Change user password.
     */
    public function changePassword($data): JsonResponse
    {
        $this->validateCurrentPassword($data['current_password']);
        $user = Auth::user();

        if ($user instanceof User) {
            $updatePassword = $user->update([
                'password' => Hash::make($data['password'])
            ]);

            if ($updatePassword) {
                return response()->json([
                    'status' => 'success',
                    'message' => 'Password updated successfully.'
                ]);
            } else {
                return response()->json([
                    'status' => 'failed',
                    'message' => 'An error occurred while updating password'
                ]);
            }
        }

        return response()->json([
            'status' => 'failed',
            'message' => 'User not authenticated'
        ], 401);
    }

    /**
     * Send password reset link.
     */
    public function sendResetLink(array $data): JsonResponse
    {
        $status = Password::sendResetLink(['email' => $data['email']]);

        if ($status === Password::RESET_LINK_SENT) {
            return response()->json([
                'status' => 'success',
                'message' => 'Password reset link sent successfully.'
            ]);
        }

        return response()->json([
            'status' => 'failed',
            'message' => 'Unable to send password reset link. Please try again later.'
        ], 400);
    }

    /**
     * Reset user password.
     */
    public function resetPassword(array $data): JsonResponse
    {
        $status = Password::reset(
            $data,
            function (User $user, string $password) {
                $user->forceFill([
                    'password' => Hash::make($password)
                ])->save();
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return response()->json([
                'status' => 'success',
                'message' => 'Password has been reset successfully.'
            ]);
        }

        return response()->json([
            'status' => 'failed',
            'message' => 'Invalid or expired reset token.'
        ], 400);
    }
}
