<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        // --- NHÓM NGUYÊN LIỆU (Material) ---
        DB::table('categories')->insert([
            ['id' => 1, 'name' => 'Len sợi & Sợi vải', 'type' => 'material', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 2, 'name' => 'Dụng cụ đan móc',   'type' => 'material', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 3, 'name' => 'Phụ kiện túi ví',   'type' => 'material', 'created_at' => now(), 'updated_at' => now()],
        ]);

        // --- NHÓM THÀNH PHẨM (Product) ---
        DB::table('categories')->insert([
            ['id' => 4, 'name' => 'Thú bông len',      'type' => 'product', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 5, 'name' => 'Túi xách Handmade', 'type' => 'product', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 6, 'name' => 'Hoa len trang trí', 'type' => 'product', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}