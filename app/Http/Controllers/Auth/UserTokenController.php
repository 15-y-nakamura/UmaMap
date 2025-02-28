<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\UserToken;
use Illuminate\Support\Facades\Log;

class UserTokenController extends Controller
{
    /**
     * トークンを使用してユーザーIDを取得する
     */
    public function userToken(Request $request)
    {
        try {
            $token = $request->input('token');
            $userToken = UserToken::where('token', $token)->first();

            if ($userToken) {
                return response()->json(['user_id' => $userToken->user_id]);
            } else {
                return response()->json(['error' => 'Invalid token'], 400);
            }
        } catch (\Exception $e) {
            Log::error('トークンを使用してユーザーIDを取得中にエラーが発生しました: ' . $e->getMessage());
            return response()->json(['error' => 'トークンを使用してユーザーIDを取得中にエラーが発生しました。'], 500);
        }
    }
}