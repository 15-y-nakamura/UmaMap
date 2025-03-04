<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Shop/Shop');
});

Route::get('/login', function () {
    return Inertia::render('Auth/Login');
});

Route::get('/register', function () {
    return Inertia::render('Auth/Register');
});

Route::get('/shop/{id}', function ($id) {
    return Inertia::render('ShopDetail/ShopDetail', ['shopId' => $id]);
});

Route::get('/history', function () {
    return Inertia::render('History/History');
});