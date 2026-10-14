<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CarController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\Admin\BookingController as AdminBookingController;
use App\Http\Controllers\Admin\CustomerController as AdminCustomerController;
use App\Http\Controllers\Admin\ServiceController as AdminServiceController;
use App\Http\Controllers\Admin\StatsController as AdminStatsController;

// Public routes
Route::post('/auth/send-otp', [AuthController::class, 'sendOtp']);
Route::post('/auth/verify-otp', [AuthController::class, 'verifyOtp']);
Route::get('/auth/me', [AuthController::class, 'me']);
Route::post('/auth/logout', [AuthController::class, 'logout']);

Route::get('/services', [ServiceController::class, 'index']);

// Protected customer routes
Route::middleware(['auth.custom'])->group(function () {
    Route::get('/cars', [CarController::class, 'index']);
    Route::post('/cars', [CarController::class, 'store']);
    Route::delete('/cars/{id}', [CarController::class, 'destroy']);

    Route::get('/bookings', [BookingController::class, 'index']);
    Route::get('/bookings/{id}', [BookingController::class, 'show']);
    Route::post('/bookings', [BookingController::class, 'store']);
    Route::post('/bookings/{id}/rate', [BookingController::class, 'rate']);
});

// Admin routes
Route::prefix('admin')->middleware(['admin.custom'])->group(function () {
    Route::get('/stats', [AdminStatsController::class, 'stats']);
    Route::get('/reports', [AdminStatsController::class, 'reports']);
    
    Route::get('/bookings', [AdminBookingController::class, 'index']);
    Route::get('/bookings/{id}', [AdminBookingController::class, 'show']);
    Route::patch('/bookings/{id}', [AdminBookingController::class, 'update']);
    
    Route::get('/customers', [AdminCustomerController::class, 'index']);
    
    Route::get('/services', [AdminServiceController::class, 'index']);
    Route::post('/services', [AdminServiceController::class, 'store']);
    Route::patch('/services/{id}', [AdminServiceController::class, 'update']);
    Route::delete('/services/{id}', [AdminServiceController::class, 'destroy']);
});
