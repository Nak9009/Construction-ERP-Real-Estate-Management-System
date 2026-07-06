<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Domain\Project\Models\Project;
use App\Domain\House\Models\House;
use App\Domain\Financial\Models\Expense;
use App\Domain\Financial\Models\Budget;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Get aggregated KPIs and chart coordinates for the main admin/director dashboard.
     */
    public function index(Request $request)
    {
        $this->authorize('view_analytics');

        // 1. KPI Widgets
        $activeProjectsCount = Project::where('status', 'in_progress')->count();
        $totalHouses = House::count();
        $completedHouses = House::where('status', 'completed')->count();
        $underConstructionHouses = House::where('status', 'under_construction')->count();
        $delayedProjects = Project::where('status', 'delayed')->count();

        // 2. Financial Metrics
        $totalBudget = Project::sum('budget');
        $totalExpenses = Expense::where('status', 'approved')->sum('amount');
        $budgetUsedPct = $totalBudget > 0 ? round(($totalExpenses / $totalBudget) * 100, 2) : 0;

        // 3. Construction Progress Data (grouped by status)
        $houseStatusStats = House::select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->get();

        // 4. Budget vs Actual Project Chart Data
        $projectBudgetVsActual = Project::select('name', 'budget')
            ->withSum(['expenses' => function ($query) {
                $query->where('status', 'approved');
            }], 'amount')
            ->take(5)
            ->get()
            ->map(function ($proj) {
                return [
                    'name' => $proj->name,
                    'budget' => (float) $proj->budget,
                    'actual' => (float) ($proj->expenses_sum_amount ?? 0),
                ];
            });

        // 5. Monthly Expenses Trend
        $monthlyExpenses = Expense::select(
            DB::raw("DATE_FORMAT(created_at, '%Y-%m') as month"), // MySQL syntax
            DB::raw('sum(amount) as total')
        )
            ->where('status', 'approved')
            ->groupBy('month')
            ->orderBy('month', 'asc')
            ->take(12)
            ->get();

        return response()->json([
            'widgets' => [
                'active_projects' => $activeProjectsCount,
                'total_houses' => $totalHouses,
                'houses_completed' => $completedHouses,
                'houses_under_construction' => $underConstructionHouses,
                'delayed_projects' => $delayedProjects,
                'total_budget' => $totalBudget,
                'total_expenses' => $totalExpenses,
                'budget_used_percentage' => $budgetUsedPct,
            ],
            'charts' => [
                'house_status' => $houseStatusStats,
                'project_budget_vs_actual' => $projectBudgetVsActual,
                'monthly_expenses' => $monthlyExpenses,
            ]
        ]);
    }
}
