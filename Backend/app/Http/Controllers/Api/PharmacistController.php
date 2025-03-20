<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\PharmacistResource;
use App\Models\Pharmacist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;


class PharmacistController extends Controller
{
    //
    public function index(Request $request)
    {
        $pharmacist_query = Pharmacist::query();
        $search_param = $request->query('search');

        if ($search_param) {
            $pharmacist_query->where('name', 'LIKE', "%{$search_param}%")
                ->orWhere('address', 'LIKE', "%{$search_param}%")
                ->orWhere('phone', 'LIKE', "%{$search_param}%")
                ->orWhere('email', 'LIKE', "%{$search_param}%");
        }

        $pharmacists = $pharmacist_query->get();

        if ($pharmacists->isEmpty()) {
            return response()->json([
                'message' => 'No pharmacist found',
                'data' => []
            ]);
        }

        return PharmacistResource::collection($pharmacists);
    }




    public function show(Pharmacist $pharmacist)
    {
        return new PharmacistResource($pharmacist);
    }

    public function update(Request $request, Pharmacist $pharmacist)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|max:255',
            'password' => 'required|string|max:255',
            'phone' => 'string|max:255',
            'address' => 'string|max:255'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'All fields are mandatory',
                'error' => $validator->messages(),
            ], 422);
        }

        $pharmacist->update([
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password,
            'phone' => $request->phone,
            'address' => $request->address,
        ]);
        return response()->json([
            'message' => 'Pharmacist Updated Successfully',
            'data' => new PharmacistResource($pharmacist)
        ], 200);
    }

    public function destroy(Pharmacist $pharmacist)
    {
        $pharmacist->delete();
        return response()->json([
            'message' => 'Pharmacist Deleted Successfully',
        ], 200);
    }


}

