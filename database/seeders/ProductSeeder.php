<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        // 1. NGUYÊN LIỆU (Gắn vào category_id 1, 2)
        DB::table('products')->insert([
            [
                'category_id' => 1, // Len
                'name' => 'Len Milk Cotton 125g',
                'description' => 'Len mềm mịn, chuyên móc thú bông, khăn quàng.',
                'price' => 15000,
                'stock' => 100,
                'image' => 'https://bizweb.dktcdn.net/thumb/1024x1024/100/424/676/products/len-milk-cotton-125g-ma-01-trang.jpg',
                'created_at' => now(), 'updated_at' => now()
            ],
            [
                'category_id' => 2, // Dụng cụ
                'name' => 'Bộ kim móc SKC 8 cây',
                'description' => 'Kim móc cán dẻo, cầm êm tay, size từ 2.0mm đến 6.0mm.',
                'price' => 85000,
                'stock' => 50,
                'image' => 'https://down-vn.img.susercontent.com/file/sg-11134201-22120-0y8f8f8f8f8f', // (Link ảnh ví dụ)
                'created_at' => now(), 'updated_at' => now()
            ]
        ]);

        // 2. THÀNH PHẨM (Gắn vào category_id 4, 5)
        DB::table('products')->insert([
            [
                'category_id' => 4, // Thú bông
                'name' => 'Thỏ Con Mặc Váy Hồng',
                'description' => 'Thú bông handmade 100%, cao 30cm, mắt có chốt an toàn.',
                'price' => 250000,
                'stock' => 5, // Số lượng ít
                'image' => 'https://i.pinimg.com/736x/8e/9e/8e/8e9e8e8e8e8e8e8e8e8e8e8e8e8e8e8e.jpg',
                'created_at' => now(), 'updated_at' => now()
            ],
            [
                'category_id' => 5, // Túi xách
                'name' => 'Túi Granny Square Vintage',
                'description' => 'Túi ghép ô màu sắc cổ điển, lót vải canvas dày dặn.',
                'price' => 320000,
                'stock' => 2,
                'image' => 'https://i.etsystatic.com/12345/r/il/12345.jpg',
                'created_at' => now(), 'updated_at' => now()
            ]
        ]);
    }
}