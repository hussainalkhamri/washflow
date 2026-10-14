<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $userId = session('userId');

        if (!$userId) {
            return response()->json(['message' => 'غير مصرح'], 401);
        }

        $user = User::find($userId);

        if (!$user || $user->role !== 'admin') {
            return response()->json(['message' => 'غير مصرح - يلزم صلاحية المدير'], 403);
        }

        $request->merge(['_authUserId' => $userId]);

        return $next($request);
    }
}
