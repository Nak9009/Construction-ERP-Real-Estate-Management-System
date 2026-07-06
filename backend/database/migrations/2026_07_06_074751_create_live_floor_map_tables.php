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
        // 1. Floors
        Schema::create('floors', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('house_id');
            $table->string('name');
            $table->integer('level')->default(0); // 0 = Ground, 1 = First, etc.
            $table->json('svg_map_data')->nullable(); // viewbox and generic bounds
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('house_id')->references('id')->on('houses')->onDelete('cascade');
        });

        // 2. Rooms
        Schema::create('rooms', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('floor_id');
            $table->string('name');
            $table->longText('svg_path')->nullable(); // The SVG 'd' string
            $table->string('status')->default('not_started'); // completed, in_progress, delayed, not_started
            $table->decimal('progress_pct', 5, 2)->default(0.00);
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('floor_id')->references('id')->on('floors')->onDelete('cascade');
        });

        // 3. Room Stages
        Schema::create('room_stages', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('room_id');
            $table->string('stage_name');
            $table->decimal('progress_pct', 5, 2)->default(0.00);
            $table->string('status')->default('not_started');
            $table->date('start_date')->nullable();
            $table->date('expected_end_date')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('room_id')->references('id')->on('rooms')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('room_stages');
        Schema::dropIfExists('rooms');
        Schema::dropIfExists('floors');
    }
};
