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
            $table->id(); // Auto-incrementing primary key
            $table->foreignId('drug_id')->constrained('drugs')->onDelete('cascade'); // Foreign key to drugs table
            $table->foreignId('patient_id')->constrained('users')->onDelete('cascade'); // Foreign key to users (patients)
            $table->integer('quantity'); // Quantity of the drug
            $table->timestamps(); // created_at and updated_at timestamps
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
