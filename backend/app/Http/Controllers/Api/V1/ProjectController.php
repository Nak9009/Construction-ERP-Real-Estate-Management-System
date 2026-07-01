<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Domain\Project\Models\Project;
use App\Domain\Project\Models\Milestone;
use App\Domain\Project\Models\ProjectRisk;
use App\Domain\Project\Enums\ProjectStatus;
use Illuminate\Validation\Rules\Enum;

class ProjectController extends Controller
{
    /**
     * Display a listing of projects.
     */
    public function index(Request $request)
    {
        $this->authorize('view_projects');

        $projects = Project::withCount(['milestones'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['projects' => $projects]);
    }

    /**
     * Store a newly created project.
     */
    public function store(Request $request)
    {
        $this->authorize('create_projects');

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'nullable|string|max:500',
            'lat' => 'nullable|numeric|between:-90,90',
            'lng' => 'nullable|numeric|between:-180,180',
            'budget' => 'nullable|numeric|min:0',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'status' => ['nullable', new Enum(ProjectStatus::class)],
            'description' => 'nullable|string',
        ]);

        $project = Project::create($validated);

        return response()->json([
            'message' => 'Project created successfully',
            'project' => $project
        ], 201);
    }

    /**
     * Display the specified project.
     */
    public function show(Project $project)
    {
        $this->authorize('view_projects');

        return response()->json([
            'project' => $project->load(['milestones', 'risks', 'land.blocks.lots'])
        ]);
    }

    /**
     * Update the specified project.
     */
    public function update(Request $request, Project $project)
    {
        $this->authorize('update_projects');

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'nullable|string|max:500',
            'lat' => 'nullable|numeric|between:-90,90',
            'lng' => 'nullable|numeric|between:-180,180',
            'budget' => 'nullable|numeric|min:0',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'status' => ['required', new Enum(ProjectStatus::class)],
            'description' => 'nullable|string',
        ]);

        $project->update($validated);

        return response()->json([
            'message' => 'Project updated successfully',
            'project' => $project
        ]);
    }

    /**
     * Remove the specified project.
     */
    public function destroy(Project $project)
    {
        $this->authorize('delete_projects');

        $project->delete();

        return response()->json(['message' => 'Project deleted successfully']);
    }

    /**
     * Add a milestone to the project.
     */
    public function addMilestone(Request $request, Project $project)
    {
        $this->authorize('manage_milestones_projects');

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'target_date' => 'nullable|date',
            'status' => 'nullable|string|in:pending,completed,overdue',
        ]);

        $milestone = $project->milestones()->create($validated);

        return response()->json([
            'message' => 'Milestone added successfully',
            'milestone' => $milestone
        ], 201);
    }

    /**
     * Add a risk to the project.
     */
    public function addRisk(Request $request, Project $project)
    {
        $this->authorize('manage_risks_projects');

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'severity' => 'nullable|string|in:low,medium,high,critical',
            'probability' => 'nullable|string|in:low,medium,high',
            'mitigation' => 'nullable|string',
            'status' => 'nullable|string|in:open,mitigated,closed',
        ]);

        $risk = $project->risks()->create($validated);

        return response()->json([
            'message' => 'Project risk logged successfully',
            'risk' => $risk
        ], 201);
    }
}
