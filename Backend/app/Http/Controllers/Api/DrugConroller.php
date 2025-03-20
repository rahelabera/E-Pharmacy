<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\DrugResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Drug;
use Illuminate\Support\Facades\Auth;

class DrugConroller extends Controller
{
    //
    public function index(Request $request)
    {
        $drug_query= Drug::query();
        $search_param=$request->query('q');
        $drugs = $drug_query->paginate(10); 
        if($search_param)
        {
            $drug_query=Drug::search($search_param);
        }
       
        $drug=$drug_query->get();

        
        if ($drug->count()>0){

        
        return response()->json([
            'data' => DrugResource::collection($drug), 
            'meta' => [
                'current_page' => $drugs->currentPage(),
                'from' => $drugs->firstItem(),
                'last_page' => $drugs->lastPage(),
                'per_page' => $drugs->perPage(),
                'to' => $drugs->lastItem(),
                'total' => $drugs->total(),
            ],
            'links' => [
                'first' => $drugs->url(1), 
                'last' => $drugs->url($drugs->lastPage()), 
                'prev' => $drugs->previousPageUrl(), 
                'next' => $drugs->nextPageUrl(), 
            ]
        ]);

        }
        else
        {
            return response()->json(['message'=>'No record available'],200);
        }

    }
    public function store(Request $request)
{
    
  

    $validator = Validator::make($request->all(), [
        'name' => 'required|string|max:255|min:1',
        'description'=>'required|string|max:255|min:1',
        'brand'=>'required|string|max:255|min:1',
        'price'=>'required|integer|min:1',
        'category'=>'required|string|max:255|min:1',
        'quantity' => 'required|integer|min:1',
        'dosage'=>'required|string|max:255|min:1',
        'stock'=>'required|integer|min:1',
    ]);

    if ($validator->fails()) {
        return response()->json([
            'message' => 'Validation error',
            'errors' => $validator->messages(),
        ], 422);
    }
   
   

    $cart = Drug::create([
        'name' => $request->name,
        'description'=>$request->description,
        'brand'=>$request->brand,
        'price'=>$request->price,
        'category'=>$request->category,
        'quantity'=>$request->quantity,
        'dosage'=>$request->dosage,
        'stock'=>$request->stock,
       
    ]);

    return response()->json([
        'message' => 'Drug Created successfully',
        'data' => new DrugResource($cart)
    ], 201);
}
 public function show(Drug $drug){
    return new DrugResource($drug);
 }
 public function search(Request $request)
 {
     $search = $request->input('search');
 
     if (!$search) {
         return response()->json(['message' => 'Search term is required'], 400);
     }
 
     $drugs = Drug::where(function ($query) use ($search) {
         $query->where('name', 'like', "%{$search}%")
             ->orWhere('description', 'like', "%{$search}%")
             ->orWhere('brand', 'like', "%{$search}%")
             ->orWhere('dosage', 'like', "%{$search}%")
             ->orWhere('category', 'like', "%{$search}%");
     })->get();
 
     return DrugResource::collection($drugs);
 }
 
 public function update(Request $request,Drug $drug)
 {
 

    $validator = Validator::make($request->all(), [
        'name' => 'required|string|max:255|min:1',
        'description'=>'required|string|max:255|min:1',
        'brand'=>'required|string|max:255|min:1',
        'price'=>'required|integer|min:1',
        'quantity' => 'required|integer|min:1',
        'category'=>'required|string|max:255|min:1',
        'dosage'=>'required|string|max:255|min:1',
        'stock'=>'required|integer|min:1',
    ]);

    if ($validator->fails()) {
        return response()->json([
            'message' => 'Validation error',
            'errors' => $validator->messages(),
        ], 422);
    }

   
    

    // Update the cart item
    $drug->update([
        'name' => $request->name,
        'description'=>$request->description,
        'brand'=>$request->brand,
        'price'=>$request->price,
        'category'=>$request->category,
        'quantity'=>$request->quantity,
        'dosage'=>$request->dosage,
        'stock'=>$request->stock,
    ]);

   


    return response()->json([
        'message' => 'Drug updated successfully',
        'data' => new DrugResource($drug)
    ], 200);
 }
 public function destroy(Drug $drug)
 {
    $drug->delete();
    return response()->json([
        'message' => 'Drug Deleted successfully',
        
    ], 200);
 }

   
}
