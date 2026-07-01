<?php

namespace App\Domain\Warranty\Models;

use Illuminate\Database\Eloquent\Model;
use App\Domain\Shared\Traits\HasUuid;

class RepairRecord extends Model
{
    use HasUuid;

    protected $fillable = [
        'maintenance_request_id',
        'assigned_to',
        'description',
        'cost',
        'completed_at',
    ];

    protected $casts = [
        'cost' => 'decimal:2',
        'completed_at' => 'datetime',
    ];

    public function maintenanceRequest()
    {
        return $this->belongsTo(MaintenanceRequest::class);
    }

    public function technician()
    {
        return $this->belongsTo(\App\Domain\Workforce\Models\Employee::class, 'assigned_to');
    }
}
