<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\CompanyController;
use App\Http\Controllers\Api\V1\ProjectController;
use App\Http\Controllers\Api\V1\LandController;
use App\Http\Controllers\Api\V1\HouseController;
use App\Http\Controllers\Api\V1\ConstructionController;
use App\Http\Controllers\Api\V1\DashboardController;
use App\Http\Controllers\Api\V1\WorkforceController;
use App\Http\Controllers\Api\V1\EquipmentController;
use App\Http\Controllers\Api\V1\WarehouseController;
use App\Http\Controllers\Api\V1\ProcurementController;
use App\Http\Controllers\Api\V1\FinancialController;
use App\Http\Controllers\Api\V1\SalesController;
use App\Http\Controllers\Api\V1\CustomerController;
use App\Http\Controllers\Api\V1\WarrantyController;
use App\Http\Controllers\Api\V1\DocumentController;
use App\Http\Controllers\Api\V1\ReportController;
use App\Http\Controllers\Api\V1\Admin\UserController;
use App\Http\Controllers\Api\V1\Admin\RoleController;
use App\Http\Controllers\Api\V1\Admin\AdminDashboardController;
use App\Http\Controllers\Api\V1\Admin\AuditLogController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {
    // Public/Auth routes
    Route::post('/auth/login', [AuthController::class, 'login']);

    // Authenticated & Tenant-Scoped routes
    Route::middleware(['tenant'])->group(function () {
        // Auth profile & logout
        Route::get('/auth/profile', [AuthController::class, 'profile']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);

        // Dashboard
        Route::get('/dashboard', [DashboardController::class, 'index']);

        // Company Settings
        Route::get('/company', [CompanyController::class, 'show']);
        Route::put('/company', [CompanyController::class, 'update']);
        Route::get('/company/branches', [CompanyController::class, 'indexBranches']);
        Route::post('/company/branches', [CompanyController::class, 'storeBranch']);
        Route::get('/company/departments', [CompanyController::class, 'indexDepartments']);
        Route::post('/company/departments', [CompanyController::class, 'storeDepartment']);

        // Projects
        Route::apiResource('projects', ProjectController::class);
        Route::post('projects/{project}/milestones', [ProjectController::class, 'addMilestone']);
        Route::post('projects/{project}/risks', [ProjectController::class, 'addRisk']);

        // Land & Subdivision
        Route::apiResource('lands', LandController::class);
        Route::post('lands/{land}/subdivide', [LandController::class, 'subdivide']);
        Route::post('blocks/{block}/lots', [LandController::class, 'addLot']);

        // Houses
        Route::get('house-types', [HouseController::class, 'indexHouseTypes']);
        Route::post('house-types', [HouseController::class, 'storeHouseType']);
        Route::apiResource('houses', HouseController::class);

        // Construction Stage-based progress
        Route::put('construction/stages/{stage}/progress', [ConstructionController::class, 'updateStageProgress']);
        Route::post('construction/stages/{stage}/workers', [ConstructionController::class, 'assignWorkers']);
        Route::post('construction/stages/{stage}/materials', [ConstructionController::class, 'logMaterials']);
        Route::post('construction/stages/{stage}/media', [ConstructionController::class, 'uploadMedia']);
        Route::post('construction/stages/{stage}/inspections', [ConstructionController::class, 'addInspection']);

        // Workforce
        Route::get('workforce/employees', [WorkforceController::class, 'indexEmployees']);
        Route::post('workforce/employees', [WorkforceController::class, 'storeEmployee']);
        Route::put('workforce/employees/{employee}', [WorkforceController::class, 'updateEmployee']);
        Route::delete('workforce/employees/{employee}', [WorkforceController::class, 'destroyEmployee']);
        Route::get('workforce/contractors', [WorkforceController::class, 'indexContractors']);
        Route::post('workforce/contractors', [WorkforceController::class, 'storeContractor']);
        Route::post('workforce/attendance', [WorkforceController::class, 'logAttendance']);
        Route::post('workforce/daily-reports', [WorkforceController::class, 'submitDailyReport']);
        Route::get('workforce/skills', [WorkforceController::class, 'indexSkills']);
        Route::post('workforce/skills', [WorkforceController::class, 'storeSkill']);

        // Equipment
        Route::get('equipment', [EquipmentController::class, 'index']);
        Route::post('equipment', [EquipmentController::class, 'store']);
        Route::post('equipment/assign', [EquipmentController::class, 'assignEquipment']);
        Route::post('equipment/fuel', [EquipmentController::class, 'logFuel']);
        Route::post('equipment/maintenance', [EquipmentController::class, 'recordMaintenance']);

        // Warehouse
        Route::get('warehouse/materials', [WarehouseController::class, 'indexMaterials']);
        Route::post('warehouse/materials', [WarehouseController::class, 'storeMaterial']);
        Route::post('warehouse/stock-movements', [WarehouseController::class, 'recordMovement']);

        // Procurement
        Route::get('procurement/suppliers', [ProcurementController::class, 'indexSuppliers']);
        Route::post('procurement/suppliers', [ProcurementController::class, 'storeSupplier']);
        Route::get('procurement/purchase-orders', [ProcurementController::class, 'indexPurchaseOrders']);
        Route::post('procurement/purchase-orders', [ProcurementController::class, 'storePurchaseOrder']);
        Route::post('procurement/goods-receipts', [ProcurementController::class, 'recordGoodsReceipt']);
        Route::get('procurement/rfqs', [ProcurementController::class, 'indexRfqs']);
        Route::post('procurement/rfqs', [ProcurementController::class, 'storeRfq']);
        Route::post('procurement/rfqs/responses', [ProcurementController::class, 'storeRfqResponse']);

        // Financial
        Route::get('financial/budgets', [FinancialController::class, 'indexBudgets']);
        Route::post('financial/budgets', [FinancialController::class, 'storeBudget']);
        Route::get('financial/expenses', [FinancialController::class, 'indexExpenses']);
        Route::post('financial/expenses', [FinancialController::class, 'storeExpense']);
        Route::post('financial/invoices', [FinancialController::class, 'storeInvoice']);
        Route::post('financial/payments', [FinancialController::class, 'storePayment']);

        // Sales
        Route::get('sales/leads', [SalesController::class, 'indexLeads']);
        Route::post('sales/leads', [SalesController::class, 'storeLead']);
        Route::post('sales/quotations', [SalesController::class, 'storeQuotation']);
        Route::post('sales/reservations', [SalesController::class, 'storeReservation']);
        Route::post('sales/bookings', [SalesController::class, 'storeBooking']);
        Route::get('sales/contracts', [SalesController::class, 'indexContracts']);
        Route::post('sales/contracts', [SalesController::class, 'storeContract']);
        Route::put('sales/contracts/{contract}', [SalesController::class, 'updateContract']);
        Route::delete('sales/contracts/{contract}', [SalesController::class, 'destroyContract']);
        Route::post('sales/commissions', [SalesController::class, 'storeCommission']);

        // Customers
        Route::get('customers', [CustomerController::class, 'index']);
        Route::post('customers', [CustomerController::class, 'store']);
        Route::get('customers/{customer}', [CustomerController::class, 'show']);
        Route::put('customers/{customer}', [CustomerController::class, 'update']);
        Route::delete('customers/{customer}', [CustomerController::class, 'destroy']);
        Route::post('customers/{customer}/family', [CustomerController::class, 'addFamilyMember']);
        Route::post('customers/payment-plans', [CustomerController::class, 'storePaymentPlan']);
        Route::post('customers/installments', [CustomerController::class, 'logInstallment']);

        // Warranty & Maintenance
        Route::get('warranties', [WarrantyController::class, 'index']);
        Route::post('warranties', [WarrantyController::class, 'store']);
        Route::post('warranties/maintenance-requests', [WarrantyController::class, 'submitMaintenanceRequest']);
        Route::post('warranties/repair-records', [WarrantyController::class, 'logRepairRecord']);

        // Documents
        Route::get('documents', [DocumentController::class, 'index']);
        Route::post('documents', [DocumentController::class, 'store']);
        Route::get('documents/{document}/download', [DocumentController::class, 'download']);

        // Reports
        Route::post('reports/project-summary', [ReportController::class, 'projectSummary']);
        Route::post('reports/financial', [ReportController::class, 'financial']);
        Route::post('reports/workforce', [ReportController::class, 'workforce']);

        // Admin Management
        Route::prefix('admin')->group(function () {
            Route::get('dashboard', [AdminDashboardController::class, 'overview']);
            
            Route::apiResource('users', UserController::class);
            Route::apiResource('roles', RoleController::class);
            Route::get('permissions', [RoleController::class, 'permissions']);
            Route::get('audit-logs', [AuditLogController::class, 'index']);
        });
    });

    // --- LIVE FLOOR MAP ---
    Route::get('houses/{house}/floors', [\App\Http\Controllers\Api\V1\HouseController::class, 'floors']);
    Route::get('rooms/{room}', [\App\Http\Controllers\Api\V1\HouseController::class, 'roomDetails']);
    Route::patch('room-stages/{stage}', [\App\Http\Controllers\Api\V1\HouseController::class, 'updateRoomStage']);
});

