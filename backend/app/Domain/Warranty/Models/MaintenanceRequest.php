<?php

namespace App\Domain\Warranty\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Domain\Shared\Traits\HasUuid;
use App\Domain\Shared\Traits\HasAuditLog;

class MaintenanceRequest extends Model
{
    use HasUuid, SoftDeletes, HasAuditLog;

    protected $fillable = [
        'warranty_id',
        'customer_id',
        'title',
        'description',
        'priority',
        'status',
    ];

    public function warranty()
    {
        return $this->belongsTo(Warranty::class);
    }

    public function customer()
    {
        return $this->belongsTo(\App\Domain\Customer\Models\Customer::class);
    }

    public function repairRecords()
    {
        return $this->hasMany(RepairRecord::class);
    }
}
