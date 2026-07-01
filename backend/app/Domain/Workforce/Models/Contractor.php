<?php

namespace App\Domain\Workforce\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Domain\Shared\Traits\HasUuid;
use App\Domain\Shared\Traits\HasAuditLog;
use App\Domain\Shared\Traits\BelongsToCompany;

class Contractor extends Model
{
    use HasUuid, SoftDeletes, HasAuditLog, BelongsToCompany;

    protected $fillable = [
        'company_id',
        'name',
        'contact_person',
        'email',
        'phone',
        'specialization',
        'license_number',
        'rating',
    ];

    protected $casts = [
        'rating' => 'decimal:2',
    ];

    public function stages()
    {
        return $this->hasMany(\App\Domain\Construction\Models\ConstructionStage::class);
    }
}
