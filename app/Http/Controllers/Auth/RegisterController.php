<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Inertia\Inertia;
use Inertia\Response;
use Exception;
use App\Models\UserToken;
use Illuminate\Support\Facades\Log;

class RegisterController extends Controller
{
    /**
     * 新規登録処理
     */
    public function register(RegisterRequest $request)
    {
        try {
            $user = new User();
            $user->createUser($request->userId, $request->nickname, $request->email, $request->password);
            $token = new UserToken();
            $token->createToken($user);
            return ['token' => $token->token];
        } catch (Exception $e) {
            Log::error('新規登録処理中にエラーが発生しました: ' . $e->getMessage());
            return response()->json(['error' => '新規登録処理中にエラーが発生しました。'], 500);
        }
    }
}