<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Domain\Company\Models\Branch;
use App\Domain\Company\Models\Department;
use App\Http\Resources\Api\V1\BranchResource;
use App\Http\Resources\Api\V1\DepartmentResource;

class CompanyController extends Controller
{
    /**
     * Get the company details.
     */
    public function show(Request $request)
    {
        $company = $request->user()->company;

        if (!$company) {
            return response()->json(['message' => 'No active tenant context'], 404);
        }

        return response()->json([
            'company' => $company->load(['branches', 'departments'])
        ]);
    }

    /**
     * Update the company details.
     */
    public function update(Request $request)
    {
        $company = $request->user()->company;

        if (!$company) {
            return response()->json(['message' => 'No active tenant context'], 404);
        }

        $this->authorize('update_companies');

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'nullable|string|max:500',
            'logo' => 'nullable|string',
            'settings' => 'nullable|array',
        ]);

        $company->update($validated);

        return response()->json([
            'message' => 'Company updated successfully',
            'company' => $company
        ]);
    }

    /**
     * Display a listing of branches.
     */
    public function indexBranches(Request $request)
    {
        $this->authorize('view_companies');
        
        $branches = Branch::where('company_id', $request->user()->company_id)->get();
        return BranchResource::collection($branches);
    }

    /**
     * Store a newly created branch.
     */
    public function storeBranch(Request $request)
    {
        $this->authorize('update_companies');

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'nullable|string',
            'phone' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
        ]);

        $validated['company_id'] = $request->user()->company_id;

        $branch = Branch::create($validated);

        return response()->json([
            'message' => 'Branch created successfully',
            'branch' => new BranchResource($branch)
        ], 201);
    }

    /**
     * Display a listing of departments.
     */
    public function indexDepartments(Request $request)
    {
        $this->authorize('view_companies');
        
        $departments = Department::where('company_id', $request->user()->company_id)->get();
        return DepartmentResource::collection($departments);
    }

    /**
     * Store a newly created department.
     */
    public function storeDepartment(Request $request)
    {
        $this->authorize('update_companies');

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'manager_id' => 'nullable|uuid|exists:users,id',
        ]);

        $validated['company_id'] = $request->user()->company_id;

        $department = Department::create($validated);

        return response()->json([
            'message' => 'Department created successfully',
            'department' => new DepartmentResource($department)
        ], 201);
    }
}
