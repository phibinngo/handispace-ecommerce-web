<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class BlockAdminAccess
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Nếu là ADMIN -> Cấm ngay lập tức
        if (Auth::check() && Auth::user()->role === 'admin') {
            // Hiển thị màn hình lỗi 403
            abort(403, 'Admin không được phép vào khu vực mua sắm!');
        }

        return $next($request);
    }
}
