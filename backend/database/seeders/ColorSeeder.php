<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ColorSeeder extends Seeder
{
    public function run()
    {
        DB::table('moods')->insert([
            ['name' => '楽しい', 'color_code' => '#fbbf24'],
            ['name' => '幸せ', 'color_code' => '#f472b6'],
            ['name' => '穏やか', 'color_code' => '#4ade80'],
            ['name' => '興奮', 'color_code' => '#f97316'],
            ['name' => '悲しい', 'color_code' => '#3b82f6'],
            ['name' => '不安', 'color_code' => '#8b5cf6'],
            ['name' => '怒り', 'color_code' => '#ef4444'],
            ['name' => '退屈', 'color_code' => '#6b7280'],
            ['name' => '希望', 'color_code' => '#06b6d4'],
            ['name' => '愛', 'color_code' => '#ec4899'],
            ['name' => '安心', 'color_code' => '#10b981'],
            ['name' => '感謝', 'color_code' => '#fde047'],
            ['name' => '懐かしい', 'color_code' => '#f59e0b'],
            ['name' => '驚き', 'color_code' => '#0ea5e9'],
            ['name' => '孤独', 'color_code' => '#1e293b'],
        ]);
    }
}