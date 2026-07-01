<?php

namespace App\Domain\Sales\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Domain\Shared\Traits\HasUuid;
use App\Domain\Shared\Traits\HasAuditLog;

class Booking extends Model
{
    use HasUuid, SoftDeletes, HasAuditLog;

    protected $fillable = [
        'reservation_id',
        'booking_date',
        'payment_schedule',
        'status',
    ];

    protected $casts = [
        'booking_date' => 'date',
        'payment_schedule' => 'array',
    ];

    public function reservation()
    {
        return $this->belongsTo(Reservation::class);
    }

    public function contract()
    {
        return $this->hasOne(SalesContract::class);
    }
}
