<?php

namespace App\Domain\House\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Domain\Shared\Traits\HasUuid;

class Floor extends Model
{
    use HasUuid, SoftDeletes;

    protected $fillable = [
        'house_id',
        'name',
        'level',
        'svg_map_data',
    ];

    protected $casts = [
        'svg_map_data' => 'array',
    ];

    public function house()
    {
        return $this->belongsTo(House::class);
    }

    public function rooms()
    {
        return $this->hasMany(Room::class);
    }
}
