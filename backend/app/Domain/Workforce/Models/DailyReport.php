<?php

namespace App\Domain\Workforce\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Domain\Shared\Traits\HasUuid;
use App\Domain\Shared\Traits\HasAuditLog;

class DailyReport extends Model
{
    use HasUuid, SoftDeletes, HasAuditLog;

    protected $fillable = [
        'project_id',
        'reported_by',
        'date',
        'summary',
        'weather',
        'issues',
        'photos',
    ];

    protected $casts = [
        'date' => 'date',
        'photos' => 'array',
    ];

    public function project()
    {
        return $this->belongsTo(\App\Domain\Project\Models\Project::class);
    }

    public function reporter()
    {
        return $this->belongsTo(Employee::class, 'reported_by');
    }
}
