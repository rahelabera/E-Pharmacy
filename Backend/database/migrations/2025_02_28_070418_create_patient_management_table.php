<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
   
    public function up(): void
    {
        Schema::create('patients', function (Blueprint $table) {
            $table->id(); 
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('address')->nullable();
            $table->decimal('lat', 10, 7)->nullable(); 
            $table->decimal('lng', 10, 7)->nullable();
            $table->timestamps(); 
        });
    }

  
    public function down(): void
    {
        Schema::dropIfExists('patients');
    }
};
