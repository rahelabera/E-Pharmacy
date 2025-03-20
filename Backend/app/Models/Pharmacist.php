<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Laravel\Scout\Searchable;
use Laravel\Scout\Attributes\SearchUsingPrefix;
class Pharmacist extends Model
{
    use Searchable;
    //
    protected $table = 'pharmacist';
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'address'
    ];

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
}
