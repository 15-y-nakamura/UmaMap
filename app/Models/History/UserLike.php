<?php

namespace App\Models\History;

use Illuminate\Database\Eloquent\Model;
use App\Models\Auth\User;
use App\Models\ShopDetail\ShopLike;

class UserLike extends Model
{
    protected $fillable = [
        'user_id',
        'shop_id'
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function shopLike() {
        return $this->belongsTo(ShopLike::class, 'shop_id', 'shop_id');
    }
}