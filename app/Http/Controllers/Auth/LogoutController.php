<?php
namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\Auth\UserToken;

class LogoutController extends Controller
{
    public function logout(Request $request)
    {
        try {
            $token = $request->input('token');
            $userToken = UserToken::where('token', $token)->first();
            if ($userToken) {
                $userToken->delete();
                return response()->json(['message' => 'ログアウトされました。']);
            } else {
                return response()->json(['error' => 'トークンが見つかりませんでした。'], 404);
            }
        } catch (\Exception $e) {
            Log::error('ログアウト処理中にエラーが発生しました: ' . $e->getMessage());
            return response()->json(['error' => 'ログアウト処理中にエラーが発生しました。'], 500);
        }
    }
}