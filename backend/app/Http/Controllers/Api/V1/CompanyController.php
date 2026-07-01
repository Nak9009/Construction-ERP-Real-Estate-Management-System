<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

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
}
