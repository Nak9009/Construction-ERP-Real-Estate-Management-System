<?php

namespace App\Domain\Company\Enums;

enum CompanyStatus: string
{
    case ACTIVE = 'active';
    case INACTIVE = 'inactive';
    case SUSPENDED = 'suspended';
    case TRIAL = 'trial';
}
