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

class AdminAuthController extends Controller
{
    /**
     * 1. Hiển thị trang đăng nhập Admin (Giao diện đen ngầu)
     */
    public function create(): Response
    {
        return Inertia::render('Auth/AdminLogin');
    }

    /**
     * 2. Xử lý logic đăng nhập
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        // 1. Thử đăng nhập bằng username + password
        // Lưu ý: LoginRequest phải đã đổi sang check 'username' như bài trước
        $credentials = $request->only('username', 'password');

        if (Auth::attempt($credentials)) {
            // 2. Nếu khớp mật khẩu -> Check tiếp quyền
            if (Auth::user()->role === 'admin') {
                $request->session()->regenerate();
                // Đúng là Admin -> Vào Dashboard
                return redirect()->intended('/admin');
            }

            // 3. Nếu đúng mật khẩu nhưng KHÔNG PHẢI ADMIN (là User)
            Auth::logout(); // Đăng xuất ngay lập tức
        }

        // 4. Trả về lỗi chung chung (Cho cả trường hợp Sai pass HOẶC Sai quyền)
        // Để bảo mật, không nên nói "Bạn không có quyền", mà nói "Thông tin sai"
        return back()->withErrors([
            'username' => 'Tài khoản hoặc mật khẩu không chính xác.',
        ]);
    }
    
    /**
     * 3. Đăng xuất Admin
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        // Đăng xuất xong thì về lại trang login admin
        return redirect('/admin/login');
    }
}