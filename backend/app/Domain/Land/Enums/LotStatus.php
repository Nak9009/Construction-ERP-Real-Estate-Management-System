<?php

namespace App\Domain\Land\Enums;

enum LotStatus: string
{
    case AVAILABLE = 'available';
    case RESERVED = 'reserved';
    case SOLD = 'sold';
    case BUILDING = 'building';
    case COMPLETED = 'completed';
}
