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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            
            // Thông tin người nhận (Lưu cứng lịch sử)
            $table->string('shipping_name');
            $table->string('shipping_phone');
            $table->string('shipping_address'); // Gộp full địa chỉ vào đây
            
            $table->string('payment_method')->default('COD');
            $table->string('status')->default('pending'); // pending, shipping, completed...
            
            $table->decimal('subtotal', 15, 2); // Tổng tiền hàng
            $table->decimal('discount_amount', 15, 2)->default(0); // Tiền giảm
            $table->decimal('total_price', 15, 2); // Phải trả
            
            $table->text('note')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
