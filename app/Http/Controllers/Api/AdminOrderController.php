<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class AdminOrderController extends Controller
{
    public function index()
    {
        $orders = Order::with(['user', 'orderItems.product'])
                    ->latest()
                    ->paginate(10);

        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders
        ]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|string'
        ]);

        $order = Order::with('orderItems.product')->findOrFail($id);
        
        $oldStatus = strtolower(trim($order->status));
        $newStatus = strtolower(trim($request->status));

        if ($oldStatus === $newStatus) {
            return back();
        }

        DB::beginTransaction();

        try {
            // Cập nhật trạng thái
            $order->update(['status' => $request->status]);
            $restockStatuses = ['cancelled', 'returned'];

            // Cộng kho (Khách trả hàng)
            if (in_array($newStatus, $restockStatuses) && !in_array($oldStatus, $restockStatuses)) {
                foreach ($order->orderItems as $item) {
                    if ($item->product) $item->product->increment('quantity', $item->quantity);
                }
            }
            // Trừ kho (Admin hoàn tác hủy)
            else if (!in_array($newStatus, $restockStatuses) && in_array($oldStatus, $restockStatuses)) {
                foreach ($order->orderItems as $item) {
                    if ($item->product) $item->product->decrement('quantity', $item->quantity);
                }
            }

            // 3. QUẢN LÝ CHI TIÊU & HẠNG THÀNH VIÊN

            $user = User::find($order->user_id);

            if ($user) {
                // Tính giá trị thực tế: (Subtotal - Discount), ép kiểu float
                $subtotal = floatval($order->subtotal); 
                $discount = floatval($order->discount_amount ?? 0); // Dựa theo ảnh DB bạn gửi, cột là discount_amount
                $realSpentAmount = max(0, $subtotal - $discount);

                Log::info("--- START UPDATE ORDER #{$id} ---");
                Log::info("User ID: {$user->id} | Old Status: {$oldStatus} | New Status: {$newStatus}");
                Log::info("Amount Value: {$realSpentAmount}");

                // TRƯỜNG HỢP A: CỘNG TIỀN (Chưa hoàn thành -> Hoàn thành)
                if ($newStatus === 'completed' && $oldStatus !== 'completed') {
                    $user->total_spent = floatval($user->total_spent) + $realSpentAmount;
                    
                    Log::info("➕ ADDING: New Total = " . $user->total_spent);
                    
                    if (method_exists($user, 'upgradeLoyaltyLevel')) {
                        $user->upgradeLoyaltyLevel();
                    }
                    $user->save();
                }
                
                // TRƯỜNG HỢP B: TRỪ TIỀN (Đang hoàn thành -> Bị Hủy/Trả)
                // 👇 ĐÂY LÀ ĐOẠN TRỪ TIỀN BẠN CẦN 👇
                else if ($oldStatus === 'completed' && $newStatus !== 'completed') {
                    $user->total_spent = max(0, floatval($user->total_spent) - $realSpentAmount);
                    
                    Log::info("➖ SUBTRACTING: New Total = " . $user->total_spent);

                    if (method_exists($user, 'upgradeLoyaltyLevel')) {
                        $user->upgradeLoyaltyLevel();
                    }
                    $user->save();
                } 
                else {
                    Log::info("ℹ️ No change in total_spent needed for this status transition.");
                }
            } else {
                Log::warning("⚠️ User not found for Order #{$id}");
            }
            
            DB::commit();
            return back()->with('success', 'Cập nhật trạng thái thành công!');

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("🔥 ERROR Updating Order: " . $e->getMessage());
            return back()->with('error', 'Lỗi: ' . $e->getMessage());
        }
    }
}