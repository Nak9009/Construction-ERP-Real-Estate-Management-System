<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Domain\Project\Models\Project;
use App\Http\Requests\Api\V1\ProjectStoreRequest;
use App\Http\Requests\Api\V1\ProjectUpdateRequest;
use App\Http\Resources\Api\V1\ProjectResource;

class ProjectController extends Controller
{
    /**
     * Display a listing of projects.
     */
    public function index(Request $request)
    {
        // $this->authorize('view_projects');

        $projects = Project::withCount(['milestones'])
            ->orderBy('created_at', 'desc')
            ->get();

        return ProjectResource::collection($projects);
    }

    /**
     * Store a newly created project.
     */
    public function store(ProjectStoreRequest $request)
    {
        $project = Project::create($request->validated());

        return response()->json([
            'message' => 'Project created successfully',
            'project' => new ProjectResource($project)
        ], 201);
    }

    /**
     * Display the specified project.
     */
    public function show(Project $project)
    {
        // $this->authorize('view_projects');

        return new ProjectResource($project->load(['milestones', 'risks', 'land.blocks.lots']));
    }

    /**
     * Update the specified project.
     */
    public function update(ProjectUpdateRequest $request, Project $project)
    {
        $project->update($request->validated());

        return response()->json([
            'message' => 'Project updated successfully',
            'project' => new ProjectResource($project)
        ]);
    }

    /**
     * Remove the specified project.
     */
    public function destroy(Project $project)
    {
        // $this->authorize('delete_projects');

        $project->delete();

        return response()->json(['message' => 'Project deleted successfully']);
    }

    /**
     * Add a milestone to the project.
     */
    public function addMilestone(Request $request, Project $project)
    {
        // $this->authorize('manage_milestones_projects');

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
        // $this->authorize('manage_risks_projects');

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

