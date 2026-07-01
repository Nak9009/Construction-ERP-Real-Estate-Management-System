<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;
use App\Domain\Shared\Traits\HasUuid;
use App\Domain\Shared\Traits\BelongsToCompany;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles, HasUuid, BelongsToCompany;

    protected $fillable = [
        'company_id',
        'name',
        'email',
        'password',
        'phone',
        'avatar',
        'mfa_enabled',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'mfa_enabled' => 'boolean',
        ];
    }

    public function employee()
    {
        return $this->hasOne(\App\Domain\Workforce\Models\Employee::class);
    }

    public function customer()
    {
        return $this->hasOne(\App\Domain\Customer\Models\Customer::class);
    }
}

