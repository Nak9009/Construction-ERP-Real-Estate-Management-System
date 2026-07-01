<?php

namespace App\Domain\Shared\Models;

use Spatie\Permission\Models\Role as SpatieRole;
use App\Domain\Shared\Traits\HasUuid;

class Role extends SpatieRole
{
    use HasUuid;

    // Indicate that the primary key is a UUID string and not incrementing
    public $incrementing = false;
    protected $keyType = 'string';
}
