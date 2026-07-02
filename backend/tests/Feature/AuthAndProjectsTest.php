<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Domain\Project\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;

class AuthAndProjectsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Run seeders automatically for feature testing
        $this->seed(\Database\Seeders\RolePermissionSeeder::class);
        $this->seed(\Database\Seeders\DemoCompanySeeder::class);
    }

    /**
     * Test login returns valid response with token.
     */
    public function test_user_can_login_with_correct_credentials()
    {
        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'sokha.chan@pphousing.com',
            'password' => 'Password123!',
        ]);

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'token',
                     'user' => [
                         'id',
                         'name',
                         'email',
                         'company_id',
                         'roles',
                         'permissions',
                     ]
                 ]);
    }

    /**
     * Test guest cannot access projects.
     */
    public function test_guest_cannot_access_projects_index()
    {
        $response = $this->getJson('/api/v1/projects');

        $response->assertStatus(401);
    }

    /**
     * Test authorized employee can list projects.
     */
    public function test_authorized_user_can_list_projects()
    {
        $user = User::where('email', 'sokha.chan@pphousing.com')->first();
        $this->assertNotNull($user);

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/v1/projects');

        $response->assertStatus(200)
                 ->assertJsonCount(1, 'data')
                 ->assertJsonPath('data.0.name', 'Green City Phase 1');
    }
}
