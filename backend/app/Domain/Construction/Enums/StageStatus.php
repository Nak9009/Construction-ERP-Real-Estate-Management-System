<?php

namespace App\Domain\Construction\Enums;

enum StageStatus: string
{
    case PENDING = 'pending';
    case IN_PROGRESS = 'in_progress';
    case COMPLETED = 'completed';
    case ON_HOLD = 'on_hold';
    case DELAYED = 'delayed';
    case CANCELLED = 'cancelled';
}
