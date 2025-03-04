<?php

namespace App\Http\Requests\History;

use Illuminate\Foundation\Http\FormRequest;

class UserLikeRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'user_id' => 'required|exists:users,id',
            'shop_id' => 'required|string',
        ];
    }
}