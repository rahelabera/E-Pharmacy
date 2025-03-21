<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');//foreign key to users table
            $table->json('items');//array of items in the order(eg. product_id, quantity, price)
            $table->decimal('total_amount', 8, 2);//total cost of the order
            $table->string('status')->default('pending');//status of the order(pending, canceled,completed)
            $table->timestamps();
            //Foregin key constraint
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');

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
