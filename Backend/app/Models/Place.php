<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Place extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'address', 'lat', 'lng'];
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }
}