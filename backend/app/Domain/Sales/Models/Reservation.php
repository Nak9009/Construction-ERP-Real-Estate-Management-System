<?php

namespace App\Domain\Sales\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Domain\Shared\Traits\HasUuid;
use App\Domain\Shared\Traits\HasAuditLog;

class Reservation extends Model
{
    use HasUuid, SoftDeletes, HasAuditLog;

    protected $fillable = [
        'house_id',
        'customer_id',
        'reserved_at',
        'deposit_amount',
        'expires_at',
        'status',
    ];

    protected $casts = [
        'reserved_at' => 'datetime',
        'deposit_amount' => 'decimal:2',
        'expires_at' => 'datetime',
    ];

    public function house()
    {
        return $this->belongsTo(\App\Domain\House\Models\House::class);
    }

    public function customer()
    {
        return $this->belongsTo(\App\Domain\Customer\Models\Customer::class);
    }

    public function booking()
    {
        return $this->hasOne(Booking::class);
    }
}
