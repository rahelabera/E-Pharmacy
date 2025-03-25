<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Laravel\Scout\Searchable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Patient extends Model
{
    use HasFactory, Searchable, SoftDeletes; // Enables Factory, Search, and Soft Deletes

    protected $table = 'users';

    protected $fillable = [
        'user_id', // Reference to users table
        'first_name',
        'last_name',
        'phone_number',
        'email',
        'address',
        'lat',  // Latitude for location tracking
        'lng',  // Longitude for location tracking
        'is_role'
    ];

    // Generate a UUID for each patient instead of auto-incrementing ID (if needed)
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($patient) {
            if (!$patient->id) {
                $patient->id = Str::uuid(); 
            }
        });
    }

    // Relationship: Each patient belongs to a user
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Scout Search Configuration
    public function toSearchableArray()
    {
        return $this->only(['id', 'first_name', 'last_name', 'phone_number', 'email', 'address']);
    }
}
