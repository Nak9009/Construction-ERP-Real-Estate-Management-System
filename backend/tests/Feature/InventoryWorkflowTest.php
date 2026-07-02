<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Domain\Construction\Models\ConstructionStage;
use App\Domain\Construction\Models\StageMaterial;
use App\Domain\Warehouse\Models\Material;
use App\Services\InventoryService;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Schema;

class InventoryWorkflowTest extends TestCase
{
    use RefreshDatabase;

    public function test_logging_material_usage_deducts_inventory_and_logs_movement()
    {
        \Illuminate\Support\Facades\DB::statement('PRAGMA foreign_keys = OFF;');
        // 1. Arrange
        $stage = ConstructionStage::create([
            'id' => Str::uuid(),
            'house_id' => Str::uuid(),
            'stage_type' => 'foundation',
            'status' => 'in_progress',
        ]);

        $inventoryItem = Material::create([
            'id' => Str::uuid(),
            'company_id' => Str::uuid(),
            'name' => 'Cement Bags',
            'current_stock' => 500,
            'unit' => 'bags',
            'unit_price' => 5.50
        ]);

        $stageMaterial = StageMaterial::create([
            'id' => Str::uuid(),
            'stage_id' => $stage->id,
            'material_id' => $inventoryItem->id,
            'quantity_planned' => 100,
            'quantity_used' => 0
        ]);
        
        $stageMaterial->setRelation('material', $inventoryItem);

        $inventoryService = new InventoryService();

        // 2. Act
        $inventoryService->processMaterialUsage($stage, $stageMaterial, 50, null);

        // 3. Assert
        $inventoryItem->refresh();
        $this->assertEquals(450, $inventoryItem->current_stock);

        $this->assertDatabaseHas('stock_movements', [
            'reference_type' => ConstructionStage::class,
            'reference_id' => $stage->id,
            'quantity' => 50,
            'type' => 'out'
        ]);
    }
}
