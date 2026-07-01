<?php

namespace App\Domain\Equipment\Models;

use Illuminate\Database\Eloquent\Model;
use App\Domain\Shared\Traits\HasUuid;

class EquipmentAssignment extends Model
{
    use HasUuid;

    protected $fillable = [
        'equipment_id',
        'project_id',
        'assigned_date',
        'return_date',
    ];

    protected $casts = [
        'assigned_date' => 'date',
        'return_date' => 'date',
    ];

    public function equipment()
    {
        return $this->belongsTo(Equipment::class);
    }

    public function project()
    {
        return $this->belongsTo(\App\Domain\Project\Models\Project::class);
    }
}
