<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Booking extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'user_id', 'car_id', 'status', 'scheduled_date',
        'scheduled_time', 'address', 'latitude', 'longitude',
        'total_price', 'notes', 'admin_notes',
    ];

    protected $casts = [
        'total_price' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function car()
    {
        return $this->belongsTo(Car::class);
    }

    public function bookingServices()
    {
        return $this->hasMany(BookingService::class);
    }

    public function rating()
    {
        return $this->hasOne(Rating::class);
    }
}
