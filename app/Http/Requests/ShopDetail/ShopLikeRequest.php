<?php

namespace App\Http\Requests\ShopDetail;

use Illuminate\Foundation\Http\FormRequest;

class ShopLikeRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'shop_id' => 'required|string|unique:shop_likes,shop_id',
        ];
    }
}