<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
// 👇 Import Model LoyaltyLevel
use App\Models\LoyaltyLevel;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'username', 
        'name', 
        'email', 
        'password', 
        'phone', 
        'age', 
        'total_spent', 
        'role', 
        'loyalty_level_id'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'total_spent' => 'decimal:2',
        ];
    }

    // --- QUAN HỆ (RELATIONSHIPS) ---

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function addresses(): HasMany
    {
        return $this->hasMany(Address::class);
    }

    /**
     * Quan hệ với Hạng thành viên
     * Tên hàm là loyaltyLevel (camelCase) để đúng chuẩn convention
     */
    public function loyaltyLevel(): BelongsTo
    {
        return $this->belongsTo(LoyaltyLevel::class);
    }

    // --- LOGIC NGHIỆP VỤ ---

    /**
     * Tự động kiểm tra và nâng hạng thành viên
     * Gọi hàm này sau khi thanh toán thành công
     */
    public function upgradeLoyaltyLevel()
    {
        // Tìm cấp độ cao nhất mà user đạt được dựa trên tiền đã chi
        // Logic: Lấy các cấp độ có min_spend <= total_spent, sắp xếp giảm dần, lấy cái đầu tiên
        $newLevel = LoyaltyLevel::where('min_spend', '<=', $this->total_spent)
                                ->orderBy('min_spend', 'desc')
                                ->first();

        // Nếu tìm thấy và khác với cấp hiện tại thì cập nhật
        if ($newLevel && $newLevel->id !== $this->loyalty_level_id) {
            $this->loyalty_level_id = $newLevel->id;
            // Lưu ý: Không cần $this->save() ở đây nếu gọi trong Controller trước khi save user
            // Nhưng để chắc chắn, ta gán vào model instance
        }
    }
}