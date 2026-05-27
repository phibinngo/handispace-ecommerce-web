<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Gọi các seeder con theo đúng thứ tự logic
        $this->call([
            LoyaltyLevelSeeder::class, // 1. Tạo Hạng thành viên trước (để User có cái mà liên kết)
            CategorySeeder::class,     // 2. Tạo Danh mục (để Sản phẩm có cái mà liên kết)
            UserSeeder::class,         // 3. Tạo User (Admin & Khách)
            ProductSeeder::class,      // 4. Tạo Sản phẩm
        ]);
    }
}