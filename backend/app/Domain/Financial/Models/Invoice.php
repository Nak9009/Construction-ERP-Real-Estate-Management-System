<?php

namespace App\Domain\Financial\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Domain\Shared\Traits\HasUuid;
use App\Domain\Shared\Traits\HasAuditLog;
use App\Domain\Shared\Traits\BelongsToCompany;

class Invoice extends Model
{
    use HasUuid, SoftDeletes, HasAuditLog, BelongsToCompany;

    protected $fillable = [
        'company_id',
        'invoice_number',
        'type',
        'contact_id',
        'contact_type',
        'amount',
        'tax',
        'due_date',
        'status',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'tax' => 'decimal:2',
        'due_date' => 'date',
    ];

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function contact()
    {
        return $this->morphTo();
    }
}
