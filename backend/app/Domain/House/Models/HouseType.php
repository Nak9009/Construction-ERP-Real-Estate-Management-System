<?php

namespace App\Domain\House\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Domain\Shared\Traits\HasUuid;
use App\Domain\Shared\Traits\HasAuditLog;
use App\Domain\Shared\Traits\BelongsToCompany;

class HouseType extends Model
{
    use HasUuid, SoftDeletes, HasAuditLog, BelongsToCompany;

    protected $fillable = [
        'company_id',
        'name',
        'bedrooms',
        'bathrooms',
        'floors',
        'has_kitchen',
        'has_parking',
        'has_garden',
        'has_pool',
        'base_price',
    ];

    protected $casts = [
        'bedrooms' => 'integer',
        'bathrooms' => 'integer',
        'floors' => 'integer',
        'has_kitchen' => 'boolean',
        'has_parking' => 'boolean',
        'has_garden' => 'boolean',
        'has_pool' => 'boolean',
        'base_price' => 'decimal:2',
    ];

    public function houses()
    {
        return $this->hasMany(House::class);
    }
}
