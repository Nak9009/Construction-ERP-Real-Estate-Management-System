<?php

namespace App\Domain\Workforce\Models;

use Illuminate\Database\Eloquent\Model;
use App\Domain\Shared\Traits\HasUuid;

class Skill extends Model
{
    use HasUuid;

    protected $fillable = [
        'name',
        'category',
    ];

    public function employees()
    {
        return $this->belongsToMany(Employee::class, 'employee_skills')
                    ->withPivot('proficiency_level')
                    ->withTimestamps();
    }
}
