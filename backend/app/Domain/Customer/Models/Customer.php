<?php

namespace App\Domain\Customer\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Domain\Shared\Traits\HasUuid;
use App\Domain\Shared\Traits\HasAuditLog;
use App\Domain\Shared\Traits\BelongsToCompany;

class Customer extends Model
{
    use HasUuid, SoftDeletes, HasAuditLog, BelongsToCompany;

    protected $fillable = [
        'company_id',
        'user_id',
        'name',
        'phone',
        'email',
        'address',
        'id_number',
        'id_type',
    ];

    public function user()
    {
        return $this->belongsTo(\App\Models\User::class);
    }

    public function familyMembers()
    {
        return $this->hasMany(CustomerFamilyMember::class);
    }

    public function reservations()
    {
        return $this->hasMany(\App\Domain\Sales\Models\Reservation::class);
    }

    public function warranties()
    {
        return $this->hasMany(\App\Domain\Warranty\Models\Warranty::class);
    }
}
