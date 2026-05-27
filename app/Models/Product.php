<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'name',
        'description',
        'price',
        'quantity', // 👈 Đã đổi về 'quantity'
        'image'
    ];

    protected $casts = [
        'quantity' => 'integer', // 👈 Ép kiểu số nguyên
        'price' => 'decimal:2',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}