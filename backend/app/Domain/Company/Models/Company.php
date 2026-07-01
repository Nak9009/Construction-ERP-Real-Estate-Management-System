<?php

namespace App\Domain\Company\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Domain\Shared\Traits\HasUuid;
use App\Domain\Shared\Traits\HasAuditLog;
use App\Domain\Company\Enums\CompanyStatus;

class Company extends Model
{
    use HasUuid, SoftDeletes, HasAuditLog;

    protected $fillable = [
        'name',
        'logo',
        'address',
        'settings',
        'status',
    ];

    protected $casts = [
        'settings' => 'array',
        'status' => CompanyStatus::class,
    ];

    public function branches()
    {
        return $this->hasMany(Branch::class);
    }

    public function departments()
    {
        return $this->hasMany(Department::class);
    }

    public function users()
    {
        return $this->hasMany(\App\Models\User::class);
    }

    public function projects()
    {
        return $this->hasMany(\App\Domain\Project\Models\Project::class);
    }
}
