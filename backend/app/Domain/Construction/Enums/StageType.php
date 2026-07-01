<?php

namespace App\Domain\Construction\Enums;

enum StageType: string
{
    case PLANNING = 'planning';
    case SITE_PREPARATION = 'site_preparation';
    case EXCAVATION = 'excavation';
    case FOUNDATION = 'foundation';
    case COLUMNS = 'columns';
    case SLAB = 'slab';
    case GROUND_FLOOR = 'ground_floor';
    case UPPER_FLOOR = 'upper_floor';
    case ROOF = 'roof';
    case WALLS = 'walls';
    case DOORS = 'doors';
    case WINDOWS = 'windows';
    case ELECTRICAL = 'electrical';
    case PLUMBING = 'plumbing';
    case CEILING = 'ceiling';
    case PAINTING = 'painting';
    case FLOORING = 'flooring';
    case INTERIOR = 'interior';
    case EXTERIOR = 'exterior';
    case LANDSCAPING = 'landscaping';
    case CLEANING = 'cleaning';
    case INSPECTION = 'inspection';
    case HANDOVER = 'handover';

    public function order(): int
    {
        return match ($this) {
            self::PLANNING => 1,
            self::SITE_PREPARATION => 2,
            self::EXCAVATION => 3,
            self::FOUNDATION => 4,
            self::COLUMNS => 5,
            self::SLAB => 6,
            self::GROUND_FLOOR => 7,
            self::UPPER_FLOOR => 8,
            self::ROOF => 9,
            self::WALLS => 10,
            self::DOORS => 11,
            self::WINDOWS => 12,
            self::ELECTRICAL => 13,
            self::PLUMBING => 14,
            self::CEILING => 15,
            self::PAINTING => 16,
            self::FLOORING => 17,
            self::INTERIOR => 18,
            self::EXTERIOR => 19,
            self::LANDSCAPING => 20,
            self::CLEANING => 21,
            self::INSPECTION => 22,
            self::HANDOVER => 23,
        };
    }

    public function label(): string
    {
        return str_replace('_', ' ', ucfirst($this->value));
    }
}
