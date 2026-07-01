<?php

namespace App\Domain\Company\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Domain\Shared\Traits\HasUuid;
use App\Domain\Shared\Traits\HasAuditLog;
use App\Domain\Shared\Traits\BelongsToCompany;

class Branch extends Model
{
    use HasUuid, SoftDeletes, HasAuditLog, BelongsToCompany;

    protected $fillable = [
        'company_id',
        'name',
        'address',
        'is_hq',
    ];

    protected $casts = [
        'is_hq' => 'boolean',
    ];

    public function departments()
    {
        return $this->hasMany(Department::class);
    }
}
