<?php

namespace Database\Seeders;

use App\Models\Booking;
use App\Models\BookingService;
use App\Models\Car;
use App\Models\Service;
use App\Models\User;
use Illuminate\Database\Seeder;

class BookingSeeder extends Seeder
{
    public function run(): void
    {
        $customer1 = User::where('phone', '0511111111')->first();
        $customer2 = User::where('phone', '0522222222')->first();
        $customer3 = User::where('phone', '0533333333')->first();

        $car1 = Car::where('plate_number', 'أ ب د 1234')->first();
        $car3 = Car::where('plate_number', 'ح ط ي 9012')->first();
        $car4 = Car::where('plate_number', 'ك ل م 3456')->first();

        $mainSvc = Service::where('category', 'main')->get();
        $extraSvc = Service::where('category', 'extra')->get();

        $today = date('Y-m-d');
        $twoDaysAgo = date('Y-m-d', strtotime('-2 days'));

        if ($customer1 && $car1 && $mainSvc->count() >= 3 && $extraSvc->count() >= 4) {
            $booking1 = Booking::create([
                'user_id' => $customer1->id,
                'car_id' => $car1->id,
                'status' => 'completed',
                'scheduled_date' => $twoDaysAgo,
                'scheduled_time' => '09:00',
                'address' => 'حي الملقا، شارع الأمير محمد بن سلمان',
                'total_price' => 105,
            ]);

            BookingService::create(['booking_id' => $booking1->id, 'service_id' => $mainSvc[2]->id, 'price' => $mainSvc[2]->price]);
            BookingService::create(['booking_id' => $booking1->id, 'service_id' => $extraSvc[3]->id, 'price' => $extraSvc[3]->price]);
        }

        if ($customer2 && $car3) {
            $booking2 = Booking::create([
                'user_id' => $customer2->id,
                'car_id' => $car3->id,
                'status' => 'confirmed',
                'scheduled_date' => $today,
                'scheduled_time' => '14:00',
                'address' => 'حي الياسمين، طريق الملك فهد',
                'total_price' => 140,
            ]);

            BookingService::create(['booking_id' => $booking2->id, 'service_id' => $mainSvc[2]->id, 'price' => $mainSvc[2]->price]);
            BookingService::create(['booking_id' => $booking2->id, 'service_id' => $extraSvc[1]->id, 'price' => $extraSvc[1]->price]);
        }

        if ($customer3 && $car4) {
            $booking3 = Booking::create([
                'user_id' => $customer3->id,
                'car_id' => $car4->id,
                'status' => 'new',
                'scheduled_date' => $today,
                'scheduled_time' => '16:30',
                'address' => 'حي النرجس، شارع أنس بن مالك',
                'total_price' => 180,
                'notes' => 'السيارة في المواقف الخارجية',
            ]);

            BookingService::create(['booking_id' => $booking3->id, 'service_id' => $mainSvc[2]->id, 'price' => $mainSvc[2]->price]);
            BookingService::create(['booking_id' => $booking3->id, 'service_id' => $extraSvc[0]->id, 'price' => $extraSvc[0]->price]);
        }
    }
}
