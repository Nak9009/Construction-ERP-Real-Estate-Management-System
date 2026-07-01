<?php

namespace App\Domain\Construction\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Domain\Shared\Traits\HasUuid;
use App\Domain\Shared\Traits\HasAuditLog;
use App\Domain\Construction\Enums\InspectionResult;

class Inspection extends Model
{
    use HasUuid, SoftDeletes, HasAuditLog;

    protected $fillable = [
        'stage_id',
        'inspector_id',
        'checklist',
        'result',
        'notes',
        'inspected_at',
    ];

    protected $casts = [
        'checklist' => 'array',
        'result' => InspectionResult::class,
        'inspected_at' => 'datetime',
    ];

    public function stage()
    {
        return $this->belongsTo(ConstructionStage::class, 'stage_id');
    }

    public function inspector()
    {
        return $this->belongsTo(\App\Domain\Workforce\Models\Employee::class, 'inspector_id');
    }
}
