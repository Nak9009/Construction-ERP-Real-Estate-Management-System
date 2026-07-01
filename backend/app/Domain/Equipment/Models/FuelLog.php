<?php

namespace App\Domain\Equipment\Models;

use Illuminate\Database\Eloquent\Model;
use App\Domain\Shared\Traits\HasUuid;

class FuelLog extends Model
{
    use HasUuid;

    protected $fillable = [
        'equipment_id',
        'date',
        'liters',
        'cost',
        'odometer',
    ];

    protected $casts = [
        'date' => 'date',
        'liters' => 'decimal:2',
        'cost' => 'decimal:2',
        'odometer' => 'decimal:2',
    ];

    public function equipment()
    {
        return $this->belongsTo(Equipment::class);
    }
}
