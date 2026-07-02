<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Spatie\Permission\Models\Role;

class AdminDashboardController extends Controller
{
    /**
     * Get overview metrics for the admin dashboard.
     */
    public function overview(Request $request)
    {
        $this->authorize('view_admin_dashboard');

        // General metrics for the admin
        $totalUsers = User::count();
        $recentUsers = User::where('created_at', '>=', now()->subDays(7))->count();
        $totalRoles = Role::count();

        // If you had activity logs, you could fetch them here

        return response()->json([
            'message' => 'Admin dashboard metrics retrieved successfully',
            'data' => [
                'total_users' => $totalUsers,
                'new_users_this_week' => $recentUsers,
                'total_roles' => $totalRoles,
                'system_health' => 'ok', // Placeholder
            ]
        ]);
    }
}
