<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    public function index()
    {
        $customers = User::where('role', 'customer')
            ->withCount('bookings')
            ->with('cars')
            ->get();
            
        // Map the relation names to match the expected Express payload format:
        // 'bookingCount' instead of 'bookings_count'
        $formattedCustomers = $customers->map(function($customer) {
            $data = $customer->toArray();
            $data['bookingCount'] = $data['bookings_count'];
            unset($data['bookings_count']);
            return $data;
        });

        return response()->json($formattedCustomers);
    }
}
