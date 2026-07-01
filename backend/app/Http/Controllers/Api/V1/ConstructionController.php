<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Domain\Construction\Models\ConstructionStage;
use App\Domain\Construction\Models\Inspection;
use App\Domain\Construction\Models\StageMedia;
use App\Domain\Construction\Enums\StageStatus;
use App\Domain\Construction\Enums\InspectionResult;
use Illuminate\Validation\Rules\Enum;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ConstructionController extends Controller
{
    /**
     * Update construction stage progress and status.
     */
    public function updateStageProgress(Request $request, ConstructionStage $stage)
    {
        $this->authorize('update_progress_construction');

        $validated = $request->validate([
            'progress_pct' => 'required|numeric|between:0,100',
            'status' => ['required', new Enum(StageStatus::class)],
            'notes' => 'nullable|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        if ($validated['progress_pct'] == 100.00) {
            $validated['status'] = StageStatus::COMPLETED;
            $validated['end_date'] = $validated['end_date'] ?? now()->toDateString();
        }

        $stage->update($validated);

        return response()->json([
            'message' => 'Stage progress updated successfully',
            'stage' => $stage
        ]);
    }

    /**
     * Assign employees to work on a construction stage.
     */
    public function assignWorkers(Request $request, ConstructionStage $stage)
    {
        $this->authorize('assign_workers_construction');

        $validated = $request->validate([
            'worker_ids' => 'required|array',
            'worker_ids.*' => 'uuid|exists:employees,id',
            'role' => 'nullable|string|max:255',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        $workers = [];
        foreach ($validated['worker_ids'] as $id) {
            $workers[] = $stage->workers()->create([
                'worker_id' => $id,
                'role' => $validated['role'],
                'start_date' => $validated['start_date'] ?? now()->toDateString(),
                'end_date' => $validated['end_date'],
            ]);
        }

        return response()->json([
            'message' => 'Workers assigned to stage successfully',
            'workers' => $workers
        ], 201);
    }

    /**
     * Log material consumption for a stage.
     */
    public function logMaterials(Request $request, ConstructionStage $stage)
    {
        $this->authorize('log_materials_construction');

        $validated = $request->validate([
            'material_id' => 'required|uuid|exists:materials,id',
            'quantity_planned' => 'required|numeric|min:0',
            'quantity_used' => 'nullable|numeric|min:0',
            'unit_cost' => 'nullable|numeric|min:0',
        ]);

        $stageMaterial = $stage->materials()->create($validated);

        // Adjust material stock in warehouse
        if (!empty($validated['quantity_used'])) {
            $material = $stageMaterial->material;
            $material->decrement('current_stock', $validated['quantity_used']);

            // Create stock movement
            $material->stockMovements()->create([
                'type' => 'out',
                'quantity' => $validated['quantity_used'],
                'reference_type' => ConstructionStage::class,
                'reference_id' => $stage->id,
                'moved_by' => $request->user()->employee?->id,
            ]);
        }

        return response()->json([
            'message' => 'Stage material logged successfully',
            'material' => $stageMaterial
        ], 201);
    }

    /**
     * Upload construction progress photos/videos.
     */
    public function uploadMedia(Request $request, ConstructionStage $stage)
    {
        $this->authorize('upload_media_construction');

        $request->validate([
            'file' => 'required|file|mimes:jpeg,png,jpg,gif,mp4,mov|max:20480', // 20MB Max
            'type' => 'nullable|string|in:photo,video',
            'caption' => 'nullable|string|max:255',
        ]);

        $file = $request->file('file');
        $fileName = Str::uuid() . '.' . $file->getClientOriginalExtension();
        
        // Save to public storage disk
        $path = $file->storeAs('construction/stages/' . $stage->id, $fileName, 'public');

        $media = $stage->media()->create([
            'type' => $request->type ?? ($file->getClientOriginalExtension() === 'mp4' || $file->getClientOriginalExtension() === 'mov' ? 'video' : 'photo'),
            'path' => Storage::url($path),
            'caption' => $request->caption,
            'uploaded_by' => $request->user()->id,
        ]);

        return response()->json([
            'message' => 'Media file uploaded successfully',
            'media' => $media
        ], 201);
    }

    /**
     * Log a quality inspection report for the stage.
     */
    public function addInspection(Request $request, ConstructionStage $stage)
    {
        $this->authorize('create_inspections');

        $validated = $request->validate([
            'inspector_id' => 'required|uuid|exists:employees,id',
            'checklist' => 'required|array',
            'result' => ['required', new Enum(InspectionResult::class)],
            'notes' => 'nullable|string',
        ]);

        $inspection = $stage->inspections()->create([
            'inspector_id' => $validated['inspector_id'],
            'checklist' => $validated['checklist'],
            'result' => $validated['result'],
            'notes' => $validated['notes'],
            'inspected_at' => now(),
        ]);

        return response()->json([
            'message' => 'Inspection logged successfully',
            'inspection' => $inspection
        ], 201);
    }
}
