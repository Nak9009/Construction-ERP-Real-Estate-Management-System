<?php

namespace App\Domain\Warranty\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Domain\Shared\Traits\HasUuid;
use App\Domain\Shared\Traits\HasAuditLog;

class Warranty extends Model
{
    use HasUuid, SoftDeletes, HasAuditLog;

    protected $fillable = [
        'house_id',
        'customer_id',
        'start_date',
        'end_date',
        'terms',
        'status',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'terms' => 'array',
    ];

    public function house()
    {
        return $this->belongsTo(\App\Domain\House\Models\House::class);
    }

    public function customer()
    {
        return $this->belongsTo(\App\Domain\Customer\Models\Customer::class);
    }

    public function maintenanceRequests()
    {
        return $this->hasMany(MaintenanceRequest::class);
    }
}
