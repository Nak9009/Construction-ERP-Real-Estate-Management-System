<?php

namespace App\Domain\Warehouse\Models;

use Illuminate\Database\Eloquent\Model;
use App\Domain\Shared\Traits\HasUuid;

class StockMovement extends Model
{
    use HasUuid;

    protected $fillable = [
        'material_id',
        'project_id',
        'type',
        'quantity',
        'reference_type',
        'reference_id',
        'moved_by',
    ];

    protected $casts = [
        'quantity' => 'decimal:4',
    ];

    public function material()
    {
        return $this->belongsTo(Material::class);
    }

    public function project()
    {
        return $this->belongsTo(\App\Domain\Project\Models\Project::class);
    }

    public function mover()
    {
        return $this->belongsTo(\App\Domain\Workforce\Models\Employee::class, 'moved_by');
    }

    public function reference()
    {
        return $this->morphTo();
    }
}
