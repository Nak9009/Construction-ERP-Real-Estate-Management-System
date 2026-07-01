<?php

namespace App\Domain\Land\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Domain\Shared\Traits\HasUuid;
use App\Domain\Shared\Traits\HasAuditLog;

class Block extends Model
{
    use HasUuid, SoftDeletes, HasAuditLog;

    protected $fillable = [
        'land_id',
        'name',
        'description',
        'total_lots',
    ];

    public function land()
    {
        return $this->belongsTo(Land::class);
    }

    public function lots()
    {
        return $this->hasMany(Lot::class);
    }
}
