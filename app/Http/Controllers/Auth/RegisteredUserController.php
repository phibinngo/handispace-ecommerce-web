<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        // 1. Định nghĩa luật kiểm tra (Rules)
        $rules = [
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:'.User::class,
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'phone' => 'required|string|max:20',
            'birth_year' => 'required|integer|min:1900|max:'.date('Y'),
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ];

        // 2. Định nghĩa thông báo lỗi Tiếng Việt (Messages)
        $messages = [
            'name.required' => 'Vui lòng nhập họ và tên.',
            
            'username.required' => 'Vui lòng nhập tên đăng nhập.',
            'username.unique' => 'Tên đăng nhập này đã có người sử dụng.',
            
            'email.required' => 'Vui lòng nhập địa chỉ Email.',
            'email.email' => 'Địa chỉ Email không đúng định dạng.',
            'email.unique' => 'Email này đã được đăng ký tài khoản khác.',
            
            'phone.required' => 'Vui lòng nhập số điện thoại.',
            
            'birth_year.required' => 'Vui lòng nhập năm sinh.',
            'birth_year.integer' => 'Năm sinh phải là số.',
            'birth_year.min' => 'Năm sinh không hợp lệ.',
            'birth_year.max' => 'Năm sinh không hợp lệ.',
            
            'password.required' => 'Vui lòng nhập mật khẩu.',
            'password.confirmed' => 'Mật khẩu nhập lại không khớp.',
            'password.min' => 'Mật khẩu phải có ít nhất 8 ký tự.',
        ];

        // 3. Thực hiện validate với Rules và Messages đã định nghĩa
        $request->validate($rules, $messages);

        // 4. Lưu User vào Database
        $user = User::create([
            'name' => $request->name,
            'username' => $request->username,
            'email' => $request->email,
            'phone' => $request->phone,
            'birth_year' => $request->birth_year,
            'password' => Hash::make($request->password),
        ]);

        event(new Registered($user));

        Auth::login($user);

        return redirect(route('dashboard', absolute: false));
    }
}