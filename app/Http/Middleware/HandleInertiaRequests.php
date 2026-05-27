<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            // 👇 THÊM ĐOẠN NÀY ĐỂ REACT BIẾT LÀ ĐÃ LOGIN
            'auth' => [
                'user' => $request->user(),
            ],
            // 👆 KẾT THÚC ĐOẠN THÊM
            
            // Các dữ liệu khác (giữ nguyên nếu có)
            'flash' => [
            'success' => fn () => $request->session()->get('success'),
            'error' => fn () => $request->session()->get('error'), // Phải có dòng này thì React mới đọc được lỗi
        ],
        ]);
    }
}
