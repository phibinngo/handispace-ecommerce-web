<?php
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CheckoutController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
Route::get('/products', [ProductController::class, 'index']); // Danh sách + Lọc
Route::get('/products/{id}', [ProductController::class, 'show']); // Chi tiết
// Route::middleware('auth:sanctum')->post('/checkout', [CheckoutController::class, 'checkout']);
