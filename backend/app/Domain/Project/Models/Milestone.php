<?php

namespace App\Domain\Project\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Domain\Shared\Traits\HasUuid;
use App\Domain\Shared\Traits\HasAuditLog;

class Milestone extends Model
{
    use HasUuid, SoftDeletes, HasAuditLog;

    protected $fillable = [
        'project_id',
        'name',
        'target_date',
        'completed_date',
        'status',
    ];

    protected $casts = [
        'target_date' => 'date',
        'completed_date' => 'date',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}
