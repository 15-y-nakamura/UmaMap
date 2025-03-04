<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\Auth\UserToken;
use Illuminate\Support\Facades\Log;

class LoginController extends Controller
{
    public function login(LoginRequest $request)
    {
        try {
            $user = $request->user;

            if ($user->user_token) {
                $user->user_token->delete();
            }

            $token = new UserToken();
            $token->createToken($user);

            $data = [
                'token' => $token->token,
                'user' => $user,
            ];

            return response()->json($data);
        } catch (\Exception $e) {
            Log::error('ログイン処理中にエラーが発生しました: ' . $e->getMessage());
            return response()->json(['error' => 'ログイン処理中にエラーが発生しました。'], 500);
        }
    }
}