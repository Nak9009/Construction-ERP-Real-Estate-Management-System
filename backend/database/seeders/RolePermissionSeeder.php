<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Domain\Shared\Models\Role;
use App\Domain\Shared\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // 1. Define permissions grouped by module
        $modules = [
            'companies' => ['view', 'create', 'update', 'delete'],
            'projects' => ['view', 'create', 'update', 'delete', 'manage_milestones', 'manage_risks'],
            'lands' => ['view', 'create', 'update', 'delete', 'subdivide'],
            'lots' => ['view', 'create', 'update', 'delete', 'change_status'],
            'houses' => ['view', 'create', 'update', 'delete', 'view_blueprints', 'upload_blueprints'],
            'construction' => ['view', 'create', 'update', 'delete', 'update_progress', 'assign_workers', 'log_materials', 'upload_media'],
            'workforce' => ['view', 'create', 'update', 'delete', 'attendance_report', 'payroll_manage'],
            'equipment' => ['view', 'create', 'update', 'delete', 'assign_project', 'log_fuel', 'log_maintenance'],
            'warehouse' => ['view', 'create', 'update', 'delete', 'adjust_stock', 'transfer_stock'],
            'procurement' => ['view', 'create', 'update', 'delete', 'approve_po', 'create_rfq', 'receive_goods'],
            'financial' => ['view', 'create', 'update', 'delete', 'manage_budget', 'approve_expense', 'view_reports'],
            'sales' => ['view', 'create', 'update', 'delete', 'view_pipeline', 'manage_commissions', 'create_contract'],
            'customers' => ['view', 'create', 'update', 'delete', 'view_payment_plans'],
            'inspections' => ['view', 'create', 'update', 'approve'],
            'warranties' => ['view', 'create', 'update', 'delete', 'create_repair_record'],
            'documents' => ['view', 'create', 'update', 'delete', 'download'],
            'reports' => ['view', 'generate', 'export'],
            'analytics' => ['view'],
            'ai' => ['view', 'run_prediction'],
        ];

        $permissionsList = [];
        foreach ($modules as $module => $actions) {
            foreach ($actions as $action) {
                $permissionsList[] = Permission::create([
                    'name' => "{$action}_{$module}",
                    'guard_name' => 'web'
                ]);
            }
        }

        // 2. Define Roles and assign permissions
        $roles = [
            'Super Admin' => [], // Gets all permissions dynamically
            'Company Owner' => [], // Gets all permissions dynamically
            
            'Director' => [
                'view_companies', 'view_projects', 'view_lands', 'view_lots', 'view_houses',
                'view_construction', 'view_workforce', 'view_equipment', 'view_warehouse',
                'view_procurement', 'view_financial', 'view_sales', 'view_customers',
                'view_inspections', 'view_warranties', 'view_documents', 'view_reports',
                'view_analytics', 'view_ai', 'generate_reports', 'export_reports',
                'approve_po_procurement', 'approve_expense_financial', 'view_payment_plans_customers'
            ],
            
            'Project Director' => [
                'view_projects', 'create_projects', 'update_projects', 'manage_milestones_projects', 'manage_risks_projects',
                'view_lands', 'view_lots', 'view_houses', 'view_construction', 'view_workforce',
                'view_equipment', 'view_warehouse', 'view_procurement', 'view_financial',
                'view_inspections', 'view_documents', 'view_reports', 'view_analytics',
                'generate_reports', 'export_reports', 'approve_po_procurement', 'approve_expense_financial'
            ],
            
            'Project Manager' => [
                'view_projects', 'update_projects', 'manage_milestones_projects', 'manage_risks_projects',
                'view_lands', 'view_lots', 'view_houses', 'view_construction', 'update_construction',
                'assign_workers_construction', 'log_materials_construction', 'upload_media_construction', 'view_workforce',
                'view_equipment', 'assign_project_equipment', 'view_warehouse', 'view_procurement',
                'view_documents', 'view_reports', 'generate_reports', 'export_reports'
            ],
            
            'Finance Manager' => [
                'view_projects', 'view_financial', 'create_financial', 'update_financial',
                'manage_budget_financial', 'approve_expense_financial', 'view_reports', 'generate_reports',
                'export_reports', 'view_analytics', 'view_sales', 'view_customers', 'view_payment_plans_customers'
            ],
            
            'Procurement Manager' => [
                'view_warehouse', 'view_procurement', 'create_procurement', 'update_procurement',
                'approve_po_procurement', 'create_rfq_procurement', 'receive_goods_procurement', 'view_reports', 'generate_reports'
            ],
            
            'Site Engineer' => [
                'view_projects', 'view_construction', 'update_construction', 'update_progress_construction',
                'assign_workers_construction', 'log_materials_construction', 'upload_media_construction', 'view_equipment', 'view_warehouse',
                'view_inspections', 'create_inspections', 'view_documents', 'create_documents'
            ],
            
            'Inspector' => [
                'view_projects', 'view_construction', 'view_inspections', 'create_inspections',
                'update_inspections', 'approve_inspections', 'view_documents'
            ],
            
            'Sales Manager' => [
                'view_sales', 'create_sales', 'update_sales', 'delete_sales', 'view_pipeline_sales',
                'manage_commissions_sales', 'create_contract_sales', 'view_customers', 'create_customers',
                'update_customers', 'view_payment_plans_customers', 'view_reports', 'generate_reports'
            ],
            
            'Sales Agent' => [
                'view_sales', 'create_sales', 'update_sales', 'view_pipeline_sales', 'create_contract_sales',
                'view_customers', 'create_customers', 'update_customers', 'view_payment_plans_customers'
            ],
            
            'Contractor' => [
                'view_projects', 'view_construction', 'update_progress_construction', 'upload_media_construction', 'view_documents'
            ],
            
            'Customer' => [
                'view_houses', 'view_construction', 'view_payment_plans_customers', 'view_warranties',
                'view_documents', 'create_warranties'
            ],
        ];

        // Create Super Admin and Owner
        $superAdminRole = Role::create(['name' => 'Super Admin', 'guard_name' => 'web']);
        $ownerRole = Role::create(['name' => 'Company Owner', 'guard_name' => 'web']);
        
        // Give all permissions to Super Admin and Company Owner
        $allPermissions = Permission::all();
        $superAdminRole->syncPermissions($allPermissions);
        $ownerRole->syncPermissions($allPermissions);

        foreach ($roles as $roleName => $perms) {
            if ($roleName === 'Super Admin' || $roleName === 'Company Owner') {
                continue;
            }

            $role = Role::create(['name' => $roleName, 'guard_name' => 'web']);
            $role->syncPermissions($perms);
        }
    }
}
