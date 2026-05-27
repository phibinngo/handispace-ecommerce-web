<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class UserProfileController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // 1. Lấy cấp độ thành viên (Nếu bảng users có cột loyalty_level_id)
        $user->load('loyaltyLevel');

        // 2. Lấy đơn hàng & chi tiết sản phẩm
        // Lưu ý: Trong Model Order phải có hàm items() như mình đưa ở trên
        $orders = $user->orders()->with('items.product')->latest()->get();

        // 3. Lấy địa chỉ
        // ⚠️ LƯU Ý: Nếu bạn CHƯA tạo bảng 'addresses', hãy comment dòng dưới lại để tránh lỗi 500
        $addresses = [];
        try {
            $addresses = $user->addresses()->get();
        } catch (\Exception $e) {
            // Bỏ qua lỗi nếu chưa có bảng địa chỉ
        }

        return response()->json([
            'status' => true,
            'user' => $user,
            'orders' => $orders,
            'addresses' => $addresses,
            'next_level_progress' => $this->calculateNextLevel($user->total_spent ?? 0) 
        ]);
    }

    private function calculateNextLevel($currentSpent)
    {
        // Logic tính toán giữ nguyên như bạn đã viết
        if ($currentSpent < 2000000) return ['target' => 2000000, 'percent' => ($currentSpent/2000000)*100, 'next_name' => 'Hạng Bạc', 'remaining' => 2000000 - $currentSpent];
        if ($currentSpent < 5000000) return ['target' => 5000000, 'percent' => ($currentSpent/5000000)*100, 'next_name' => 'Hạng Vàng', 'remaining' => 5000000 - $currentSpent];
        if ($currentSpent < 10000000) return ['target' => 10000000, 'percent' => ($currentSpent/10000000)*100, 'next_name' => 'Kim Cương', 'remaining' => 10000000 - $currentSpent];
        
        return ['target' => $currentSpent, 'percent' => 100, 'next_name' => 'Max Level', 'remaining' => 0];
    }

    public function updateInfo(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:15',
        ]);

        $user = $request->user();
        $user->update([
            'name' => $request->name,
            'phone' => $request->phone
        ]);

        return response()->json(['message' => 'Cập nhật thành công!']);
    }

    // 2. Hàm thêm địa chỉ mới
    // Hàm thêm địa chỉ
    public function addAddress(Request $request)
    {
        $request->validate([
            'receiver_name' => 'required',
            'receiver_phone' => 'required',
            'province' => 'required',
            'ward' => 'required',
            'street_address' => 'required',
        ]);

        $user = $request->user();

        // 1. Nếu người dùng tích chọn "Mặc định"
        if ($request->boolean('is_default')) {
            // Chuyển tất cả địa chỉ cũ về thường
            $user->addresses()->update(['is_default' => 0]);
        }

        // 2. Tạo địa chỉ mới
        $user->addresses()->create([
            'receiver_name' => $request->receiver_name,
            'receiver_phone' => $request->receiver_phone,
            'address_name' => $request->address_name ?? 'Nhà riêng',
            'province' => $request->province,
            'ward' => $request->ward,
            'street_address' => $request->street_address,
            'is_default' => $request->boolean('is_default') ? 1 : 0
        ]);

        return response()->json(['message' => 'Thêm địa chỉ thành công!']);
    }

    // Hàm cập nhật địa chỉ (Thêm hàm này vào Controller nếu chưa có)
    public function updateAddress(Request $request, $id)
    {
        $user = $request->user();
        $address = $user->addresses()->findOrFail($id);

        // 1. Nếu người dùng tích chọn "Mặc định"
        if ($request->boolean('is_default')) {
            // Chuyển các cái khác về thường (trừ cái đang sửa)
            $user->addresses()->where('id', '!=', $id)->update(['is_default' => 0]);
        }

        // 2. Cập nhật
        $address->update([
            'receiver_name' => $request->receiver_name,
            'receiver_phone' => $request->receiver_phone,
            'address_name' => $request->address_name,
            'province' => $request->province,
            'ward' => $request->ward,
            'street_address' => $request->street_address,
            'is_default' => $request->boolean('is_default') ? 1 : 0
        ]);

        return response()->json(['message' => 'Cập nhật thành công!']);
    }

    // Hàm xóa địa chỉ
    public function deleteAddress(Request $request, $id)
    {
        $request->user()->addresses()->where('id', $id)->delete();
        return response()->json(['message' => 'Đã xóa địa chỉ']);
    }
}