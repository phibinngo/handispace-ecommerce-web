<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        // 👇👇👇 SỬA ĐOẠN NÀY ĐỂ CHUYỂN HƯỚNG THEO ROLE 👇👇👇
        
        $user = $request->user(); // Lấy thông tin người vừa đăng nhập

        // 1. Nếu là ADMIN -> Vào trang Quản lý đơn hàng
        if ($user->role === 'admin') {
            return redirect()->intended('/admin/orders');
        }

        // 2. Nếu là KHÁCH HÀNG -> Vào thẳng trang Shop mua sắm
        return redirect()->intended('/shop');
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
