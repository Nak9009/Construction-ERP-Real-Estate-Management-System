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

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {
    // Public/Auth routes
    Route::post('/auth/login', [AuthController::class, 'login']);

    // Authenticated & Tenant-Scoped routes
    Route::middleware(['auth:sanctum', 'tenant'])->group(function () {
        // Auth profile & logout
        Route::get('/auth/profile', [AuthController::class, 'profile']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);

        // Dashboard
        Route::get('/dashboard', [DashboardController::class, 'index']);

        // Company Settings
        Route::get('/company', [CompanyController::class, 'show']);
        Route::put('/company', [CompanyController::class, 'update']);

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
        Route::get('workforce/contractors', [WorkforceController::class, 'indexContractors']);
        Route::post('workforce/contractors', [WorkforceController::class, 'storeContractor']);
        Route::post('workforce/attendance', [WorkforceController::class, 'logAttendance']);
        Route::post('workforce/daily-reports', [WorkforceController::class, 'submitDailyReport']);

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
        Route::post('sales/contracts', [SalesController::class, 'storeContract']);
        Route::post('sales/commissions', [SalesController::class, 'storeCommission']);

        // Customers
        Route::get('customers', [CustomerController::class, 'index']);
        Route::post('customers', [CustomerController::class, 'store']);
        Route::get('customers/{customer}', [CustomerController::class, 'show']);
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
    });
});

