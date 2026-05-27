<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'product_id',
        'quantity',
    ];

    // Link ngược lại với bảng Product để lấy tên, giá, ảnh...
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    // Link tới user (nếu cần sau này)
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}