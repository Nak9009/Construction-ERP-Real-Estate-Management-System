<?php

namespace App\Domain\Financial\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Domain\Shared\Traits\HasUuid;
use App\Domain\Shared\Traits\HasAuditLog;

class Budget extends Model
{
    use HasUuid, SoftDeletes, HasAuditLog;

    protected $fillable = [
        'project_id',
        'category',
        'planned_amount',
        'actual_amount',
        'fiscal_year',
    ];

    protected $casts = [
        'planned_amount' => 'decimal:2',
        'actual_amount' => 'decimal:2',
        'fiscal_year' => 'integer',
    ];

    public function project()
    {
        return $this->belongsTo(\App\Domain\Project\Models\Project::class);
    }
}
