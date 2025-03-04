<?php

namespace App\Http\Controllers\ShopDetail;

use App\Http\Controllers\Controller;
use App\Http\Requests\ShopDetail\ShopLikeRequest;
use App\Models\ShopDetail\ShopLike;
use Illuminate\Support\Facades\Log;

class ShopLikeController extends Controller
{
    public function show($shop_id)
    {
        try {
            $shopLike = ShopLike::where('shop_id', $shop_id)->first();
            if (!$shopLike) {
                return response()->json(['message' => '店舗が見つかりません'], 404);
            }
            return response()->json($shopLike);
        } catch (\Exception $e) {
            Log::error('うまー！情報の表示中にエラーが発生しました: ' . $e->getMessage());
            return response()->json(['error' => 'うまー！情報の表示中にエラーが発生しました。'], 500);
        }
    }

    public function store(ShopLikeRequest $request)
    {
        try {
            ShopLike::firstOrCreate(['shop_id' => $request->shop_id], ['like_count' => 0]);
            return response()->json(['message' => 'うまー！が新規作成されました。']);
        } catch (\Exception $e) {
            Log::error('うまー！を新規作成中にエラーが発生しました: ' . $e->getMessage());
            return response()->json(['error' => 'うまー！を新規作成中にエラーが発生しました。'], 500);
        }
    }

    public function like($shop_id)
    {
        try {
            ShopLike::firstOrCreate(['shop_id' => $shop_id], ['like_count' => 0])->increment('like_count');
            return response()->json(['message' => 'うまー！が追加されました。']);
        } catch (\Exception $e) {
            Log::error('うまー！を追加中にエラーが発生しました: ' . $e->getMessage());
            return response()->json(['error' => 'うまー！を追加中にエラーが発生しました。'], 500);
        }
    }

    public function unlike($shop_id)
    {
        try {
            $shopLike = ShopLike::where('shop_id', $shop_id)->first();
            if ($shopLike) {
                $shopLike->decrement('like_count');
            }
            return response()->json(['message' => '履歴から削除されました。']);
        } catch (\Exception $e) {
            Log::error('うまー！を削除中にエラーが発生しました: ' . $e->getMessage());
            return response()->json(['error' => 'うまー！を削除中にエラーが発生しました。'], 500);
        }
    }
}