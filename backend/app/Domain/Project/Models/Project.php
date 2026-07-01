<?php

namespace App\Domain\Project\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Domain\Shared\Traits\HasUuid;
use App\Domain\Shared\Traits\HasAuditLog;
use App\Domain\Shared\Traits\BelongsToCompany;
use App\Domain\Project\Enums\ProjectStatus;

class Project extends Model
{
    use HasUuid, SoftDeletes, HasAuditLog, BelongsToCompany;

    protected $fillable = [
        'company_id',
        'name',
        'address',
        'lat',
        'lng',
        'budget',
        'start_date',
        'end_date',
        'status',
        'description',
    ];

    protected $casts = [
        'status' => ProjectStatus::class,
        'budget' => 'decimal:2',
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    public function milestones()
    {
        return $this->hasMany(Milestone::class);
    }

    public function risks()
    {
        return $this->hasMany(ProjectRisk::class);
    }

    public function land()
    {
        return $this->hasOne(\App\Domain\Land\Models\Land::class);
    }

    public function budgets()
    {
        return $this->hasMany(\App\Domain\Financial\Models\Budget::class);
    }

    public function expenses()
    {
        return $this->hasMany(\App\Domain\Financial\Models\Expense::class);
    }
}
