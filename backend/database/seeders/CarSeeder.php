<?php

namespace Database\Seeders;

use App\Models\Car;
use App\Models\User;
use Illuminate\Database\Seeder;

class CarSeeder extends Seeder
{
    public function run(): void
    {
        $customer1 = User::where('phone', '0511111111')->first();
        $customer2 = User::where('phone', '0522222222')->first();
        $customer3 = User::where('phone', '0533333333')->first();

        if ($customer1) {
            Car::create([
                'user_id' => $customer1->id,
                'brand' => 'تويوتا',
                'model' => 'كامري',
                'color' => 'أبيض',
                'plate_number' => 'أ ب د 1234',
                'year' => '2023',
            ]);

            Car::create([
                'user_id' => $customer1->id,
                'brand' => 'لكزس',
                'model' => 'ES350',
                'color' => 'أسود',
                'plate_number' => 'ه و ز 5678',
                'year' => '2024',
            ]);
        }

        if ($customer2) {
            Car::create([
                'user_id' => $customer2->id,
                'brand' => 'هيونداي',
                'model' => 'سوناتا',
                'color' => 'فضي',
                'plate_number' => 'ح ط ي 9012',
                'year' => '2022',
            ]);
        }

        if ($customer3) {
            Car::create([
                'user_id' => $customer3->id,
                'brand' => 'نيسان',
                'model' => 'باترول',
                'color' => 'أبيض',
                'plate_number' => 'ك ل م 3456',
                'year' => '2024',
            ]);
        }
    }
}
