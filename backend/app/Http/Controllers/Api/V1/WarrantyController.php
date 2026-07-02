<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Domain\Warranty\Models\Warranty;
use App\Domain\Warranty\Models\MaintenanceRequest;
use App\Domain\Warranty\Models\RepairRecord;
use App\Http\Resources\Api\V1\WarrantyResource;
use App\Http\Resources\Api\V1\MaintenanceRequestResource;
use App\Http\Resources\Api\V1\RepairRecordResource;

class WarrantyController extends Controller
{
    /**
     * Display a listing of warranties.
     */
    public function index(Request $request)
    {
        $this->authorize('view_warranties');
        
        $warranties = Warranty::orderBy('created_at', 'desc')->get();
        return WarrantyResource::collection($warranties);
    }

    /**
     * Store a newly created warranty.
     */
    public function store(Request $request)
    {
        $this->authorize('create_warranties');

        $validated = $request->validate([
            'house_id' => 'required|uuid|exists:houses,id',
            'customer_id' => 'required|uuid|exists:customers,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'terms' => 'nullable|string',
            'status' => 'nullable|string|in:active,expired,voided',
        ]);

        $warranty = Warranty::create($validated);

        return response()->json([
            'message' => 'Warranty created successfully',
            'warranty' => new WarrantyResource($warranty)
        ], 201);
    }

    /**
     * Submit a maintenance request.
     */
    public function submitMaintenanceRequest(Request $request)
    {
        $this->authorize('manage_maintenance_requests');

        $validated = $request->validate([
            'warranty_id' => 'nullable|uuid|exists:warranties,id',
            'customer_id' => 'required|uuid|exists:customers,id',
            'house_id' => 'required|uuid|exists:houses,id',
            'issue_description' => 'required|string',
            'reported_date' => 'required|date',
            'status' => 'nullable|string|in:pending,assigned,in_progress,resolved,closed',
            'priority' => 'nullable|string|in:low,medium,high,urgent',
        ]);

        $maintenanceRequest = MaintenanceRequest::create($validated);

        return response()->json([
            'message' => 'Maintenance request submitted successfully',
            'maintenance_request' => new MaintenanceRequestResource($maintenanceRequest)
        ], 201);
    }

    /**
     * Log a repair record.
     */
    public function logRepairRecord(Request $request)
    {
        $this->authorize('manage_repair_records');

        $validated = $request->validate([
            'maintenance_request_id' => 'required|uuid|exists:maintenance_requests,id',
            'contractor_id' => 'nullable|uuid|exists:contractors,id',
            'employee_id' => 'nullable|uuid|exists:employees,id',
            'repair_date' => 'required|date',
            'description' => 'required|string',
            'cost' => 'nullable|numeric|min:0',
            'resolution_status' => 'nullable|string|in:fixed,pending_parts,unresolved',
        ]);

        $record = RepairRecord::create($validated);

        return response()->json([
            'message' => 'Repair record logged successfully',
            'repair_record' => new RepairRecordResource($record)
        ], 201);
    }
}
