<?php

namespace App\Jobs;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User; // Import User model
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ProcessOrder implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $orderData;
    protected $cartItems;
    protected $user; // Lưu thông tin user đặt hàng

    // Nhận dữ liệu từ Controller truyền vào
    public function __construct($user, $orderData, $cartItems)
    {
        $this->user = $user;
        $this->orderData = $orderData;
        $this->cartItems = $cartItems;
    }

    public function handle(): void
    {
        DB::beginTransaction(); // Bắt đầu giao dịch (Transaction)

        try {
            $totalAmount = 0;

            // 1. Tạo đơn hàng trước (Status: Pending)
            $order = Order::create([
                'user_id' => $this->user->id,
                'shipping_name' => $this->orderData['shipping_name'],
                'shipping_phone' => $this->orderData['shipping_phone'],
                'shipping_address' => $this->orderData['shipping_address'],
                'payment_method' => $this->orderData['payment_method'],
                'status' => 'processing', // Đang xử lý
                'subtotal' => 0, // Tính sau
                'total_price' => 0, // Tính sau
            ]);

            foreach ($this->cartItems as $item) {
                // --- QUAN TRỌNG NHẤT: LOCK SẢN PHẨM ---
                // lockForUpdate(): Khi dòng này chạy, không ai được phép sửa sản phẩm này
                // cho đến khi Transaction kết thúc.
                $product = Product::where('id', $item['id'])->lockForUpdate()->first();

                // 2. Check số lượng lần cuối
                if (!$product || $product->stock < $item['quantity']) {
                    // Nếu hết hàng -> Hủy toàn bộ đơn này (Rollback)
                    throw new \Exception("Sản phẩm {$item['name']} đã hết hàng hoặc không đủ số lượng.");
                }

                // 3. Trừ kho
                $product->stock -= $item['quantity'];
                $product->save();

                // 4. Tạo chi tiết đơn hàng
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'price' => $product->price,
                ]);

                $totalAmount += $product->price * $item['quantity'];
            }

            // 5. Cập nhật lại tổng tiền đơn hàng
            $order->update([
                'subtotal' => $totalAmount,
                'total_price' => $totalAmount, // Chưa tính giảm giá (bạn tự thêm logic voucher sau)
                'status' => 'pending' // Chuyển sang chờ giao hàng
            ]);
            
            // 6. Cộng tiền tích lũy cho User (Loyalty)
            $userUpdate = User::find($this->user->id);
            $userUpdate->total_spent += $totalAmount;
            $userUpdate->save();

            DB::commit(); // Chốt đơn! Lưu tất cả vào DB
            Log::info("Đơn hàng #{$order->id} đã tạo thành công.");

        } catch (\Exception $e) {
            DB::rollBack(); // Gặp lỗi -> Hoàn tác tất cả (Không trừ kho, không tạo đơn)
            Log::error("Lỗi tạo đơn hàng: " . $e->getMessage());
            
            // (Nâng cao: Ở đây bạn có thể bắn Notification về cho User báo đặt hàng thất bại)
        }
    }
}