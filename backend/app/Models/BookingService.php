<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class BookingService extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = ['booking_id', 'service_id', 'price'];

    protected $casts = [
        'price' => 'decimal:2',
    ];

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }

    public function service()
    {
        return $this->belongsTo(Service::class);
    }
}
