<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Http;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\UserTokenController;
use App\Http\Controllers\Auth\LogoutController;
use App\Http\Controllers\ShopDetail\ShopLikeController;
use App\Http\Controllers\History\UserLikeController;
use App\Http\Controllers\Shop\ShopController;
use App\Http\Controllers\ShopDetail\ShopDetailController;

Route::post('/login', [LoginController::class, 'login']);
Route::post('/register', [RegisterController::class, 'register']);
Route::post('/user-token', [UserTokenController::class, 'userToken']);
Route::post('/logout', [LogoutController::class, 'logout']);

Route::get('/shop', [ShopController::class, 'show']);
Route::get('/shop/{id}', [ShopDetailController::class, 'show']);

Route::get('shops/{shop_id}/like', [ShopLikeController::class, 'show']);
Route::post('shops/{shop_id}/like', [ShopLikeController::class, 'store']);
Route::put('shops/{shop_id}/like', [ShopLikeController::class, 'like']);
Route::delete('shops/{shop_id}/like', [ShopLikeController::class, 'unlike']);

Route::get('users/{user_id}/likes', [UserLikeController::class, 'show']);
Route::post('users/{user_id}/likes', [UserLikeController::class, 'store']);
Route::delete('users/{user_id}/likes/{shop_id}', [UserLikeController::class, 'destroy']);