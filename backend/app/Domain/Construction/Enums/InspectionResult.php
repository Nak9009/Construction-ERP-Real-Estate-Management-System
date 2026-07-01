<?php

namespace App\Domain\Construction\Enums;

enum InspectionResult: string
{
    case PASS = 'pass';
    case FAIL = 'fail';
    case CONDITIONAL = 'conditional';
    case PENDING = 'pending';
}
