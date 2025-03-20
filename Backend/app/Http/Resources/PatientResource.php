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
        // return parent::toArray($request);
        return [
            'id' => $this->id,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'date_of_birth' => $this->date_of_birth,
            'gender' => $this->gender,
            'phone_number' => $this->phone_number,
            'email' => $this->email,
            'address' => $this->address,
            'medical_history' => $this->medical_history,
            'current_medications' => $this->current_medications,
            'allergies' => $this->allergies,
            'chronic_conditions' => $this->chronic_conditions,
            'has_prescription' => $this->has_prescription,
            'prescription_file' => $this->prescription_file,
            'emergency_contact_name' => $this->emergency_contact_name,
            'emergency_contact_phone' => $this->emergency_contact_phone,
            'emergency_contact_relationship' => $this->emergency_contact_relationship,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
