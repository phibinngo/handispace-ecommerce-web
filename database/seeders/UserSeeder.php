<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Admin (Không cần cấp độ)
        DB::table('users')->insert([
            'username' => 'admin',
            'name' => 'Ngô Phi Bin',
            'email' => 'phibinngo@gmail.com',
            'phone' => '0345923445',
            'password' => Hash::make('12345678'),
            'role' => 'admin',
            'total_spent' => 0,
            'loyalty_level_id' => null, 
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('users')->insert([
            'username' => 'phibinngo',
            'name' => 'Phi Bin Ngô',
            'email' => 'phibin@gmail.com',
            'phone' => '0912345678',
            'password' => Hash::make('12345678'),
            'role' => 'customer',
            'age' => 25,
            'total_spent' => 4500000,
            'loyalty_level_id' => 2, 
            'created_at' => now(),
            'updated_at' => now(),
        ]);

    }
}