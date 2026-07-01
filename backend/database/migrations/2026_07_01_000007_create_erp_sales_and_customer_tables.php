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
        // 1. Leads
        Schema::create('leads', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('company_id');
            $table->string('name');
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('source')->nullable(); // facebook, website, referral, walk-in, etc.
            $table->string('status')->default('new'); // new, contacted, qualified, proposal, negotiation, won, lost
            $table->uuid('assigned_to')->nullable(); // Employee ID (Sales Agent)
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('company_id')->references('id')->on('companies')->onDelete('cascade');
            $table->foreign('assigned_to')->references('id')->on('employees')->onDelete('set null');
        });

        // 2. Customers
        Schema::create('customers', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('company_id');
            $table->uuid('user_id')->nullable(); // Customer login account
            $table->string('name');
            $table->string('phone');
            $table->string('email')->nullable();
            $table->string('address')->nullable();
            $table->string('id_number')->nullable(); // National ID or Passport
            $table->string('id_type')->default('national_id'); // national_id, passport, driver_license
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('company_id')->references('id')->on('companies')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
        });

        // 3. Customer Family Members
        Schema::create('customer_family_members', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('customer_id');
            $table->string('name');
            $table->string('relationship'); // spouse, child, parent, sibling, etc.
            $table->string('phone')->nullable();
            $table->timestamps();

            $table->foreign('customer_id')->references('id')->on('customers')->onDelete('cascade');
        });

        // 4. Quotations
        Schema::create('quotations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('lead_id');
            $table->uuid('house_id');
            $table->decimal('quoted_price', 15, 2);
            $table->decimal('discount', 15, 2)->default(0.00);
            $table->date('valid_until')->nullable();
            $table->string('status')->default('draft'); // draft, sent, accepted, rejected, expired
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('lead_id')->references('id')->on('leads')->onDelete('cascade');
            $table->foreign('house_id')->references('id')->on('houses')->onDelete('cascade');
        });

        // 5. Reservations
        Schema::create('reservations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('house_id');
            $table->uuid('customer_id');
            $table->timestamp('reserved_at')->nullable();
            $table->decimal('deposit_amount', 15, 2);
            $table->timestamp('expires_at')->nullable();
            $table->string('status')->default('pending'); // pending, active, completed, expired, cancelled
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('house_id')->references('id')->on('houses')->onDelete('cascade');
            $table->foreign('customer_id')->references('id')->on('customers')->onDelete('cascade');
        });

        // 6. Bookings
        Schema::create('bookings', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('reservation_id');
            $table->date('booking_date');
            $table->json('payment_schedule')->nullable(); // Installment structures
            $table->string('status')->default('confirmed'); // confirmed, contract_signed, cancelled
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('reservation_id')->references('id')->on('reservations')->onDelete('cascade');
        });

        // 7. Sales Contracts
        Schema::create('sales_contracts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('booking_id');
            $table->string('contract_number')->unique();
            $table->decimal('total_amount', 15, 2);
            $table->timestamp('signed_at')->nullable();
            $table->string('document_path')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('booking_id')->references('id')->on('bookings')->onDelete('cascade');
        });

        // 8. Payment Plans
        Schema::create('payment_plans', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('sales_contract_id');
            $table->decimal('total_amount', 15, 2);
            $table->decimal('down_payment', 15, 2)->default(0.00);
            $table->integer('installment_count');
            $table->string('frequency')->default('monthly'); // monthly, quarterly, semi-annual, annual
            $table->timestamps();

            $table->foreign('sales_contract_id')->references('id')->on('sales_contracts')->onDelete('cascade');
        });

        // 9. Installments
        Schema::create('installments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('payment_plan_id');
            $table->integer('installment_number');
            $table->decimal('amount', 15, 2);
            $table->date('due_date');
            $table->timestamp('paid_at')->nullable();
            $table->string('status')->default('pending'); // pending, paid, partially_paid, late, overdue
            $table->timestamps();

            $table->foreign('payment_plan_id')->references('id')->on('payment_plans')->onDelete('cascade');
        });

        // 10. Commissions
        Schema::create('commissions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('sales_contract_id');
            $table->uuid('agent_id'); // Employee ID (Sales Agent)
            $table->decimal('amount', 15, 2);
            $table->decimal('percentage', 5, 2);
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();

            $table->foreign('sales_contract_id')->references('id')->on('sales_contracts')->onDelete('cascade');
            $table->foreign('agent_id')->references('id')->on('employees')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('commissions');
        Schema::dropIfExists('installments');
        Schema::dropIfExists('payment_plans');
        Schema::dropIfExists('sales_contracts');
        Schema::dropIfExists('bookings');
        Schema::dropIfExists('reservations');
        Schema::dropIfExists('quotations');
        Schema::dropIfExists('customer_family_members');
        Schema::dropIfExists('customers');
        Schema::dropIfExists('leads');
    }
};
