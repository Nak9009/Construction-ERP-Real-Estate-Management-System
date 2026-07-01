<?php

namespace App\Domain\Construction\Models;

use Illuminate\Database\Eloquent\Model;
use App\Domain\Shared\Traits\HasUuid;

class StageMedia extends Model
{
    use HasUuid;

    protected $table = 'stage_media';

    protected $fillable = [
        'stage_id',
        'type',
        'path',
        'caption',
        'uploaded_by',
    ];

    public function stage()
    {
        return $this->belongsTo(ConstructionStage::class, 'stage_id');
    }

    public function user()
    {
        return $this->belongsTo(\App\Models\User::class, 'uploaded_by');
    }
}
