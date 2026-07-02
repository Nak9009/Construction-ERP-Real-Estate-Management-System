<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Domain\Equipment\Models\Equipment;
use App\Domain\Equipment\Models\EquipmentAssignment;
use App\Domain\Equipment\Models\FuelLog;
use App\Domain\Equipment\Models\MaintenanceRecord;
use App\Http\Resources\Api\V1\EquipmentResource;
use App\Http\Resources\Api\V1\EquipmentAssignmentResource;
use App\Http\Resources\Api\V1\FuelLogResource;
use App\Http\Resources\Api\V1\MaintenanceRecordResource;

class EquipmentController extends Controller
{
    /**
     * Display a listing of equipment.
     */
    public function index(Request $request)
    {
        $this->authorize('view_equipment');
        
        $equipment = Equipment::orderBy('created_at', 'desc')->get();
        return EquipmentResource::collection($equipment);
    }

    /**
     * Store a newly created equipment.
     */
    public function store(Request $request)
    {
        $this->authorize('create_equipment');

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            'serial_number' => 'nullable|string|max:255',
            'purchase_date' => 'nullable|date',
            'status' => 'nullable|string|in:available,in_use,maintenance,retired',
            'daily_rate' => 'nullable|numeric',
        ]);

        $equipment = Equipment::create($validated);

        return response()->json([
            'message' => 'Equipment created successfully',
            'equipment' => new EquipmentResource($equipment)
        ], 201);
    }

    /**
     * Assign equipment to a project.
     */
    public function assignEquipment(Request $request)
    {
        $this->authorize('manage_equipment_assignments');

        $validated = $request->validate([
            'equipment_id' => 'required|uuid|exists:equipment,id',
            'project_id' => 'required|uuid|exists:projects,id',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'operator_id' => 'nullable|uuid|exists:employees,id',
            'notes' => 'nullable|string',
        ]);

        $assignment = EquipmentAssignment::create($validated);
        
        // Update equipment status
        Equipment::where('id', $validated['equipment_id'])->update(['status' => 'in_use']);

        return response()->json([
            'message' => 'Equipment assigned successfully',
            'assignment' => new EquipmentAssignmentResource($assignment)
        ], 201);
    }

    /**
     * Log fuel usage.
     */
    public function logFuel(Request $request)
    {
        $this->authorize('manage_fuel_logs');

        $validated = $request->validate([
            'equipment_id' => 'required|uuid|exists:equipment,id',
            'date' => 'required|date',
            'liters' => 'required|numeric|min:0',
            'cost' => 'required|numeric|min:0',
            'recorded_by' => 'nullable|uuid|exists:users,id',
            'receipt_photo' => 'nullable|string',
        ]);

        $log = FuelLog::create($validated);

        return response()->json([
            'message' => 'Fuel logged successfully',
            'fuel_log' => new FuelLogResource($log)
        ], 201);
    }

    /**
     * Record maintenance.
     */
    public function recordMaintenance(Request $request)
    {
        $this->authorize('manage_maintenance_records');

        $validated = $request->validate([
            'equipment_id' => 'required|uuid|exists:equipment,id',
            'date' => 'required|date',
            'type' => 'required|string|in:preventive,repair',
            'description' => 'required|string',
            'cost' => 'nullable|numeric|min:0',
            'performed_by' => 'nullable|string|max:255',
            'next_maintenance_date' => 'nullable|date',
        ]);

        $record = MaintenanceRecord::create($validated);

        return response()->json([
            'message' => 'Maintenance recorded successfully',
            'maintenance_record' => new MaintenanceRecordResource($record)
        ], 201);
    }
}
