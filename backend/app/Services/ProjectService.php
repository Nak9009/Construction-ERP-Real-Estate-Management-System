<?php

namespace App\Services;

use App\Domain\Project\Models\Project;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ProjectService
{
    /**
     * Track a new expense against a project's budget.
     * Flags the project if actual costs exceed the planned budget.
     */
    public function logProjectExpense(Project $project, float $amount, string $description = '')
    {
        DB::transaction(function () use ($project, $amount, $description) {
            // Log the expense (assuming there's a relationship or table for project expenses)
            // For now, we will just increment the 'actual_cost' on the project
            
            $project->increment('actual_cost', $amount);
            $project->refresh();

            Log::info("Expense of {$amount} logged for Project {$project->name}. ({$description})");

            $this->checkBudgetVariance($project);
        });
    }

    /**
     * Check if a project has exceeded its budget.
     */
    protected function checkBudgetVariance(Project $project)
    {
        $budget = (float) $project->budget;
        $actualCost = (float) $project->actual_cost;

        if ($budget > 0 && $actualCost > $budget) {
            $variance = $actualCost - $budget;
            
            // In a real application, we would fire an event here:
            // event(new ProjectBudgetExceeded($project, $variance));
            
            Log::warning("BUDGET EXCEEDED: Project {$project->name} has exceeded its budget by {$variance}.");
            
            // Optionally, update a status flag on the project
            // $project->update(['status' => 'budget_exceeded']);
        }
    }
}
