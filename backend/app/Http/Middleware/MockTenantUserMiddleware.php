<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\User;
use App\Domain\Company\Models\Company;
use Illuminate\Support\Facades\Auth;

class MockTenantUserMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // For local development E2E testing, auto-login the first user
        $user = User::first();
        $company = Company::first();

        if ($user && !Auth::check()) {
            Auth::login($user);
        }

        if ($company) {
            // Set mock tenant
            app()->singleton('tenant_id', fn () => $company->id);
            // mock a generic policy bypass for development
            \Illuminate\Support\Facades\Gate::before(function ($user, $ability) {
                return true; // Grant all permissions
            });
        }

        return $next($request);
    }
}
