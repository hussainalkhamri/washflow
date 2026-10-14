<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\BookingService;
use App\Models\Rating;
use App\Models\Service;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    public function index(Request $request)
    {
        $bookings = Booking::with(['user', 'car', 'bookingServices.service', 'rating'])
            ->where('user_id', $request->_authUserId)
            ->orderBy('created_at', 'desc')
            ->get();
        return response()->json($bookings);
    }

    public function show(Request $request, $id)
    {
        $booking = Booking::with(['user', 'car', 'bookingServices.service', 'rating'])->find($id);

        if (!$booking || $booking->user_id !== $request->_authUserId) {
            return response()->json(['message' => 'غير موجود'], 404);
        }

        return response()->json($booking);
    }

    public function store(Request $request)
    {
        $request->validate([
            'carId' => 'required|string',
            'serviceIds' => 'required|array|min:1',
            'scheduledDate' => 'required|string',
            'scheduledTime' => 'required|string',
            'address' => 'required|string',
            'totalPrice' => 'required|numeric'
        ], [
            'carId.required' => 'البيانات غير مكتملة',
            'serviceIds.required' => 'البيانات غير مكتملة',
            'scheduledDate.required' => 'البيانات غير مكتملة',
            'scheduledTime.required' => 'البيانات غير مكتملة',
            'address.required' => 'البيانات غير مكتملة',
            'totalPrice.required' => 'البيانات غير مكتملة',
        ]);

        $booking = Booking::create([
            'user_id' => $request->_authUserId,
            'car_id' => $request->carId,
            'status' => 'new',
            'scheduled_date' => $request->scheduledDate,
            'scheduled_time' => $request->scheduledTime,
            'address' => $request->address,
            'notes' => $request->notes,
            'total_price' => $request->totalPrice,
        ]);

        foreach ($request->serviceIds as $serviceId) {
            $service = Service::find($serviceId);
            if ($service) {
                BookingService::create([
                    'booking_id' => $booking->id,
                    'service_id' => $serviceId,
                    'price' => $service->price,
                ]);
            }
        }

        return response()->json($booking);
    }

    public function rate(Request $request, $id)
    {
        $request->validate(['stars' => 'required|integer|min:1|max:5'], [
            'stars.required' => 'التقييم مطلوب',
        ]);

        $booking = Booking::find($id);

        if (!$booking || $booking->user_id !== $request->_authUserId) {
            return response()->json(['message' => 'غير موجود'], 404);
        }

        $rating = Rating::create([
            'booking_id' => $id,
            'user_id' => $request->_authUserId,
            'stars' => $request->stars,
            'comment' => $request->comment,
        ]);

        return response()->json($rating);
    }
}
