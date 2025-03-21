<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $orders = Order::with('customer')->get();

        if ($orders->isEmpty()) {
            return response()->json([
                'message' => 'No orders found',
                'data' => []
            ]);
        }

        return OrderResource::collection($orders);
    }

    // Create a new order
    public function store(Request $request)
    {
        //Validate input
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'items' => 'required|array',
            'total_amount' => 'required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'error' => $validator->errors(),
            ], 422);
        }
        //Create the order
        $order = Order::create([
            'user_id' => $request->user_id,
            'items' => json_encode($request->items),
            'total_amount' => $request->total_amount,
            'status' => 'pending',

        ]);

        return response()->json([
            'message' => 'Order created successfully',
            'data' => new OrderResource($order),
        ], 201);
    }




    /**
     * Retrieve a specific order by ID
     */
    public function show(Order $order)
    {
        return new OrderResource($order);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Delete an order by ID
     */
    public function destroy(Order $order)
    {
        $order->delete();
        return response()->json([
            'message' => 'Order deleted successfully',
        ], 200);
    }
}
