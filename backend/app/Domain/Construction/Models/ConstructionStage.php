<?php

namespace App\Domain\Construction\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Domain\Shared\Traits\HasUuid;
use App\Domain\Shared\Traits\HasAuditLog;
use App\Domain\Construction\Enums\StageType;
use App\Domain\Construction\Enums\StageStatus;

class ConstructionStage extends Model
{
    use HasUuid, SoftDeletes, HasAuditLog;

    protected $fillable = [
        'house_id',
        'stage_type',
        'status',
        'progress_pct',
        'start_date',
        'end_date',
        'engineer_id',
        'contractor_id',
        'cost',
        'notes',
    ];

    protected $casts = [
        'stage_type' => StageType::class,
        'status' => StageStatus::class,
        'progress_pct' => 'decimal:2',
        'start_date' => 'date',
        'end_date' => 'date',
        'cost' => 'decimal:2',
    ];

    public function house()
    {
        return $this->belongsTo(\App\Domain\House\Models\House::class);
    }

    public function engineer()
    {
        return $this->belongsTo(\App\Domain\Workforce\Models\Employee::class, 'engineer_id');
    }

    public function contractor()
    {
        return $this->belongsTo(\App\Domain\Workforce\Models\Contractor::class, 'contractor_id');
    }

    public function workers()
    {
        return $this->hasMany(StageWorker::class, 'stage_id');
    }

    public function materials()
    {
        return $this->hasMany(StageMaterial::class, 'stage_id');
    }

    public function media()
    {
        return $this->hasMany(StageMedia::class, 'stage_id');
    }

    public function inspections()
    {
        return $this->hasMany(Inspection::class, 'stage_id');
    }
}
