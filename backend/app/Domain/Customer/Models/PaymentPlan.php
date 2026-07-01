<?php

namespace App\Domain\Customer\Models;

use Illuminate\Database\Eloquent\Model;
use App\Domain\Shared\Traits\HasUuid;

class PaymentPlan extends Model
{
    use HasUuid;

    protected $fillable = [
        'sales_contract_id',
        'total_amount',
        'down_payment',
        'installment_count',
        'frequency',
    ];

    protected $casts = [
        'total_amount' => 'decimal:2',
        'down_payment' => 'decimal:2',
    ];

    public function contract()
    {
        return $this->belongsTo(\App\Domain\Sales\Models\SalesContract::class, 'sales_contract_id');
    }

    public function installments()
    {
        return $this->hasMany(Installment::class);
    }
}
