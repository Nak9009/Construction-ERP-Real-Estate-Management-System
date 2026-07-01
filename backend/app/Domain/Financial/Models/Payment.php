<?php

namespace App\Domain\Financial\Models;

use Illuminate\Database\Eloquent\Model;
use App\Domain\Shared\Traits\HasUuid;

class Payment extends Model
{
    use HasUuid;

    protected $fillable = [
        'invoice_id',
        'amount',
        'method',
        'reference',
        'paid_at',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'paid_at' => 'datetime',
    ];

    public function invoice()
    {
        return $this->belongsTo(Invoice::class);
    }
}
