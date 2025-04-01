<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  
    public function up(): void
    {
        Schema::create('pharmacists', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password');
            $table->string('phone')->nullable();
            $table->string('address')->nullable(); 
            $table->decimal('lat', 10, 7)->nullable(); 
            $table->decimal('lng', 10, 7)->nullable(); 
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending'); 
            $table->string('license_image')->nullable(); 
            $table->timestamps();
        });
    }

   
    public function down(): void
    {
        Schema::dropIfExists('pharmacists');
    }
};
