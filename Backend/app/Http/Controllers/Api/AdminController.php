<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\PharmacistResource;
use App\Models\Pharmacist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AdminController extends Controller
{
    // Fetch all unapproved pharmacists awaiting approval
    public function getUnapprovedPharmacists()
    {
        $unapprovedPharmacists = Pharmacist::where('status', 'pending')->get();

        if ($unapprovedPharmacists->isEmpty()) {
            return response()->json([
                'message' => 'No pharmacists pending approval',
                'data' => []
            ]);
        }

        return PharmacistResource::collection($unapprovedPharmacists);
    }

    // Approve a pharmacist and allow registration if the prescription image is valid
    public function approvePharmacist(Request $request, $id)
    {
        $pharmacist = Pharmacist::find($id);

        if (!$pharmacist) {
            return response()->json([
                'message' => 'Pharmacist not found'
            ], 404);
        }

        // Check if prescription image exists
        if (!$request->hasFile('prescription_image')) {
            return response()->json([
                'message' => 'Prescription image is required'
            ], 422);
        }

        // Validate prescription image
        $request->validate([
            'prescription_image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Store the prescription image
        $prescriptionImage = $request->file('prescription_image')->store('prescriptions', 'public');

        // Update pharmacist's status and store prescription image path
        $pharmacist->status = 'approved';
        $pharmacist->prescription_image = $prescriptionImage;
        $pharmacist->save();

        return response()->json([
            'message' => 'Pharmacist approved and registered successfully',
            'data' => new PharmacistResource($pharmacist)
        ], 200);
    }

    // Reject a pharmacist's registration request
    public function rejectPharmacist($id)
    {
        $pharmacist = Pharmacist::find($id);

        if (!$pharmacist) {
            return response()->json([
                'message' => 'Pharmacist not found'
            ], 404);
        }

        // Reject the pharmacist's registration request
        $pharmacist->status = 'rejected';
        $pharmacist->save();

        return response()->json([
            'message' => 'Pharmacist registration rejected',
            'data' => new PharmacistResource($pharmacist)
        ], 200);
    }

    // Fetch all approved pharmacists
    public function getApprovedPharmacists()
    {
        $approvedPharmacists = Pharmacist::where('status', 'approved')->get();

        if ($approvedPharmacists->isEmpty()) {
            return response()->json([
                'message' => 'No approved pharmacists found',
                'data' => []
            ]);
        }

        return PharmacistResource::collection($approvedPharmacists);
    }
}
