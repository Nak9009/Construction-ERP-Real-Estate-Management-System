<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Domain\Workforce\Models\Employee;
use App\Domain\Workforce\Models\Contractor;
use App\Domain\Workforce\Models\Attendance;
use App\Domain\Workforce\Models\DailyReport;
use App\Http\Resources\Api\V1\EmployeeResource;
use App\Http\Resources\Api\V1\ContractorResource;
use App\Http\Resources\Api\V1\AttendanceResource;
use App\Http\Resources\Api\V1\DailyReportResource;

class WorkforceController extends Controller
{
    /**
     * Display a listing of employees.
     */
    public function indexEmployees(Request $request)
    {
        $this->authorize('view_employees');
        
        $employees = Employee::orderBy('created_at', 'desc')->get();
        return EmployeeResource::collection($employees);
    }

    /**
     * Store a newly created employee.
     */
    public function storeEmployee(Request $request)
    {
        $this->authorize('create_employees');

        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'department_id' => 'nullable|uuid',
            'salary' => 'nullable|numeric',
            'hire_date' => 'nullable|date',
            'status' => 'nullable|string|in:active,inactive,terminated',
        ]);

        $employee = Employee::create($validated);

        return response()->json([
            'message' => 'Employee created successfully',
            'employee' => new EmployeeResource($employee)
        ], 201);
    }

    /**
     * Display a listing of contractors.
     */
    public function indexContractors(Request $request)
    {
        $this->authorize('view_contractors');
        
        $contractors = Contractor::orderBy('created_at', 'desc')->get();
        return ContractorResource::collection($contractors);
    }

    /**
     * Store a newly created contractor.
     */
    public function storeContractor(Request $request)
    {
        $this->authorize('create_contractors');

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'specialty' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'status' => 'nullable|string|in:active,inactive',
        ]);

        $contractor = Contractor::create($validated);

        return response()->json([
            'message' => 'Contractor created successfully',
            'contractor' => new ContractorResource($contractor)
        ], 201);
    }

    /**
     * Log attendance for workers.
     */
    public function logAttendance(Request $request)
    {
        $this->authorize('manage_attendance');

        $validated = $request->validate([
            'employee_id' => 'required|uuid|exists:employees,id',
            'project_id' => 'required|uuid|exists:projects,id',
            'date' => 'required|date',
            'status' => 'required|string|in:present,absent,leave,sick',
            'hours_worked' => 'nullable|numeric',
        ]);

        $attendance = Attendance::create($validated);

        return response()->json([
            'message' => 'Attendance logged successfully',
            'attendance' => new AttendanceResource($attendance)
        ], 201);
    }

    /**
     * Submit a daily report.
     */
    public function submitDailyReport(Request $request)
    {
        $this->authorize('manage_daily_reports');

        $validated = $request->validate([
            'project_id' => 'required|uuid|exists:projects,id',
            'date' => 'required|date',
            'weather_conditions' => 'nullable|string',
            'work_completed' => 'required|string',
            'issues_encountered' => 'nullable|string',
        ]);

        $report = DailyReport::create($validated);

        return response()->json([
            'message' => 'Daily report submitted successfully',
            'report' => new DailyReportResource($report)
        ], 201);
    }
}
