<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ShopController extends Controller
{
    public function show(Request $request)
    {
        $apiKey = env('HOTPEPPER_GOURMET_API_KEY');
        $lat = $request->query('lat');
        $lng = $request->query('lng');
        $range = $request->query('range');
        $budget = $request->query('budget');
        $genre = $request->query('genre');

        $shops = [];
        $page = 1; // ページ番号（1ページ目からスタート）
        $maxRequest = 100; //APIの仕様で1回のリクエストで最大100件までしか取得できない

        //取得したデータの数がtotalAvailableより少ない場合、
        //または取得したデータの総数が1000件未満の場合に続行されます。
        do {
            $params = [
                'key' => $apiKey,
                'lat' => $lat,
                'lng' => $lng,
                'range' => $range,
                'format' => 'json',
                'count' => $maxRequest,
                'start' => ($page - 1) * $maxRequest + 1, // 現在のページに基づいて開始位置を計算
            ];

            if ($budget) {
                $params['budget'] = $budget;
            }

            if ($genre) {
                $params['genre'] = $genre;
            }

            $response = Http::get('http://webservice.recruit.co.jp/hotpepper/gourmet/v1/', $params);
            $data = $response->json();

            if (!empty($data['results']['shop'])) {
                $shops = array_merge($shops, $data['results']['shop']);
            }

            $totalAvailable = $data['results']['results_available'] ?? 0;
            $page++;

        } while (count($shops) < $totalAvailable && count($shops) < 1000); // 1000件取得制限（負荷対策）

        return response()->json(['results' => ['shop' => $shops]]);
    }
}