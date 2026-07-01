<?php

namespace App\Domain\Construction\Models;

use Illuminate\Database\Eloquent\Model;
use App\Domain\Shared\Traits\HasUuid;

class StageMaterial extends Model
{
    use HasUuid;

    protected $fillable = [
        'stage_id',
        'material_id',
        'quantity_planned',
        'quantity_used',
        'unit_cost',
    ];

    protected $casts = [
        'quantity_planned' => 'decimal:4',
        'quantity_used' => 'decimal:4',
        'unit_cost' => 'decimal:4',
    ];

    public function stage()
    {
        return $this->belongsTo(ConstructionStage::class, 'stage_id');
    }

    public function material()
    {
        return $this->belongsTo(\App\Domain\Warehouse\Models\Material::class);
    }
}
