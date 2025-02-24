<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Http;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/hotpepper', function (Request $request) {
    $apiKey = env('HOTPEPPER_GOURMET_API_KEY');
    $latitude = $request->query('lat');
    $longitude = $request->query('lng');
    $range = $request->query('range');
    $results = [];
    $page = 1;

    do {
        $params = [
            'key' => $apiKey,
            'lat' => $latitude,
            'lng' => $longitude,
            'range' => $range,
            'format' => 'json',
            'start' => ($page - 1) * 10 + 1,
        ];

        $response = Http::get('http://webservice.recruit.co.jp/hotpepper/gourmet/v1/', $params);

        $data = $response->json();
        if (isset($data['results']['shop'])) {
            $results = array_merge($results, $data['results']['shop']);
        }
        $page++;
    } while (isset($data['results']['results_available']) && count($results) < $data['results']['results_available']);

    return response()->json(['results' => ['shop' => $results]]);
});