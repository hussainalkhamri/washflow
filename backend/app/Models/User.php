<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use HasFactory, HasUuids;

    protected $fillable = ['name', 'phone', 'role'];

    protected $hidden = [];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relationships
    public function cars()
    {
        return $this->hasMany(Car::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function ratings()
    {
        return $this->hasMany(Rating::class);
    }
}
