<?php

namespace App\Domain\Procurement\Models;

use Illuminate\Database\Eloquent\Model;
use App\Domain\Shared\Traits\HasUuid;

class RfqResponse extends Model
{
    use HasUuid;

    protected $fillable = [
        'rfq_id',
        'supplier_id',
        'total_amount',
        'notes',
        'submitted_at',
    ];

    protected $casts = [
        'total_amount' => 'decimal:2',
        'submitted_at' => 'datetime',
    ];

    public function rfq()
    {
        return $this->belongsTo(Rfq::class);
    }

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }
}
