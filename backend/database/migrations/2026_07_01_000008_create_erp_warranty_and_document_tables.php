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
        // 1. Warranties
        Schema::create('warranties', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('house_id');
            $table->uuid('customer_id');
            $table->date('start_date');
            $table->date('end_date');
            $table->json('terms')->nullable();
            $table->string('status')->default('active'); // active, expired, voided
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('house_id')->references('id')->on('houses')->onDelete('cascade');
            $table->foreign('customer_id')->references('id')->on('customers')->onDelete('cascade');
        });

        // 2. Maintenance Requests (Customer warranty requests)
        Schema::create('maintenance_requests', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('warranty_id')->nullable();
            $table->uuid('customer_id');
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('priority')->default('medium'); // low, medium, high, emergency
            $table->string('status')->default('pending'); // pending, assigned, in_progress, completed, rejected
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('warranty_id')->references('id')->on('warranties')->onDelete('set null');
            $table->foreign('customer_id')->references('id')->on('customers')->onDelete('cascade');
        });

        // 3. Repair Records
        Schema::create('repair_records', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('maintenance_request_id');
            $table->uuid('assigned_to')->nullable(); // Employee ID (Technician/Contractor/etc.)
            $table->text('description')->nullable();
            $table->decimal('cost', 15, 2)->default(0.00);
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->foreign('maintenance_request_id')->references('id')->on('maintenance_requests')->onDelete('cascade');
            $table->foreign('assigned_to')->references('id')->on('employees')->onDelete('set null');
        });

        // 4. Documents (Polymorphic Document Storage)
        Schema::create('documents', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('company_id');
            $table->string('documentable_type')->nullable(); // Project, House, Lot, Supplier, SalesContract, etc.
            $table->uuid('documentable_id')->nullable();
            $table->string('type'); // blueprint, permit, invoice, inspection_report, contract, warranty, certificate, photo, video, etc.
            $table->string('name');
            $table->string('path');
            $table->bigInteger('size')->nullable(); // size in bytes
            $table->uuid('uploaded_by')->nullable(); // User ID
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('company_id')->references('id')->on('companies')->onDelete('cascade');
            $table->foreign('uploaded_by')->references('id')->on('users')->onDelete('set null');
            $table->index(['documentable_type', 'documentable_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('documents');
        Schema::dropIfExists('repair_records');
        Schema::dropIfExists('maintenance_requests');
        Schema::dropIfExists('warranties');
    }
};
