<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Domain\Company\Models\Company;
use App\Domain\Company\Models\Branch;
use App\Domain\Company\Models\Department;
use App\Domain\Project\Models\Project;
use App\Domain\Project\Models\Milestone;
use App\Domain\Land\Models\Land;
use App\Domain\Land\Models\Block;
use App\Domain\Land\Models\Lot;
use App\Domain\House\Models\HouseType;
use App\Domain\House\Models\House;
use App\Domain\Construction\Models\ConstructionStage;
use App\Domain\Construction\Enums\StageType;
use App\Domain\Construction\Enums\StageStatus;
use App\Domain\Workforce\Models\Employee;
use App\Domain\Workforce\Models\Contractor;
use App\Domain\Customer\Models\Customer;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DemoCompanySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Create Company
        $company = Company::create([
            'id' => Str::uuid(),
            'name' => 'Phnom Penh Housing Co., Ltd.',
            'logo' => null,
            'address' => 'Veng Sreng Blvd, Phnom Penh, Cambodia',
            'status' => 'active',
            'settings' => [
                'timezone' => 'Asia/Phnom_Penh',
                'currency' => 'USD',
                'language' => 'en',
            ],
        ]);

        // 2. Create HQ Branch
        $branch = Branch::create([
            'id' => Str::uuid(),
            'company_id' => $company->id,
            'name' => 'Phnom Penh Headquarters',
            'address' => 'Veng Sreng Blvd, Phnom Penh, Cambodia',
            'is_hq' => true,
        ]);

        // 3. Create Departments
        $engineeringDept = Department::create([
            'id' => Str::uuid(),
            'company_id' => $company->id,
            'branch_id' => $branch->id,
            'name' => 'Engineering Department',
        ]);

        $salesDept = Department::create([
            'id' => Str::uuid(),
            'company_id' => $company->id,
            'branch_id' => $branch->id,
            'name' => 'Sales & Marketing',
        ]);

        // 4. Create Users and Assign Roles
        $usersData = [
            [
                'name' => 'Super Admin User',
                'email' => 'admin@pphousing.com',
                'role' => 'Super Admin',
                'phone' => '+85512345678',
            ],
            [
                'name' => 'Sokha Chan',
                'email' => 'sokha.chan@pphousing.com',
                'role' => 'Project Manager',
                'phone' => '+855887654321',
            ],
            [
                'name' => 'Dara Vong',
                'email' => 'dara.vong@pphousing.com',
                'role' => 'Site Engineer',
                'phone' => '+85599887766',
            ],
            [
                'name' => 'Borey Kem',
                'email' => 'borey.kem@pphousing.com',
                'role' => 'Sales Agent',
                'phone' => '+85577665544',
            ],
        ];

        $users = [];
        foreach ($usersData as $data) {
            $user = User::create([
                'id' => Str::uuid(),
                'company_id' => $company->id,
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make('Password123!'),
                'phone' => $data['phone'],
                'mfa_enabled' => false,
            ]);

            $user->assignRole($data['role']);
            $users[$data['role']] = $user;
        }

        // Create Employees
        $pmEmployee = Employee::create([
            'id' => Str::uuid(),
            'company_id' => $company->id,
            'user_id' => $users['Project Manager']->id,
            'employee_number' => 'EMP-PP-001',
            'position' => 'Project Manager',
            'department_id' => $engineeringDept->id,
            'hire_date' => '2025-01-10',
            'salary' => 2500.00,
        ]);

        $engineerEmployee = Employee::create([
            'id' => Str::uuid(),
            'company_id' => $company->id,
            'user_id' => $users['Site Engineer']->id,
            'employee_number' => 'EMP-PP-002',
            'position' => 'Site Engineer',
            'department_id' => $engineeringDept->id,
            'hire_date' => '2025-02-15',
            'salary' => 1200.00,
        ]);

        $salesEmployee = Employee::create([
            'id' => Str::uuid(),
            'company_id' => $company->id,
            'user_id' => $users['Sales Agent']->id,
            'employee_number' => 'EMP-PP-003',
            'position' => 'Sales Representative',
            'department_id' => $salesDept->id,
            'hire_date' => '2025-03-01',
            'salary' => 800.00,
        ]);

        // Create Contractor
        $contractor = Contractor::create([
            'id' => Str::uuid(),
            'company_id' => $company->id,
            'name' => 'Meng Long Construction Services Co.',
            'contact_person' => 'Meng Long',
            'email' => 'menglong@menglongcon.com',
            'phone' => '+85511223344',
            'specialization' => 'Foundation and Concrete Structures',
            'license_number' => 'LIC-CON-2025-0998',
            'rating' => 4.80,
        ]);

        // 5. Create Project
        $project = Project::create([
            'id' => Str::uuid(),
            'company_id' => $company->id,
            'name' => 'Green City Phase 1',
            'address' => 'Chroy Changvar District, Phnom Penh, Cambodia',
            'lat' => 11.621453,
            'lng' => 104.931298,
            'budget' => 2500000.00,
            'start_date' => '2026-01-01',
            'end_date' => '2027-12-31',
            'status' => 'in_progress',
            'description' => 'A boutique gated community featuring 120 modern luxury homes, green parks, and high-end security services.',
        ]);

        // Add Project Milestones
        Milestone::create([
            'id' => Str::uuid(),
            'project_id' => $project->id,
            'name' => 'Land Preparation & Excavation',
            'target_date' => '2026-03-01',
            'completed_date' => '2026-03-10',
            'status' => 'completed',
        ]);

        Milestone::create([
            'id' => Str::uuid(),
            'project_id' => $project->id,
            'name' => 'Phase 1 Foundations Complete',
            'target_date' => '2026-07-01',
            'completed_date' => null,
            'status' => 'pending',
        ]);

        // 6. Create Land
        $land = Land::create([
            'id' => Str::uuid(),
            'project_id' => $project->id,
            'owner_name' => 'Chroy Changvar Land Development S.A.',
            'purchase_price' => 1200000.00,
            'title_number' => 'Title No. ChroyChangvar-2025-889A',
            'lat' => 11.621453,
            'lng' => 104.931298,
            'polygon' => [
                ['lat' => 11.623, 'lng' => 104.930],
                ['lat' => 11.623, 'lng' => 104.933],
                ['lat' => 11.620, 'lng' => 104.933],
                ['lat' => 11.620, 'lng' => 104.930],
            ],
            'area_sqm' => 15000.00,
        ]);

        // 7. Create Blocks
        $blockA = Block::create([
            'id' => Str::uuid(),
            'land_id' => $land->id,
            'name' => 'Block A',
            'description' => 'Premium villas along the riverfront',
            'total_lots' => 10,
        ]);

        $blockB = Block::create([
            'id' => Str::uuid(),
            'land_id' => $land->id,
            'name' => 'Block B',
            'description' => 'Link houses and community clubhouse area',
            'total_lots' => 20,
        ]);

        // 8. Create Lots
        $lots = [];
        $lotLocations = [
            ['block_id' => $blockA->id, 'num' => 'A-01', 'width' => 10, 'length' => 20, 'lat' => 11.6221, 'lng' => 104.9311, 'status' => 'sold'],
            ['block_id' => $blockA->id, 'num' => 'A-02', 'width' => 10, 'length' => 20, 'lat' => 11.6222, 'lng' => 104.9312, 'status' => 'reserved'],
            ['block_id' => $blockA->id, 'num' => 'A-03', 'width' => 10, 'length' => 20, 'lat' => 11.6223, 'lng' => 104.9313, 'status' => 'available'],
            ['block_id' => $blockB->id, 'num' => 'B-01', 'width' => 5, 'length' => 15, 'lat' => 11.6211, 'lng' => 104.9321, 'status' => 'sold'],
            ['block_id' => $blockB->id, 'num' => 'B-02', 'width' => 5, 'length' => 15, 'lat' => 11.6212, 'lng' => 104.9322, 'status' => 'available'],
        ];

        foreach ($lotLocations as $loc) {
            $lots[$loc['num']] = Lot::create([
                'id' => Str::uuid(),
                'block_id' => $loc['block_id'],
                'lot_number' => $loc['num'],
                'width' => $loc['width'],
                'length' => $loc['length'],
                'area_sqm' => $loc['width'] * $loc['length'],
                'lat' => $loc['lat'],
                'lng' => $loc['lng'],
                'status' => $loc['status'],
            ]);
        }

        // 9. Create House Types
        $villaType = HouseType::create([
            'id' => Str::uuid(),
            'company_id' => $company->id,
            'name' => 'Twin Villa Royal',
            'bedrooms' => 4,
            'bathrooms' => 5,
            'floors' => 3,
            'has_kitchen' => true,
            'has_parking' => true,
            'has_garden' => true,
            'has_pool' => false,
            'base_price' => 320000.00,
        ]);

        $linkType = HouseType::create([
            'id' => Str::uuid(),
            'company_id' => $company->id,
            'name' => 'Link House Modern',
            'bedrooms' => 3,
            'bathrooms' => 4,
            'floors' => 2,
            'has_kitchen' => true,
            'has_parking' => true,
            'has_garden' => false,
            'has_pool' => false,
            'base_price' => 145000.00,
        ]);

        // 10. Create Houses and Construction Stages
        $housesData = [
            ['lot' => 'A-01', 'type' => $villaType, 'num' => 'Villa-01', 'price' => 315000.00, 'status' => 'sold'],
            ['lot' => 'A-02', 'type' => $villaType, 'num' => 'Villa-02', 'price' => 320000.00, 'status' => 'reserved'],
            ['lot' => 'B-01', 'type' => $linkType, 'num' => 'Link-01', 'price' => 140000.00, 'status' => 'sold'],
        ];

        foreach ($housesData as $hData) {
            $house = House::create([
                'id' => Str::uuid(),
                'lot_id' => $lots[$hData['lot']]->id,
                'house_type_id' => $hData['type']->id,
                'house_number' => $hData['num'],
                'land_cost' => $hData['type'] === $villaType ? 100000.00 : 40000.00,
                'construction_cost' => $hData['type'] === $villaType ? 150000.00 : 70000.00,
                'selling_price' => $hData['price'],
                'status' => $hData['status'],
            ]);

            // Add standard construction stages
            $stages = [
                ['type' => StageType::PLANNING, 'status' => StageStatus::COMPLETED, 'progress' => 100.00, 'cost' => 5000.00],
                ['type' => StageType::SITE_PREPARATION, 'status' => StageStatus::COMPLETED, 'progress' => 100.00, 'cost' => 8000.00],
                ['type' => StageType::EXCAVATION, 'status' => StageStatus::COMPLETED, 'progress' => 100.00, 'cost' => 12000.00],
                ['type' => StageType::FOUNDATION, 'status' => StageStatus::IN_PROGRESS, 'progress' => 45.00, 'cost' => 35000.00],
                ['type' => StageType::COLUMNS, 'status' => StageStatus::PENDING, 'progress' => 0.00, 'cost' => 20000.00],
                ['type' => StageType::ROOF, 'status' => StageStatus::PENDING, 'progress' => 0.00, 'cost' => 40000.00],
            ];

            foreach ($stages as $s) {
                ConstructionStage::create([
                    'id' => Str::uuid(),
                    'house_id' => $house->id,
                    'stage_type' => $s['type'],
                    'status' => $s['status'],
                    'progress_pct' => $s['progress'],
                    'start_date' => $s['status'] !== StageStatus::PENDING ? '2026-02-01' : null,
                    'end_date' => $s['status'] === StageStatus::COMPLETED ? '2026-03-01' : null,
                    'engineer_id' => $engineerEmployee->id,
                    'contractor_id' => $contractor->id,
                    'cost' => $s['cost'],
                    'notes' => "Standard stage setup for {$hData['num']}",
                ]);
            }
        }

        // 11. Create Customer
        $customerUser = User::create([
            'id' => Str::uuid(),
            'company_id' => $company->id,
            'name' => 'Chanthy Meas',
            'email' => 'chanthy.meas@gmail.com',
            'password' => Hash::make('Password123!'),
            'phone' => '+85512999999',
            'mfa_enabled' => false,
        ]);
        $customerUser->assignRole('Customer');

        $customer = Customer::create([
            'id' => Str::uuid(),
            'company_id' => $company->id,
            'user_id' => $customerUser->id,
            'name' => 'Chanthy Meas',
            'phone' => '+85512999999',
            'email' => 'chanthy.meas@gmail.com',
            'address' => 'Building 45, Street 200, Boeung Keng Kang, Phnom Penh',
            'id_number' => '0123456789',
            'id_type' => 'national_id',
        ]);
    }
}
