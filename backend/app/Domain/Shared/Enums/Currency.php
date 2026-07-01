<?php

namespace App\Domain\Shared\Enums;

enum Currency: string
{
    case USD = 'USD';
    case KHR = 'KHR';
    case THB = 'THB';
    case EUR = 'EUR';
    case GBP = 'GBP';
    case CNY = 'CNY';
    case JPY = 'JPY';
    case SGD = 'SGD';
    case AUD = 'AUD';
    case MYR = 'MYR';

    public function symbol(): string
    {
        return match ($this) {
            self::USD => '$',
            self::KHR => '៛',
            self::THB => '฿',
            self::EUR => '€',
            self::GBP => '£',
            self::CNY => '¥',
            self::JPY => '¥',
            self::SGD => 'S$',
            self::AUD => 'A$',
            self::MYR => 'RM',
        };
    }
}
