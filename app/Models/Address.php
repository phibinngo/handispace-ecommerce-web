<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Address extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 
        'address_name',   // Tên gợi nhớ (Nhà riêng, công ty)
        'receiver_name', 
        'receiver_phone',
        'province', 
        'ward', 
        'street_address', 
        'is_default'
    ];

    // Mối quan hệ: Địa chỉ thuộc về 1 User
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}