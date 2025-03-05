<?php

namespace App\Http\Controllers\History;

use App\Http\Controllers\Controller;
use App\Http\Requests\History\UserLikeRequest;
use App\Models\History\UserLike;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class UserLikeController extends Controller
{
    public function show($user_id)
    {
        try {
            $userLikes = UserLike::where('user_id', $user_id)->orderBy('created_at', 'desc')->get();
            $apiKey = env('HOTPEPPER_GOURMET_API_KEY');
            $shops = [];

            foreach ($userLikes as $userLike) {
                $params = [
                    'key' => $apiKey,
                    'id' => $userLike->shop_id,
                    'format' => 'json',
                ];

                $response = Http::get('http://webservice.recruit.co.jp/hotpepper/gourmet/v1/', $params);
                $data = $response->json();

                if (!empty($data['results']['shop'])) {
                    $shop = $data['results']['shop'][0];
                    $shops[] = [
                        'id' => $shop['id'],
                        'name' => $shop['name'],
                        'address' => $shop['address'],
                        'open' => $shop['open'],
                        'photo' => $shop['photo']['pc']['l'],
                        'timestamps' => $userLike->created_at,
                    ];
                }
            }

            return response()->json($shops);
        } catch (\Exception $e) {
            Log::error('ユーザーごとの店舗情報の表示中にエラーが発生しました: ' . $e->getMessage());
            return response()->json(['error' => 'ユーザーごとの店舗情報の表示中にエラーが発生しました。'], 500);
        }
    }

    public function store(UserLikeRequest $request)
    {
        try {
            UserLike::firstOrCreate(['user_id' => $request->user_id, 'shop_id' => $request->shop_id]);
            return response()->json(['message' => 'うまー！が追加されました。']);
        } catch (\Exception $e) {
            Log::error('うまー！を追加中にエラーが発生しました: ' . $e->getMessage());
            return response()->json(['error' => 'うまー！を追加中にエラーが発生しました。'], 500);
        }
    }
    
    public function destroy($user_id, $shop_id)
    {
        try {
            UserLike::where('shop_id', $shop_id)->where('user_id', $user_id)->delete();
            return response()->json(['message' => 'うまー！が削除されました。']);
        } catch (\Exception $e) {
            Log::error('ユーザーの履歴からうまー！を削除中にエラーが発生しました: ' . $e->getMessage());
            return response()->json(['error' => 'ユーザーの履歴からうまー！を削除中にエラーが発生しました。'], 500);
        }
    }
}