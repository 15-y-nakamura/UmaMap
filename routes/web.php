<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home');
});

Route::get('/shop/{id}', function ($id) {
    return Inertia::render('ShopDetail', ['shopId' => $id]);
});