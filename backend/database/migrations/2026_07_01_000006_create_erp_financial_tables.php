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
        // 1. Budgets
        Schema::create('budgets', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('project_id');
            $table->string('category'); // labor, material, equipment, land, overhead, etc.
            $table->decimal('planned_amount', 15, 2)->default(0.00);
            $table->decimal('actual_amount', 15, 2)->default(0.00);
            $table->integer('fiscal_year');
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('project_id')->references('id')->on('projects')->onDelete('cascade');
            $table->unique(['project_id', 'category', 'fiscal_year']);
        });

        // 2. Invoices
        Schema::create('invoices', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('company_id');
            $table->string('invoice_number')->unique();
            $table->string('type'); // payable (to supplier/contractor), receivable (from customer)
            $table->uuid('contact_id'); // Polymorphic contact (Supplier ID, Customer ID, User ID)
            $table->string('contact_type');
            $table->decimal('amount', 15, 2)->default(0.00);
            $table->decimal('tax', 15, 2)->default(0.00);
            $table->date('due_date');
            $table->string('status')->default('unpaid'); // unpaid, paid, partially_paid, overdue, cancelled
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('company_id')->references('id')->on('companies')->onDelete('cascade');
            $table->index(['contact_type', 'contact_id']);
        });

        // 3. Payments
        Schema::create('payments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('invoice_id');
            $table->decimal('amount', 15, 2);
            $table->string('method')->default('cash'); // cash, bank_transfer, check, card, etc.
            $table->string('reference')->nullable(); // transaction hash, check number, bank ref
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();

            $table->foreign('invoice_id')->references('id')->on('invoices')->onDelete('cascade');
        });

        // 4. Expenses
        Schema::create('expenses', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('company_id');
            $table->uuid('project_id')->nullable();
            $table->string('category'); // administrative, travel, utilities, petty_cash, etc.
            $table->decimal('amount', 15, 2);
            $table->text('description')->nullable();
            $table->string('receipt_path')->nullable();
            $table->uuid('approved_by')->nullable(); // Employee ID
            $table->string('status')->default('pending'); // pending, approved, rejected
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('company_id')->references('id')->on('companies')->onDelete('cascade');
            $table->foreign('project_id')->references('id')->on('projects')->onDelete('set null');
            $table->foreign('approved_by')->references('id')->on('employees')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('expenses');
        Schema::dropIfExists('payments');
        Schema::dropIfExists('invoices');
        Schema::dropIfExists('budgets');
    }
};
