<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB; // Dùng transaction cho an toàn

class OrderController extends Controller
{
    // 1. XỬ LÝ HỦY ĐƠN HÀNG
    public function cancel(Request $request, $id)
    {
        $request->validate([
            'reason' => 'required|string|max:255'
        ]);

        // Tìm đơn hàng của user hiện tại
        $order = Order::where('id', $id)
                      ->where('user_id', Auth::id())
                      ->with('orderItems.product') // Load kèm sản phẩm để hoàn kho
                      ->firstOrFail();

        // Chỉ được hủy khi đơn đang ở trạng thái 'pending'
        if ($order->status !== 'pending') {
            return response()->json(['message' => 'Đơn hàng đã được xử lý, không thể hủy.'], 400);
        }

        DB::beginTransaction();
        try {
            // Cập nhật trạng thái và lý do
            $order->update([
                'status' => 'cancelled',
                'cancel_reason' => $request->reason
            ]);

            // --- LOGIC HOÀN KHO ---
            // Lặp qua từng sản phẩm trong đơn để cộng lại số lượng
            foreach ($order->orderItems as $item) {
                if ($item->product) {
                    $item->product->increment('quantity', $item->quantity);
                }
            }

            DB::commit();
            return response()->json(['message' => 'Đã hủy đơn hàng thành công.']);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Lỗi hệ thống: ' . $e->getMessage()], 500);
        }
    }

    // 2. XỬ LÝ YÊU CẦU TRẢ HÀNG
    public function requestReturn(Request $request, $id)
    {
        $request->validate([
            'reason' => 'required|string|max:500'
        ]);

        $order = Order::where('id', $id)->where('user_id', Auth::id())->firstOrFail();

        // Chỉ được trả khi đơn đã hoàn thành
        if ($order->status !== 'completed') {
            return response()->json(['message' => 'Đơn hàng chưa hoàn thành, không thể trả hàng.'], 400);
        }

        // Nếu đã đánh giá thì không được trả
        if ($order->is_rated) {
            return response()->json(['message' => 'Đơn hàng đã đánh giá, không thể yêu cầu trả hàng.'], 400);
        }

        // Cập nhật trạng thái sang chờ duyệt
        $order->update([
            'status' => 'return_pending',
            'return_reason' => $request->reason
        ]);

        return response()->json(['message' => 'Đã gửi yêu cầu trả hàng. Vui lòng chờ Admin duyệt.']);
    }

    // 3. XỬ LÝ ĐÁNH GIÁ ĐƠN HÀNG (Kèm ảnh)
    public function rate(Request $request, $id)
    {
        $request->validate([
            'content' => 'required|string', // 👇 Bỏ 'min:5' đi để nhập ngắn cũng được
            'image'   => 'nullable|image|max:5120' // 👇 Tăng lên 5MB (5120KB) cho thoải mái
        ]);

        $order = Order::where('id', $id)->where('user_id', Auth::id())->firstOrFail();

        if ($order->status !== 'completed') {
            return response()->json(['message' => 'Chỉ được đánh giá đơn hàng đã hoàn thành.'], 400);
        }

        if ($order->is_rated) {
            return response()->json(['message' => 'Bạn đã đánh giá đơn hàng này rồi.'], 400);
        }

        // Xử lý upload ảnh (nếu có)
        $imagePath = null;
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = time() . '_' . $file->getClientOriginalName();
            // Lưu vào public/uploads/reviews
            $file->move(public_path('uploads/reviews'), $filename);
            $imagePath = '/uploads/reviews/' . $filename;
        }

        // Cập nhật thông tin đánh giá
        $order->update([
            'is_rated' => true,
            'review_content' => $request->content,
            'review_image' => $imagePath
        ]);

        return response()->json(['message' => 'Cảm ơn bạn đã đánh giá sản phẩm!']);
    }
}