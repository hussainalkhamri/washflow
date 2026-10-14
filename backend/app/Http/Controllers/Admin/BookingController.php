<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    public function index()
    {
        $bookings = Booking::with(['user', 'car', 'bookingServices.service', 'rating'])
            ->orderBy('created_at', 'desc')
            ->get();
            
        return response()->json($bookings);
    }

    public function show($id)
    {
        $booking = Booking::with(['user', 'car', 'bookingServices.service', 'rating'])->find($id);

        if (!$booking) {
            return response()->json(['message' => 'غير موجود'], 404);
        }

        return response()->json($booking);
    }

    public function update(Request $request, $id)
    {
        $booking = Booking::find($id);
        
        if (!$booking) {
             return response()->json(['message' => 'غير موجود'], 404);
        }

        $updateData = [];
        if ($request->has('status')) {
            $updateData['status'] = $request->status;
        }
        if ($request->has('adminNotes')) {
            $updateData['admin_notes'] = $request->adminNotes;
        }

        if (!empty($updateData)) {
            $booking->update($updateData);
        }

        return response()->json(['success' => true]);
    }
}
