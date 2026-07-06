<?php

namespace App\Domain\House\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Domain\Shared\Traits\HasUuid;
use App\Domain\Shared\Traits\HasAuditLog;
use App\Domain\House\Enums\HouseStatus;

class House extends Model
{
    use HasUuid, SoftDeletes, HasAuditLog;

    protected $fillable = [
        'lot_id',
        'house_type_id',
        'house_number',
        'land_cost',
        'construction_cost',
        'selling_price',
        'status',
    ];

    protected $casts = [
        'status' => HouseStatus::class,
        'land_cost' => 'decimal:2',
        'construction_cost' => 'decimal:2',
        'selling_price' => 'decimal:2',
    ];

    public function lot()
    {
        return $this->belongsTo(\App\Domain\Land\Models\Lot::class);
    }

    public function houseType()
    {
        return $this->belongsTo(HouseType::class);
    }

    public function constructionStages()
    {
        return $this->hasMany(\App\Domain\Construction\Models\ConstructionStage::class);
    }

    public function floors()
    {
        return $this->hasMany(Floor::class);
    }

    public function warranty()
    {
        return $this->hasOne(\App\Domain\Warranty\Models\Warranty::class);
    }
}
