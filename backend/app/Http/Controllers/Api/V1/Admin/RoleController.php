<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Http\Resources\Api\V1\Admin\RoleResource;
use App\Http\Resources\Api\V1\Admin\PermissionResource;

class RoleController extends Controller
{
    /**
     * Display a listing of roles.
     */
    public function index(Request $request)
    {
        $this->authorize('view_roles');
        
        $roles = Role::with('permissions')->get();
        return RoleResource::collection($roles);
    }

    /**
     * Store a newly created role.
     */
    public function store(Request $request)
    {
        $this->authorize('create_roles');

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles,name',
            'permissions' => 'nullable|array',
            'permissions.*' => 'string|exists:permissions,name',
        ]);

        $role = Role::create(['name' => $validated['name']]);

        if (!empty($validated['permissions'])) {
            $role->syncPermissions($validated['permissions']);
        }

        return response()->json([
            'message' => 'Role created successfully',
            'role' => new RoleResource($role->load('permissions'))
        ], 201);
    }

    /**
     * Display the specified role.
     */
    public function show(Role $role)
    {
        $this->authorize('view_roles');
        
        return new RoleResource($role->load('permissions'));
    }

    /**
     * Update the specified role in storage.
     */
    public function update(Request $request, Role $role)
    {
        $this->authorize('update_roles');

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles,name,' . $role->id,
            'permissions' => 'nullable|array',
            'permissions.*' => 'string|exists:permissions,name',
        ]);

        $role->update(['name' => $validated['name']]);

        if (isset($validated['permissions'])) {
            $role->syncPermissions($validated['permissions']);
        }

        return response()->json([
            'message' => 'Role updated successfully',
            'role' => new RoleResource($role->load('permissions'))
        ]);
    }

    /**
     * Remove the specified role from storage.
     */
    public function destroy(Role $role)
    {
        $this->authorize('delete_roles');

        if ($role->name === 'admin' || $role->name === 'super-admin') {
            return response()->json(['message' => 'Cannot delete system roles.'], 403);
        }

        $role->delete();

        return response()->json(['message' => 'Role deleted successfully']);
    }

    /**
     * Get all available permissions.
     */
    public function permissions(Request $request)
    {
        $this->authorize('view_roles'); // Generally tied to role management
        
        $permissions = Permission::all();
        return PermissionResource::collection($permissions);
    }
}
