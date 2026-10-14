<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Service extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = ['name', 'name_en', 'description', 'price', 'category', 'is_active'];

    protected $casts = [
        'is_active' => 'boolean',
        'price'     => 'decimal:2',
    ];

    public function bookingServices()
    {
        return $this->hasMany(BookingService::class);
    }

    // Scope: only active services
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
