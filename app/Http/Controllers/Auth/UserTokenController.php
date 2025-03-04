<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Auth\UserToken;
use Illuminate\Support\Facades\Log;

class UserTokenController extends Controller
{
    public function userToken(Request $request)
    {
        try {
            $token = $request->input('token');
            $userToken = UserToken::where('token', $token)->first();
            return response()->json(['user_id' => $userToken->user_id]);
        } catch (\Exception $e) {
            Log::error('トークンを使用してユーザーIDを取得中にエラーが発生しました: ' . $e->getMessage());
            return response()->json(['error' => 'トークンを使用してユーザーIDを取得中にエラーが発生しました。'], 500);
        }
    }
}