<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Cart extends Model
{
    use HasFactory;

    protected $table = 'cart';

    // Define fillable fields to prevent mass assignment vulnerabilities
    protected $fillable = [
        'drug_id',
        'user_id',
        'quantity',
    ];

    // Define relationships

    // A cart item belongs to a single drug
    public function drug()
    {
        return $this->belongsTo(Drug::class);
    }

   
}
