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
        // 1. Materials
        Schema::create('materials', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('company_id');
            $table->string('name');
            $table->string('sku')->unique()->nullable();
            $table->string('barcode')->unique()->nullable();
            $table->string('unit')->default('pcs'); // kg, bag, m3, pcs, etc.
            $table->string('category')->nullable(); // cement, steel, brick, paint, tile, etc.
            $table->decimal('min_stock', 12, 4)->default(0.0000);
            $table->decimal('current_stock', 12, 4)->default(0.0000);
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('company_id')->references('id')->on('companies')->onDelete('cascade');
        });

        // 2. Stock Movements
        Schema::create('stock_movements', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('material_id');
            $table->uuid('project_id')->nullable();
            $table->string('type'); // in (purchase/adjustment), out (consumption/waste), transfer
            $table->decimal('quantity', 12, 4);
            $table->string('reference_type')->nullable(); // PurchaseOrder, ConstructionStage, etc.
            $table->uuid('reference_id')->nullable();
            $table->uuid('moved_by')->nullable(); // Employee ID
            $table->timestamps();

            $table->foreign('material_id')->references('id')->on('materials')->onDelete('cascade');
            $table->foreign('project_id')->references('id')->on('projects')->onDelete('set null');
            $table->foreign('moved_by')->references('id')->on('employees')->onDelete('set null');
        });

        // 3. Suppliers
        Schema::create('suppliers', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('company_id');
            $table->string('name');
            $table->string('contact_name')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('address')->nullable();
            $table->decimal('rating', 3, 2)->default(5.0);
            $table->string('payment_terms')->nullable(); // Net 30, Net 60, etc.
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('company_id')->references('id')->on('companies')->onDelete('cascade');
        });

        // 4. RFQs (Request For Quotations)
        Schema::create('rfqs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('company_id');
            $table->string('title');
            $table->date('deadline')->nullable();
            $table->string('status')->default('draft'); // draft, sent, closed, completed
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('company_id')->references('id')->on('companies')->onDelete('cascade');
        });

        // 5. RFQ Responses
        Schema::create('rfq_responses', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('rfq_id');
            $table->uuid('supplier_id');
            $table->decimal('total_amount', 15, 2)->nullable();
            $table->text('notes')->nullable();
            $table->timestamp('submitted_at')->nullable();
            $table->timestamps();

            $table->foreign('rfq_id')->references('id')->on('rfqs')->onDelete('cascade');
            $table->foreign('supplier_id')->references('id')->on('suppliers')->onDelete('cascade');
        });

        // 6. Purchase Orders
        Schema::create('purchase_orders', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('company_id');
            $table->uuid('supplier_id');
            $table->uuid('project_id')->nullable();
            $table->string('po_number')->unique();
            $table->string('status')->default('draft'); // draft, sent, approved, partially_received, received, cancelled
            $table->decimal('total', 15, 2)->default(0.00);
            $table->decimal('tax', 15, 2)->default(0.00);
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('company_id')->references('id')->on('companies')->onDelete('cascade');
            $table->foreign('supplier_id')->references('id')->on('suppliers')->onDelete('cascade');
            $table->foreign('project_id')->references('id')->on('projects')->onDelete('set null');
        });

        // 7. Purchase Order Items
        Schema::create('purchase_order_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('purchase_order_id');
            $table->uuid('material_id');
            $table->decimal('quantity', 12, 4);
            $table->decimal('unit_price', 15, 4);
            $table->decimal('total_price', 15, 2);
            $table->timestamps();

            $table->foreign('purchase_order_id')->references('id')->on('purchase_orders')->onDelete('cascade');
            $table->foreign('material_id')->references('id')->on('materials')->onDelete('cascade');
        });

        // 8. Goods Receipts
        Schema::create('goods_receipts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('purchase_order_id');
            $table->uuid('received_by'); // Employee ID
            $table->timestamp('received_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->foreign('purchase_order_id')->references('id')->on('purchase_orders')->onDelete('cascade');
            $table->foreign('received_by')->references('id')->on('employees')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('goods_receipts');
        Schema::dropIfExists('purchase_order_items');
        Schema::dropIfExists('purchase_orders');
        Schema::dropIfExists('rfq_responses');
        Schema::dropIfExists('rfqs');
        Schema::dropIfExists('suppliers');
        Schema::dropIfExists('stock_movements');
        Schema::dropIfExists('materials');
    }
};
