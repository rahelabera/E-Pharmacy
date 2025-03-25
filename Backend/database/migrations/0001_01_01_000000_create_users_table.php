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
            $table->string('name');
            $table->string('email')->unique();
            $table->tinyInteger('is_role')->default(1)->comment('0: Admin, 1: Patient, 2: Pharmacist');
            $table->string('password');
            $table->string('phone')->nullable(); // Applicable to Pharmacist
            $table->string('address')->nullable(); // Shared field for Patient and Pharmacist
            $table->decimal('lat', 10, 7)->nullable(); // Shared for Patient and Pharmacist
            $table->decimal('lng', 10, 7)->nullable(); // Shared for Patient and Pharmacist
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending')->nullable()->comment('For Pharmacist only');
            $table->string('license_image')->nullable()->comment('For Pharmacist only');
            $table->timestamp('email_verified_at')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });

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
