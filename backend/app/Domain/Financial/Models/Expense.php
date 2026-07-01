<?php

namespace App\Domain\Financial\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Domain\Shared\Traits\HasUuid;
use App\Domain\Shared\Traits\HasAuditLog;
use App\Domain\Shared\Traits\BelongsToCompany;

class Expense extends Model
{
    use HasUuid, SoftDeletes, HasAuditLog, BelongsToCompany;

    protected $fillable = [
        'company_id',
        'project_id',
        'category',
        'amount',
        'description',
        'receipt_path',
        'approved_by',
        'status',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
    ];

    public function project()
    {
        return $this->belongsTo(\App\Domain\Project\Models\Project::class);
    }

    public function approver()
    {
        return $this->belongsTo(\App\Domain\Workforce\Models\Employee::class, 'approved_by');
    }
}
