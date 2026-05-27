<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminUserController extends Controller
{
    public function index()
    {
        // Lấy danh sách user (trừ admin ra nếu muốn)
        // role = 'user' là giả định, nếu bạn chưa phân quyền thì cứ lấy all()
        $users = User::where('role', '!=', 'admin') 
                    ->orWhereNull('role') // Lấy cả user thường
                    ->latest()
                    ->paginate(10);

        return Inertia::render('Admin/Users/Index', [
            'users' => $users
        ]);
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return redirect()->back()->with('message', 'Đã xóa người dùng thành công!');
    }
}