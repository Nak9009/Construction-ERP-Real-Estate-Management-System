<?php

namespace App\Domain\Shared\Models;

use Spatie\Permission\Models\Permission as SpatiePermission;
use App\Domain\Shared\Traits\HasUuid;

class Permission extends SpatiePermission
{
    use HasUuid;

    // Indicate that the primary key is a UUID string and not incrementing
    public $incrementing = false;
    protected $keyType = 'string';
}
