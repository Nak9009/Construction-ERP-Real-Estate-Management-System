<?php

namespace App\Domain\House\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Domain\Shared\Traits\HasUuid;

class Room extends Model
{
    use HasUuid, SoftDeletes;

    protected $fillable = [
        'floor_id',
        'name',
        'svg_path',
        'status',
        'progress_pct',
    ];

    protected $casts = [
        'progress_pct' => 'decimal:2',
    ];

    public function floor()
    {
        return $this->belongsTo(Floor::class);
    }

    public function stages()
    {
        return $this->hasMany(RoomStage::class);
    }
}
