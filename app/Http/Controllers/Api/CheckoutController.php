<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Cart;
use App\Models\Product;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    // 1. Hiển thị trang Checkout (GET)
    public function checkout(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        
        if ($user) {
            $user->load('loyaltyLevel');
        }

        $cartItems = [];
        $isBuyNow = false;

        if ($request->has('buy_now_mode') && $request->has('product_id')) {
            $isBuyNow = true;
            $product = Product::find($request->product_id);
            
            if ($product) {
                $quantity = (int) $request->input('quantity', 1);
                $cartItems = [
                    (object) [
                        'id' => 'temp_item', 
                        'product_id' => $product->id,
                        'quantity' => $quantity,
                        'product' => $product 
                    ]
                ];
            }
        } else {
            if ($user) {
                $cartItems = Cart::with('product')->where('user_id', $user->id)->get();
            }
        }

        $subtotal = 0;
        foreach ($cartItems as $item) {
            if ($item->product) {
                $subtotal += $item->product->price * $item->quantity;
            }
        }

        $discountPercent = ($user && $user->loyaltyLevel) ? $user->loyaltyLevel->discount_percent : 0;
        $discountAmount = $subtotal * ($discountPercent / 100);
        $shippingFee = 30000;
        
        $finalTotal = max(0, $subtotal + $shippingFee - $discountAmount);

        return Inertia::render('Checkout', [
            'cartItems' => $cartItems,
            'user' => $user,
            'summary' => [
                'subtotal' => $subtotal,
                'discount_amount' => $discountAmount,
                'discount_percent' => $discountPercent,
                'shipping_fee' => $shippingFee,
                'total' => $finalTotal
            ],
            'buyNowParams' => $isBuyNow ? $request->all() : null 
        ]);
    }

    // 2. Xử lý Đặt hàng (POST)
    public function processCheckout(Request $request)
    {
        $request->validate([
            'shipping_name' => 'required',
            'shipping_phone' => 'required',
            'shipping_address' => 'required',
            'payment_method' => 'required',
        ]);

        /** @var \App\Models\User $user */
        $user = Auth::user();
        if ($user) $user->load('loyaltyLevel');
        
        DB::beginTransaction();
        try {
            $orderItemsData = [];
            $subtotalAmount = 0; 

            $buyNowParams = $request->input('buy_now_params');

            // --- BƯỚC 1: LẤY DỮ LIỆU & TRỪ KHO ---
            if ($buyNowParams) {
                $product = Product::findOrFail($buyNowParams['product_id']);
                $qty = (int) $buyNowParams['quantity'];

                if ($product->quantity < $qty) throw new \Exception("Sản phẩm {$product->name} không đủ số lượng!");

                $orderItemsData[] = [
                    'product_id' => $product->id,
                    'quantity' => $qty,
                    'price' => $product->price
                ];
                $subtotalAmount += $product->price * $qty;
                $product->decrement('quantity', $qty);

            } else {
                $cartItems = Cart::with('product')->where('user_id', $user->id)->get();
                if ($cartItems->isEmpty()) throw new \Exception("Giỏ hàng trống!");

                foreach ($cartItems as $item) {
                    if (!$item->product) continue;
                    if ($item->product->quantity < $item->quantity) throw new \Exception("Sản phẩm {$item->product->name} không đủ số lượng!");

                    $orderItemsData[] = [
                        'product_id' => $item->product_id,
                        'quantity' => $item->quantity,
                        'price' => $item->product->price
                    ];
                    $subtotalAmount += $item->product->price * $item->quantity;
                    $item->product->decrement('quantity', $item->quantity);
                }
            }

            // --- BƯỚC 2: TÍNH TOÁN (SERVER SIDE) ---
            $discountPercent = ($user && $user->loyaltyLevel) ? $user->loyaltyLevel->discount_percent : 0;
            $discountAmount = $subtotalAmount * ($discountPercent / 100);
            $shippingFee = 30000;
            
            $finalTotal = max(0, $subtotalAmount + $shippingFee - $discountAmount);

            // --- BƯỚC 3: TẠO ĐƠN HÀNG (Trạng thái mặc định là Pending) ---
            $order = Order::create([
                'user_id' => $user->id,
                'shipping_name' => $request->shipping_name,
                'shipping_phone' => $request->shipping_phone,
                'shipping_address' => $request->shipping_address,
                'payment_method' => $request->payment_method,
                
                'subtotal' => $subtotalAmount,
                'discount_amount' => $discountAmount,
                'shipping_fee' => $shippingFee, // Lưu phí ship để dễ tính toán sau này
                'total_price' => $finalTotal, 
                
                'status' => 'pending', // Mặc định là chờ xử lý, chưa cộng điểm
                'note' => $request->note,
                'is_rated' => 0
            ]);

            // --- BƯỚC 4: TẠO CHI TIẾT ---
            foreach ($orderItemsData as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price']
                ]);
            }

            // --- BƯỚC 5: DỌN DẸP ---
            if (!$buyNowParams) {
                Cart::where('user_id', $user->id)->delete();
            }

            // Việc cộng tiền sẽ chuyển sang AdminOrderController khi duyệt đơn.

            DB::commit();
            return redirect()->route('my-account')->with('message', 'Đặt hàng thành công!');

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }
    }
}