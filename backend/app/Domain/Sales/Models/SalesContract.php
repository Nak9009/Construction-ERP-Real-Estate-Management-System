<?php

namespace App\Domain\Sales\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Domain\Shared\Traits\HasUuid;
use App\Domain\Shared\Traits\HasAuditLog;

class SalesContract extends Model
{
    use HasUuid, SoftDeletes, HasAuditLog;

    protected $fillable = [
        'booking_id',
        'contract_number',
        'total_amount',
        'signed_at',
        'document_path',
    ];

    protected $casts = [
        'total_amount' => 'decimal:2',
        'signed_at' => 'datetime',
    ];

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }

    public function paymentPlan()
    {
        return $this->hasOne(\App\Domain\Customer\Models\PaymentPlan::class);
    }

    public function commissions()
    {
        return $this->hasMany(Commission::class);
    }
}
