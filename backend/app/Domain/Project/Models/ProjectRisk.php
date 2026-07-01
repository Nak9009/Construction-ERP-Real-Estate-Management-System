<?php

namespace App\Domain\Project\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Domain\Shared\Traits\HasUuid;
use App\Domain\Shared\Traits\HasAuditLog;

class ProjectRisk extends Model
{
    use HasUuid, SoftDeletes, HasAuditLog;

    protected $fillable = [
        'project_id',
        'title',
        'severity',
        'probability',
        'mitigation',
        'status',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}
