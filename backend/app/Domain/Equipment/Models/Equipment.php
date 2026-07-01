<?php

namespace App\Domain\Equipment\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Domain\Shared\Traits\HasUuid;
use App\Domain\Shared\Traits\HasAuditLog;
use App\Domain\Shared\Traits\BelongsToCompany;

class Equipment extends Model
{
    use HasUuid, SoftDeletes, HasAuditLog, BelongsToCompany;

    protected $fillable = [
        'company_id',
        'name',
        'type',
        'model',
        'serial_number',
        'purchase_date',
        'status',
    ];

    protected $casts = [
        'purchase_date' => 'date',
    ];

    public function assignments()
    {
        return $this->hasMany(EquipmentAssignment::class);
    }

    public function fuelLogs()
    {
        return $this->hasMany(FuelLog::class);
    }

    public function maintenanceRecords()
    {
        return $this->hasMany(MaintenanceRecord::class);
    }
}
