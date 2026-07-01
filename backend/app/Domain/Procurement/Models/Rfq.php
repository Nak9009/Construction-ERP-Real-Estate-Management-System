<?php

namespace App\Domain\Procurement\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Domain\Shared\Traits\HasUuid;
use App\Domain\Shared\Traits\HasAuditLog;
use App\Domain\Shared\Traits\BelongsToCompany;

class Rfq extends Model
{
    use HasUuid, SoftDeletes, HasAuditLog, BelongsToCompany;

    protected $fillable = [
        'company_id',
        'title',
        'deadline',
        'status',
    ];

    protected $casts = [
        'deadline' => 'date',
    ];

    public function responses()
    {
        return $this->hasMany(RfqResponse::class);
    }
}
