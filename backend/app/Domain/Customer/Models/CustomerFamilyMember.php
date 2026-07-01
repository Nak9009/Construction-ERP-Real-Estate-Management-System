<?php

namespace App\Domain\Customer\Models;

use Illuminate\Database\Eloquent\Model;
use App\Domain\Shared\Traits\HasUuid;

class CustomerFamilyMember extends Model
{
    use HasUuid;

    protected $fillable = [
        'customer_id',
        'name',
        'relationship',
        'phone',
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }
}
