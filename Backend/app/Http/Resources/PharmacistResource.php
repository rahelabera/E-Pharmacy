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
        //return parent::toArray($request);
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'passowrd' => $this->password,
            'phone' => $this->phone,
            'address' => $this->address,
            'is_verified' => $this->is_verified,
            'status' => $this->status,
            'role' => $this->role,
            'created_at' => $this->created_at,
        ];
    }
}
