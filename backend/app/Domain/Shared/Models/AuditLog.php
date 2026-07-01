<?php

namespace App\Domain\Shared\Models;

use Illuminate\Database\Eloquent\Model;
use App\Domain\Shared\Traits\HasUuid;

class AuditLog extends Model
{
    use HasUuid;

    protected $fillable = [
        'company_id',
        'user_id',
        'auditable_type',
        'auditable_id',
        'event',
        'old_values',
        'new_values',
        'ip_address',
        'user_agent',
    ];

    protected $casts = [
        'old_values' => 'array',
        'new_values' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(\App\Domain\Shared\Models\User::class);
    }

    public function company()
    {
        return $this->belongsTo(\App\Domain\Company\Models\Company::class);
    }

    public function auditable()
    {
        return $this->morphTo();
    }
}
