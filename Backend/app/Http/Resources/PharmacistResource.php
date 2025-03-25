<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PharmacistResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id, // Ensure UUID is string
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'address' => $this->address,
            'is_verified' => (bool) $this->is_verified, // Ensure boolean format
            'status' => $this->status,
            'role' => $this->role,
            'license_image' => $this->license_image ? asset('storage/' . $this->license_image) : null, // License image URL
            'created_at' => $this->created_at->toISOString(), // Format timestamps
            'updated_at' => $this->updated_at->toISOString(),
        ];
    }
}
