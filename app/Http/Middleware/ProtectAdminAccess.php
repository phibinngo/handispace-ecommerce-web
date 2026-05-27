<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class ProtectAdminAccess
{
    public function handle(Request $request, Closure $next): Response
    {
        // 1. Kiểm tra: Chưa đăng nhập?
        if (!Auth::check()) {
            // Thay vì về /login, ta bắt nó về /admin/login
            return redirect()->route('admin.login');
        }

        // 2. Kiểm tra: Đã đăng nhập nhưng Role không phải Admin?
        if (Auth::user()->role !== 'admin') {
            abort(403, 'Bạn không có quyền truy cập trang quản trị.');
        }

        // 3. Nếu OK hết -> Cho qua
        return $next($request);
    }
}