<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LoyaltyLevelSeeder extends Seeder
{
    public function run(): void
    {
        // Xóa dữ liệu cũ để tránh trùng lặp nếu chạy lại
        DB::table('loyalty_levels')->truncate();

        // 1. Khách Thường (Mới tạo)
        DB::table('loyalty_levels')->insert([
            'id' => 1, // Gán cứng ID để dễ gọi bên User
            'name' => 'Thành viên Mới',
            'min_spend' => 0,
            'discount_percent' => 0,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // 2. Khách Bạc (Mua trên 2 triệu)
        DB::table('loyalty_levels')->insert([
            'id' => 2,
            'name' => 'Thành viên Bạc',
            'min_spend' => 2000000,
            'discount_percent' => 2, // Giảm 2%
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // 3. Khách Vàng (Mua trên 5 triệu)
        DB::table('loyalty_levels')->insert([
            'id' => 3,
            'name' => 'Thành viên Vàng',
            'min_spend' => 5000000,
            'discount_percent' => 5, // Giảm 5%
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // 4. Khách Kim Cương (Mua trên 10 triệu)
        DB::table('loyalty_levels')->insert([
            'id' => 4,
            'name' => 'Thành viên Kim Cương',
            'min_spend' => 10000000,
            'discount_percent' => 10, // Giảm 10%
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}