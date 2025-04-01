<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PasswordReset extends Model
{
    protected $fillable = ['email', 'token', 'created_at'];

    public $timestamps = false;  // We don't need the default created_at/updated_at columns.
}
