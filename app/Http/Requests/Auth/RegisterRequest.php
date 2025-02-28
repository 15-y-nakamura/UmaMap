<?php
namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Contracts\Validation\Validator;

class RegisterRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'userId' => ['required', 'regex:/^[0-9a-zA-Z_]+$/', 'unique:users,login_id', 'max:30'],
            'nickname' => ['required', 'regex:/^[ぁ-んァ-ンーa-zA-Z0-9一-龠０-９\-\r]+$/', 'max:30'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'confirmed', 'regex:/^[a-zA-Z0-9@#\$%!\^&*]+$/', 'min:8', 'max:30'],
        ];
    }

    public function messages()
    {
        return [
            'userId.required' => "ユーザーIDを入力してください",
            'userId.regex' => "半角英数以外は使用できません",
            'userId.unique' => "既に使用されているIDです",
            'userId.max' => "半角英数1〜30文字以内で入力してください",
            'nickname.required' => "ニックネームを入力してください",
            'nickname.regex' => "特殊記号は使用できません",
            'nickname.max' => "1〜30文字以内で入力してください",
            'email.required' => "メールアドレスを入力してください",
            'email.string' => "有効なメールアドレスを入力してください",
            'email.email' => "有効なメールアドレスを入力してください",
            'email.max' => "メールアドレスは255文字以内で入力してください",
            'email.unique' => "既に使用されているメールアドレスです",
            'password.required' => "パスワードを入力してください",
            'password.regex' => "使用可能な文字は半角英数および記号(@, #, $, %, !, ^, &, *)のみです",
            'password.min' => "半角英数8〜30文字以内で入力してください",
            'password.max' => "半角英数8〜30文字以内で入力してください",
            'password.confirmed' => "パスワードとパスワード(確認)が一致していません。",
        ];
    }


    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(
            response()->json([
                "errors" => $validator->errors(),
            ], 422, ['X-Inertia' => 'true']) // InertiaにJSON形式でエラーを渡す
        );
    }
}
