<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AuthMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $userId = session('userId');

        if (!$userId) {
            return response()->json(['message' => 'غير مصرح'], 401);
        }

        // Attach to request for downstream use
        $request->merge(['_authUserId' => $userId]);

        return $next($request);
    }
}
