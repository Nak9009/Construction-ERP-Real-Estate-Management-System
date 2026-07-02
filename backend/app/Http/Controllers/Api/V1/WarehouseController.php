<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Domain\Warehouse\Models\Material;
use App\Domain\Warehouse\Models\StockMovement;
use App\Http\Resources\Api\V1\MaterialResource;
use App\Http\Resources\Api\V1\StockMovementResource;

class WarehouseController extends Controller
{
    /**
     * Display a listing of materials.
     */
    public function indexMaterials(Request $request)
    {
        $this->authorize('view_materials');
        
        $materials = Material::orderBy('name', 'asc')->get();
        return MaterialResource::collection($materials);
    }

    /**
     * Store a newly created material.
     */
    public function storeMaterial(Request $request)
    {
        $this->authorize('create_materials');

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'sku' => 'required|string|max:100|unique:materials,sku',
            'category' => 'nullable|string|max:100',
            'unit' => 'required|string|max:50',
            'minimum_stock_level' => 'required|numeric|min:0',
            'current_stock' => 'nullable|numeric|min:0',
            'unit_price' => 'nullable|numeric|min:0',
        ]);

        $material = Material::create($validated);

        return response()->json([
            'message' => 'Material created successfully',
            'material' => new MaterialResource($material)
        ], 201);
    }

    /**
     * Record a stock movement (in, out, adjustment, return).
     */
    public function recordMovement(Request $request)
    {
        $this->authorize('manage_stock_movements');

        $validated = $request->validate([
            'material_id' => 'required|uuid|exists:materials,id',
            'project_id' => 'nullable|uuid|exists:projects,id',
            'type' => 'required|string|in:in,out,adjustment,return',
            'quantity' => 'required|numeric|min:0.01',
            'date' => 'required|date',
            'reference_number' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        $movement = StockMovement::create($validated);
        
        $material = Material::findOrFail($validated['material_id']);
        
        if (in_array($validated['type'], ['in', 'return'])) {
            $material->increment('current_stock', $validated['quantity']);
        } elseif ($validated['type'] === 'out') {
            $material->decrement('current_stock', $validated['quantity']);
        }
        // adjustments are complex, simplified here

        return response()->json([
            'message' => 'Stock movement recorded successfully',
            'movement' => new StockMovementResource($movement)
        ], 201);
    }
}
