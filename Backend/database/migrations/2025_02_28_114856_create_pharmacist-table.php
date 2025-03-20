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
        Schema::create('pharmacist', function (Blueprint $table) {
            $table->id();// auto incrementing primary key
            $table->string('name');//pharmacist full name
            $table->string('email')->unique(); // Ensures each pharmacist has a unique email for login
            $table->string('password'); // Stores the encrypted password for authentication
            $table->string('phone')->nullable(); // Optional phone number for contact purposes
            $table->string('address')->nullable(); // Optional address field for location details
            $table->timestamps(); //Stores `created_at` and `updated_at` timestamps

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
