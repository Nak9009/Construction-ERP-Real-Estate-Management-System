<?php

namespace App\Domain\Shared\Traits;

trait BelongsToCompany
{
    protected static function bootBelongsToCompany(): void
    {
        static::creating(function ($model) {
            if (empty($model->company_id) && auth()->check()) {
                $model->company_id = auth()->user()->company_id;
            }
        });

        // Global scope to filter by company
        static::addGlobalScope('company', function ($query) {
            if (auth()->check() && auth()->user()->company_id) {
                $query->where($query->getModel()->getTable() . '.company_id', auth()->user()->company_id);
            }
        });
    }

    public function company()
    {
        return $this->belongsTo(\App\Domain\Company\Models\Company::class);
    }
}
