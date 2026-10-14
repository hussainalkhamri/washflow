<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'مدير النظام',
            'phone' => '0500000000',
            'role' => 'admin',
        ]);

        User::create([
            'name' => 'عبدالله محمد',
            'phone' => '0511111111',
            'role' => 'customer',
        ]);

        User::create([
            'name' => 'فهد العتيبي',
            'phone' => '0522222222',
            'role' => 'customer',
        ]);

        User::create([
            'name' => 'سلطان الشمري',
            'phone' => '0533333333',
            'role' => 'customer',
        ]);
    }
}
