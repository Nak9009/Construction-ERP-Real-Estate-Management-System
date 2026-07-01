<?php

namespace App\Domain\Equipment\Models;

use Illuminate\Database\Eloquent\Model;
use App\Domain\Shared\Traits\HasUuid;

class MaintenanceRecord extends Model
{
    use HasUuid;

    protected $fillable = [
        'equipment_id',
        'type',
        'description',
        'cost',
        'date',
        'next_due',
    ];

    protected $casts = [
        'cost' => 'decimal:2',
        'date' => 'date',
        'next_due' => 'date',
    ];

    public function equipment()
    {
        return $this->belongsTo(Equipment::class);
    }
}
