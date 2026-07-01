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
        // 1. Projects
        Schema::create('projects', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('company_id');
            $table->string('name');
            $table->string('address')->nullable();
            $table->decimal('lat', 10, 8)->nullable();
            $table->decimal('lng', 11, 8)->nullable();
            $table->decimal('budget', 15, 2)->nullable();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->string('status')->default('planning'); // planning, in_progress, on_hold, completed, cancelled, delayed
            $table->text('description')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('company_id')->references('id')->on('companies')->onDelete('cascade');
        });

        // 2. Milestones
        Schema::create('milestones', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('project_id');
            $table->string('name');
            $table->date('target_date')->nullable();
            $table->date('completed_date')->nullable();
            $table->string('status')->default('pending'); // pending, completed, overdue
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('project_id')->references('id')->on('projects')->onDelete('cascade');
        });

        // 3. Project Risks
        Schema::create('project_risks', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('project_id');
            $table->string('title');
            $table->string('severity')->default('medium'); // low, medium, high, critical
            $table->string('probability')->default('medium'); // low, medium, high
            $table->text('mitigation')->nullable();
            $table->string('status')->default('open'); // open, mitigated, closed
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('project_id')->references('id')->on('projects')->onDelete('cascade');
        });

        // 4. Lands
        Schema::create('lands', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('project_id')->nullable();
            $table->string('owner_name')->nullable();
            $table->decimal('purchase_price', 15, 2)->nullable();
            $table->string('title_number')->nullable();
            $table->decimal('lat', 10, 8)->nullable();
            $table->decimal('lng', 11, 8)->nullable();
            $table->json('polygon')->nullable();
            $table->decimal('area_sqm', 12, 2)->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('project_id')->references('id')->on('projects')->onDelete('set null');
        });

        // 5. Blocks
        Schema::create('blocks', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('land_id');
            $table->string('name');
            $table->text('description')->nullable();
            $table->integer('total_lots')->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('land_id')->references('id')->on('lands')->onDelete('cascade');
        });

        // 6. Lots
        Schema::create('lots', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('block_id');
            $table->string('lot_number');
            $table->decimal('width', 8, 2)->nullable();
            $table->decimal('length', 8, 2)->nullable();
            $table->decimal('area_sqm', 10, 2)->nullable();
            $table->decimal('lat', 10, 8)->nullable();
            $table->decimal('lng', 11, 8)->nullable();
            $table->string('status')->default('available'); // available, reserved, sold, building, completed
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('block_id')->references('id')->on('blocks')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lots');
        Schema::dropIfExists('blocks');
        Schema::dropIfExists('lands');
        Schema::dropIfExists('project_risks');
        Schema::dropIfExists('milestones');
        Schema::dropIfExists('projects');
    }
};
