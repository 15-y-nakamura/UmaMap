<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Http;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\UserTokenController;
use App\Http\Controllers\Auth\LogoutController;

Route::get('/shop', function (Request $request) {
    $apiKey = env('HOTPEPPER_GOURMET_API_KEY');
    $lat = $request->query('lat');
    $lng = $request->query('lng');
    $range = $request->query('range');
    $budget = $request->query('budget');
    $genre = $request->query('genre');

    $shops = [];
    $page = 1; //ページ番号（1ページ目からスタート）
    $maxRequest = 100; //APIの仕様で1回のリクエストで最大100件まで取得可能

    do {
        //APIの仕様上、1回で100件までしか取れないため、ページを増やして全件取得する必要がある
        //特に都心部で広範囲の検索をすると100件では足りないことが多い！
        $params = [
            'key' => $apiKey,
            'lat' => $lat,
            'lng' => $lng,
            'range' => $range,
            'format' => 'json',
            'count' => $maxRequest,
            //API の仕様上、1回で100件までしか取れないため、ページを増やして全件取得する必要がある
            //100件ずつ取得するため、start はページ番号 * 100 になる
            //例:2回目(page=2)→start=101（101件目から）
            'start' => ($page - 1) * $maxRequest + 1,
        ];

        // 予算が指定されている場合
        if ($budget) {
            $params['budget'] = $budget;
        }

        // ジャンルが指定されている場合
        if ($genre) {
            $params['genre'] = $genre;
        }

        $response = Http::get('http://webservice.recruit.co.jp/hotpepper/gourmet/v1/', $params);
        $data = $response->json();

        // 取得した店舗データがある場合のみ追加
        if (!empty($data['results']['shop'])) {
            $shops = array_merge($shops, $data['results']['shop']);
        }

        // API が返した検索結果の合計件数
        $totalAvailable = $data['results']['results_available'] ?? 0;

        $page++; // 次のページへ

    } while (count($shops) < $totalAvailable && count($shops) < 1000); // 1000件取得制限（負荷対策）

    return response()->json(['results' => ['shop' => $shops]]);
});


Route::get('/shop/{id}', function ($id) {
    $apiKey = env('HOTPEPPER_GOURMET_API_KEY');
    $params = [
        'key' => $apiKey,
        'id' => $id,
        'format' => 'json',
    ];

    $response = Http::get('http://webservice.recruit.co.jp/hotpepper/gourmet/v1/', $params);
    $data = $response->json();
    //0番目のデータを取得
    $shop = $data['results']['shop'][0];
    return response()->json($shop);
});

// ログイン
Route::post('/login', [LoginController::class, 'login']);

// 新規登録
Route::post('/register', [RegisterController::class, 'register']);

// ユーザートークン
Route::post('/user-token', [UserTokenController::class, 'userToken']);

// ログアウト
Route::post('/logout', [LogoutController::class, 'logout']);