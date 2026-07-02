<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Domain\Land\Models\Land;
use App\Domain\Land\Models\Block;
use App\Domain\Land\Models\Lot;
use App\Domain\Land\Enums\LotStatus;
use Illuminate\Validation\Rules\Enum;

class LandController extends Controller
{
    /**
     * Display a list of land assets.
     */
    public function index()
    {
        // $this->authorize('view_lands');
        
        $lands = Land::with(['project'])->get();
        return response()->json(['lands' => $lands]);
    }

    /**
     * Store new land information.
     */
    public function store(Request $request)
    {
        // $this->authorize('create_lands');

        $validated = $request->validate([
            'project_id' => 'nullable|uuid|exists:projects,id',
            'owner_name' => 'nullable|string|max:255',
            'purchase_price' => 'nullable|numeric|min:0',
            'title_number' => 'nullable|string|max:255',
            'lat' => 'nullable|numeric|between:-90,90',
            'lng' => 'nullable|numeric|between:-180,180',
            'polygon' => 'nullable|array',
            'area_sqm' => 'nullable|numeric|min:0',
        ]);

        $land = Land::create($validated);

        return response()->json([
            'message' => 'Land asset created successfully',
            'land' => $land
        ], 201);
    }

    /**
     * Show detailed land subdivision (Blocks and Lots).
     */
    public function show(Land $land)
    {
        // $this->authorize('view_lands');

        return response()->json([
            'land' => $land->load(['blocks.lots', 'project'])
        ]);
    }

    /**
     * Subdivide land into blocks.
     */
    public function subdivide(Request $request, Land $land)
    {
        // $this->authorize('subdivide_lands');

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'total_lots' => 'nullable|integer|min:0',
        ]);

        $block = $land->blocks()->create($validated);

        return response()->json([
            'message' => 'Block created successfully',
            'block' => $block
        ], 201);
    }

    /**
     * Add lots to a block.
     */
    public function addLot(Request $request, Block $block)
    {
        // $this->authorize('create_lots');

        $validated = $request->validate([
            'lot_number' => 'required|string|max:255',
            'width' => 'nullable|numeric|min:0',
            'length' => 'nullable|numeric|min:0',
            'area_sqm' => 'nullable|numeric|min:0',
            'lat' => 'nullable|numeric|between:-90,90',
            'lng' => 'nullable|numeric|between:-180,180',
            'status' => ['nullable', new Enum(LotStatus::class)],
        ]);

        if (empty($validated['area_sqm']) && !empty($validated['width']) && !empty($validated['length'])) {
            $validated['area_sqm'] = $validated['width'] * $validated['length'];
        }

        $lot = $block->lots()->create($validated);

        // Update block total lots count
        $block->increment('total_lots');

        return response()->json([
            'message' => 'Lot created successfully',
            'lot' => $lot
        ], 201);
    }

    /**
     * Update land information.
     */
    public function update(Request $request, Land $land)
    {
        $validated = $request->validate([
            'project_id' => 'sometimes|nullable|uuid|exists:projects,id',
            'owner_name' => 'sometimes|nullable|string|max:255',
            'purchase_price' => 'sometimes|nullable|numeric|min:0',
            'title_number' => 'sometimes|nullable|string|max:255',
            'lat' => 'sometimes|nullable|numeric|between:-90,90',
            'lng' => 'sometimes|nullable|numeric|between:-180,180',
            'polygon' => 'sometimes|nullable|array',
            'area_sqm' => 'sometimes|nullable|numeric|min:0',
        ]);

        $land->update($validated);

        return response()->json([
            'message' => 'Land asset updated successfully',
            'land' => $land
        ]);
    }

    /**
     * Remove the specified land asset.
     */
    public function destroy(Land $land)
    {
        $land->delete();
        return response()->json(null, 204);
    }
}
