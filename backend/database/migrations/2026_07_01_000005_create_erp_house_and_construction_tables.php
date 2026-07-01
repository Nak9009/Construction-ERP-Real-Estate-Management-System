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
        // 1. House Types
        Schema::create('house_types', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('company_id');
            $table->string('name');
            $table->integer('bedrooms')->default(0);
            $table->integer('bathrooms')->default(0);
            $table->integer('floors')->default(1);
            $table->boolean('has_kitchen')->default(true);
            $table->boolean('has_parking')->default(true);
            $table->boolean('has_garden')->default(false);
            $table->boolean('has_pool')->default(false);
            $table->decimal('base_price', 15, 2)->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('company_id')->references('id')->on('companies')->onDelete('cascade');
        });

        // 2. Houses
        Schema::create('houses', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('lot_id');
            $table->uuid('house_type_id');
            $table->string('house_number');
            $table->decimal('land_cost', 15, 2)->default(0.00);
            $table->decimal('construction_cost', 15, 2)->default(0.00);
            $table->decimal('selling_price', 15, 2)->default(0.00);
            $table->string('status')->default('available'); // planned, under_construction, completed, sold, reserved, available
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('lot_id')->references('id')->on('lots')->onDelete('cascade');
            $table->foreign('house_type_id')->references('id')->on('house_types')->onDelete('cascade');
        });

        // 3. Construction Stages
        Schema::create('construction_stages', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('house_id');
            $table->string('stage_type'); // Enum mappings (planning, excavation, foundation, Columns, etc.)
            $table->string('status')->default('pending'); // pending, in_progress, completed, on_hold, delayed, cancelled
            $table->decimal('progress_pct', 5, 2)->default(0.00);
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->uuid('engineer_id')->nullable(); // Site/Civil Engineer (Employee ID)
            $table->uuid('contractor_id')->nullable(); // Assigned Contractor
            $table->decimal('cost', 15, 2)->default(0.00);
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('house_id')->references('id')->on('houses')->onDelete('cascade');
            $table->foreign('engineer_id')->references('id')->on('employees')->onDelete('set null');
            $table->foreign('contractor_id')->references('id')->on('contractors')->onDelete('set null');
            $table->unique(['house_id', 'stage_type']);
        });

        // 4. Stage Workers
        Schema::create('stage_workers', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('stage_id');
            $table->uuid('worker_id'); // Employee ID
            $table->string('role')->nullable();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->timestamps();

            $table->foreign('stage_id')->references('id')->on('construction_stages')->onDelete('cascade');
            $table->foreign('worker_id')->references('id')->on('employees')->onDelete('cascade');
        });

        // 5. Stage Materials
        Schema::create('stage_materials', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('stage_id');
            $table->uuid('material_id');
            $table->decimal('quantity_planned', 12, 4);
            $table->decimal('quantity_used', 12, 4)->default(0.0000);
            $table->decimal('unit_cost', 15, 4)->nullable();
            $table->timestamps();

            $table->foreign('stage_id')->references('id')->on('construction_stages')->onDelete('cascade');
            $table->foreign('material_id')->references('id')->on('materials')->onDelete('cascade');
        });

        // 6. Stage Media
        Schema::create('stage_media', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('stage_id');
            $table->string('type')->default('photo'); // photo, video
            $table->string('path');
            $table->string('caption')->nullable();
            $table->uuid('uploaded_by'); // User ID
            $table->timestamps();

            $table->foreign('stage_id')->references('id')->on('construction_stages')->onDelete('cascade');
            $table->foreign('uploaded_by')->references('id')->on('users')->onDelete('cascade');
        });

        // 7. Inspections
        Schema::create('inspections', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('stage_id');
            $table->uuid('inspector_id'); // Employee ID
            $table->json('checklist')->nullable();
            $table->string('result')->default('pending'); // pass, fail, conditional, pending
            $table->text('notes')->nullable();
            $table->timestamp('inspected_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('stage_id')->references('id')->on('construction_stages')->onDelete('cascade');
            $table->foreign('inspector_id')->references('id')->on('employees')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inspections');
        Schema::dropIfExists('stage_media');
        Schema::dropIfExists('stage_materials');
        Schema::dropIfExists('stage_workers');
        Schema::dropIfExists('construction_stages');
        Schema::dropIfExists('houses');
        Schema::dropIfExists('house_types');
    }
};
