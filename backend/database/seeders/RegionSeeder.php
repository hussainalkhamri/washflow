<?php

namespace Database\Seeders;

use App\Models\Region;
use Illuminate\Database\Seeder;

class RegionSeeder extends Seeder
{
    public function run(): void
    {
        $regions = [
            'حي الملقا',
            'حي الياسمين',
            'حي النرجس',
            'حي الصحافة',
            'حي العارض',
            'حي القيروان',
        ];

        foreach ($regions as $region) {
            Region::create([
                'name' => $region,
                'is_active' => true,
            ]);
        }
    }
}
