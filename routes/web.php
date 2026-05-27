<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Api\CheckoutController;
use App\Http\Controllers\Api\UserProfileController;
use App\Http\Controllers\Api\AdminOrderController;
use App\Http\Controllers\Api\AdminDashboardController;
use App\Http\Controllers\Api\AdminUserController;
use App\Http\Controllers\Auth\AdminAuthController;
use App\Http\Controllers\Api\AdminProductController;
use App\Http\Controllers\Api\ProductController; 
use App\Http\Controllers\Api\AdminCategoryController; 
use App\Http\Controllers\Api\CategoryController;      
use App\Http\Controllers\Api\OrderController; 
use App\Http\Controllers\Api\CartController; 
use App\Models\Product; 
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
| 1. KHU VỰC CÔNG KHAI
*/
Route::middleware(['not_admin'])->group(function () {
    
    Route::get('/', function () { 
        $bestSellers = Product::latest()->take(4)->get();
        
        return Inertia::render('Home', [
            'bestSellers' => $bestSellers
        ]); 
    })->name('home');

    Route::get('/shop', function () { return Inertia::render('Shop'); })->name('shop');
    
    Route::get('/api/products', [ProductController::class, 'index']);
    Route::get('/product/{id}', [ProductController::class, 'show'])->name('product.detail');
});

Route::get('/dashboard', function () {
    return redirect()->route('my-account'); 
})->middleware(['auth', 'verified', 'not_admin'])->name('dashboard');


/*
| 2. KHU VỰC THÀNH VIÊN (User)
*/
Route::middleware(['auth', 'not_admin'])->group(function () {
    
    // Giỏ hàng
    Route::get('/cart', function () { return Inertia::render('Cart'); })->name('cart');

    Route::post('/cart/add', [CartController::class, 'addToCart'])->name('cart.add');
    Route::post('/cart/sync', [CartController::class, 'sync'])->name('cart.sync'); 
    Route::post('/cart/update', [CartController::class, 'update'])->name('cart.update'); 
    Route::post('/cart/remove', [CartController::class, 'destroy'])->name('cart.remove'); 

    // Profile & Address
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    Route::get('/my-account', function () { return Inertia::render('UserDashboard'); })->name('my-account');
    Route::get('/api/my-profile', [UserProfileController::class, 'index']);
    Route::post('/api/update-info', [UserProfileController::class, 'updateInfo']);
    Route::post('/api/add-address', [UserProfileController::class, 'addAddress']);
    Route::put('/api/update-address/{id}', [UserProfileController::class, 'updateAddress']);
    Route::delete('/api/delete-address/{id}', [UserProfileController::class, 'deleteAddress']);

    // Thanh toán
    Route::get('/checkout', [CheckoutController::class, 'checkout'])->name('checkout');
    Route::post('/checkout', [CheckoutController::class, 'processCheckout'])->name('checkout.process');
    
    // Khác
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::post('/api/orders/{id}/cancel', [OrderController::class, 'cancel']);
    Route::post('/api/orders/{id}/return', [OrderController::class, 'requestReturn']);
    Route::post('/api/orders/{id}/rate', [OrderController::class, 'rate']);
});


/*
| 3. KHU VỰC QUẢN TRỊ VIÊN (ADMIN)
*/
Route::middleware(['admin_auth'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [AdminDashboardController::class, 'index'])->name('dashboard');
    Route::get('/orders', [AdminOrderController::class, 'index'])->name('orders.index');
    Route::put('/orders/{id}', [AdminOrderController::class, 'update'])->name('orders.update');
    Route::get('/users', [AdminUserController::class, 'index'])->name('users.index');
    Route::delete('/users/{id}', [AdminUserController::class, 'destroy'])->name('users.destroy');
    Route::resource('products', AdminProductController::class);
    Route::resource('categories', AdminCategoryController::class);
});


/*
| 4. AUTH
*/
Route::middleware('guest')->group(function () {
    Route::get('/admin/login', [AdminAuthController::class, 'create'])->name('admin.login');
    Route::post('/admin/login', [AdminAuthController::class, 'store']);
});

Route::post('/admin/logout', [AdminAuthController::class, 'destroy'])->middleware('auth')->name('admin.logout');

require __DIR__.'/auth.php';