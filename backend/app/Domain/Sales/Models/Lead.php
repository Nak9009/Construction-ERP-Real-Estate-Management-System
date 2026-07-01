<?php

namespace App\Domain\Sales\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Domain\Shared\Traits\HasUuid;
use App\Domain\Shared\Traits\HasAuditLog;
use App\Domain\Shared\Traits\BelongsToCompany;

class Lead extends Model
{
    use HasUuid, SoftDeletes, HasAuditLog, BelongsToCompany;

    protected $fillable = [
        'company_id',
        'name',
        'email',
        'phone',
        'source',
        'status',
        'assigned_to',
        'notes',
    ];

    public function agent()
    {
        return $this->belongsTo(\App\Domain\Workforce\Models\Employee::class, 'assigned_to');
    }

    public function quotations()
    {
        return $this->hasMany(Quotation::class);
    }
}
