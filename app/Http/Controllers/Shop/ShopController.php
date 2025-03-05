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

        // ジャンル名をコードに変換
        if ($genre) {
            $genre = $this->convertGenreToCode($genre);
        }

        // 予算をコードに変換
        if ($budget) {
            $budget = $this->convertBudgetToCode($budget);
        } else {
            $budget = null; // 無効な値は除外
        }

        $shops = [];
        $page = 1;
        $maxRequest = 100;//APIの仕様で1回のリクエストで最大100件までしか取得できない

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

        } while (count($shops) < $totalAvailable && count($shops) < 1000); // 1000件取得制限（負荷対策）（負荷対策）

        return response()->json(['results' => ['shop' => $shops]]);
    }

    // ジャンル名をジャンルコードに変換
    private function convertGenreToCode($genre)
    {
        switch ($genre) {
            case '居酒屋': return 'G001';
            case 'ダイニングバー・バル': return 'G002';
            case '創作料理': return 'G003';
            case '和食': return 'G004';
            case '洋食': return 'G005';
            case 'イタリアン・フレンチ': return 'G006';
            case '中華': return 'G007';
            case '焼肉・ホルモン': return 'G008';
            case '韓国料理': return 'G017';
            case 'アジア・エスニック料理': return 'G009';
            case '各国料理': return 'G010';
            case 'カラオケ・パーティ': return 'G011';
            case 'バー・カクテル': return 'G012';
            case 'ラーメン': return 'G013';
            case 'お好み焼き・もんじゃ': return 'G016';
            case 'カフェ・スイーツ': return 'G014';
            case 'その他グルメ': return 'G015';
            default: return null; // 無効な値は除外
        }
    }

    // 予算を予算コードに変換
    private function convertBudgetToCode($budget)
    {
        switch ($budget) {
            case '~500': return 'B001';
            case '501~1000': return 'B002';
            case '1001~1500': return 'B003';
            case '1501~2000': return 'B008';
            case '2001~3000': return 'B009';
            case '3001~4000': return 'B010';
            case '4001~5000': return 'B011';
            case '5001~7000': return 'B012';
            case '7001~10000': return 'B013';
            case '10001~15000': return 'B014';
            case '15001~20000': return 'B015';
            case '20001~30000': 
            case '30001~': // 30001円以上はAPIの上限
                return 'B016';
            default: return null; // 無効な値は除外
        }
    }
}
