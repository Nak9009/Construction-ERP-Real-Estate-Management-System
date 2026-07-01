<?php

namespace App\Domain\House\Enums;

enum HouseStatus: string
{
    case PLANNED = 'planned';
    case UNDER_CONSTRUCTION = 'under_construction';
    case COMPLETED = 'completed';
    case SOLD = 'sold';
    case RESERVED = 'reserved';
    case AVAILABLE = 'available';
}
