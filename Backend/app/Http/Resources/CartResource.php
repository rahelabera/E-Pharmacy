<?php



namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CartResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'drug' => [
                'id' => $this->drug->id,
                'name' => $this->drug->name,
                'price' => $this->drug->price,
                'description' => $this->drug->description,
                'brand' => $this->drug->brand,  // Added brand
                'dosage' => $this->drug->dosage,  // Added dosage
                'expires_at' => $this->drug->expires_at->format('Y-m-d'),  // Added expiry date formatted
            ],
            'quantity' => $this->quantity,
            'total_price' => $this->quantity * $this->drug->price, // Calculate total price
            'added_at' => $this->created_at->format('Y-m-d H:i:s'),
        ];
    }
}
