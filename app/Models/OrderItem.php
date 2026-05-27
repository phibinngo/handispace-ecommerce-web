<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id', 
        'product_id', 
        'quantity', 
        'price', 
        'custom_text'
    ];

    // Mối quan hệ: Item này thuộc về 1 Sản phẩm (Để lấy tên, ảnh hiển thị lịch sử)
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    // Mối quan hệ: Item này thuộc về 1 Đơn hàng
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }
}