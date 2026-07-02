<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Domain\Shared\Models\AuditLog;
use App\Http\Resources\Api\V1\AuditLogResource;

class AuditLogController extends Controller
{
    /**
     * Display a listing of audit logs.
     */
    public function index(Request $request)
    {
        $this->authorize('view_audit_logs');
        
        $logs = AuditLog::orderBy('created_at', 'desc')->paginate(50);
        
        return AuditLogResource::collection($logs);
    }
}
