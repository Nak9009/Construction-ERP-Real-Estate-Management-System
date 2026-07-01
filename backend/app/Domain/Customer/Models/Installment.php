<?php

namespace App\Domain\Customer\Models;

use Illuminate\Database\Eloquent\Model;
use App\Domain\Shared\Traits\HasUuid;

class Installment extends Model
{
    use HasUuid;

    protected $fillable = [
        'payment_plan_id',
        'installment_number',
        'amount',
        'due_date',
        'paid_at',
        'status',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'due_date' => 'date',
        'paid_at' => 'datetime',
    ];

    public function paymentPlan()
    {
        return $this->belongsTo(PaymentPlan::class);
    }
}
