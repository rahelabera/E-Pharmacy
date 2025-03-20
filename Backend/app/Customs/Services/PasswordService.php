<?php
namespace App\Customs\Services;

use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class PasswordService
{
    private function validateCurrentPassword($current_password){
        if (!password_verify($current_password, Auth::user()->password)) {
            response()->json([
                'status' => 'failed',
                'message' => 'Password did not match the current password'
            ])->send();
            exit;
        }
    }

    public function changePassword($data)
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
        } else {
            return response()->json([
                'status' => 'failed',
                'message' => 'User not authenticated'
            ], 401);
        }
    }
}