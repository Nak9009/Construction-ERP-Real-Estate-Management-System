<?php

namespace App\Domain\Land\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Domain\Shared\Traits\HasUuid;
use App\Domain\Shared\Traits\HasAuditLog;
use App\Domain\Land\Enums\LotStatus;

class Lot extends Model
{
    use HasUuid, SoftDeletes, HasAuditLog;

    protected $fillable = [
        'block_id',
        'lot_number',
        'width',
        'length',
        'area_sqm',
        'lat',
        'lng',
        'status',
        'svg_path',
    ];

    protected $casts = [
        'status' => LotStatus::class,
        'width' => 'decimal:2',
        'length' => 'decimal:2',
        'area_sqm' => 'decimal:2',
    ];

    public function block()
    {
        return $this->belongsTo(Block::class);
    }

    public function house()
    {
        return $this->hasOne(\App\Domain\House\Models\House::class);
    }
}
