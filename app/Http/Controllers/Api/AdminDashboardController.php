<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Models\Category;
use App\Models\OrderItem;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class AdminDashboardController extends Controller
{
    public function index()
    {
        // 1. THỐNG KÊ TỔNG QUÁT
        $revenue = Order::where('status', 'completed')->sum('total_price');
        $totalProducts = Product::count();
        $totalCategories = Category::count();
        $totalUsers = User::where('role', 'customer')->count();
        
        $pendingOrders = Order::where('status', 'pending')->count();
        
        // Đếm đơn yêu cầu trả hàng (đang chờ xử lý)
        $returnRequests = Order::where('status', 'return_pending')->count(); 

        // 2. BIỂU ĐỒ DOANH THU
        $months = [1, 2, 3, 4];
        $revenueData = [];
        $currentYear = Carbon::now()->year;

        foreach ($months as $month) {
            $rev = Order::whereYear('created_at', $currentYear)
                        ->whereMonth('created_at', $month)
                        ->where('status', 'completed')
                        ->sum('total_price');
            $revenueData[] = $rev; 
        }

        // 3. BIỂU ĐỒ SỐ LƯỢNG ĐƠN
        $salesData = [0, 0, 0, 0];
        $startOfMonth = Carbon::now()->startOfMonth();
        $endOfMonth = Carbon::now()->endOfMonth();

        $ordersInMonth = Order::whereBetween('created_at', [$startOfMonth, $endOfMonth])
                              ->where('status', '!=', 'cancelled')
                              ->get();

        foreach ($ordersInMonth as $order) {
            $day = $order->created_at->day;
            if ($day <= 7) $salesData[0]++;
            elseif ($day <= 14) $salesData[1]++;
            elseif ($day <= 21) $salesData[2]++;
            else $salesData[3]++;
        }

        // 4. TRẠNG THÁI ĐƠN HÀNG
        $statusCounts = Order::select('status', DB::raw('count(*) as total'))
                             ->groupBy('status')
                             ->pluck('total', 'status')->toArray();
        
        $pieData = [
            $statusCounts['completed'] ?? 0,
            ($statusCounts['shipping'] ?? 0) + ($statusCounts['processing'] ?? 0) + ($statusCounts['pending'] ?? 0),
            ($statusCounts['cancelled'] ?? 0) + ($statusCounts['returned'] ?? 0) + ($statusCounts['return_pending'] ?? 0)
        ];

        // 5. TOP SẢN PHẨM
        $topProducts = OrderItem::select('product_id', DB::raw('SUM(quantity) as total_sold'))
            ->join('orders', 'orders.id', '=', 'order_items.order_id')
            ->where('orders.status', 'completed')
            ->groupBy('product_id')
            ->orderByDesc('total_sold')
            ->take(5)
            ->with('product')
            ->get();

        $topProductNames = $topProducts->map(fn($item) => $item->product->name ?? 'SP Đã xóa');
        $topProductQuantities = $topProducts->pluck('total_sold');

        $stats = [
            'revenue' => $revenue,
            'totalProducts' => $totalProducts,
            'totalCategories' => $totalCategories,
            'totalUsers' => $totalUsers,
            'pendingOrders' => $pendingOrders,
            'returnRequests' => $returnRequests,
            'chart_revenue' => $revenueData,
            'chart_sales' => $salesData,
            'chart_status' => $pieData,
            'chart_top_names' => $topProductNames,
            'chart_top_data' => $topProductQuantities,
        ];

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats
        ]);
    }
}