<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\User;
use App\Models\Rating;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class StatsController extends Controller
{
    public function stats()
    {
        $today = date('Y-m-d');
        
        $todayBookings = Booking::where('scheduled_date', $today)->count();
        $totalRevenue = Booking::where('status', 'completed')->sum('total_price');
        $totalCustomers = User::where('role', 'customer')->count();
        $activeBookings = Booking::whereNotIn('status', ['completed', 'cancelled'])->count();

        return response()->json([
            'todayBookings' => $todayBookings,
            'totalRevenue' => (float) $totalRevenue,
            'totalCustomers' => $totalCustomers,
            'activeBookings' => $activeBookings
        ]);
    }

    public function reports()
    {
        $totalRevenue = Booking::where('status', 'completed')->sum('total_price');
        $totalBookings = Booking::count();
        $completedBookings = Booking::where('status', 'completed')->count();
        $cancelledBookings = Booking::where('status', 'cancelled')->count();
        $averageRating = Rating::avg('stars') ?? 0;

        $revenueByServiceRows = DB::table('booking_services')
            ->join('services', 'booking_services.service_id', '=', 'services.id')
            ->join('bookings', 'booking_services.booking_id', '=', 'bookings.id')
            ->where('bookings.status', 'completed')
            ->select('services.name', DB::raw('SUM(CAST(booking_services.price AS DECIMAL)) as revenue'), DB::raw('COUNT(booking_services.id) as count'))
            ->groupBy('services.name')
            ->orderByDesc('revenue')
            ->get();

        $monthlyRows = DB::table('bookings')
            ->where('status', 'completed')
            // SQLite doesn't have TO_CHAR. Use STRFTIME for SQLite compatibility:
            ->select(DB::raw("strftime('%Y-%m', created_at) as month"), DB::raw('SUM(CAST(total_price AS DECIMAL)) as revenue'), DB::raw('COUNT(*) as count'))
            ->groupBy('month')
            ->orderByDesc('month')
            ->limit(12)
            ->get();

        return response()->json([
            'totalRevenue' => (float) $totalRevenue,
            'totalBookings' => $totalBookings,
            'completedBookings' => $completedBookings,
            'cancelledBookings' => $cancelledBookings,
            'averageRating' => (float) $averageRating,
            'revenueByService' => $revenueByServiceRows->map(function($row) {
                return [
                    'name' => $row->name,
                    'revenue' => (float) $row->revenue,
                    'count' => (int) $row->count,
                ];
            }),
            'monthlyRevenue' => $monthlyRows->map(function($row) {
                return [
                    'month' => $row->month,
                    'revenue' => (float) $row->revenue,
                    'count' => (int) $row->count,
                ];
            }),
        ]);
    }
}
