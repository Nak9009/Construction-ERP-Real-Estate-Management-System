<?php

namespace App\Domain\Sales\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Domain\Shared\Traits\HasUuid;
use App\Domain\Shared\Traits\HasAuditLog;

class Quotation extends Model
{
    use HasUuid, SoftDeletes, HasAuditLog;

    protected $fillable = [
        'lead_id',
        'house_id',
        'quoted_price',
        'discount',
        'valid_until',
        'status',
    ];

    protected $casts = [
        'quoted_price' => 'decimal:2',
        'discount' => 'decimal:2',
        'valid_until' => 'date',
    ];

    public function lead()
    {
        return $this->belongsTo(Lead::class);
    }

    public function house()
    {
        return $this->belongsTo(\App\Domain\House\Models\House::class);
    }
}
