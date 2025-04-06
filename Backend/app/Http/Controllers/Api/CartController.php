<?php

namespace App\Http\Controllers\Api;
use App\Models\Cart;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Resources\CartResource;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    //
    public function index()
    {
        $cart= Cart::get();
        if ($cart->count()>0)
        {
            return CartResource::collection($cart);
        }
        else
        {
            return response()->json(['message'=>'No record available'],200);
        }

    }
    public function store(Request $request)
{
  

    $validator = Validator::make($request->all(), [
        'drug_id' => 'required|exists:drugs,id',
        'quantity' => 'required|integer|min:1',
    ]);

    if ($validator->fails()) {
        return response()->json([
            'message' => 'Validation error',
            'errors' => $validator->messages(),
        ], 422);
    }

    // Get the logged-in patient ID
    $user_id = Auth::id();
  

    // Add drug to cart
    $cart = Cart::create([
        'user_id' => $user_id,
        'drug_id' => $request->drug_id,
        'quantity' => $request->quantity,
    ]);

    return response()->json([
        'message' => 'Drug added to cart successfully',
        'data' => new CartResource($cart)
    ], 201);
}
 public function show(Cart $cart){
    return new CartResource($cart);
 }
 public function update(Request $request,Cart $cart)
 {
 

    $validator = Validator::make($request->all(), [
        'drug_id' => 'required|exists:drugs,id',
        'quantity' => 'required|integer|min:1',
    ]);

    if ($validator->fails()) {
        return response()->json([
            'message' => 'Validation error',
            'errors' => $validator->messages(),
        ], 422);
    }

   
    

    // Update the cart item
    $cart->update([
    'drug_id' => $request->drug_id,
    'quantity' => $request->quantity,
    ]);

    // Refresh the cart model to get the latest data from the database
    $cart->refresh();


    return response()->json([
        'message' => 'Cart item updated successfully',
        'data' => new CartResource($cart)
    ], 200);
 }
 public function destroy(Cart $cart)
 {
    $cart->delete();
    return response()->json([
        'message' => 'Cart item Deleted successfully',
        
    ], 200);
 }
}
