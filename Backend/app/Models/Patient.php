<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Laravel\Scout\Searchable; 

class Patient extends Model
{
    protected $table = 'patients';
    protected $fillable = [
        'first_name',
        'last_name',
        'date_of_birth',
        'gender',
        'phone_number',
        'email',
        'address',
        'medical_history',
        'current_medications',
        'allergies',
        'chronic_conditions',
        'has_prescription',
        'prescription_file',
        'emergency_contact_name',
        'emergency_contact_phone',
        'emergency_contact_relationship',
    ];
    use Searchable;
    public function toSearchableArray()
    {
        return $this->only('id', 'first_name', 'last_name', 'phone_number', 'email', 'address', 'medical_history', 'current_medications', 'allergies', 'chronic_conditions', 'emergency_contact_name', 'emergency_contact_phone', 'emergency_contact_relationship');
    }
}
