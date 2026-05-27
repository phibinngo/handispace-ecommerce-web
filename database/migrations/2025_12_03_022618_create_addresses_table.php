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
        Schema::create('addresses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            
            $table->string('address_name')->nullable(); // VD: Nhà riêng
            $table->string('receiver_name');
            $table->string('receiver_phone');
            
            $table->string('province');      // Tỉnh / Thành phố
            $table->string('ward');          // Phường / Xã
            $table->string('street_address'); // Số nhà, tên đường
            
            $table->boolean('is_default')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('addresses');
    }
};
