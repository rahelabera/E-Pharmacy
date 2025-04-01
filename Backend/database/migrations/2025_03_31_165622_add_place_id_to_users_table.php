<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('place_name')->nullable(); // Store place name
            $table->string('address')->nullable()->change(); // Ensure address can be nullable
            $table->decimal('lat', 10, 7)->nullable(); // Store latitude
            $table->decimal('lng', 10, 7)->nullable(); // Store longitude
        });
    }

    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['place_name', 'lat', 'lng']);
        });
    }
};
