<?php

namespace App\Domain\Sales\Models;

use Illuminate\Database\Eloquent\Model;
use App\Domain\Shared\Traits\HasUuid;

class Commission extends Model
{
    use HasUuid;

    protected $fillable = [
        'sales_contract_id',
        'agent_id',
        'amount',
        'percentage',
        'paid_at',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'percentage' => 'decimal:2',
        'paid_at' => 'datetime',
    ];

    public function contract()
    {
        return $this->belongsTo(SalesContract::class, 'sales_contract_id');
    }

    public function agent()
    {
        return $this->belongsTo(\App\Domain\Workforce\Models\Employee::class, 'agent_id');
    }
}
