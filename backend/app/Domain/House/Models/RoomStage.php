<?php

namespace App\Domain\House\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Domain\Shared\Traits\HasUuid;

class RoomStage extends Model
{
    use HasUuid, SoftDeletes;

    protected $fillable = [
        'room_id',
        'stage_name',
        'progress_pct',
        'status',
        'start_date',
        'expected_end_date',
    ];

    protected $casts = [
        'progress_pct' => 'decimal:2',
        'start_date' => 'date',
        'expected_end_date' => 'date',
    ];

    public function room()
    {
        return $this->belongsTo(Room::class);
    }
}
