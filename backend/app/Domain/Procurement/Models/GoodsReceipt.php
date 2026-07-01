<?php

namespace App\Domain\Procurement\Models;

use Illuminate\Database\Eloquent\Model;
use App\Domain\Shared\Traits\HasUuid;

class GoodsReceipt extends Model
{
    use HasUuid;

    protected $fillable = [
        'purchase_order_id',
        'received_by',
        'received_at',
        'notes',
    ];

    protected $casts = [
        'received_at' => 'datetime',
    ];

    public function purchaseOrder()
    {
        return $this->belongsTo(PurchaseOrder::class);
    }

    public function receiver()
    {
        return $this->belongsTo(\App\Domain\Workforce\Models\Employee::class, 'received_by');
    }
}
