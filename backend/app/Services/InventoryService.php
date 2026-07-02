<?php

namespace App\Services;

use App\Domain\Construction\Models\ConstructionStage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class InventoryService
{
    /**
     * Process material usage for a construction stage.
     * Deducts inventory, creates a stock transaction, and checks for low stock.
     */
    public function processMaterialUsage(ConstructionStage $stage, $stageMaterial, float $quantityUsed, ?string $movedBy = null)
    {
        DB::transaction(function () use ($stage, $stageMaterial, $quantityUsed, $movedBy) {
            $material = $stageMaterial->material;
            
            if (!$material) {
                Log::warning("Material not found for StageMaterial {$stageMaterial->id}");
                return;
            }

            // Deduct stock
            $material->decrement('current_stock', $quantityUsed);

            // Create stock movement
            $material->stockMovements()->create([
                'type' => 'out',
                'quantity' => $quantityUsed,
                'reference_type' => ConstructionStage::class,
                'reference_id' => $stage->id,
                'moved_by' => $movedBy,
            ]);

            // Check for low stock alert
            $this->checkLowStockAlert($material);
        });
    }

    /**
     * Check if a material falls below its reorder point
     * and trigger an alert if needed.
     */
    protected function checkLowStockAlert($material)
    {
        // Define a generic threshold if not present on the item
        $threshold = $material->low_stock_threshold ?? 50;

        if ($material->current_stock < $threshold) {
            Log::info("LOW STOCK ALERT: Material {$material->id} is at {$material->current_stock}, which is below threshold {$threshold}.");
        }
    }
}
