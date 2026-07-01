<?php

namespace App\Domain\Construction\Models;

use Illuminate\Database\Eloquent\Model;
use App\Domain\Shared\Traits\HasUuid;

class StageWorker extends Model
{
    use HasUuid;

    protected $fillable = [
        'stage_id',
        'worker_id',
        'role',
        'start_date',
        'end_date',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    public function stage()
    {
        return $this->belongsTo(ConstructionStage::class, 'stage_id');
    }

    public function worker()
    {
        return $this->belongsTo(\App\Domain\Workforce\Models\Employee::class, 'worker_id');
    }
}
