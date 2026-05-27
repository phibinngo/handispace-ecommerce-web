<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            // Để tránh lỗi migration chạy trước bảng loyalty, ta không dùng constrained() ở đây
            // Chỉ lưu id thôi, xử lý logic sau.
            $table->unsignedBigInteger('loyalty_level_id')->nullable(); 
            
            $table->string('username')->unique(); // Tên đăng nhập
            $table->string('name'); // Họ tên
            $table->string('email')->unique();
            $table->string('phone')->unique();
            $table->string('password');
            $table->integer('age')->nullable();
            $table->decimal('total_spent', 15, 2)->default(0); // Tổng mua
            $table->string('role')->default('customer'); // admin/customer
            
            $table->timestamp('email_verified_at')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });

        // Các bảng phụ của Laravel (giữ nguyên đừng xóa)
        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
