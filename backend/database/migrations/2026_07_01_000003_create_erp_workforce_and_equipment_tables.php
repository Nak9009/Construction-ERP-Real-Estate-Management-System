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
        // 1. Contractors
        Schema::create('contractors', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('company_id');
            $table->string('name');
            $table->string('contact_person')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('specialization')->nullable();
            $table->string('license_number')->nullable();
            $table->decimal('rating', 3, 2)->default(5.0);
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('company_id')->references('id')->on('companies')->onDelete('cascade');
        });

        // 2. Employees
        Schema::create('employees', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('company_id');
            $table->uuid('user_id')->nullable();
            $table->string('employee_number')->unique();
            $table->string('position')->nullable();
            $table->uuid('department_id')->nullable();
            $table->date('hire_date')->nullable();
            $table->decimal('salary', 12, 2)->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('company_id')->references('id')->on('companies')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
            $table->foreign('department_id')->references('id')->on('departments')->onDelete('set null');
        });

        // 3. Skills
        Schema::create('skills', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name')->unique();
            $table->string('category')->nullable(); // Engineering, Carpentry, Masonry, Plumbing, Electrical, etc.
            $table->timestamps();
        });

        // 4. Employee Skills (Pivot)
        Schema::create('employee_skills', function (Blueprint $table) {
            $table->uuid('employee_id');
            $table->uuid('skill_id');
            $table->string('proficiency_level')->default('intermediate'); // beginner, intermediate, advanced, expert
            $table->primary(['employee_id', 'skill_id']);

            $table->foreign('employee_id')->references('id')->on('employees')->onDelete('cascade');
            $table->foreign('skill_id')->references('id')->on('skills')->onDelete('cascade');
        });

        // 5. Attendances
        Schema::create('attendances', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('employee_id');
            $table->uuid('project_id')->nullable();
            $table->date('date');
            $table->time('check_in')->nullable();
            $table->time('check_out')->nullable();
            $table->decimal('hours_worked', 4, 2)->default(0.00);
            $table->string('status')->default('present'); // present, absent, late, leave
            $table->timestamps();

            $table->foreign('employee_id')->references('id')->on('employees')->onDelete('cascade');
            $table->foreign('project_id')->references('id')->on('projects')->onDelete('set null');
            $table->unique(['employee_id', 'date']);
        });

        // 6. Daily Reports
        Schema::create('daily_reports', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('project_id');
            $table->uuid('reported_by'); // Employee ID
            $table->date('date');
            $table->text('summary')->nullable();
            $table->string('weather')->nullable();
            $table->text('issues')->nullable();
            $table->json('photos')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('project_id')->references('id')->on('projects')->onDelete('cascade');
            $table->foreign('reported_by')->references('id')->on('employees')->onDelete('cascade');
            $table->unique(['project_id', 'date']);
        });

        // 7. Equipment
        Schema::create('equipment', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('company_id');
            $table->string('name');
            $table->string('type')->nullable(); // excavator, crane, truck, concrete_mixer, generator, etc.
            $table->string('model')->nullable();
            $table->string('serial_number')->nullable();
            $table->date('purchase_date')->nullable();
            $table->string('status')->default('available'); // available, in_use, maintenance, broken
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('company_id')->references('id')->on('companies')->onDelete('cascade');
        });

        // 8. Equipment Assignments
        Schema::create('equipment_assignments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('equipment_id');
            $table->uuid('project_id');
            $table->date('assigned_date');
            $table->date('return_date')->nullable();
            $table->timestamps();

            $table->foreign('equipment_id')->references('id')->on('equipment')->onDelete('cascade');
            $table->foreign('project_id')->references('id')->on('projects')->onDelete('cascade');
        });

        // 9. Fuel Logs
        Schema::create('fuel_logs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('equipment_id');
            $table->date('date');
            $table->decimal('liters', 8, 2);
            $table->decimal('cost', 10, 2);
            $table->decimal('odometer', 10, 2)->nullable();
            $table->timestamps();

            $table->foreign('equipment_id')->references('id')->on('equipment')->onDelete('cascade');
        });

        // 10. Maintenance Records
        Schema::create('maintenance_records', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('equipment_id');
            $table->string('type')->default('routine'); // routine, repair, inspection
            $table->text('description')->nullable();
            $table->decimal('cost', 10, 2)->default(0.00);
            $table->date('date');
            $table->date('next_due')->nullable();
            $table->timestamps();

            $table->foreign('equipment_id')->references('id')->on('equipment')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('maintenance_records');
        Schema::dropIfExists('fuel_logs');
        Schema::dropIfExists('equipment_assignments');
        Schema::dropIfExists('equipment');
        Schema::dropIfExists('daily_reports');
        Schema::dropIfExists('attendances');
        Schema::dropIfExists('employee_skills');
        Schema::dropIfExists('skills');
        Schema::dropIfExists('employees');
        Schema::dropIfExists('contractors');
    }
};
