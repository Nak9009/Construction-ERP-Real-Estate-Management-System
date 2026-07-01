<?php

namespace App\Domain\Shared\Traits;

use App\Domain\Shared\Models\AuditLog;

trait HasAuditLog
{
    protected static function bootHasAuditLog(): void
    {
        static::created(function ($model) {
            static::logAudit($model, 'created');
        });

        static::updated(function ($model) {
            static::logAudit($model, 'updated', $model->getOriginal(), $model->getAttributes());
        });

        static::deleted(function ($model) {
            static::logAudit($model, 'deleted');
        });
    }

    protected static function logAudit($model, string $event, array $oldValues = [], array $newValues = []): void
    {
        if (!auth()->check()) {
            return;
        }

        AuditLog::create([
            'company_id' => $model->company_id ?? auth()->user()->company_id ?? null,
            'user_id' => auth()->id(),
            'auditable_type' => get_class($model),
            'auditable_id' => $model->getKey(),
            'event' => $event,
            'old_values' => $event === 'updated' ? json_encode(array_diff_assoc($oldValues, $newValues)) : null,
            'new_values' => $event === 'updated' ? json_encode(array_diff_assoc($newValues, $oldValues)) : null,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }
}
