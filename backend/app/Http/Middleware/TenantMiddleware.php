<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TenantMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user) {
            if (!$user->company_id) {
                // Super Admin or system level users do not have a company_id scope
                return $next($request);
            }

            $company = $user->company;

            if (!$company) {
                return response()->json([
                    'message' => 'Company not found or invalid tenant context.'
                ], 403);
            }

            // Verify company status
            if ($company->status->value === 'inactive' || $company->status->value === 'suspended') {
                return response()->json([
                    'message' => 'Your company account is currently ' . $company->status->value . '. Please contact support.'
                ], 403);
            }
        }

        return $next($request);
    }
}
