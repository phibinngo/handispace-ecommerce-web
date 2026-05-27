<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        // --- Thông tin cơ bản ---
        'user_id',
        'shipping_name',
        'shipping_phone',
        'shipping_address',
        'payment_method',
        'status',
        'subtotal',
        'discount_amount',
        'total_price',
        'note',

        // --- 👇 CÁC CỘT MỚI (QUAN TRỌNG ĐỂ LƯU HỦY/TRẢ/ĐÁNH GIÁ) ---
        'cancel_reason',    // Lý do hủy đơn
        'return_reason',    // Lý do trả hàng
        'is_rated',         // Đánh dấu đã đánh giá (để ẩn nút)
        'review_content',   // Nội dung review
        'review_image'      // Ảnh review
    ];

    // Quan hệ với bảng OrderItem
    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    // Alias (tên gọi khác) cho orderItems, tiện cho việc gọi API
    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    // Quan hệ với User
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}