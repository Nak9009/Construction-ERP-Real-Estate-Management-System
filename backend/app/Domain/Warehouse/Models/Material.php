<?php

namespace App\Domain\Warehouse\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Domain\Shared\Traits\HasUuid;
use App\Domain\Shared\Traits\HasAuditLog;
use App\Domain\Shared\Traits\BelongsToCompany;

class Material extends Model
{
    use HasUuid, SoftDeletes, HasAuditLog, BelongsToCompany;

    protected $fillable = [
        'company_id',
        'name',
        'sku',
        'barcode',
        'unit',
        'category',
        'min_stock',
        'current_stock',
    ];

    protected $casts = [
        'min_stock' => 'decimal:4',
        'current_stock' => 'decimal:4',
    ];

    public function stockMovements()
    {
        return $this->hasMany(StockMovement::class);
    }
}
