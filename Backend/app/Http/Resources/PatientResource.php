<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PatientResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id, // UUID as string
            'user_id' => (string) $this->user_id, // Ensure proper format
            'name' => $this->user->name, // Fetch from User model
            'email' => $this->user->email, // Fetch from User model
            'address' => $this->address, // Keep if patient-specific
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
        ];
    }
}
