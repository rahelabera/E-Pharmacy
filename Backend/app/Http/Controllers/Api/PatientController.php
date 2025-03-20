<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use App\Models\Patient;
use App\Http\Resources\PatientResource; 

class PatientController extends Controller
{
public function index(Request $request)
{
    $patients_query = Patient::query();
    $search_param = $request->query('search');
    if ($search_param) {
        $patients_query->where('first_name', 'LIKE', "%{$search_param}%")
                       ->orWhere('last_name', 'LIKE', "%{$search_param}%")
                       ->orWhere('phone_number', 'LIKE', "%{$search_param}%")
                       ->orWhere('email', 'LIKE', "%{$search_param}%");
    }
    $patients = $patients_query->get();
    if ($patients->isEmpty()) {
        return response()->json([
            'message' => 'No patients found',
            'data' => []
        ]);
    }
    return PatientResource::collection($patients);
}
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:255|min:1',
            'last_name' => 'required|string|max:255|min:1',
            'date_of_birth' => 'required|date',
            'gender' => 'required|in:Male,Female,Other',
            'phone_number' => 'required|string|max:255|unique:patients,phone_number',
            'email' => 'nullable|string|email|max:255|unique:patients,email',
            'address' => 'nullable|string',
            'medical_history' => 'nullable|string',
            'current_medications' => 'nullable|string',
            'allergies' => 'nullable|string',
            'chronic_conditions' => 'nullable|string',
            'has_prescription' => 'nullable|boolean',
            'prescription_file' => 'nullable|string',
            'emergency_contact_name' => 'nullable|string|max:255',
            'emergency_contact_phone' => 'nullable|string|max:255',
            'emergency_contact_relationship' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->messages(),
            ], 422);
        }

        $patient = Patient::create($request->all());

        return response()->json([
            'message' => 'Patient Created Successfully',
            'data' => new PatientResource($patient)
        ], 201);
    }
    public function show(Patient $patient)
    {
        return new PatientResource($patient);
    }
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'first_name' => 'sometimes|required|string|max:255|min:1',
            'last_name' => 'sometimes|required|string|max:255|min:1',
            'date_of_birth' => 'sometimes|required|date',
            'gender' => 'sometimes|required|in:Male,Female,Other',
            'phone_number' => 'sometimes|required|string|max:255|unique:patients,phone_number,' . $id,
            'email' => 'nullable|string|email|max:255|unique:patients,email,' . $id,
            'address' => 'nullable|string',
            'medical_history' => 'nullable|string',
            'current_medications' => 'nullable|string',
            'allergies' => 'nullable|string',
            'chronic_conditions' => 'nullable|string',
            'has_prescription' => 'nullable|boolean',
            'prescription_file' => 'nullable|string',
            'emergency_contact_name' => 'nullable|string|max:255',
            'emergency_contact_phone' => 'nullable|string|max:255',
            'emergency_contact_relationship' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->messages(),
            ], 422);
        }

        $patient = Patient::findOrFail($id);
        $patient->update($request->all());

        return response()->json([
            'message' => 'Patient Updated Successfully',
            'data' => $patient
        ], 200);
    }
    public function destroy(Patient $patient)
    {
        $patient->delete();
        return response()->json([
            'message' => 'Patient deleted successfully',
            'data' => []
        ]);
    }
}
