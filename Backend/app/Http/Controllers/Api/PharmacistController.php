<?php
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\PharmacistResource;
use App\Models\Pharmacist;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class PharmacistController extends Controller
{
    /**
     * List pharmacists with optional search parameter
     */
    public function index(Request $request)
    {
        // Filter pharmacists by role (is_role = 2)
        $pharmacists = User::where('is_role', 2);

        $search_param = $request->query('search');

        if ($search_param) {
            $pharmacists->where('name', 'LIKE', "%{$search_param}%")
                ->orWhere('address', 'LIKE', "%{$search_param}%")
                ->orWhere('phone', 'LIKE', "%{$search_param}%")
                ->orWhere('email', 'LIKE', "%{$search_param}%");
        }

        $pharmacists = $pharmacists->get();

        if ($pharmacists->isEmpty()) {
            return response()->json([
                'message' => 'No pharmacists found',
                'data' => []
            ]);
        }

        return response()->json([
            'status' => 'success',
            'pharmacists' => $pharmacists
        ]);
    }

   

    /**
     * Show the details of a single pharmacist
     */
    public function show(User $pharmacist)
    {
        if ($pharmacist->is_role !== 2) {
            return response()->json([
                'status' => 'error',
                'message' => 'User is not a pharmacist'
            ], 400);
        }

        return response()->json([
            'status' => 'success',
            'data' => $pharmacist
        ]);
    }

    /**
     * Update a pharmacist's details
     */
    public function update(Request $request, User $pharmacist)
    {
        if ($pharmacist->is_role !== 2) {
            return response()->json([
                'status' => 'error',
                'message' => 'User is not a pharmacist'
            ], 400);
        }

        // Validate the fields
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|max:255|email|unique:users,email,' . $pharmacist->id,
            'phone' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:255',
            'license_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Handle license image update
        if ($request->hasFile('license_image')) {
            if ($pharmacist->license_image && Storage::exists('public/' . $pharmacist->license_image)) {
                Storage::delete('public/' . $pharmacist->license_image);
            }

            $licenseImagePath = $request->file('license_image')->store('licenses', 'public');
            $pharmacist->license_image = $licenseImagePath;
        }

        $pharmacist->update([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'address' => $request->address,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Pharmacist updated successfully',
            'data' => $pharmacist
        ]);
    }

    /**
     * Delete a pharmacist
     */
    public function destroy(User $pharmacist)
    {
        if ($pharmacist->is_role !== 2) {
            return response()->json([
                'status' => 'error',
                'message' => 'User is not a pharmacist'
            ], 400);
        }

        // Delete license image if exists
        if ($pharmacist->license_image && Storage::exists('public/' . $pharmacist->license_image)) {
            Storage::delete('public/' . $pharmacist->license_image);
        }

        $pharmacist->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Pharmacist deleted successfully',
        ]);
    }
}
