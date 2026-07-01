<?php

namespace App\Domain\Land\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Domain\Shared\Traits\HasUuid;
use App\Domain\Shared\Traits\HasAuditLog;

class Land extends Model
{
    use HasUuid, SoftDeletes, HasAuditLog;

    protected $fillable = [
        'project_id',
        'owner_name',
        'purchase_price',
        'title_number',
        'lat',
        'lng',
        'polygon',
        'area_sqm',
    ];

    protected $casts = [
        'polygon' => 'array',
        'purchase_price' => 'decimal:2',
        'area_sqm' => 'decimal:2',
    ];

    public function project()
    {
        return $this->belongsTo(\App\Domain\Project\Models\Project::class);
    }

    public function blocks()
    {
        return $this->hasMany(Block::class);
    }
}
