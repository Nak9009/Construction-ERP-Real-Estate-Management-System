<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LiveFloorMapSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Delete all old floor map data to reset the demo
        \App\Domain\House\Models\RoomStage::query()->delete();
        \App\Domain\House\Models\Room::query()->delete();
        \App\Domain\House\Models\Floor::query()->delete();

        $house = \App\Domain\House\Models\House::first();
        if (!$house) return;

        $floor = \App\Domain\House\Models\Floor::create([
            'house_id' => $house->id,
            'name' => 'Ground Floor',
            'level' => 0,
            'svg_map_data' => [
                'viewBox' => '0 0 800 600',
                'outline_path' => 'M 40 40 L 760 40 L 760 560 L 40 560 Z' // Draw house walls in frontend
            ]
        ]);

        $rooms = [
            [
                'name' => 'Living Room',
                'path' => 'M 50 50 L 400 50 L 400 300 L 50 300 Z', 
                'status' => 'completed',
                'pct' => 100
            ],
            [
                'name' => 'Kitchen',
                'path' => 'M 410 50 L 750 50 L 750 200 L 410 200 Z', 
                'status' => 'in_progress',
                'pct' => 70
            ],
            [
                'name' => 'Dining Area',
                'path' => 'M 410 210 L 750 210 L 750 300 L 410 300 Z', 
                'status' => 'in_progress',
                'pct' => 45
            ],
            [
                'name' => 'Hallway',
                'path' => 'M 50 310 L 750 310 L 750 360 L 50 360 Z', 
                'status' => 'completed',
                'pct' => 100
            ],
            [
                'name' => 'Master Bedroom',
                'path' => 'M 50 370 L 300 370 L 300 550 L 50 550 Z', 
                'status' => 'delayed',
                'pct' => 20
            ],
            [
                'name' => 'Ensuite Bath',
                'path' => 'M 310 370 L 450 370 L 450 450 L 310 450 Z', 
                'status' => 'not_started',
                'pct' => 0
            ],
            [
                'name' => 'Main Bathroom',
                'path' => 'M 310 460 L 450 460 L 450 550 L 310 550 Z', 
                'status' => 'not_started',
                'pct' => 0
            ],
            [
                'name' => 'Bedroom 2',
                'path' => 'M 460 370 L 750 370 L 750 550 L 460 550 Z', 
                'status' => 'not_started',
                'pct' => 0
            ]
        ];

        foreach ($rooms as $roomData) {
            $room = \App\Domain\House\Models\Room::create([
                'floor_id' => $floor->id,
                'name' => $roomData['name'],
                'svg_path' => $roomData['path'],
                'status' => $roomData['status'],
                'progress_pct' => $roomData['pct']
            ]);

            $stages = ['Foundation', 'Walls', 'Electrical', 'Plumbing', 'Painting', 'Finishing'];
            foreach ($stages as $index => $stage) {
                // Mock logic to stagger progress across stages based on the room's total progress
                $stagePct = 0;
                $stageStatus = 'not_started';
                
                $expectedStageProg = ($roomData['pct'] / 100) * 6; // 6 stages total
                if ($expectedStageProg > $index) {
                    $stagePct = min(100, ($expectedStageProg - $index) * 100);
                    $stageStatus = $stagePct == 100 ? 'completed' : ($roomData['status'] === 'delayed' ? 'delayed' : 'in_progress');
                }

                \App\Domain\House\Models\RoomStage::create([
                    'room_id' => $room->id,
                    'stage_name' => $stage,
                    'progress_pct' => $stagePct,
                    'status' => $stageStatus
                ]);
            }
        }
    }
}
