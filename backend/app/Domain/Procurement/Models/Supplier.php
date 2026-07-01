<?php

namespace App\Domain\Procurement\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Domain\Shared\Traits\HasUuid;
use App\Domain\Shared\Traits\HasAuditLog;
use App\Domain\Shared\Traits\BelongsToCompany;

class Supplier extends Model
{
    use HasUuid, SoftDeletes, HasAuditLog, BelongsToCompany;

    protected $fillable = [
        'company_id',
        'name',
        'contact_name',
        'email',
        'phone',
        'address',
        'rating',
        'payment_terms',
    ];

    protected $casts = [
        'rating' => 'decimal:2',
    ];

    public function purchaseOrders()
    {
        return $this->hasMany(PurchaseOrder::class);
    }
}
