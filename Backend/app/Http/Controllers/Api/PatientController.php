<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User; // Assuming the User model is used for both patients and pharmacists
use App\Http\Resources\PatientResource;
use App\Http\Resources\PatientCollection;
use Illuminate\Http\Request;

class PatientController extends Controller
{
    /**
     * Get all pharmacists (users with role '2').
     */
    public function getAllPharmacists()
    {
        // Get all users with role '2' (pharmacist)
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
     * Get all patients (users with role '1').
     */
    public function getAllPatients()
    {
        // Get all users with role '1' (patient)
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
     * Get all patients with optional search functionality.
     */
    public function index(Request $request)
    {
        $search_param = $request->query('search');

        $patients_query = User::where('is_role', 1); // Only get patients (role 1)

        if ($search_param) {
            $patients_query->where('name', 'LIKE', "%{$search_param}%")
                           ->orWhere('email', 'LIKE', "%{$search_param}%");
        }

        $patients = $patients_query->get();

        if ($patients->isEmpty()) {
            return response()->json([
                'message' => 'No patients found',
                'data' => []
            ]);
        }

        return response()->json([
            'status' => 'success',
            'patients' => $patients
        ]);
    }

    /**
     * Get a single patient by ID.
     */
    public function show($id)
    {
        $patient = User::findOrFail($id);

        if ($patient->is_role != 1) { // Ensure the user is a patient
            return response()->json([
                'status' => 'error',
                'message' => 'User is not a patient'
            ], 400);
        }

        return response()->json([
            'status' => 'success',
            'patient' => $patient
        ]);
    }

    /**
     * Update a patient's address.
     */
    public function update(Request $request, $id)
    {
        $patient = User::findOrFail($id);

        if ($patient->is_role != 1) { // Ensure the user is a patient
            return response()->json([
                'status' => 'error',
                'message' => 'User is not a patient'
            ], 400);
        }

        $patient->update($request->only('address'));

        return response()->json([
            'status' => 'success',
            'message' => 'Patient updated successfully',
            'patient' => $patient
        ]);
    }

    /**
     * Delete a patient.
     */
    public function destroy($id)
    {
        $patient = User::findOrFail($id);

        if ($patient->is_role != 1) { // Ensure the user is a patient
            return response()->json([
                'status' => 'error',
                'message' => 'User is not a patient'
            ], 400);
        }

        $patient->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Patient deleted successfully'
        ]);
    }
}
