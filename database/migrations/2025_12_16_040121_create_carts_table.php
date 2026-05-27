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
        Schema::create('carts', function (Blueprint $table) {
            $table->id();
            // Liên kết với User: Để biết giỏ này của ông nào
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            
            // Liên kết với Product: Để biết ổng mua cái gì
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            
            // Số lượng mua
            $table->integer('quantity')->default(1);
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('carts');
    }
};
