<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function sendOtp(Request $request)
    {
        $request->validate(['phone' => 'required|string']);
        
        // In production, send real OTP. For demo, OTP is always 1234
        return response()->json(['success' => true, 'message' => 'تم إرسال رمز التحقق']);
    }

    public function verifyOtp(Request $request)
    {
        $request->validate([
            'phone' => 'required|string',
            'otp' => 'required|string'
        ], [
            'phone.required' => 'البيانات غير مكتملة',
            'otp.required' => 'البيانات غير مكتملة'
        ]);

        if ($request->otp !== '1234') {
            return response()->json(['message' => 'رمز التحقق غير صحيح'], 400);
        }

        $user = User::firstOrCreate(
            ['phone' => $request->phone],
            ['name' => 'مستخدم جديد', 'role' => 'customer']
        );

        session(['userId' => $user->id]);

        return response()->json(['user' => $user]);
    }

    public function me(Request $request)
    {
        $userId = session('userId');
        if (!$userId) {
            return response()->json(['message' => 'غير مسجل'], 401);
        }

        $user = User::find($userId);
        if (!$user) {
            return response()->json(['message' => 'غير مسجل'], 401);
        }

        return response()->json($user);
    }

    public function logout(Request $request)
    {
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['success' => true]);
    }
}
