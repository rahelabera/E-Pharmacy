<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Laravel\Scout\Searchable;
use Laravel\Scout\Attributes\SearchUsingPrefix;
use Illuminate\Support\Facades\Hash;

class Pharmacist extends Model
{
    use HasFactory, Searchable;

    protected $table = 'users';

    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'address',
        'lat', // Pharmacist latitude
        'lng', // Pharmacist longitude
        'status', // Approval status
        'license_image', // Added for license image
        'is_role',
    ];

    // Ensure password is always hashed before saving (on both create & update)
    public function setPasswordAttribute($value)
    {
        if ($value) {
            $this->attributes['password'] = Hash::make($value);
        }
    }

    // Relationship: If pharmacists are linked to users
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    #[SearchUsingPrefix(['status'])]
    public function toSearchableArray()
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'address' => $this->address,
        ];
    }

    // Accessor for prescription image URL
    public function getPrescriptionImageAttribute($value)
    {
        return $value ? asset('storage/' . $value) : null;
    }

    // Accessor for license image URL
    public function getLicenseImageAttribute($value)
    {
        return $value ? asset('storage/' . $value) : null;
    }
}
