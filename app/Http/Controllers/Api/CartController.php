<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Cart;
use App\Models\Product;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB; // Import DB

class CartController extends Controller
{
    // 1. Thêm vào giỏ (Dùng cho nút ở trang chi tiết sản phẩm)
    public function addToCart(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $user = Auth::user();
        
        $cartItem = Cart::where('user_id', $user->id)
                        ->where('product_id', $request->product_id)
                        ->first();

        if ($cartItem) {
            $cartItem->quantity += $request->quantity;
            $cartItem->save();
        } else {
            Cart::create([
                'user_id' => $user->id,
                'product_id' => $request->product_id,
                'quantity' => $request->quantity
            ]);
        }

        return response()->json(['message' => 'Đã thêm vào giỏ hàng!']);
    }

    // 2. Đồng bộ giỏ hàng (QUAN TRỌNG: Dùng khi ấn nút Thanh Toán ở giỏ hàng)
    public function sync(Request $request) 
    {
        $user = Auth::user();
        $frontendCart = $request->input('cart', []);

        DB::beginTransaction();
        try {
            // Xóa giỏ hàng cũ trong DB để tránh trùng lặp/sai lệch
            Cart::where('user_id', $user->id)->delete();

            // Lưu lại toàn bộ giỏ hàng hiện tại từ Frontend vào DB
            foreach ($frontendCart as $item) {
                // Kiểm tra item có đủ thông tin không
                if (isset($item['id']) && isset($item['quantity'])) {
                     Cart::create([
                        'user_id' => $user->id,
                        'product_id' => $item['id'], // Trong context frontend item.id là product_id
                        'quantity' => $item['quantity']
                    ]);
                }
            }
            
            DB::commit();
            return response()->json(['message' => 'Đã đồng bộ giỏ hàng']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Lỗi đồng bộ: ' . $e->getMessage()], 500);
        }
    }

    // Cập nhật số lượng (Giữ nguyên hoặc có thể bỏ nếu dùng sync)
    public function update(Request $request)
    {
        // Logic update từng item (nếu cần)
        // ... 
        return response()->json(['message' => 'OK']);
    }

    // Xóa sản phẩm (Giữ nguyên hoặc có thể bỏ nếu dùng sync)
    public function destroy(Request $request)
    {
        // Logic xóa từng item (nếu cần)
        // ...
        return response()->json(['message' => 'OK']);
    }
}