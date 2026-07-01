<?php

namespace App\Domain\Workforce\Models;

use Illuminate\Database\Eloquent\Model;
use App\Domain\Shared\Traits\HasUuid;

class Attendance extends Model
{
    use HasUuid;

    protected $fillable = [
        'employee_id',
        'project_id',
        'date',
        'check_in',
        'check_out',
        'hours_worked',
        'status',
    ];

    protected $casts = [
        'date' => 'date',
        'hours_worked' => 'decimal:2',
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function project()
    {
        return $this->belongsTo(\App\Domain\Project\Models\Project::class);
    }
}
