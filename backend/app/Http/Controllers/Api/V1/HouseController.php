<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Domain\House\Models\House;
use App\Domain\House\Models\HouseType;
use App\Domain\House\Enums\HouseStatus;
use Illuminate\Validation\Rules\Enum;

class HouseController extends Controller
{
    /**
     * Display a listing of house types.
     */
    public function indexHouseTypes()
    {
        // $this->authorize('view_houses');

        $types = HouseType::all();
        return response()->json(['house_types' => $types]);
    }

    /**
     * Store new house type details.
     */
    public function storeHouseType(Request $request)
    {
        // $this->authorize('create_houses');

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'bedrooms' => 'required|integer|min:0',
            'bathrooms' => 'required|integer|min:0',
            'floors' => 'required|integer|min:1',
            'has_kitchen' => 'boolean',
            'has_parking' => 'boolean',
            'has_garden' => 'boolean',
            'has_pool' => 'boolean',
            'base_price' => 'nullable|numeric|min:0',
        ]);

        $type = HouseType::create($validated);

        return response()->json([
            'message' => 'House type created successfully',
            'house_type' => $type
        ], 201);
    }

    /**
     * List all houses.
     */
    public function index()
    {
        // $this->authorize('view_houses');

        $houses = House::with(['lot.block.land', 'houseType'])->get();
        return response()->json(['houses' => $houses]);
    }

    /**
     * Create a house.
     */
    public function store(Request $request)
    {
        // $this->authorize('create_houses');

        $validated = $request->validate([
            'lot_id' => 'required|uuid|exists:lots,id',
            'house_type_id' => 'required|uuid|exists:house_types,id',
            'house_number' => 'required|string|max:255',
            'land_cost' => 'nullable|numeric|min:0',
            'construction_cost' => 'nullable|numeric|min:0',
            'selling_price' => 'nullable|numeric|min:0',
            'status' => ['nullable', new Enum(HouseStatus::class)],
        ]);

        $house = House::create($validated);

        // Update lot status to building
        $house->lot->update(['status' => 'building']);

        return response()->json([
            'message' => 'House created successfully',
            'house' => $house
        ], 201);
    }

    /**
     * Display a specific house.
     */
    public function show(House $house)
    {
        // $this->authorize('view_houses');

        return response()->json([
            'house' => $house->load(['lot.block.land', 'houseType', 'constructionStages.engineer', 'constructionStages.contractor'])
        ]);
    }

    /**
     * Update a house detail.
     */
    public function update(Request $request, House $house)
    {
        // $this->authorize('update_houses');

        $validated = $request->validate([
            'house_number' => 'required|string|max:255',
            'land_cost' => 'nullable|numeric|min:0',
            'construction_cost' => 'nullable|numeric|min:0',
            'selling_price' => 'nullable|numeric|min:0',
            'status' => ['required', new Enum(HouseStatus::class)],
        ]);

        $house->update($validated);

        return response()->json([
            'message' => 'House updated successfully',
            'house' => $house
        ]);
    }

    /**
     * Remove the specified house.
     */
    public function destroy(House $house)
    {
        $house->delete();
        return response()->json(null, 204);
    }

    // --- LIVE FLOOR MAP ---
    public function floors(House $house)
    {
        return response()->json([
            'floors' => $house->floors()->with(['rooms.stages'])->get()
        ]);
    }

    public function roomDetails(\App\Domain\House\Models\Room $room)
    {
        return response()->json([
            'room' => $room->load(['stages'])
        ]);
    }

    public function updateRoomStage(Request $request, \App\Domain\House\Models\RoomStage $stage)
    {
        $validated = $request->validate([
            'progress_pct' => 'required|numeric|min:0|max:100',
            'status' => 'required|string|in:completed,in_progress,delayed,not_started',
        ]);

        $stage->update($validated);

        // Broadcast event would go here for WebSocket
        // event(new \App\Events\RoomStageUpdatedEvent($stage));

        return response()->json([
            'message' => 'Stage updated successfully',
            'stage' => $stage
        ]);
    }
}
