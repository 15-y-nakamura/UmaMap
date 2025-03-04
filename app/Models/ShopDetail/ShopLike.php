<?php

namespace App\Models\ShopDetail;

use Illuminate\Database\Eloquent\Model;
use App\Models\History\UserLike;

class ShopLike extends Model
{
    protected $fillable = [
        'shop_id',
        'like_count'
    ];

    public function userLikes()
    {
        return $this->hasMany(UserLike::class, 'shop_id', 'shop_id');
    }

    public static function incrementLikeCount($shop_id)
    {
        $shopLike = self::firstOrCreate(['shop_id' => $shop_id]);
        $shopLike->increment('like_count');
    }

    public static function decrementLikeCount($shop_id)
    {
        self::where('shop_id', $shop_id)->decrement('like_count');
    }
}