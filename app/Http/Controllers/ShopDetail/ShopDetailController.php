<?php

namespace App\Http\Controllers\ShopDetail;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Http;

class ShopDetailController extends Controller
{
    public function show($id)
    {
        $apiKey = env('HOTPEPPER_GOURMET_API_KEY');
        $params = [
            'key' => $apiKey,
            'id' => $id,
            'format' => 'json',
        ];

        $response = Http::get('http://webservice.recruit.co.jp/hotpepper/gourmet/v1/', $params);
        $data = $response->json();
        $shop = $data['results']['shop'][0];

        return response()->json($shop);
    }
}