<?php
namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\UserToken;

class LogoutController extends Controller
{
    /**
     * ログアウト処理
     */
    public function logout(Request $request)
    {
        try {
            $token = $request->input('token'); // フロントエンドから受け取る
            UserToken::where('token', $token)->first()->delete();
            return response()->noContent(); // 成功時に空のレスポンスを返す
        } catch (\Exception $e) {
            Log::error('ログアウト処理中にエラーが発生しました: ' . $e->getMessage());
            return response()->json(['error' => 'ログアウト処理中にエラーが発生しました。'], 500);
        }
    }
}
