<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    public function run(): void
    {
        $mainServiceData = [
            ['name' => 'غسيل خارجي', 'description' => 'غسيل خارجي شامل للسيارة بالماء والصابون الخاص', 'price' => 40, 'category' => 'main', 'is_active' => true],
            ['name' => 'غسيل داخلي', 'description' => 'تنظيف داخلي شامل للمقاعد والأرضيات والتابلوه', 'price' => 50, 'category' => 'main', 'is_active' => true],
            ['name' => 'غسيل شامل', 'description' => 'غسيل داخلي + خارجي كامل بأعلى جودة', 'price' => 80, 'category' => 'main', 'is_active' => true],
        ];

        $extraServiceData = [
            ['name' => 'تلميع السيارة', 'description' => 'تلميع احترافي للهيكل الخارجي', 'price' => 100, 'category' => 'extra', 'is_active' => true],
            ['name' => 'تنظيف المحرك', 'description' => 'تنظيف المحرك بمواد خاصة آمنة', 'price' => 60, 'category' => 'extra', 'is_active' => true],
            ['name' => 'تشميع', 'description' => 'طبقة تشميع حماية للطلاء', 'price' => 80, 'category' => 'extra', 'is_active' => true],
            ['name' => 'تعطير داخلي', 'description' => 'تعطير داخلي برائحة فاخرة', 'price' => 25, 'category' => 'extra', 'is_active' => true],
        ];

        foreach (array_merge($mainServiceData, $extraServiceData) as $data) {
            Service::create($data);
        }
    }
}
