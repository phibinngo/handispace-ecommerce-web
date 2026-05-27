<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB; // 👇 Cần để query bảng orders
use Inertia\Inertia;               // 👇 Cần để trả về view chi tiết

class ProductController extends Controller
{
    // ---------------------------------------------------------
    // 1. API CHO TRANG SHOP (Trả về JSON để Frontend gọi Axios)
    // ---------------------------------------------------------
    public function index(Request $request)
    {
        $query = Product::with('category'); 

        // 1. Lọc theo tên
        if ($request->filled('name')) {
            $query->where('name', 'like', '%' . $request->name . '%');
        }

        // 2. Lọc theo loại (Dùng whereHas để lọc qua bảng relation categories)
        if ($request->filled('type') && $request->type !== 'all') {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('type', $request->type);
            });
        }

        // 3. Sắp xếp
        switch ($request->sort) {
            case 'price_asc':
                $query->orderBy('price', 'asc');
                break;
            case 'price_desc':
                $query->orderBy('price', 'desc');
                break;
            default:
                $query->latest(); 
                break;
        }

        // 4. Trả về JSON (Frontend Shop sẽ dùng cái này)
        return response()->json([
            'status' => true,
            'data' => $query->paginate(12) 
        ]);
    }

    // ---------------------------------------------------------
    // 2. TRANG CHI TIẾT SẢN PHẨM (Trả về View Inertia)
    // ---------------------------------------------------------
    public function show($id)
    {
        // A. Lấy thông tin sản phẩm
        $product = Product::with('category')->findOrFail($id);

        // B. Lấy sản phẩm liên quan (Cùng danh mục, trừ chính nó)
        $relatedProducts = Product::where('category_id', $product->category_id)
            ->where('id', '!=', $id)
            ->take(4)
            ->get();

        // C. Lấy Đánh giá (Review) từ bảng Orders
        // Logic: Từ order_items (có product_id) -> Join sang orders (có review) -> Join sang users (lấy tên)
        $reviews = DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->join('users', 'orders.user_id', '=', 'users.id')
            ->where('order_items.product_id', $id)      // Lọc: Đơn hàng có chứa sản phẩm này
            ->where('orders.is_rated', 1)               // Lọc: Đơn đã được đánh giá
            ->whereNotNull('orders.review_content')     // Lọc: Phải có nội dung
            ->select(
                'users.name as user_name',
                'orders.review_content',
                'orders.review_image',
                'orders.updated_at as created_at'       // Lấy ngày đánh giá
            )
            ->orderBy('orders.updated_at', 'desc')
            ->get();

        // D. Trả về View React (ProductDetail.jsx)
        return Inertia::render('ProductDetail', [
            'product' => $product,
            'relatedProducts' => $relatedProducts,
            'reviews' => $reviews 
        ]);
    }
}